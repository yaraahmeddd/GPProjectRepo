import { motion } from 'framer-motion';
import { CheckCircle, Home, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HUCLogo = "/assets/HUC logo.jpeg";

export const AssignmentPage = () => {
  const { t, i18n } = useTranslation('assignment');
  const isRTL = i18n.resolvedLanguage?.startsWith('ar') || i18n.language?.startsWith('ar');

  const handleDone = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Cairo']" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-center mb-8 no-print">
          <img src={HUCLogo} alt={t('logo_alt', 'Helwan University Club')} className="h-20 w-auto object-contain" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'circOut' }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#1a5f7a] mb-3">{t('success_title', 'Registration Completed Successfully!')}</h1>
          <p className="text-xl text-gray-600 mt-4 font-semibold">{t('success_subtitle', 'Please visit the club HQ to complete the remaining procedures')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-center mt-8">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDone} className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2596be] hover:bg-[#1a7a9a] text-white font-bold rounded-xl shadow-lg shadow-[#2596be]/20 transition-all">
            <Home className="w-5 h-5" />
            {t('back_home', 'Back to Home')}
          </motion.button>
        </motion.div>
      </div>

      <footer className="bg-[#0e1c38] text-white pt-16 pb-10 rounded-t-[3rem] mt-16 no-print">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-4 mb-6">
                <img src={HUCLogo} alt={t('logo_alt', 'Helwan University Club')} className="w-16 h-16 object-contain bg-white rounded-lg p-2" />
                <div>
                  <h3 className="font-bold text-2xl">{t('club_name', 'Helwan University Club')}</h3>
                  <p className="text-[#f8941c] font-medium">{t('club_tagline', 'Legacy.. Sports.. Life')}</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed font-normal">{t('club_desc', 'Your first destination for sports and recreation. We provide an integrated sports community with world-class services for all family members.')}</p>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">{t('quick_links', 'Quick Links')}</h4>
                <ul className="space-y-4 text-gray-400">
                  <li><button onClick={() => window.location.href = '/'} className="hover:text-indigo-400 transition-colors">{t('home', 'Home')}</button></li>
                  <li><button onClick={() => window.location.href = '/re'} className="hover:text-indigo-400 transition-colors">{t('register', 'Registration')}</button></li>
                  <li><button onClick={() => window.location.href = '/login'} className="hover:text-indigo-400 transition-colors">{t('login', 'Login')}</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-6 text-white">{t('contact_us', 'Contact Us')}</h4>
                <ul className="space-y-4 text-gray-400 text-sm">
                  <li className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#2596be]" />
                    <a href="https://maps.app.goo.gl/QHexupLs17Y7u7rF6" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('map_location', 'View on Map')}</a>
                  </li>
                  <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#2596be]" />1913641</li>
                  <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#2596be]" />huc@hq.helwan.edu.eg</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">{t('copyright', { year: new Date().getFullYear(), defaultValue: `© ${new Date().getFullYear()} Helwan University Club - All rights reserved` })}</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E4405F] transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1DA1F2] transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssignmentPage;

