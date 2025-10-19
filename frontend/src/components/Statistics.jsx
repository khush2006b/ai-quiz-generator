import React, { useState, useEffect } from 'react';
import { quizAPI } from '../api/quizAPI';
import './Statistics.css';

function Statistics({ onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await quizAPI.getStatistics();
      setStats(data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="statistics-modal">
        <div className="statistics-content">
          <div className="loading-spinner">Loading statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-modal">
        <div className="statistics-content">
          <p className="error-message">{error}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-modal" onClick={onClose}>
      <div className="statistics-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>📊 Your Statistics</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalQuizzes}</div>
            <div className="stat-label">Total Quizzes</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.bestScore}%</div>
            <div className="stat-label">Best Score</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.totalCorrect}/{stats.totalQuestions}</div>
            <div className="stat-label">Questions Correct</div>
          </div>
        </div>

        {stats.recentQuizzes && stats.recentQuizzes.length > 0 && (
          <div className="recent-quizzes">
            <h3>Recent Quizzes</h3>
            <div className="quiz-list">
              {stats.recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-item">
                  <div className="quiz-info">
                    <div className="quiz-topic">{quiz.topic}</div>
                    <div className="quiz-details">
                      <span className={`difficulty-badge ${quiz.difficulty}`}>
                        {quiz.difficulty}
                      </span>
                      <span className="quiz-date">{formatDate(quiz.completedAt)}</span>
                      {quiz.timeTaken && (
                        <span className="quiz-time">⏱️ {formatTime(quiz.timeTaken)}</span>
                      )}
                    </div>
                  </div>
                  <div 
                    className="quiz-score"
                    style={{ color: getScoreColor(quiz.score, quiz.totalQuestions) }}
                  >
                    {quiz.score}/{quiz.totalQuestions}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
