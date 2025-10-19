import React, { useState, useEffect } from 'react';
import './Results.css';

function Results({ score, total, onRestart, topic, difficulty, timeTaken, userAnswers = [] }) {
  const percentage = ((score / total) * 100).toFixed(1);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [highScore, setHighScore] = useState(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  useEffect(() => {
    // Check and update high score for this topic
    const storageKey = `highScore_${topic.toLowerCase().replace(/\s+/g, '_')}`;
    const savedHighScore = localStorage.getItem(storageKey);
    
    if (savedHighScore) {
      const saved = JSON.parse(savedHighScore);
      setHighScore(saved);
      
      if (percentage > saved.percentage) {
        // New high score!
        const newHighScore = {
          score,
          total,
          percentage: parseFloat(percentage),
          difficulty,
          date: new Date().toISOString()
        };
        localStorage.setItem(storageKey, JSON.stringify(newHighScore));
        setHighScore(newHighScore);
        setIsNewHighScore(true);
      }
    } else {
      // First time playing this topic
      const newHighScore = {
        score,
        total,
        percentage: parseFloat(percentage),
        difficulty,
        date: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(newHighScore));
      setHighScore(newHighScore);
      setIsNewHighScore(true);
    }
  }, [score, total, percentage, topic, difficulty]);
  
  const getMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding! 🏆', emoji: '🎉', color: '#ffd700' };
    if (percentage >= 80) return { text: 'Excellent Work! 🌟', emoji: '⭐', color: '#28a745' };
    if (percentage >= 70) return { text: 'Great Job! 👏', emoji: '👍', color: '#61dafb' };
    if (percentage >= 60) return { text: 'Good Effort! 💪', emoji: '😊', color: '#ffc107' };
    return { text: 'Keep Practicing! 📚', emoji: '💪', color: '#dc3545' };
  };

  const message = getMessage();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="results-container">
      <div className="results-animation">
        <div className="confetti-wrapper">
          {percentage >= 70 && [...Array(20)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#61dafb', '#ffd700', '#28a745', '#ffc107'][Math.floor(Math.random() * 4)]
            }}></div>
          ))}
        </div>
      </div>

      <div className="results-content">
        {isNewHighScore && (
          <div className="new-high-score-banner">
            🏆 NEW HIGH SCORE! 🏆
          </div>
        )}

        <div className="results-emoji" style={{ color: message.color }}>
          {message.emoji}
        </div>
        
        <h2 style={{ color: message.color }}>{message.text}</h2>
        
        <div className="score-circle">
          <svg className="score-ring" viewBox="0 0 120 120">
            <circle
              className="score-ring-background"
              cx="60"
              cy="60"
              r="52"
            />
            <circle
              className="score-ring-progress"
              cx="60"
              cy="60"
              r="52"
              style={{
                strokeDasharray: `${(percentage / 100) * 326.73} 326.73`,
                stroke: message.color
              }}
            />
          </svg>
          <div className="score-text">
            <div className="score-percentage">{percentage}%</div>
            <div className="score-fraction">{score}/{total}</div>
          </div>
        </div>

        <div className="results-details">
          <div className="detail-item">
            <span className="detail-label">Topic</span>
            <span className="detail-value">{topic}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Difficulty</span>
            <span className={`detail-value difficulty-badge ${difficulty}`}>
              {difficulty}
            </span>
          </div>
          {timeTaken && (
            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value">⏱️ {formatTime(timeTaken)}</span>
            </div>
          )}
          {highScore && !isNewHighScore && (
            <div className="detail-item">
              <span className="detail-label">Your Best</span>
              <span className="detail-value">🏆 {highScore.percentage.toFixed(1)}%</span>
            </div>
          )}
        </div>

        <div className="results-actions">
          <button 
            className="btn-primary" 
            onClick={() => setShowDetailedReview(!showDetailedReview)}
          >
            <span className="icon">📝</span>
            {showDetailedReview ? 'Hide' : 'Show'} Detailed Review
          </button>
          <button className="btn-secondary" onClick={onRestart}>
            <span className="icon">🎯</span>
            New Quiz
          </button>
        </div>

        {/* Detailed Review Section */}
        {showDetailedReview && userAnswers.length > 0 && (
          <div className="detailed-review">
            <h3 className="review-title">📋 Question Review</h3>
            <div className="review-list">
              {userAnswers.map((answer, index) => (
                <div 
                  key={index} 
                  className={`review-item ${answer.isCorrect ? 'correct-review' : 'incorrect-review'}`}
                >
                  <div className="review-header">
                    <span className="review-number">Q{index + 1}</span>
                    <span className={`review-badge ${answer.isCorrect ? 'badge-correct' : 'badge-incorrect'}`}>
                      {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  
                  <div className="review-question">
                    {answer.question}
                  </div>

                  <div className="review-answers">
                    <div className={`review-answer ${!answer.isCorrect ? 'wrong-answer' : ''}`}>
                      <span className="answer-label">Your Answer:</span>
                      <span className="answer-value">{answer.userAnswer}</span>
                    </div>
                    
                    {!answer.isCorrect && (
                      <div className="review-answer correct-answer-display">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-value">{answer.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  {answer.explanation && (
                    <div className="review-explanation">
                      <span className="explanation-label">💡 Explanation:</span>
                      <p>{answer.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;