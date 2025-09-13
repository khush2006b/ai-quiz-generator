import React from 'react';

function Results({ score, total, onRestart }) {
  return (
    <div className="results-container">
      <h2>Quiz Finished!</h2>
      <p>Your Score: {score} out of {total}</p>
      <button onClick={onRestart}>Play Again</button>
    </div>
  );
}

export default Results;