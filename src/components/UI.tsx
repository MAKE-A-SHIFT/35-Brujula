'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

const dict = {
  es: {
    title: "35 BRÚJULA",
    reiki_btn: "Sesión de Reiki",
    reiki_title: "SESIÓN DE\nREIKI",
    reiki_desc: "El Reiki es un método de sanación energética suave y poderoso.\n\nDurante una sesión, se canaliza la energía universal para rearmonizar tu cuerpo, calmar tu mente y liberar bloqueos emocionales profundos.\n\nSentirás un calor envolvente, una liberación total de tensiones y una claridad mental renovada. Es un regreso a tu equilibrio natural.",
    reiki_risks: "Este tipo de terapia es una práctica complementaria de bienestar y no reemplaza la atención, el diagnóstico ni el tratamiento médico o psicológico.\n\nAnte cualquier condición de salud, consultá con un profesional habilitado.",
    akashic_btn: "Registros Akáshicos",
    akashic_title: "REGISTROS\nAKÁSHICOS",
    akashic_desc: "Los Registros Akáshicos son la gran biblioteca del Universo, que contiene la memoria de cada alma.\n\nAbrir tus registros es acceder a una sabiduría superior para entender los patrones repetitivos de tu vida, tus bloqueos actuales y la misión de tu alma.\n\nEs una conversación íntima y luminosa con tus guías espirituales para recibir respuestas claras y liberadoras.",
    akashic_risks: "La lectura de Registros Akáshicos es una práctica de acompañamiento espiritual y de autoconocimiento.\n\nNo reemplaza el diagnóstico, tratamiento o seguimiento médico, psicológico o psiquiátrico, ni ofrece garantías sobre resultados relacionados con la salud.\n\nAnte cualquier situación física o emocional, es importante consultar con profesionales de la salud habilitados.",
    know_more: "A SABER:",
    cta: "RESERVAR POR WHATSAPP",
    lang: "ES"
  },
  en: {
    title: "35 BRÚJULA",
    reiki_btn: "Reiki Session",
    reiki_title: "REIKI\nSESSION",
    reiki_desc: "Reiki is a gentle and powerful energy healing method.\n\nDuring a session, universal energy is channeled to reharmonize your body, calm your mind, and release deep emotional blockages.\n\nYou will feel an enveloping warmth, a total release of tension, and a renewed mental clarity. It is a return to your natural balance.",
    reiki_risks: "This type of therapy is a complementary wellness practice and does not replace medical or psychological care, diagnosis, or treatment.\n\nIn the face of any health condition, consult with a licensed professional.",
    akashic_btn: "Akashic Records",
    akashic_title: "AKASHIC\nRECORDS",
    akashic_desc: "The Akashic Records are the great library of the Universe, containing the memory of every soul.\n\nOpening your records means accessing higher wisdom to understand the repetitive patterns of your life, your current blockages, and your soul's mission.\n\nIt is an intimate and luminous conversation with your spiritual guides to receive clear answers.",
    akashic_risks: "The reading of Akashic Records is a practice of spiritual accompaniment and self-knowledge.\n\nIt does not replace medical, psychological, or psychiatric diagnosis, treatment, or follow-up, nor does it offer guarantees regarding health-related outcomes.\n\nIn the face of any physical or emotional situation, it is important to consult with licensed health professionals.",
    know_more: "GOOD TO KNOW:",
    cta: "BOOK VIA WHATSAPP",
    lang: "EN"
  }
};

const Polaroid = ({ src, className = "" }: { src: string, className?: string }) => (
  <div className={`bg-white p-2 pb-8 shadow-md border border-gray-200 ${className}`}>
    <div className="w-full h-full bg-gray-200 overflow-hidden">
      <img src={src} alt="Texture" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
    </div>
  </div>
);

