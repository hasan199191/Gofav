/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F6F6',
          100: '#CCF0ED',
          200: '#99E0DA',
          300: '#66D1C8',
          400: '#33C2B5',
          500: '#00B3A3', // Main Algorand Teal
          600: '#008F83',
          700: '#006B63',
          800: '#004842',
          900: '#002421'
        },
        secondary: {
          50: '#F0E6F6',
          100: '#E2CCED',
          200: '#C599DB',
          300: '#A866C8',
          400: '#8B33B6',
          500: '#6E00A3', // Purple accent
          600: '#580082',
          700: '#420062',
          800: '#2C0041',
          900: '#160021'
        },
        accent: {
          50: '#FFF2E6',
          100: '#FFE5CC',
          200: '#FFCA99',
          300: '#FFB066',
          400: '#FF9633',
          500: '#FF7C00', // Orange accent
          600: '#CC6300',
          700: '#994A00',
          800: '#663200',
          900: '#331900'
        },
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#4CAF50',
          700: '#388E3C'
        },
        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          500: '#FFC107',
          700: '#FFA000'
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#F44336',
          700: '#D32F2F'
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'hard': '0 10px 25px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};