import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MenuIcon, X, Award, User, Layout, BarChart2, LogOut, Brain, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthStore } from '../../store/authStore';
import { useWallet } from '../../contexts/WalletContext';
import Button from '../ui/Button';
import WalletConnect from '../wallet/WalletConnect';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { user, isAuthenticated } = useAuthStore();
  const { connected, address } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/campaigns', label: 'Campaign', icon: Award },
    { path: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
    { path: '/mindshare', label: 'Mindshare', icon: Brain },
    { path: '/loyalty', label: 'Loyalty', icon: Shield },
  ];

  // Add project dashboard if user is a project owner
  if (user?.isProjectOwner) {
    navLinks.push({
      path: '/project/dashboard',
      label: 'Project Dashboard',
      icon: Layout,
    });
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary-600 font-bold text-xl"
            onClick={closeMenu}
          >
            <Award className="w-6 h-6" />
            <span>GoFav</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isAuthenticated && navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth / Wallet Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <WalletConnect />
                </div>
                <div className="hidden md:flex items-center">
                  <div 
                    className="flex items-center cursor-pointer relative"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <img
                      src={user?.twitterProfileImage}
                      alt={user?.twitterName}
                      className="w-8 h-8 rounded-full"
                    />
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-sm font-medium text-neutral-900">{user?.twitterName}</p>
                          <p className="text-xs text-neutral-500">@{user?.twitterHandle}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 inline mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:block">
                <Button onClick={() => navigate('/login')}>Sign In</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === link.path
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                      onClick={closeMenu}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                
                <div className="pt-2 pb-1">
                  <WalletConnect isMobile />
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                  onClick={closeMenu}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Button 
                className="w-full justify-center"
                onClick={() => {
                  navigate('/login');
                  closeMenu();
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;