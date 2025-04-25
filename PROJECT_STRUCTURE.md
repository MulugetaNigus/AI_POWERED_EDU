# AI-Powered Education Platform: Project Structure

## Project Overview
The AI-Powered Education Platform is a comprehensive educational technology solution leveraging artificial intelligence to enhance learning experiences. The platform offers a suite of tools including AI-powered tutoring, document analysis, exam preparation, community features, and personalized learning experiences.

## Folder Structure

```
AI_POWERED_EDU/
├── src/                   # Source code 
│   ├── Assets/            # Static assets like images
│   ├── auth/              # Authentication components and pages
│   ├── Community/         # Community features (posts, groups, chat)
│   ├── components/        # Reusable UI components
│   ├── config/            # Configuration files (Firebase, etc.)
│   ├── context/           # React Context for state management
│   ├── Exam/              # Exam preparation features
│   ├── lib/               # Utility libraries
│   ├── onboarding/        # Onboarding flow components
│   ├── pages/             # Main application pages
│   ├── quize_progress/    # Quiz and progress tracking
│   ├── services/          # API services and business logic
│   ├── styles/            # CSS and styling files
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global CSS
├── public/                # Public assets
├── node_modules/          # Dependencies
├── package.json           # Project configuration and dependencies
└── vite.config.ts         # Vite configuration
```

## Core Features

### Authentication & User Management
- User registration and login (Firebase and Clerk integration)
- Social login options (Google)
- Password recovery and reset
- User profile management
- Role-based access control

### AI-Powered Learning
- Document analysis and Q&A (PDF upload and interaction)
- AI tutoring with context-aware responses
- Natural language processing for educational content
- Document understanding with vector embeddings

### Dashboard
- Personalized learning dashboard
- Progress tracking and analytics
- Credit system for AI usage
- Subscription management

### Community Features
- Discussion forums and posts
- Study groups and collaboration
- Messaging and chat capabilities
- Resource sharing
- Live sessions

### Exam Preparation
- Practice exams and assessments
- Performance analytics
- Personalized study plans
- Interactive learning materials

### Onboarding
- Personalized user onboarding flow
- Grade level selection
- Learning preferences configuration
- Initial assessment

### Virtual Learning Environment
- Interactive learning materials
- Visualization tools
- Content recommendations
- Adaptive learning paths

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Context, Zustand
- **Routing**: React Router
- **Animation**: Framer Motion
- **UI Components**: Headless UI, Hero Icons
- **Forms**: React Hook Form (implied)
- **Data Visualization**: Recharts

### Backend & APIs
- **Authentication**: Firebase Authentication, Clerk
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (implied)
- **API Communication**: Axios
- **AI Integration**: Google Gemini API

### AI/ML Components
- **Language Models**: Google Gemini (1.5-flash)
- **Document Processing**: LangChain, FAISS
- **Vector Embeddings**: Models/embedding-001
- **PDF Processing**: PDF.js, pdf-parse

### DevOps & Infrastructure
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Environment Variables**: dotenv
- **Code Quality**: ESLint, Prettier, TypeScript

## Authentication Flow
The application implements a dual authentication approach:
1. **Firebase Authentication**: For email/password and Google authentication
2. **Clerk Authentication**: For additional authentication options and user management

Protected routes use the `ProtectedRoute` and `ProtectedRoute2` components to verify authentication status before rendering content.

## State Management
- **Local Component State**: React's useState for component-level state
- **Application Themes**: ThemeContext using React Context API
- **Credits & Subscription**: Managed through Firebase Firestore with credit service

## API Services

### Credit Service
- `initializeUserCredits`: Set up credits for new users
- `getUserCredits`: Retrieve user credit information
- `addCredits`: Add credits to a user account
- `deductCredits`: Consume credits for AI features
- `updateSubscription`: Update user subscription plan

### Payment Service
- Payment processing for subscriptions
- Callback handling for payment confirmation
- Subscription plan management

### MongoDB Service
- Data storage and retrieval for learning content
- User progress tracking
- Analytics and reporting

## Environment Variables
The application uses environment variables for:
- Firebase configuration
- API keys and endpoints
- Service configuration
- Feature flags

## Build and Deployment
- The application is built using Vite
- ESLint and TypeScript provide code quality checks
- Tailwind for CSS processing

## Future Development Roadmap
Based on the codebase, potential future developments include:
- Enhanced AI tutoring capabilities
- Expanded analytics and progress tracking
- Additional community features
- Mobile application development
- Integration with additional educational APIs

## Contributing Guidelines
- Follow existing code conventions
- Use TypeScript for type safety
- Maintain consistent component structure
- Follow established UI patterns
- Utilize existing libraries and utilities 