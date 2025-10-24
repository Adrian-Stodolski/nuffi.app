/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NUFFI Dark Theme Colors
        'bg-primary': '#0a0a0b',
        'bg-secondary': '#111113',
        'bg-tertiary': '#1a1a1d',
        'bg-quaternary': '#242428',
        
        'text-primary': '#ffffff',
        'text-secondary': '#b4b4b8',
        'text-muted': '#6b6b70',
        'text-disabled': '#404045',
        
        'border': '#2a2a2e',
        'border-hover': '#3a3a3e',
        'border-focus': '#4a4a4e',
        
        'accent-blue': '#3b82f6',
        'accent-blue-hover': '#2563eb',
        'accent-purple': '#8b5cf6',
        'accent-green': '#10b981',
        'accent-orange': '#f59e0b',
        'accent-red': '#ef4444',
        
        'status-active': '#22c55e',
        'status-warning': '#f59e0b',
        'status-error': '#ef4444',
        'status-inactive': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-strong': '0 0 30px rgba(59, 130, 246, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}