![image](https://github.com/user-attachments/assets/8d5cab76-ae89-4b4c-a367-88b5afdceda1)

## Live Preview

https://cubemaster.vercel.app/

# 🧊 Cube Master

A fully interactive **3D Rubik's Cube simulator** with multiple game modes, user authentication, and progress tracking. Built with Next.js, React Three Fiber, Prisma, and NextAuth.

---

## ✨ Features

### 🎮 Game Modes

- **Classic Mode**: Practice with different difficulty levels (Easy, Medium, Hard)
- **Time Attack**: Race against the clock to solve the cube
- **Daily Challenge**: Complete daily cubes with specific scramble patterns
- **Explore Mode**: Free play with no time pressure

### 🏆 User System

- **Google OAuth Authentication** via NextAuth
- **Personal Profile** with detailed statistics
- **Game History** tracking all your solves
- **Performance Analytics** with charts and metrics

### 🎯 Core Gameplay

- **Click-and-drag face rotation** with smooth animations
- **Undo / Redo functionality** for move navigation
- **Scramble generator** with configurable difficulty
- **Auto-solve** feature that reverts moves step-by-step
- **Timer system** with millisecond precision
- **Move counter** tracking efficiency

### 📊 Analytics & Tracking

- **Solve times** with detailed breakdown
- **Move efficiency** statistics
- **Progress charts** showing improvement over time
- **Success rate** tracking across different modes
- **Personal best** records

### 🎨 User Experience

- **Responsive design** for all devices
- **Dark theme** with gradient backgrounds
- **Loading states** with custom animations
- **Error handling** with user-friendly messages
- **Suspense boundaries** for smooth navigation

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React Three Fiber** - 3D rendering and animations
- **Three.js** - WebGL 3D graphics
- **Zustand** - State management
- **Tailwind CSS** - Utility-first styling
- **Headless UI** - Accessible components

### Backend & Database

- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Database (via Prisma Postgres)
- **NextAuth** - Authentication solution
- **API Routes** - Serverless functions

### Development

- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prisma Migrate** - Database migrations

---

## � Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cube-master.git
cd cube-master

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up the database
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Database Setup

```bash
# Initialize database
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### Deployment (Vercel)

The project is configured for deployment on Vercel with the following considerations:

**Environment Variables:**

- Copy `.env.example` to `.env.local` and fill in your values
- Set the same environment variables in your Vercel dashboard

**Prisma Engine Configuration:**

- The project includes multiple binary targets for different deployment environments
- Engine files are automatically generated during the build process
- If you encounter Prisma engine errors, check the troubleshooting section below

**Build Commands:**

- Vercel will automatically use the `vercel-build` script
- This ensures Prisma client is generated before building

**Troubleshooting Deployment Issues:**

If you encounter Prisma engine errors during deployment:

1. **Check environment variables:**

   ```bash
   # Make sure these are set in Vercel
   SUPABASE_CONNECTION_STRING="your-database-url"
   NEXTAUTH_URL="https://your-app.vercel.app"
   NEXTAUTH_SECRET="your-secret"
   ```

2. **Common solutions:**
   - Ensure database migrations are up to date
   - Check that all environment variables are correctly set
   - Verify that the database is accessible from your deployment environment

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── game/              # Game-related pages
│   ├── profile/           # User profile
│   └── signin/            # Authentication
├── components/            # React components
│   ├── analytics/         # Charts and statistics
│   ├── game/              # Game components
│   ├── landing/           # Landing page
│   ├── three/             # 3D components
│   └── ui/                # UI components
├── lib/                   # Utilities and configuration
├── hooks/                 # Custom React hooks
├── store/                 # Zustand store
└── prisma/               # Database schema and migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


## 🐛 Known Issues

- Some browsers may experience performance issues with complex animations
- Mobile touch controls could be improved for better accuracy

---

## 🔮 Future Features

- **Multiplayer mode** for real-time competition
- **Tutorial system** for beginners
- **Custom cube themes** and colors
- **Advanced statistics** and AI-powered tips
- **Mobile app** for iOS and Android

---

**Made with ❤️ by [numanjvd82]**
