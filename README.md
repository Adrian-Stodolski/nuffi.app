# 👻 NUFFI - AI Development Environment

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tauri-1.5.0-FFC131?style=for-the-badge&logo=tauri&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-4.5.14-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-10.16.4-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
</div>

## ✨ Overview

**NUFFI** is a next-generation AI-powered development environment that revolutionizes how developers work. Built with modern web technologies and featuring a beautiful glassmorphism UI, NUFFI provides intelligent workspace management, real-time system monitoring, and AI-driven recommendations.

## 🚀 Key Features

### 🎯 **AI-Powered Workspace Management**
- **Smart Workspace Creation** - Intelligent project setup with AI recommendations
- **Template Marketplace** - Curated collection of development templates
- **AI Recommendations** - Real-time suggestions for code optimization and best practices
- **Preset Wizard** - Guided setup for popular development stacks

### 📊 **Real-Time Dashboard & Monitoring**
- **System Performance Monitor** - Live CPU, Memory, Disk, and Network metrics
- **Project Health Tracking** - Code quality, test coverage, and security monitoring
- **Development Tools Status** - Real-time status of Node.js, React, TypeScript, and more
- **Activity Feed** - Recent deployments, tests, and development events

### 🎨 **Beautiful Modern UI**
- **Glassmorphism Design** - Stunning glass-card effects with backdrop blur
- **Smooth Animations** - 60fps animations powered by Framer Motion
- **Responsive Layout** - Perfect experience on all screen sizes
- **Dark Theme** - Eye-friendly dark interface with accent colors

### 🔧 **Developer Experience**
- **Hot Module Replacement** - Instant updates during development
- **TypeScript Support** - Full type safety and IntelliSense
- **Component Library** - Reusable UI components with consistent styling
- **State Management** - Efficient state handling with Zustand

## 🛠️ Tech Stack

### **Frontend**
- **React 18.2.0** - Modern React with hooks and concurrent features
- **TypeScript 5.0.4** - Type-safe development experience
- **Vite 4.5.14** - Lightning-fast build tool and dev server
- **Framer Motion 10.16.4** - Production-ready motion library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons

### **Desktop App**
- **Tauri 1.5.0** - Rust-powered desktop application framework
- **Rust** - Systems programming language for performance

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **PostCSS** - CSS processing and optimization

## 🎮 Getting Started

### Prerequisites
- **Node.js** 18.17.0 or higher
- **Rust** 1.77.1 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nuffi.git
   cd nuffi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Launch Tauri app** (in separate terminal)
   ```bash
   cargo tauri dev
   ```

5. **Open in browser**
   ```
   http://localhost:1420
   ```

## 📱 Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Layout components (Sidebar, TopBar)
│   ├── NuffiLogo.tsx    # Custom Nuffi ghost logo
│   └── AnimatedBackground.tsx
├── pages/               # Application pages
│   ├── V3Ultimate.tsx   # Dashboard Overview
│   ├── WowFactorDemo.tsx # Performance Monitor
│   ├── AIRecommendations.tsx
│   ├── Marketplace.tsx
│   └── ...
├── services/            # API and service layers
├── stores/              # State management
└── styles/              # Global styles and themes
```

## 🎨 Design System

### **Color Palette**
- **Primary**: `#00BFFF` (Accent Blue)
- **Secondary**: `#8B5CF6` (Accent Purple)
- **Success**: `#4CAF50` (Accent Green)
- **Warning**: `#F97316` (Accent Orange)
- **Error**: `#EF4444` (Accent Red)

### **Typography**
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold weights with gradient text effects
- **Body**: Regular weight with proper line heights

### **Components**
- **Glass Cards**: Backdrop blur with subtle borders
- **Hover Effects**: Smooth scale and lift animations
- **Loading States**: Rotating icons and progress bars
- **Gradients**: Multi-color gradients for visual appeal

## 🚀 Features in Detail

### **Dashboard Overview**
- Real-time system metrics with animated progress bars
- Project statistics with trend indicators
- Recent activity feed with color-coded events
- Circular health score with SVG animations

### **Performance Monitor**
- Live CPU usage with temperature monitoring
- Memory usage with available/used breakdown
- Disk I/O with read/write speeds
- Network activity with latency tracking
- Top system processes with resource usage

### **AI Recommendations**
- Intelligent code optimization suggestions
- Security vulnerability detection
- Performance improvement recommendations
- Loading states with smooth animations
- Apply/Dismiss functionality

### **Marketplace**
- Template browsing with search and filters
- One-click template application
- Rating and download statistics
- Responsive grid layout

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run tauri dev    # Start Tauri development
npm run tauri build  # Build Tauri application
```

### **Code Style**
- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **TypeScript** strict mode enabled
- **Component naming**: PascalCase for components
- **File naming**: camelCase for utilities, PascalCase for components

## 🎯 Roadmap

- [ ] **AI Code Assistant** - Integrated AI coding help
- [ ] **Plugin System** - Extensible architecture
- [ ] **Cloud Sync** - Workspace synchronization
- [ ] **Team Collaboration** - Multi-user workspaces
- [ ] **Mobile App** - iOS and Android companion
- [ ] **Docker Integration** - Container management
- [ ] **Git Integration** - Advanced version control

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tauri Team** - For the amazing desktop app framework
- **React Team** - For the incredible UI library
- **Framer** - For the beautiful motion library
- **Lucide** - For the gorgeous icon set

---

<div align="center">
  <p>Made with ❤️ by the NUFFI Team</p>
  <p>🚀 <strong>Building the future of development environments</strong> 🚀</p>
  <p><em>Hook test - auto git workflow enabled</em></p>
</div>