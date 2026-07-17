import { LogOut, User, CheckSquare } from 'lucide-react';
import { useNavigate, NavigateFunction, Link } from 'react-router-dom';
import { useAuth } from './firestore-utils/auth-context';
import { useNotification } from './firestore-utils/notification-context';
import { Firestore } from 'firebase/firestore';

const isAppMode = import.meta.env.VITE_APP_MODE === 'true';
const appName = import.meta.env.VITE_APP_NAME || (isAppMode ? 'SecureAgentBase' : 'Your App');

interface NavigationBarProps {
  navigate?: NavigateFunction;
  db?: Firestore;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ navigate: navigationOverride, db }) => {
  const defaultNavigate = useNavigate();
  const navigate = navigationOverride || defaultNavigate;
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      addNotification('Logout failed: ' + (error as Error).message, 'error');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-8 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-900">
              {appName}
              {isAppMode && (
                <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{import.meta.env.VITE_APP_VERSION || 'v0.1.0'}</span>
              )}
            </h1>
          </Link>

          <div className="flex items-center space-x-4 flex-wrap justify-end">
            {isAppMode ? (
              <Link to="/infra-setup" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Deploy
              </Link>
            ) : user && (
              <Link to="/tasks" className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
                <CheckSquare size={16} />
                Tasks
              </Link>
            )}
