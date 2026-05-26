/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        primaryDark: '#1565C0',
        secondary: '#FF9800',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        bgLight: '#F5F5F5',
        textDark: '#333333',
        textLight: '#666666',
        borderColor: '#E0E0E0',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        button: '0 4px 12px rgba(30, 136, 229, 0.3)',
      }
    },
  },
  plugins: [],
}
