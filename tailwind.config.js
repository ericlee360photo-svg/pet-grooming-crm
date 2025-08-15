/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#374151', // Custom gray for hover states
        },
        primary: {
          50: '#f8fafc',   // Very light navy
          100: '#f1f5f9',  // Light navy
          200: '#e2e8f0',  // Soft navy
          300: '#cbd5e1',  // Medium light navy
          400: '#94a3b8',  // Medium navy
          500: '#64748b',  // Navy blue
          600: '#475569',  // Dark navy
          700: '#334155',  // Darker navy
          800: '#1e293b',  // Main navy from logo
          900: '#0f172a',  // Deepest navy
        },
        secondary: {
          50: '#f8f7f9',   // Very light lavender
          100: '#f0eef2',  // Light lavender
          200: '#e2dde5',  // Soft lavender
          300: '#cfc4d1',  // Medium lavender
          400: '#b8a5bc',  // Muted lavender
          500: '#a087a6',  // Lavender gray
          600: '#8b6d90',  // Deep lavender
          700: '#75577a',  // Dark lavender
          800: '#5e4763',  // Very dark lavender
          900: '#4a374f',  // Deepest lavender
        },
        accent: {
          50: '#fff7ed',   // Very light coral
          100: '#ffedd5',  // Light coral
          200: '#fed7aa',  // Soft coral
          300: '#fdba74',  // Medium coral
          400: '#fb923c',  // Warm coral
          500: '#f97316',  // Main coral/orange from logo
          600: '#ea580c',  // Dark coral
          700: '#c2410c',  // Darker coral
          800: '#9a3412',  // Deep coral
          900: '#7c2d12',  // Deepest coral
        },
        neutral: {
          50: '#f9fafb',   // Almost white
          100: '#f3f4f6',  // Very light gray
          200: '#e5e7eb',  // Light gray
          300: '#d1d5db',  // Medium light gray
          400: '#9ca3af',  // Medium gray
          500: '#6b7280',  // Gray
          600: '#4b5563',  // Dark gray
          700: '#374151',  // Very dark gray
          800: '#1f2937',  // Almost black
          900: '#111827',  // Black
        },
        dark: {
          50: '#f8f9fa',   // Very light
          100: '#e9ecef',  // Light
          200: '#dee2e6',  // Medium light
          300: '#ced4da',  // Medium
          400: '#adb5bd',  // Medium dark
          500: '#6c757d',  // Dark
          600: '#495057',  // Darker
          700: '#343a40',  // Very dark
          800: '#212529',  // Almost black
          900: '#1a1d20',  // Deep navy/black
        }
      },
    },
  },
  plugins: [],
}
