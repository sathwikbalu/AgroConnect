import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Sprout, User, ChevronDown, Settings, UserCircle, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-theme-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-white animate-float" />
              <span className="text-xl font-bold text-white">AgroConnect</span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/crops"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/crops'
                      ? 'text-white bg-theme-700'
                      : 'text-theme-200 hover:text-white hover:bg-theme-700'
                  }`}
                >
                  Crops
                </Link>
                <Link
                  to="/resources"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/resources'
                      ? 'text-white bg-theme-700'
                      : 'text-theme-200 hover:text-white hover:bg-theme-700'
                  }`}
                >
                  Resources
                </Link>
                {user.role === 'farmer' && (
                  <Link
                    to="/resources/requests"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/resources/requests'
                        ? 'text-white bg-theme-700'
                        : 'text-theme-200 hover:text-white hover:bg-theme-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-1" />
                      Requests
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 text-white focus:outline-none"
                >
                  <div className="bg-theme-700 p-2 rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-xs text-theme-200">{user.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-theme-200" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-theme-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Your Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-theme-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-theme-800 bg-white hover:bg-theme-50 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
}