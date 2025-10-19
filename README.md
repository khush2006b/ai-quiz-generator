# 🧠 AI Quiz Generator

An interactive quiz application powered by AI that generates custom quizzes on any topic using Hugging Face's Mixtral AI model. Features a modern UI with difficulty levels, quiz history tracking, and real-time statistics.

![AI Quiz Generator](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

## ✨ Features

### 🎯 Core Features
- **AI-Powered Quiz Generation**: Generate quizzes on any topic using Mixtral AI
- **Multiple Difficulty Levels**: Choose between Easy, Medium, and Hard difficulty
- **Customizable Quiz Length**: Select 5, 10, or 15 questions per quiz
- **Real-time Timer**: Track how long you take to complete each quiz
- **Progress Bar**: Visual feedback on quiz completion
- **Instant Feedback**: See correct/incorrect answers immediately

### 📊 Advanced Features
- **Quiz History**: View all your past quizzes with scores and timestamps
- **Statistics Dashboard**: Track your performance over time
  - Total quizzes taken
  - Average score percentage
  - Best score achieved
  - Total questions answered
- **Persistent Storage**: Quiz results are saved on the backend
- **Backend API**: Secure API key management and data persistence
- **Modern UI/UX**: Smooth animations, gradient effects, and responsive design

## 🚀 Tech Stack

### Frontend
- **React 19.1.1**: UI framework
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API requests
- **CSS3**: Modern styling with animations and gradients

### Backend
- **Node.js**: Runtime environment
- **Express**: Web server framework
- **Hugging Face Inference API**: AI model integration
- **JSON File Storage**: Persistent quiz history

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Hugging Face Account** (free) - [Sign up here](https://huggingface.co/join)

## 🔧 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/khush2006b/ai-quiz-generator.git
cd ai-quiz-generator
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux

# Edit .env and add your Hugging Face token
# HUGGINGFACE_TOKEN=your_token_here
# Get your token from: https://huggingface.co/settings/tokens
\`\`\`

### 3. Frontend Setup

\`\`\`bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# The .env file is already configured to use http://localhost:5000/api
\`\`\`

## 🎮 Running the Application

### Start Backend Server

\`\`\`bash
# From the backend directory
cd backend
npm start

# Or for development with auto-reload
npm run dev
\`\`\`

The backend will start on **http://localhost:5000**

### Start Frontend Development Server

\`\`\`bash
# From the frontend directory (in a new terminal)
cd frontend
npm run dev
\`\`\`

The frontend will start on **http://localhost:5173** (or another port if 5173 is busy)

## 📖 Usage

1. **Start a Quiz**
   - Enter a topic (e.g., "JavaScript", "World History", "Biology")
   - Select difficulty level (Easy, Medium, Hard)
   - Choose number of questions (5, 10, or 15)
   - Click "Start Quiz"

2. **Take the Quiz**
   - Read each question carefully
   - Click on your answer choice
   - See immediate feedback (green for correct, red for incorrect)
   - Watch the progress bar and timer

3. **View Results**
   - See your final score and percentage
   - Review time taken
   - Get a performance message
   - View quiz details (topic, difficulty)

4. **Check Statistics**
   - Click the "📊 Statistics" button in the header
   - View your overall performance metrics
   - Browse recent quiz history
   - See detailed information about past quizzes

## 🔌 API Endpoints

### Backend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |
| POST | `/api/quiz/generate` | Generate new quiz |
| POST | `/api/quiz/save` | Save quiz result |
| GET | `/api/quiz/history` | Get quiz history |
| GET | `/api/quiz/statistics` | Get user statistics |
| DELETE | `/api/quiz/history/:id` | Delete specific quiz |
| DELETE | `/api/quiz/history` | Clear all history |

### Example API Request

\`\`\`javascript
// Generate a quiz
POST http://localhost:5000/api/quiz/generate
Content-Type: application/json

{
  "topic": "JavaScript",
  "difficulty": "medium",
  "questionCount": 10
}
\`\`\`

## 📁 Project Structure

\`\`\`
ai-quiz-generator/
├── backend/
│   ├── server.js              # Express server and API routes
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   ├── .gitignore            # Git ignore rules
│   └── quiz-history.json      # Quiz data storage (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── quizAPI.js    # API client functions
│   │   ├── components/
│   │   │   ├── TopicForm.jsx # Quiz configuration form
│   │   │   ├── Quiz.jsx      # Quiz gameplay component
│   │   │   ├── Results.jsx   # Results display
│   │   │   └── Statistics.jsx # Statistics dashboard
│   │   ├── App.jsx           # Main application component
│   │   ├── App.css           # Global styles
│   │   └── main.jsx          # React entry point
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   └── .env                  # Frontend environment variables
│
└── README.md                 # This file
\`\`\`

## 🎨 Features in Detail

### Difficulty Levels
- **Easy**: Basic questions suitable for beginners
- **Medium**: Moderate difficulty for general knowledge
- **Hard**: Advanced questions for experts

### Quiz Timer
- Tracks time from start to finish
- Displayed in MM:SS format
- Saved with quiz results

### Statistics Dashboard
- **Total Quizzes**: Count of completed quizzes
- **Average Score**: Your overall performance percentage
- **Best Score**: Your highest percentage achieved
- **Recent Quizzes**: List of last 10 quizzes with details

### Visual Feedback
- ✅ Green highlight for correct answers
- ❌ Red highlight for incorrect answers
- Animated transitions between questions
- Progress bar showing completion status
- Confetti animation for high scores (70%+)

## 🐛 Troubleshooting

### Backend Won't Start
- Check if port 5000 is available
- Verify `.env` file exists with valid Hugging Face token
- Run `npm install` to ensure all dependencies are installed

### Frontend Can't Connect to Backend
- Ensure backend server is running on port 5000
- Check `.env` file has correct API URL: `VITE_API_URL=http://localhost:5000/api`
- Look for "Disconnected" status in the app header

### Quiz Generation Fails
- Verify Hugging Face token is valid
- Check internet connection
- Try a different topic or reduce question count
- Check backend console for error messages

## 🔐 Security Notes

- **API Key Protection**: Hugging Face token is stored in backend `.env` file (not exposed to frontend)
- **CORS Configuration**: Backend allows cross-origin requests for local development
- **.gitignore**: Sensitive files like `.env` and `quiz-history.json` are excluded from version control

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables on hosting platform
2. Update frontend `.env` with production API URL
3. Deploy backend first, then frontend

### Frontend Deployment (e.g., Vercel, Netlify)
1. Update `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**khush2006b**
- GitHub: [@khush2006b](https://github.com/khush2006b)
- Repository: [ai-quiz-generator](https://github.com/khush2006b/ai-quiz-generator)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the Mixtral AI model
- [React](https://react.dev/) for the amazing UI framework
- [Vite](https://vitejs.dev/) for lightning-fast development experience
- [Express](https://expressjs.com/) for the robust backend framework

## 📸 Screenshots

### Start Screen
Enter your topic, select difficulty, and choose question count.

### Quiz Gameplay
Answer questions with instant feedback and progress tracking.

### Results Screen
See your score with celebratory animations and detailed performance metrics.

### Statistics Dashboard
Track your progress over time with comprehensive statistics.

---

Made with ❤️ and AI by khush2006b
