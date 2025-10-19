import React, { useState } from 'react';
import './TopicForm.css';

function TopicForm({ onStart, loading }) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [autoTimer, setAutoTimer] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(15);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart(topic, difficulty, questionCount, autoTimer, timerSeconds);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="topic-form">
      <div className="form-group">
        <label htmlFor="topic">Quiz Topic</label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., JavaScript, World History, Biology..."
          disabled={loading}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="questionCount">Questions</label>
          <select
            id="questionCount"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            disabled={loading}
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>
      </div>

      <div className="form-group timer-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={autoTimer}
            onChange={(e) => setAutoTimer(e.target.checked)}
            disabled={loading}
          />
          <span className="toggle-text">
            <span className="icon">{autoTimer ? '⏱️' : '🖱️'}</span>
            {autoTimer ? 'Auto Timer (questions auto-submit)' : 'Manual Mode (click Next button)'}
          </span>
        </label>
      </div>

      {autoTimer && (
        <div className="form-group">
          <label htmlFor="timerSeconds">Timer Duration (seconds per question)</label>
          <select
            id="timerSeconds"
            value={timerSeconds}
            onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
            disabled={loading}
          >
            <option value={10}>10 seconds</option>
            <option value={15}>15 seconds</option>
            <option value={20}>20 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={60}>60 seconds</option>
          </select>
        </div>
      )}

      <button type="submit" disabled={loading || !topic.trim()}>
        {loading ? (
          <>
            <span className="spinner"></span>
            Generating...
          </>
        ) : (
          <>
            <span className="icon">🚀</span>
            Start Quiz
          </>
        )}
      </button>
    </form>
  );
}

export default TopicForm;