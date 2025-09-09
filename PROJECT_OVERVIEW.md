# 🏗️ PrepAI Project Overview

> **Last Updated**: 2025-09-08  
> **Version**: 1.0.0

## 📋 **Project Summary**

**PrepAI** is a comprehensive AI-powered interview platform that revolutionizes the recruitment process through intelligent voice interviews and resume analysis. The platform combines cutting-edge AI technology with modern web development practices to deliver a seamless interview experience.

### **🎯 Core Features**

- **AI-Powered Voice Interviews**: Real-time voice interviews with dynamic question generation
- **Resume Analysis**: Intelligent resume parsing, optimization, and skills extraction
- **Multi-Tenant SaaS**: Subdomain-based tenant isolation for enterprise clients
- **Authentication System**: JWT-based authentication with role-based access control
- **Interview Management**: Complete interview scheduling, monitoring, and management
- **Dashboard Analytics**: Comprehensive user and admin dashboards with insights
- **Widget System**: Embeddable components for external websites
- **Real-time Communication**: Live updates and notifications

---

## 🏗️ **Architecture Overview**

### **Technology Stack**

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Next.js | 15.4.5 | App Router, SSR/SSG/ISR |
| **Frontend** | React | 19.1.0 | UI components and state management |
| **Backend** | Node.js | 18+ | Runtime environment |
| **Backend** | Express | 5.1.0 | Web framework |
| **Backend** | TypeScript | 5.9.2 | Type safety and development experience |
| **Database** | MongoDB | 6+ | Primary data storage |
| **Database** | Mongoose | 8.17.1 | ODM for MongoDB |
| **Styling** | TailwindCSS | 4.1.11 | Utility-first CSS framework |
| **UI Components** | ShadCN UI | Latest | Component library |
| **State Management** | Zustand | 5.0.7 | Client-side state management |
| **Forms** | React Hook Form | 7.62.0 | Form handling |
| **Validation** | Zod | 4.0.14 | Schema validation |
| **API Client** | Axios | 1.11.0 | HTTP client |
| **Caching** | TanStack Query | 5.84.1 | Server state management |
| **Authentication** | NextAuth | 5.0.0-beta.29 | Authentication framework |
| **AI Integration** | OpenAI API | Latest | Resume analysis and optimization |
| **Real-time** | Pusher | Latest | Live updates and notifications |
| **File Storage** | AWS S3 | Latest | File uploads and storage |
| **Queue System** | BullMQ | 5.58.4 | Background job processing |
| **Logging** | Winston | 3.17.0 | Application logging |

### **Architecture Principles**

- **🧩 Feature-Based Modular Design**: Self-contained business modules
- **🏢 Multi-Tenant SaaS Patterns**: Scalable tenant isolation
- **⚛️ Atomic Design System**: Clear UI component hierarchy
- **🔒 Security-First Approach**: Built-in security and compliance
- **📈 Enterprise Scalability**: Designed for startup to enterprise scale
- **🔄 Real-time Updates**: Live data synchronization
- **🎯 Performance Optimization**: Code splitting and lazy loading

---

## 📊 **Development Statistics**

| Metric | Frontend | Backend | Total |
|--------|----------|---------|-------|
| **Total Files** | 155+ | 80+ | 235+ |
| **Components** | 54+ | - | 54+ |
| **Hooks** | 26+ | - | 26+ |
| **Services** | 7+ | 5+ | 12+ |
| **Modules** | - | 38+ | 38+ |
| **Types** | 1+ | 1+ | 2+ |
| **Routes** | 1+ | 1+ | 2+ |
| **Dependencies** | 65+ | 55+ | 120+ |

---

## 🔧 **Key Features Deep Dive**

### **1. Authentication System**

**Components:**

- Registration form with validation
- OTP verification interface
- Authentication page layout

**State Management:**

- Zustand store for authentication state
- JWT token management with refresh tokens
- Role-based access control (Admin, User, Interviewer)

**Security Features:**

- Password hashing with bcrypt
- JWT token validation
- Session management
- Multi-factor authentication (OTP)

### **2. Resume Analysis System**

**AI Integration:**

- OpenAI API for resume parsing
- Skills extraction and analysis
- Job matching recommendations
- Resume optimization suggestions

**File Processing:**

- PDF, DOC, DOCX support
- AWS S3 integration for file storage
- Background job processing with BullMQ
- Resume parsing queue system

### **3. Interview Management**

**Real-time Features:**

- Voice-based interview sessions
- Dynamic question generation
- Live interview monitoring
- Real-time results analysis

**Scheduling System:**

- Time slot management
- Interview scheduling
- Calendar integration
- Notification system

### **4. Multi-Tenant Architecture**

**Tenant Isolation:**

- Subdomain-based routing
- Tenant-specific configurations
- Isolated data storage
- Role-based permissions per tenant

**Management Features:**

- Tenant creation and management
- Tenant-specific dashboards
- Billing and subscription management
- Tenant analytics

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+
- MongoDB 6+
- Git
- VS Code (recommended)

### **Quick Setup**

```bash
# Clone repository
git clone <repository-url>
cd prephired-main

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your values

# Start development
npm run dev
```

### **Environment Configuration**

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
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=prepai-uploads
```

---

## 🔄 **Development Workflow**

### **Frontend Development**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run docs:update  # Update documentation
```

### **Backend Development**

```bash
npm run start:dev    # Start development server
npm run start:prod   # Start production server
npm run build        # Build TypeScript
npm run compile      # Watch TypeScript compilation
```

### **Code Quality**

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **Conventional Commits**: Standardized commit messages

---

## 📚 **Documentation**

- **[README.md](./README.md)** - Project overview and quick start
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Developer onboarding and standards
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API documentation

---

## 🎯 **Future Roadmap**

### **Phase 1 (Current)**

- ✅ Core authentication system
- ✅ Basic resume analysis
- ✅ Interview scheduling
- ✅ Multi-tenant support

### **Phase 2 (Next)**

- 🔄 Advanced AI features
- 🔄 Real-time video interviews
- 🔄 Advanced analytics
- 🔄 Mobile app development

### **Phase 3 (Future)**

- 📋 Enterprise integrations
- 📋 Advanced reporting
- 📋 Machine learning improvements
- 📋 Global deployment

---

*This document is automatically maintained and updated. For manual updates, edit the source files and run the update script.*
