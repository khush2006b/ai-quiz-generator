import React, { useState, useEffect, useCallback } from 'react';
import './Quiz.css';

function Quiz({ questions, onFinish, difficulty, topic, autoTimer = true, timerSeconds = 15 }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(timerSeconds);
  const [userAnswers, setUserAnswers] = useState([]); // Track all answers for review
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Total time timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const moveToNextQuestion = useCallback((isCorrect) => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      // Quiz finished - pass userAnswers to results
      const finalScore = score + (isCorrect ? 1 : 0);
      const finalAnswers = userAnswers.length === questions.length ? userAnswers : [...userAnswers];
      onFinish(finalScore, timeElapsed, finalAnswers);
    }
  }, [currentQuestionIndex, questions.length, score, userAnswers, timeElapsed, onFinish]);

  const handleNextClick = () => {
    if (!selectedAnswer || !isAnswered) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    moveToNextQuestion(isCorrect);
  };

  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;

    setSelectedAnswer(null);
    setIsAnswered(true);
    setShowExplanation(true);

    // Record the time-up answer
    const answerRecord = {
      question: currentQuestion.question,
      userAnswer: 'Time Up - No Answer',
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
      explanation: currentQuestion.explanation || 'Time ran out!'
    };
    setUserAnswers((prev) => [...prev, answerRecord]);

    setTimeout(() => {
      moveToNextQuestion(false);
    }, 3000); // Show explanation for 3 seconds
  }, [isAnswered, currentQuestion, moveToNextQuestion]);

  // Per-question countdown timer (only if autoTimer is enabled)
  useEffect(() => {
    if (!autoTimer) return; // Skip timer if manual mode
    if (isAnswered) return; // Don't count down if already answered

    if (questionTimer > 0) {
      const countdown = setTimeout(() => {
        setQuestionTimer((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    } else {
      // Time's up! Auto-submit as wrong answer
      handleTimeUp();
    }
  }, [questionTimer, isAnswered, handleTimeUp, autoTimer]);

  // Reset timer when moving to next question
  useEffect(() => {
    setQuestionTimer(timerSeconds);
    setShowExplanation(false);
  }, [currentQuestionIndex, timerSeconds]);

  const handleAnswerClick = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);
    setShowExplanation(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Record the answer for review
    const answerRecord = {
      question: currentQuestion.question,
      options: currentQuestion.options,
      userAnswer: option,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation || 'No explanation available.'
    };
    setUserAnswers((prev) => [...prev, answerRecord]);

    // If auto-timer is enabled, move to next question automatically
    if (autoTimer) {
      setTimeout(() => {
        moveToNextQuestion(isCorrect);
      }, 4000); // Show explanation for 4 seconds
    }
    // If manual mode, user must click Next button
  };

  const getButtonClass = (option) => {
    if (!isAnswered) return '';
    if (option === currentQuestion.correctAnswer) return 'correct';
    if (option === selectedAnswer) return 'incorrect';
    return '';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const halfTime = timerSeconds / 2;
    const quarterTime = timerSeconds / 4;
    if (questionTimer <= quarterTime) return '#dc3545';
    if (questionTimer <= halfTime) return '#ffc107';
    return '#28a745';
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-info-top">
          <div className="quiz-topic-badge">{topic}</div>
          <div className={`difficulty-badge ${difficulty}`}>{difficulty}</div>
        </div>
        
        <div className="quiz-stats">
          <div className="stat-item">
            <span className="stat-label">Question</span>
            <span className="stat-value">{currentQuestionIndex + 1}/{questions.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}/{questions.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Time</span>
            <span className="stat-value">⏱️ {formatTime(timeElapsed)}</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="question-section">
        {/* Per-Question Timer (only show if auto-timer is enabled) */}
        {autoTimer && (
          <div className="question-timer" style={{ color: getTimerColor() }}>
            <div className="timer-circle">
              <svg viewBox="0 0 100 100" className="timer-svg">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getTimerColor()}
                  strokeWidth="8"
                  strokeDasharray={`${(questionTimer / timerSeconds) * 283} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="timer-progress"
                />
              </svg>
              <div className="timer-text">{questionTimer}s</div>
            </div>
          </div>
        )}

        <h3 className="question-text">{currentQuestion.question}</h3>
        
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              className={`option-button ${getButtonClass(option)}`}
              disabled={isAnswered}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {isAnswered && option === currentQuestion.correctAnswer && (
                <span className="check-icon">✓</span>
              )}
              {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                <span className="cross-icon">✗</span>
              )}
            </button>
          ))}
        </div>

        {/* Show Explanation after answering */}
        {showExplanation && currentQuestion.explanation && (
          <div className={`explanation-box ${selectedAnswer === currentQuestion.correctAnswer ? 'correct-explanation' : 'incorrect-explanation'}`}>
            <div className="explanation-header">
              <span className="explanation-icon">
                {selectedAnswer === currentQuestion.correctAnswer ? '✓' : 'ℹ️'}
              </span>
              <span className="explanation-title">
                {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Explanation:'}
              </span>
            </div>
            <p className="explanation-text">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Time Up Message */}
        {isAnswered && !selectedAnswer && (
          <div className="explanation-box incorrect-explanation">
            <div className="explanation-header">
              <span className="explanation-icon">⏰</span>
              <span className="explanation-title">Time's Up!</span>
            </div>
            <p className="explanation-text">
              The correct answer was: <strong>{currentQuestion.correctAnswer}</strong>
              <br />
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next Button (only show in manual mode and when answer is selected) */}
        {!autoTimer && (
          <div className="next-button-container">
            <button
              className="next-button"
              onClick={handleNextClick}
              disabled={!selectedAnswer || !isAnswered}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <span className="next-icon">→</span>
                </>
              ) : (
                <>
                  Finish Quiz
                  <span className="next-icon">✓</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;