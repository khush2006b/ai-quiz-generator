import React, { useState } from 'react'
import { HfInference } from '@huggingface/inference'

// Import your custom components
import TopicForm from './components/TopicForm'
import Quiz from './components/Quiz'
import Results from './components/Results'

// Import your stylesheet
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('start')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get the Hugging Face Token from environment variables
  const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN

  const startQuiz = async (topic) => {
    if (!hfToken) {
      setError('Hugging Face Token not found. Please add it to your .env file.')
      return
    }

    setLoading(true)
    setError('')

    // Initialize the Hugging Face client
    const hf = new HfInference(hfToken)

    try {
      // A well-crafted prompt for the Mixtral model
      const prompt = `[INST] You are an expert quiz maker. Generate a quiz of 10 multiple-choice questions about the topic: "${topic}".
      Your response must be ONLY a valid JSON object. Do not include any other text, explanation, or markdown formatting before or after the JSON.
      The main JSON key must be "questions", and its value must be an array of objects.
      Each object in the array must have this exact structure: { "question": "The question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": "The correct option text" }.
      Ensure the 'correctAnswer' exactly matches one of the strings in the 'options' array. [/INST]`

      const response = await hf.chatCompletion({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // A very powerful and stable model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      })

      let responseContent = response.choices[0].message.content
      if (!responseContent) {
        throw new Error('Received an empty response from the AI.')
      }

      // Clean the response to ensure it's only the JSON object
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Could not find a valid JSON object in the AI response.')
      }
      const jsonString = jsonMatch[0]
      
      const quizData = JSON.parse(jsonString)

      console.log('--- PARSED AI RESPONSE (from Hugging Face) ---')
      console.log(quizData)

      if (Array.isArray(quizData.questions) && quizData.questions.length > 0) {
        setQuestions(quizData.questions)
        setScore(0)
        setGameState('quiz')
      } else {
        throw new Error('Received an invalid or empty format for the quiz.')
      }
    } catch (err) {
      setError('Failed to generate the quiz. Please try another topic.')
      console.error('--- DETAILED ERROR ---')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const showResults = (finalScore) => {
    setScore(finalScore)
    setGameState('results')
  }

  const restartQuiz = () => {
    setQuestions([])
    setScore(0)
    setGameState('start')
  }

  return (
    <div className="app-container">
      <h1>AI Quiz Generator</h1>
      {error && <p className="error-message">{error}</p>}
      {gameState === 'start' && <TopicForm onStart={startQuiz} loading={loading} />}
      {gameState === 'quiz' && questions.length > 0 && (
        <Quiz questions={questions} onFinish={showResults} />
      )}
      {gameState === 'results' && (
        <Results score={score} total={questions.length} onRestart={restartQuiz} />
      )}
    </div>
  )
}

export default App