export default function UI() {
  const [selectedOffer, setSelectedOffer] = useState<'reiki' | 'akashic' | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const t = dict[lang];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/542241552792', '_blank');
  };

  const toggleLang = () => {
    setLang(l => l === 'es' ? 'en' : 'es');
  };

  return (
    <div className={`relative z-10 w-full h-full pointer-events-none flex flex-col font-sans ${montserrat.variable}`}>
      {/* Topbar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full p-6 md:px-10 flex justify-between items-center pointer-events-auto"
      >
        <div className="text-xl md:text-2xl font-bold tracking-tighter text-white font-[var(--font-montserrat)] drop-shadow-md">
          {t.title}
        </div>
        <div className="flex gap-4 md:gap-6 items-center">
          <button 
            onClick={toggleLang}
            className="text-xs md:text-sm font-semibold tracking-wide text-white hover:text-black hover:bg-white transition-colors border border-white/40 rounded-full px-3 py-1 drop-shadow-md font-[var(--font-montserrat)]"
          >
            {t.lang}
          </button>
          <a href="https://instagram.com/35brujula" target="_blank" rel="noreferrer" className="text-white hover:opacity-70 transition-opacity drop-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <button onClick={handleWhatsApp} className="text-white hover:opacity-70 transition-opacity drop-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
          </button>
        </div>
      </motion.header>

      {/* Main Options (Rich Cards with Images) */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 p-6">
        <AnimatePresence>
          {!selectedOffer && mounted && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedOffer('reiki')}
                className="pointer-events-auto group relative flex flex-col items-center p-3 md:p-4 bg-white/70 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[32px] hover:bg-white/90 hover:scale-[1.03] transition-all duration-500 w-[220px] sm:w-[260px] md:w-[300px]"
              >
                <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-4 relative shadow-sm">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img src="/chakra.jpg" alt="Reiki" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                <span className="text-base md:text-lg font-[var(--font-montserrat)] font-bold uppercase tracking-tight text-black mb-1 md:mb-2">
                  {t.reiki_btn}
                </span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                onClick={() => setSelectedOffer('akashic')}
                className="pointer-events-auto group relative flex flex-col items-center p-3 md:p-4 bg-white/70 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[32px] hover:bg-white/90 hover:scale-[1.03] transition-all duration-500 w-[220px] sm:w-[260px] md:w-[300px]"
              >
                <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-4 relative shadow-sm">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img src="/pearl.jpg" alt="Akashic" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                <span className="text-base md:text-lg font-[var(--font-montserrat)] font-bold uppercase tracking-tight text-black mb-1 md:mb-2">
                  {t.akashic_btn}
                </span>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 pointer-events-auto bg-black/40 backdrop-blur-md"
            onClick={() => setSelectedOffer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#E6E5E1] p-5 md:p-8 shadow-2xl max-w-3xl w-full max-h-[95vh] relative flex flex-col overflow-y-auto overflow-x-hidden rounded-xl md:rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Language Switcher inside Modal */}
              <div className="absolute top-3 right-12 md:top-4 md:right-16 z-20 flex bg-white/50 backdrop-blur-md rounded-full border border-black/10 overflow-hidden font-[var(--font-montserrat)] shadow-sm">
                <button 
                  onClick={() => setLang('es')} 
                  className={`px-3 py-1 text-xs md:text-sm font-bold transition-colors ${lang === 'es' ? 'bg-black text-white' : 'text-black hover:bg-black/10'}`}
                >
                  ES
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-3 py-1 text-xs md:text-sm font-bold transition-colors ${lang === 'en' ? 'bg-black text-white' : 'text-black hover:bg-black/10'}`}
                >
                  EN
                </button>
              </div>

              <button 
                onClick={() => setSelectedOffer(null)}
                className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-black/10 text-black transition-colors z-20"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Top Row: 3 Polaroids + Date */}
              <div className="flex justify-between items-end mb-6 md:mb-8 mt-8 md:mt-2">
                <div className="flex gap-2 md:gap-4">
                  <Polaroid 
                    src={selectedOffer === 'reiki' ? '/reiki_small.png' : '/akashic_small_1.png'} 
                    className="w-10 h-14 md:w-20 md:h-28" 
                  />
                  <Polaroid 
                    src={selectedOffer === 'reiki' ? '/reiki_small.png' : '/akashic_small_2.png'} 
                    className="w-10 h-14 md:w-20 md:h-28" 
                  />
                  <Polaroid 
                    src={selectedOffer === 'reiki' ? '/reiki_small.png' : '/akashic_small_1.png'} 
                    className="w-10 h-14 md:w-20 md:h-28" 
                  />
                </div>
                <div className="font-[var(--font-montserrat)] tracking-widest text-xs md:text-sm text-gray-800">
                  MAY26
                </div>
              </div>

              {/* Bottom Row: Text (Left) + Large Polaroid (Right) */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-1 flex flex-col">
                  <h2 
                    className={`text-2xl sm:text-3xl md:text-4xl font-[var(--font-montserrat)] font-extrabold uppercase mb-4 md:mb-6 leading-tight tracking-tight ${selectedOffer === 'reiki' ? 'text-[#37533D]' : 'text-[#D33311]'}`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {selectedOffer === 'reiki' ? t.reiki_title : t.akashic_title}
                  </h2>
                  
                  <div className="font-[var(--font-montserrat)] text-[13px] md:text-sm text-black/90 font-medium leading-relaxed space-y-4 md:space-y-5 text-justify">
                    <p className="whitespace-pre-line">{selectedOffer === 'reiki' ? t.reiki_desc : t.akashic_desc}</p>
                    
                    <div className="pt-3 md:pt-4 border-t border-black/10">
                      <p className="font-bold mb-1 md:mb-2">{t.know_more}</p>
                      <p className="whitespace-pre-line">{selectedOffer === 'reiki' ? t.reiki_risks : t.akashic_risks}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsApp}
                    className={`mt-6 md:mt-8 w-full md:w-auto md:self-start px-6 py-3 font-[var(--font-montserrat)] font-bold uppercase tracking-widest text-xs md:text-sm border-2 transition-all text-center ${selectedOffer === 'reiki' ? 'border-[#37533D] text-[#37533D] hover:bg-[#37533D] hover:text-[#E6E5E1]' : 'border-[#D33311] text-[#D33311] hover:bg-[#D33311] hover:text-[#E6E5E1]'}`}
                  >
                    {t.cta}
                  </button>
                </div>

                <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-4 md:mt-0">
                  <Polaroid 
                    src={selectedOffer === 'reiki' ? '/reiki_large.png' : '/akashic_large.png'} 
                    className="w-[50%] sm:w-[40%] md:w-full max-w-[220px] aspect-[3/4]" 
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
