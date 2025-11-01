const config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: 'rgb(var(--color-base-rgb) / <alpha-value>)',
        primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',
        accent1: 'rgb(var(--color-accent1-rgb) / <alpha-value>)',
        accent2: 'rgb(var(--color-accent2-rgb) / <alpha-value>)',
        accent3: 'rgb(var(--color-accent3-rgb) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 8px 28px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
