import React, { useState } from 'react';
import { Menu, X, Leaf, Search, ShoppingBag, BookOpen, Home, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white py-4 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-eco-leaf" />
          <span className="ml-2 text-2xl font-semibold text-eco-text tracking-wider">ECOLOJIA</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink icon={<Home size={18} />} label={t('common.home')} isActive />
          <NavLink icon={<ShoppingBag size={18} />} label={t('common.products')} />
          <NavLink icon={<Search size={18} />} label={t('common.categories')} />
          <NavLink icon={<Info size={18} />} label={t('common.about')} />
          <NavLink icon={<BookOpen size={18} />} label={t('common.blog')} />
          <LanguageSelector />
        </div>
        
        <button 
          className="md:hidden text-eco-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white mt-4 py-2 px-6 space-y-4">
          <MobileNavLink label={t('common.home')} isActive />
          <MobileNavLink label={t('common.products')} />
          <MobileNavLink label={t('common.categories')} />
          <MobileNavLink label={t('common.about')} />
          <MobileNavLink label={t('common.blog')} />
          <div className="pt-2">
            <LanguageSelector />
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, isActive }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center hover:text-eco-leaf transition-colors ${
        isActive ? 'text-eco-leaf font-medium' : 'text-eco-text'
      }`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </a>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ label, isActive }) => {
  return (
    <a 
      href="#" 
      className={`block py-2 ${
        isActive ? 'text-eco-leaf font-medium' : 'text-eco-text'
      }`}
    >
      {label}
    </a>
  );
};

export default Navbar;