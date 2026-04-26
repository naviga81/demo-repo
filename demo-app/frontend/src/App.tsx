import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';

function AppContent() {
  const { theme } = useTheme();
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <HomePage />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
