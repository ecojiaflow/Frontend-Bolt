import React from 'react';
import { Leaf, Mail, Heart, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 p-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-6">
              <Leaf className="h-6 w-6 text-eco-leaf" />
              <span className="ml-2 text-xl font-semibold text-eco-text">ECOLOJIA</span>
            </div>
            <p className="text-eco-text/70 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <SocialLink platform="facebook" />
              <SocialLink platform="twitter" />
              <SocialLink platform="instagram" />
              <SocialLink platform="linkedin" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-eco-text uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              <FooterLink text={t('common.home')} />
              <FooterLink text={t('common.products')} />
              <FooterLink text={t('common.categories')} />
              <FooterLink text={t('common.about')} />
              <FooterLink text={t('common.blog')} />
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-eco-text uppercase tracking-wider mb-4">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
              <FooterLink text={t('footer.terms')} />
              <FooterLink text={t('footer.privacy')} />
              <FooterLink text={t('footer.cookies')} />
              <FooterLink text={t('footer.legalNotice')} />
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-eco-text uppercase tracking-wider mb-4">
              {t('footer.newsletter')}
            </h3>
            <p className="text-sm text-eco-text/70 mb-4">
              {t('footer.newsletterDescription')}
            </p>
            <form className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-4 py-2 rounded-l-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-eco-leaf text-white rounded-r-full hover:bg-eco-text transition-colors"
                  aria-label={t('footer.subscribe')}
                >
                  <Mail size={20} />
                </button>
              </div>
              <p className="text-xs text-eco-text/50">
                {t('footer.gdprConsent')}
              </p>
            </form>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-200 py-8 px-12">
          <h3 className="text-sm font-semibold text-eco-text mb-6 flex items-center">
            <Shield size={16} className="mr-2" />
            {t('footer.certifications')}
          </h3>
          <div className="flex flex-wrap gap-4">
            <CertificationBadge name="AB Agriculture Biologique" />
            <CertificationBadge name="Ecocert" />
            <CertificationBadge name="FSC" />
            <CertificationBadge name="Cruelty Free" />
            <CertificationBadge name="1% for the Planet" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 py-6 px-12 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-eco-text/70">
            &copy; {new Date().getFullYear()} Ecolojia. {t('footer.allRights')}
          </p>
          <p className="text-sm text-eco-text/70 mt-2 sm:mt-0 flex items-center">
            <Heart size={14} className="text-eco-leaf mr-1" />
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  text: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ text }) => {
  return (
    <li>
      <a
        href="#"
        className="text-eco-text/70 hover:text-eco-leaf text-sm transition-colors"
      >
        {text}
      </a>
    </li>
  );
};

interface SocialLinkProps {
  platform: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ platform }) => {
  const { t } = useTranslation();
  
  return (
    <a
      href="#"
      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-eco-text/70 hover:text-eco-leaf hover:border-eco-leaf transition-colors"
      aria-label={t('footer.followUs', { platform })}
    >
      <span className="sr-only">{platform}</span>
      <span className="text-sm capitalize">{platform.charAt(0)}</span>
    </a>
  );
};

interface CertificationBadgeProps {
  name: string;
}

const CertificationBadge: React.FC<CertificationBadgeProps> = ({ name }) => {
  return (
    <div className="px-4 py-2 bg-eco-glow/10 rounded-full text-xs text-eco-olive font-medium">
      {name}
    </div>
  );
};

export default Footer;