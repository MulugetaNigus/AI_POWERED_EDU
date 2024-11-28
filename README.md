# AI-Powered Education Platform

An innovative education platform leveraging Google's Gemini AI for intelligent document processing and interactive learning experiences.

## 🚀 Features

### Core Capabilities
- PDF Document Processing & Analysis
- Intelligent Question-Answering System
- Real-time Document Chat Interface
- Vector-based Document Search
- Context-Aware Response Generation

### Technical Features
- Async API with FastAPI
- Secure Tunnel Integration (Ngrok)
- Advanced Logging System
- Environment-based Configuration
- CORS-enabled Endpoints

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Vite for Build Tool
- Tailwind CSS for Styling
- Framer Motion for Animations

### Backend & AI
- FastAPI for API Server
- Google Gemini API (gemini-1.5-flash)
- FAISS for Vector Search
- LangChain for AI Pipeline
- Firebase Authentication

## 📋 Prerequisites

```bash
- Python 3.8+
- Node.js 16+
- Google Gemini API Key
- Ngrok Auth Token
```

## 🔧 Setup Instructions

1. Clone the repository
```bash
git clone [repository-url]
cd AI_POWERED_EDU
```

2. Set up environment variables
```bash
# Create .env file
GOOGLE_API_KEY=your_gemini_api_key
NGROK_AUTH_TOKEN=your_ngrok_token
PORT=8000
```

3. Install dependencies
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

4. Start the application
```bash
# Backend
python Gemini.py

# Frontend
npm run dev
```

## 🔍 Usage

1. Place PDF documents in the `source` directory
2. Start the application
3. Access the web interface
4. Begin asking questions about your documents

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📝 Future Enhancements

- [ ] Advanced Admin Dashboard
- [ ] User Analytics System
- [ ] Batch Document Processing
- [ ] Enhanced Security Features
- [ ] Custom Training Capabilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.