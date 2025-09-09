# 🚀 PrepAI - AI-Powered Interview Platform

> **PrepAI** is a comprehensive AI-powered interview platform that conducts real-time voice interviews with dynamic question generation derived directly from candidate resumes.

## 📋 **Project Overview**

PrepAI is a full-stack SaaS application built with modern technologies, featuring:

- **AI-Powered Voice Interviews**: Real-time voice interviews with dynamic question generation
- **Resume Analysis**: Intelligent resume parsing and optimization
- **Multi-Tenant Architecture**: Subdomain-based tenant isolation for enterprise clients
- **Authentication System**: JWT-based authentication with role-based access control
- **Interview Management**: Complete interview scheduling and management system
- **Dashboard Analytics**: Comprehensive user and admin dashboards
- **Widget System**: Embeddable components for external websites

## 🏗️ **Architecture**

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 + React 19 | App Router, SSR/SSG/ISR |
| **Backend** | Node.js + Express + TypeScript | RESTful API server |
| **Database** | MongoDB + Mongoose | Primary data storage |
| **Styling** | TailwindCSS + ShadCN UI | Utility-first CSS + Component library |
| **State Management** | Zustand + Context API | Client-side state management |
| **Forms** | React Hook Form + Zod | Form handling + validation |
| **API Client** | Axios + TanStack Query | HTTP client + caching |
| **Authentication** | JWT + NextAuth | Token-based authentication |
| **AI Integration** | OpenAI API | Resume analysis and optimization |
| **Real-time** | Pusher | Live updates and notifications |

### **Project Structure**

```
prephired-main/          # Frontend (Next.js)
├── src/
│   ├── app/             # App Router pages
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
└── public/              # Static assets

prepAiBE/                # Backend (Node.js)
├── src/
│   ├── modules/         # Feature modules
│   ├── services/        # Business logic
│   ├── middlewares/     # Express middlewares
│   ├── errors/          # Error handling
│   └── utils/           # Utility functions
└── logs/                # Application logs
```

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+
- MongoDB 6+
- Git
- VS Code (recommended)

### **Frontend Setup**

```bash
# Clone repository
git clone <repository-url>
cd prephired-main

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

### **Backend Setup**

```bash
# Navigate to backend
cd ../prepAiBE

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with your values

# Start development server
npm run start:dev
```

### **Environment Variables**

#### **Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

#### **Backend (.env)**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prepai
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
```

## 📚 **Documentation**

- **[Development Guide](./DEVELOPMENT_GUIDE.md)** - Developer onboarding and standards
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Project Overview](./PROJECT_OVERVIEW.md)** - Detailed project architecture

## 🛠️ **Development**

### **Available Scripts**

#### **Frontend**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run docs:update  # Update documentation
```

#### **Backend**

```bash
npm run start:dev    # Start development server
npm run start:prod   # Start production server
npm run build        # Build TypeScript
npm run compile      # Watch TypeScript compilation
```

### **Code Standards**

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **Conventional Commits**: Standardized commit messages

## 🔧 **Features**

### **Authentication System**

- User registration with email verification
- OTP-based verification
- Role-based access control (Admin, User, Interviewer)
- JWT token management with refresh tokens
- Password reset functionality

### **Resume Analysis**

- AI-powered resume parsing
- Skills extraction and analysis
- Job matching recommendations
- Resume optimization suggestions

### **Interview Management**

- Dynamic question generation from resumes
- Voice-based interview sessions
- Real-time interview monitoring
- Interview scheduling and management
- Results analysis and reporting

### **Multi-Tenant Support**

- Subdomain-based tenant isolation
- Tenant-specific configurations
- Role-based permissions per tenant
- Tenant management dashboard

## 🚀 **Deployment**

### **Frontend (Vercel)**

```bash
# Deploy to Vercel
vercel --prod
```

### **Backend (Docker)**

```bash
# Build Docker image
docker build -t prepai-backend .

# Run container
docker run -p 5000:5000 prepai-backend
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

For support, email <support@prepai.com> or join our Slack channel.

---

**Built with ❤️ by the PrepAI Team**
