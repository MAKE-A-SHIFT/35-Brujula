'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, RefreshCw, LogOut } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { dictionaries } from '@/lib/dictionaries';
import AuthModal from '@/components/AuthModal';

export default function Topbar() {
  const { lang, toggleLang } = useLanguage();
  const { user, logout } = useAuth();
  const t = dictionaries[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSwitchAccount = () => {
    logout();
    setIsMenuOpen(false);
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="w-full p-6 md:px-10 flex justify-between items-center border-b border-white/20 sticky top-0 bg-black/30 backdrop-blur-md z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter hover:text-gray-300 transition-colors drop-shadow-md text-white">
            35 BRÚJULA
          </Link>
          <button 
            onClick={toggleLang} 
            className="text-[10px] md:text-xs font-bold px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-white uppercase tracking-widest border border-white/20"
          >
            {lang}
          </button>
        </div>
        
        <div className="flex gap-4 items-center relative">
          <div className="hidden md:flex gap-4 items-center mr-2">
            <Link href="/" className="text-xs md:text-sm font-semibold tracking-wide text-white hover:text-black hover:bg-white transition-colors border border-white/40 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
              {t.nav_home}
            </Link>
            <Link href="/calculator" className="text-xs md:text-sm font-semibold tracking-wide text-white hover:text-black hover:bg-white transition-colors border border-white/40 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
              ASTRO
            </Link>
            <Link href="/numerology" className="text-xs md:text-sm font-semibold tracking-wide text-white hover:text-black hover:bg-white transition-colors border border-white/40 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
              NUMEROLOGÍA
            </Link>
          </div>
          
          {!user ? (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest border border-white/30 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg backdrop-blur-md bg-black/40 text-white uppercase"
            >
              {t.acc_login_signup}
            </button>
          ) : (
            <div ref={menuRef} className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest border border-white/30 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg backdrop-blur-md bg-black/40 text-white uppercase"
              >
                <span>{t.acc_title}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
                  >
                    <Link 
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-white/10 transition-colors border-b border-white/5"
                    >
                      <User size={16} className="text-yellow-500" />
                      {t.acc_access}
                    </Link>
                    
                    <button 
                      onClick={handleSwitchAccount}
                      className="flex items-center gap-3 px-5 py-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-white/10 transition-colors border-b border-white/5 text-left"
                    >
                      <RefreshCw size={16} className="text-blue-400" />
                      {t.acc_switch}
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-5 py-4 text-xs font-bold tracking-widest uppercase text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      {t.acc_logout}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>
    </>
  );
}
