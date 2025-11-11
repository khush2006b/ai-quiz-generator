import React, { useState, useEffect } from 'react'
import { quizAPI } from './api/quizAPI'
import TopicForm from './components/TopicForm'
import Quiz from './components/Quiz'
import Results from './components/Results'
import Statistics from './components/Statistics'
import HighScores from './components/HighScores'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [quizId, setQuizId] = useState('')
  const [score, setScore] = useState(0)
  const [timeTaken, setTimeTaken] = useState(0)
  const [userAnswers, setUserAnswers] = useState([]) // Track user answers for review
  const [gameState, setGameState] = useState('start')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quizConfig, setQuizConfig] = useState({ topic: '', difficulty: 'medium' })
  const [showStats, setShowStats] = useState(false)
  const [showHighScores, setShowHighScores] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    try {
      await quizAPI.healthCheck()
      setBackendStatus('connected')
    } catch {
      setBackendStatus('disconnected')
      setError('❌ Backend server is not running. Please start the backend server first.')
    }
  }

  const startQuiz = async (topic, difficulty, questionCount, autoTimer, timerSeconds) => {
    if (backendStatus !== 'connected') {
      setError('Backend server is not connected. Please ensure it is running.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await quizAPI.generateQuiz(topic, difficulty, questionCount)
      
      if (response.success && response.quiz.questions.length > 0) {
        setQuestions(response.quiz.questions)
        setQuizId(response.quizId)
        setQuizConfig({ topic, difficulty, autoTimer, timerSeconds })
        setScore(0)
        setGameState('quiz')
      } else {
        throw new Error('Invalid quiz data received')
      }
    } catch (err) {
      setError('Failed to generate the quiz. Please try another topic or check your connection.')
      console.error('Error generating quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const showResults = async (finalScore, timeElapsed, answersArray) => {
    setScore(finalScore)
    setTimeTaken(timeElapsed)
    setUserAnswers(answersArray) // Store user answers for detailed review
    setGameState('results')

    // Save quiz result to backend
    try {
      await quizAPI.saveQuizResult({
        quizId,
        topic: quizConfig.topic,
        difficulty: quizConfig.difficulty,
        score: finalScore,
        totalQuestions: questions.length,
        timeTaken: timeElapsed,
        completedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error('Failed to save quiz result:', err)
    }
  }

  const restartQuiz = () => {
    setQuestions([])
    setQuizId('')
    setScore(0)
    setTimeTaken(0)
    setUserAnswers([]) // Clear user answers
    setGameState('start')
    setError('')
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <div className="app-header">
          <h1>
            <span className="logo-icon">🧠</span>
            AI Quiz Generator
          </h1>
          <p className="subtitle">Test your knowledge with AI-powered quizzes</p>
          
          <div className="header-actions">
            <button 
              className="stats-button" 
              onClick={() => setShowStats(true)}
              disabled={backendStatus !== 'connected'}
            >
              <span className="button-icon">📊</span>
              Statistics
            </button>
            <button 
              className="high-scores-button" 
              onClick={() => setShowHighScores(true)}
            >
              <span className="button-icon">🏆</span>
              High Scores
            </button>
            <div className={`status-indicator ${backendStatus}`}>
              <span className="status-dot"></span>
              {backendStatus === 'connected' ? '✅ Connected' : 
               backendStatus === 'disconnected' ? '❌ Disconnected' : '🔄 Checking...'}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            {backendStatus === 'disconnected' && (
              <button className="retry-btn" onClick={checkBackendHealth}>
                Retry Connection
              </button>
            )}
          </div>
        )}

        <div className="app-content">
          {gameState === 'start' && (
            <TopicForm onStart={startQuiz} loading={loading} />
          )}
          
          {gameState === 'quiz' && questions.length > 0 && (
            <Quiz 
              questions={questions} 
              onFinish={showResults}
              topic={quizConfig.topic}
              difficulty={quizConfig.difficulty}
              autoTimer={quizConfig.autoTimer}
              timerSeconds={quizConfig.timerSeconds}
            />
          )}
          
          {gameState === 'results' && (
            <Results 
              score={score} 
              total={questions.length} 
              onRestart={restartQuiz}
              topic={quizConfig.topic}
              difficulty={quizConfig.difficulty}
              timeTaken={timeTaken}
              userAnswers={userAnswers}
            />
          )}
        </div>
      </div>

      {showStats && <Statistics onClose={() => setShowStats(false)} />}
      {showHighScores && <HighScores onClose={() => setShowHighScores(false)} />}
    </div>
  )
}

export default App