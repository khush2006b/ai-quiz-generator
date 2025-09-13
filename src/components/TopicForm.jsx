import React, { useState } from 'react';

function TopicForm({ onStart, loading }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart(topic);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="topic-form">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic "
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Start Quiz'}
      </button>
    </form>
  );
}

export default TopicForm;