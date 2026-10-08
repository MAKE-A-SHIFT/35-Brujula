'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, RefreshCw, LogOut, Menu, X, Compass, Sparkles, Home } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useAuth } from '@/components/AuthProvider';
import { dictionaries } from '@/lib/dictionaries';
import AuthModal from '@/components/AuthModal';

export default function Topbar() {
  const { lang, toggleLang } = useLanguage();
  const { user, logout } = useAuth();
  const t = dictionaries[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <header className="w-full p-4 md:p-6 md:px-10 flex justify-between items-center border-b border-white/20 sticky top-0 bg-black/40 backdrop-blur-md z-40 shadow-lg">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter hover:text-gray-300 transition-colors drop-shadow-md text-white whitespace-nowrap">
            35 BRÚJULA
          </Link>
          <button 
            onClick={toggleLang} 
            className="text-[10px] md:text-xs font-bold px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-white uppercase tracking-widest border border-white/20"
          >
            {lang}
          </button>
        </div>
        
        <div className="flex gap-2 md:gap-4 items-center relative">
          {/* Desktop Navigation Links */}
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
          
          {/* Account Button (Desktop & Tablet) */}
          <div className="hidden sm:block">
            {!user ? (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest border border-white/30 px-4 md:px-5 py-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg backdrop-blur-md bg-black/40 text-white uppercase whitespace-nowrap"
              >
                {t.acc_login_signup}
              </button>
            ) : (
              <div ref={menuRef} className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest border border-white/30 px-4 md:px-5 py-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg backdrop-blur-md bg-black/40 text-white uppercase whitespace-nowrap"
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
                      className="absolute right-0 mt-3 w-56 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
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

          {/* Mobile / Tablet Burger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            className="md:hidden p-2 rounded-full border border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all shadow-lg flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[69px] left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/20 p-6 flex flex-col gap-5 shadow-2xl z-30"
          >
            {/* Primary Navigation Tabs */}
            <div className="flex flex-col gap-2">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-widest text-white hover:bg-white/10 border border-white/10 transition-colors uppercase"
              >
                <Home size={16} className="text-gray-400" />
                <span>{t.nav_home}</span>
              </Link>
              <Link 
                href="/calculator" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-widest text-white hover:bg-cyan-500/10 border border-cyan-400/20 transition-colors uppercase"
              >
                <Sparkles size={16} className="text-cyan-400" />
                <span>ASTRO</span>
              </Link>
              <Link 
                href="/numerology" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-widest text-white hover:bg-yellow-500/10 border border-yellow-400/20 transition-colors uppercase"
              >
                <Compass size={16} className="text-yellow-400" />
                <span>NUMEROLOGÍA</span>
              </Link>
            </div>

            <div className="h-px bg-white/10"></div>

            {/* Account Controls in Mobile Drawer */}
            {!user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowAuthModal(true);
                }}
                className="w-full text-center py-3.5 rounded-full bg-white text-black text-xs font-extrabold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-gray-200 transition-colors"
              >
                {t.acc_login_signup}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <User size={16} className="text-yellow-500" />
                  <span>{t.acc_access}</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSwitchAccount();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 border border-white/10 transition-colors text-left"
                >
                  <RefreshCw size={16} className="text-blue-400" />
                  <span>{t.acc_switch}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors text-left"
                >
                  <LogOut size={16} />
                  <span>{t.acc_logout}</span>
                </button>
              </div>
            )}

            {/* Language Quick Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-gray-400 uppercase tracking-widest font-semibold text-[10px]">Langue / Idioma</span>
              <button
                onClick={toggleLang}
                className="px-3 py-1 rounded-full uppercase font-bold text-xs tracking-wider bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
              >
                {lang.toUpperCase()} ⟳
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>
    </>
  );
}
