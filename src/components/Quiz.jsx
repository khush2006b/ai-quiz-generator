import React, { useState } from 'react';

function Quiz({ questions, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        onFinish(score + (option === currentQuestion.correctAnswer ? 1 : 0));
      }
    }, 1500); // Wait 1.5 seconds before moving to the next question
  };

  const getButtonClass = (option) => {
    if (!isAnswered) return '';
    if (option === currentQuestion.correctAnswer) return 'correct';
    if (option === selectedAnswer) return 'incorrect';
    return '';
  };

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestionIndex + 1}/{questions.length}</h2>
      <h3>{currentQuestion.question}</h3>
      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            className={`option-button ${getButtonClass(option)}`}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;