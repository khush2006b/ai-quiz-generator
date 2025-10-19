import React, { useState, useEffect } from 'react';
import './HighScores.css';

function HighScores({ onClose }) {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = () => {
    const scores = [];
    // Get all items from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('highScore_')) {
        const topic = key.replace('highScore_', '').replace(/_/g, ' ');
        const scoreData = JSON.parse(localStorage.getItem(key));
        scores.push({
          topic: topic.charAt(0).toUpperCase() + topic.slice(1),
          ...scoreData
        });
      }
    }
    
    // Sort by percentage (descending)
    scores.sort((a, b) => b.percentage - a.percentage);
    setHighScores(scores);
  };

  const clearAllHighScores = () => {
    if (window.confirm('Are you sure you want to clear all high scores? This cannot be undone.')) {
      // Remove all high score entries
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('highScore_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      setHighScores([]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="high-scores-modal" onClick={onClose}>
      <div className="high-scores-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>🏆 High Scores</h2>
        
        {highScores.length === 0 ? (
          <div className="no-scores">
            <p>No high scores yet!</p>
            <p>Complete some quizzes to see your best scores here.</p>
          </div>
        ) : (
          <>
            <div className="high-scores-list">
              {highScores.map((score, index) => (
                <div key={index} className="high-score-item">
                  <div className="score-rank">
                    {index === 0 && <span className="medal gold">🥇</span>}
                    {index === 1 && <span className="medal silver">🥈</span>}
                    {index === 2 && <span className="medal bronze">🥉</span>}
                    {index > 2 && <span className="rank-number">#{index + 1}</span>}
                  </div>
                  
                  <div className="score-details">
                    <div className="score-topic">{score.topic}</div>
                    <div className="score-meta">
                      <span className={`difficulty-badge ${score.difficulty}`}>
                        {score.difficulty}
                      </span>
                      <span className="score-date">{formatDate(score.date)}</span>
                    </div>
                  </div>
                  
                  <div className="score-percentage">
                    {score.percentage.toFixed(1)}%
                  </div>
                  
                  <div className="score-fraction">
                    {score.score}/{score.total}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="clear-scores-btn" onClick={clearAllHighScores}>
              🗑️ Clear All High Scores
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default HighScores;
