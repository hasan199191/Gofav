import { Link } from 'react-router-dom';
import { Twitter, Globe, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 text-primary-600 font-bold text-xl mb-4">
              <Award className="w-6 h-6" />
              <span>GoFav</span>
            </Link>
            <p className="text-neutral-600 text-sm">
              Earn rewards by creating quality social content for Algorand projects.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/campaigns" className="text-neutral-600 hover:text-primary-600 text-sm">
                  Active Campaign
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-neutral-600 hover:text-primary-600 text-sm">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/about-token" className="text-neutral-600 hover:text-primary-600 text-sm">
                  About GOFAV Token
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-neutral-600 hover:text-primary-600 text-sm">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact / Social */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://twitter.com/gofavapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-accent-500"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://gofav.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-primary-500"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} GoFav. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;