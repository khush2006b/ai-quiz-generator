import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizAPI = {
  // Generate a new quiz
  generateQuiz: async (topic, difficulty = 'medium', questionCount = 10) => {
    const response = await api.post('/quiz/generate', {
      topic,
      difficulty,
      questionCount,
    });
    return response.data;
  },

  // Save quiz result
  saveQuizResult: async (quizData) => {
    const response = await api.post('/quiz/save', quizData);
    return response.data;
  },

  // Get quiz history
  getHistory: async () => {
    const response = await api.get('/quiz/history');
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/quiz/statistics');
    return response.data;
  },

  // Delete a quiz from history
  deleteQuiz: async (quizId) => {
    const response = await api.delete(`/quiz/history/${quizId}`);
    return response.data;
  },

  // Clear all history
  clearHistory: async () => {
    const response = await api.delete('/quiz/history');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
