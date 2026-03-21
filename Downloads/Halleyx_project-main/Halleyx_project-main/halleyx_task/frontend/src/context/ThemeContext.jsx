import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('halleyx_theme') === 'dark';
  });

  useEffect(() => {
    // Only add 'dark' class when inside /app (not landing/login/register)
    const isAppRoute = window.location.pathname.startsWith('/app');
    if (dark && isAppRoute) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('halleyx_theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Called on route change to enforce light on public pages
  const enforceThemeForRoute = (path) => {
    if (!path.startsWith('/app')) {
      document.documentElement.classList.remove('dark');
    } else if (dark) {
      document.documentElement.classList.add('dark');
    }
  };

  const toggle = () => setDark(d => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle, enforceThemeForRoute }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
