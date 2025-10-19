import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Hugging Face
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// Data storage file
const HISTORY_FILE = path.join(process.cwd(), 'quiz-history.json');

// Helper function to read quiz history
async function readHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { quizzes: [], statistics: { totalQuizzes: 0, totalQuestions: 0, totalCorrect: 0 } };
  }
}

// Helper function to write quiz history
async function writeHistory(data) {
  await fs.writeFile(HISTORY_FILE, JSON.stringify(data, null, 2));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Quiz Backend is running!' });
});

// Generate quiz endpoint
app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { topic, difficulty = 'medium', questionCount = 10 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!process.env.HUGGINGFACE_TOKEN) {
      return res.status(500).json({ error: 'Hugging Face token not configured' });
    }

    // Adjust difficulty in prompt
    const difficultyText = {
      easy: 'easy to answer, suitable for beginners',
      medium: 'moderately challenging',
      hard: 'advanced and challenging'
    };

    const prompt = `[INST] You are an expert quiz maker. Generate a quiz of ${questionCount} multiple-choice questions about the topic: "${topic}".
    The difficulty should be ${difficultyText[difficulty]}.
    Your response must be ONLY a valid JSON object. Do not include any other text, explanation, or markdown formatting before or after the JSON.
    The main JSON key must be "questions", and its value must be an array of objects.
    Each object in the array must have this exact structure: { "question": "The question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "The correct option text", "explanation": "A brief 1-2 sentence explanation of why the correct answer is right" }.
    Ensure the 'correctAnswer' exactly matches one of the strings in the 'options' array.
    The 'explanation' should be educational and help the user understand the correct answer. [/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2500,
    });

    let responseContent = response.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('Received an empty response from the AI.');
    }

    // Extract JSON from response
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find a valid JSON object in the AI response.');
    }
    
    const jsonString = jsonMatch[0];
    const quizData = JSON.parse(jsonString);

    if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error('Received an invalid or empty format for the quiz.');
    }

    // Generate quiz ID
    const quizId = uuidv4();

    res.json({
      success: true,
      quizId,
      quiz: {
        topic,
        difficulty,
        questions: quizData.questions,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz', 
      details: error.message 
    });
  }
});

// Save quiz result endpoint
app.post('/api/quiz/save', async (req, res) => {
  try {
    const { quizId, topic, difficulty, score, totalQuestions, timeTaken, completedAt } = req.body;

    const history = await readHistory();
    
    const quizResult = {
      id: quizId || uuidv4(),
      topic,
      difficulty,
      score,
      totalQuestions,
      timeTaken,
      completedAt: completedAt || new Date().toISOString()
    };

    history.quizzes.unshift(quizResult);
    
    // Update statistics
    history.statistics.totalQuizzes += 1;
    history.statistics.totalQuestions += totalQuestions;
    history.statistics.totalCorrect += score;

    // Keep only last 50 quizzes
    if (history.quizzes.length > 50) {
      history.quizzes = history.quizzes.slice(0, 50);
    }

    await writeHistory(history);

    res.json({ success: true, message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

// Get quiz history endpoint
app.get('/api/quiz/history', async (req, res) => {
  try {
    const history = await readHistory();
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

// Get statistics endpoint
app.get('/api/quiz/statistics', async (req, res) => {
  try {
    const history = await readHistory();
    const stats = history.statistics;
    
    const averageScore = stats.totalQuestions > 0 
      ? ((stats.totalCorrect / stats.totalQuestions) * 100).toFixed(1)
      : 0;

    const recentQuizzes = history.quizzes.slice(0, 10);
    const bestScore = recentQuizzes.length > 0
      ? Math.max(...recentQuizzes.map(q => (q.score / q.totalQuestions) * 100))
      : 0;

    res.json({
      totalQuizzes: stats.totalQuizzes,
      totalQuestions: stats.totalQuestions,
      totalCorrect: stats.totalCorrect,
      averageScore: parseFloat(averageScore),
      bestScore: parseFloat(bestScore.toFixed(1)),
      recentQuizzes
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Delete quiz from history
app.delete('/api/quiz/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await readHistory();
    
    const quizIndex = history.quizzes.findIndex(q => q.id === id);
    
    if (quizIndex === -1) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const deletedQuiz = history.quizzes[quizIndex];
    history.quizzes.splice(quizIndex, 1);
    
    // Update statistics
    history.statistics.totalQuizzes -= 1;
    history.statistics.totalQuestions -= deletedQuiz.totalQuestions;
    history.statistics.totalCorrect -= deletedQuiz.score;

    await writeHistory(history);

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Clear all history
app.delete('/api/quiz/history', async (req, res) => {
  try {
    const emptyHistory = {
      quizzes: [],
      statistics: { totalQuizzes: 0, totalQuestions: 0, totalCorrect: 0 }
    };
    await writeHistory(emptyHistory);
    res.json({ success: true, message: 'All quiz history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI Quiz Backend running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/quiz/generate`);
  console.log(`   - POST /api/quiz/save`);
  console.log(`   - GET  /api/quiz/history`);
  console.log(`   - GET  /api/quiz/statistics`);
});
