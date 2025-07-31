# Gestura 🤟

A revolutionary social media platform designed to bridge the communication gap for the deaf and hard-of-hearing community. Gestura translates sign language into real-time captions and provides a seamless experience for creating, sharing, and consuming video content.

![Gestura Platform](https://img.shields.io/badge/Platform-Social%20Media-blue)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Python%20%7C%20AI-orange)
![Accessibility](https://img.shields.io/badge/Accessibility-Deaf%20Friendly-green)

## 🌟 Features

### Core Functionality
- **Real-time Sign Language Translation**: AI-powered translation of sign language to text captions
- **Speech-to-Sign Conversion**: Convert spoken content into sign language videos
- **Social Media Platform**: Create, share, and interact with video content
- **User Authentication**: Secure user registration and login system
- **Profile Management**: User profiles with followers/following system
- **Search Functionality**: Search for users and posts
- **Responsive Design**: Mobile-first design for all devices

### Accessibility Features
- **Deaf-Friendly Interface**: Designed specifically for the deaf community
- **Real-time Captions**: Automatic caption generation for all video content
- **Visual Feedback**: Enhanced visual cues and notifications
- **Keyboard Navigation**: Full keyboard accessibility support

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **Convex** - Real-time database and backend
- **React Hook Form** - Form handling
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI** - Modern Python web framework
- **MediaPipe** - AI-powered sign language recognition
- **OpenCV** - Computer vision and video processing
- **Speech Recognition** - Audio processing capabilities
- **Uvicorn** - ASGI server

### AI & ML
- **MediaPipe Hands** - Hand tracking and gesture recognition
- **Custom Sign Language Models** - Trained models for sign recognition
- **Real-time Processing** - Low-latency video analysis

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DanielJames0302/Gestura.git
   cd Gestura
   ```

2. **Set up the Backend (Server)**
   ```bash
   cd server
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the FastAPI server
   uvicorn main:app --reload
   ```
   
   The server will run on `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

3. **Set up the Frontend (Client)**
   ```bash
   cd client
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```
   
   The client will run on `http://localhost:3000`

4. **Environment Setup**
   
   Create a `.env.local` file in the `client` directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

## 📱 Usage

### For Content Creators
1. **Sign up** and create your profile
2. **Upload videos** or record directly in the app
3. **Add captions** automatically generated from sign language
4. **Share your content** with the community
5. **Engage** with other users through likes and comments

### For Content Consumers
1. **Browse the feed** to discover new content
2. **Search for specific topics** or users
3. **Watch videos** with real-time captions
4. **Follow creators** you enjoy
5. **Interact** with posts and comments

### Sign Language Translation
- **Sign-to-Text**: Upload videos with sign language to get automatic text captions
- **Speech-to-Sign**: Convert spoken content into sign language videos

## 🏗️ Project Structure

```
Gestura/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── convex/           # Convex database functions
│   └── types/            # TypeScript definitions
├── server/               # FastAPI backend
│   ├── controllers/      # API controllers
│   ├── services/        # Business logic
│   ├── routers/         # API routes
│   └── utils/           # Utility functions
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /auth/profile` - Get user profile

### Video Processing
- `POST /api/translate-sign` - Sign language to text translation
- `POST /api/translate-speech` - Speech to sign language conversion
- `GET /api/videos` - Get user videos

### Social Features
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create new post
- `GET /api/users` - Search users
- `POST /api/follow` - Follow user

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure accessibility standards are met

## 🐛 Known Issues

- Real-time translation accuracy may vary based on lighting conditions
- Video processing can be resource-intensive on older devices
- Some sign language dialects may not be fully supported yet

## 🚧 Future Roadmap

### Phase 1 (Current)
- ✅ Basic sign language recognition
- ✅ User authentication and profiles
- ✅ Video upload and processing
- ✅ Real-time caption generation

### Phase 2 (In Progress)
- 🔄 Enhanced AI model accuracy
- 🔄 Support for multiple sign languages
- 🔄 Advanced video editing tools
- 🔄 Community features and moderation

### Phase 3 (Planned)
- 📋 Educational content integration
- 📋 Live streaming capabilities
- 📋 Mobile app development
- 📋 Partnership with educational institutions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe** team for the excellent hand tracking capabilities
- **Clerk** for seamless authentication
- **Convex** for real-time database functionality
- The deaf community for invaluable feedback and testing

## 📞 Support

If you encounter any issues or have questions:

- **Create an issue** on GitHub

---

**Made with ❤️ for the deaf community**

*Gestura - Bridging communication gaps through technology*


