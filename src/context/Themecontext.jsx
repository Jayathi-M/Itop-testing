import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Persist theme across page refreshes
    return localStorage.getItem('xception-theme') || 'dark';
  });

  useEffect(() => {
    // Apply theme to <html> — CSS variables will auto-cascade everywhere
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('xception-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — use this in any component that needs theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}