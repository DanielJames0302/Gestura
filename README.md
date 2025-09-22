# Gestura 🤟

A revolutionary social media platform designed to bridge the communication gap for the deaf and hard-of-hearing community. Gestura translates sign language into real-time captions and provides a seamless experience for creating, sharing, and consuming video content.

![Gestura Platform](https://img.shields.io/badge/Platform-Social%20Media-blue)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Next.js%20%7C%20FastAPI%20%7C%20AI-orange)
![Accessibility](https://img.shields.io/badge/Accessibility-Deaf%20Friendly-green)
![Database](https://img.shields.io/badge/Database-Convex-green)
![Auth](https://img.shields.io/badge/Auth-Clerk-blue)

## 🌟 Features

### Core Functionality
- **Sign Language Translation**: AI-powered translation of sign language to text captions using MediaPipe
- **Speech-to-Sign Conversion**: Convert spoken content into sign language videos using ZurichNLP models
- **Pose Generation**: Generate sign language poses from text (GIF, MP4, and .pose formats)
- **Social Media Platform**: Create, share, and interact with video content
- **User Authentication**: Secure user registration and login system with Clerk
- **Profile Management**: User profiles with followers/following system
- **Search Functionality**: Search for users and posts with real-time search
- **Video Processing**: Upload, process, and generate videos with captions
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
- **React Player** - Video playback component
- **Cloudinary** - Image and video management

### Backend
- **FastAPI** - Modern Python web framework
- **MediaPipe** - AI-powered sign language recognition
- **OpenCV** - Computer vision and video processing
- **Speech Recognition** - Audio processing capabilities
- **Uvicorn** - ASGI server
- **ZurichNLP** - Spoken-to-signed translation models
- **MoviePy** - Video processing and editing

### AI & ML
- **MediaPipe Hands** - Hand tracking and gesture recognition
- **ZurichNLP Models** - Advanced sign language generation
- **Pose Visualization** - Real-time pose generation from text
- **Real-time Processing** - Low-latency video analysis

## 🚀 Quick Start

### One-Command Setup (Recommended)
```bash
# Clone and setup everything
git clone https://github.com/DanielJames0302/Gestura.git
cd Gestura

# Setup backend
cd server && python -m venv myenv && myenv\Scripts\activate && pip install -r requirements.txt

# Setup frontend
cd ../client && npm install

# Start all services
# Terminal 1: Backend
cd server && myenv\Scripts\activate && uvicorn main:app --reload

# Terminal 2: Frontend + Database
cd client && npx convex dev && npm run dev

# Terminal 3: Seed database
cd client && npm run seed
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Git**
- **Convex Account** - For database and real-time functionality
- **Clerk Account** - For authentication

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
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   
   # Convex Database
   CONVEX_DEPLOYMENT=your_convex_deployment_url
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

5. **Database Setup**
   
   ```bash
   cd client
   
   # Initialize Convex (if not already done)
   npx convex dev
   
   # Seed the database with sample data
   npm run seed
   ```

6. **Running the Application**
   
   **Terminal 1 - Backend Server:**
   ```bash
   cd server
   python -m venv myenv
   myenv\Scripts\activate  # Windows
   # source myenv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
   
   **Terminal 2 - Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```
   
   **Terminal 3 - Convex Database (if not using npx convex dev):**
   ```bash
   cd client
   npx convex dev
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
- **Pose Generation**: Generate sign language poses from text in multiple formats (GIF, MP4, .pose)
- **Video Processing**: Upload and process videos with automatic caption extraction

## 🏗️ Project Structure

```
Gestura/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   │   ├── (auth)/       # Authentication pages
│   │   └── (root)/       # Main application pages
│   ├── components/        # React components
│   │   ├── admin/        # Admin components
│   │   ├── cards/        # Card components
│   │   ├── form/         # Form components
│   │   ├── layout/       # Layout components
│   │   ├── modal/        # Modal components
│   │   └── video/        # Video components
│   ├── convex/           # Convex database functions
│   │   ├── _generated/   # Generated Convex files
│   │   ├── auth.config.ts # Clerk authentication config
│   │   ├── posts.ts      # Post-related functions
│   │   ├── users.ts      # User-related functions
│   │   ├── search.ts     # Search functions
│   │   └── seed.ts       # Database seeding
│   ├── api/              # API client functions
│   ├── constants/        # Application constants
│   ├── types/            # TypeScript definitions
│   └── scripts/          # Utility scripts
├── server/               # FastAPI backend
│   ├── controllers/      # API controllers
│   ├── services/        # Business logic and AI services
│   ├── routers/         # API routes
│   ├── schemas/         # Request/response schemas
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── spoken-to-signed-translation/ # ZurichNLP integration
│   ├── generated-files/ # Generated video/audio files
│   ├── uploads/         # Uploaded files
│   └── video_output_path/ # Processed video outputs
└── README.md
```

## 🔧 API Endpoints

### Video Processing & Translation
- `POST /upload` - Upload sign language video for translation to text
- `POST /upload-normal-video` - Upload regular video for caption extraction
- `POST /generate-asl` - Generate sign language video from text captions
- `POST /generate` - Generate video with text-to-speech audio from captions

### Pose Generation (ZurichNLP)
- `POST /generate-pose-gif` - Generate sign language pose GIF from text
- `POST /generate-pose-mp4` - Generate sign language pose MP4 from text
- `POST /generate-pose-file` - Generate sign language pose file (.pose) from text

### Social Features (Convex)
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create new post
- `GET /api/users` - Search users
- `POST /api/follow` - Follow user
- `GET /api/profile` - Get user profile

### Database Seeding
- `npm run seed` - Populate database with sample data
- `npm run seed:clear` - Clear all sample data
- `npm run seed:status` - Show current data counts

## 🌱 Database Seeding

The application includes a comprehensive seeding system for development and testing:

### Quick Seeding Commands
```bash
cd client

# Populate database with sample data
npm run seed

# Check current data status
npm run seed:status

# Clear all sample data
npm run seed:clear
```

### Sample Data Includes
- **6 diverse users** with realistic profiles and profile photos
- **10 sample posts** covering various topics (learning, nature, cooking, technology, etc.)
- **Follow relationships** creating a realistic social network
- **Search functionality** with indexed content

For detailed seeding instructions, see [SEEDING.md](client/SEEDING.md).

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
- Test with seeded data for consistency

## 🐛 Known Issues

- Real-time translation accuracy may vary based on lighting conditions
- Video processing can be resource-intensive on older devices
- Some sign language dialects may not be fully supported yet
- ZurichNLP models require significant computational resources
- Large video files may take time to process

## 🚧 Future Roadmap

### Phase 1 (Current)
- ✅ Basic sign language recognition with MediaPipe
- ✅ User authentication and profiles with Clerk
- ✅ Video upload and processing
- ✅ Real-time caption generation
- ✅ Social media platform with Convex
- ✅ Database seeding system
- ✅ ZurichNLP integration for pose generation

### Phase 2 (In Progress)
- 🔄 Enhanced AI model accuracy
- 🔄 Support for multiple sign languages
- 🔄 Advanced video editing tools
- 🔄 Community features and moderation
- 🔄 Real-time pose generation optimization

### Phase 3 (Planned)
- 📋 Educational content integration
- 📋 Live streaming capabilities
- 📋 Mobile app development
- 📋 Partnership with educational institutions
- 📋 Advanced gesture recognition
- 📋 Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe** team for the excellent hand tracking capabilities
- **Clerk** for seamless authentication and user management
- **Convex** for real-time database functionality
- **ZurichNLP** team for the spoken-to-signed translation models
- **Next.js** team for the powerful React framework
- **FastAPI** team for the modern Python web framework
- The deaf community for invaluable feedback and testing

## Support

If you encounter any issues or have questions:

- **Create an issue** on GitHub

*Gestura - Bridging communication gaps through technology*


