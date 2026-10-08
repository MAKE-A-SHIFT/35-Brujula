'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { HistoriaPreview, HistoriaFull } from './MiHistoriaText';
import Topbar from './Topbar';
import { useLanguage } from '@/components/LanguageProvider';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

const dict = {
  es: {
    title: "35 BRÚJULA",
    calc_nav: "CALCULADORA ASTRAL",
    lang: "ES",
    hero_title: "DESPIERTA TU POTENCIAL",
    hero_sub: "Transforma tu vida a través del autoconocimiento y la sanación energética.",
    
    // Mi Historia
    historia_title: "MI HISTORIA",
    historia_preview: "Hola, soy Lili. Durante años busqué respuestas en el mundo exterior, hasta que un día comprendí que la verdadera brújula siempre estuvo adentro. Este viaje de sanación me llevó a descubrir...",
    historia_full: "...herramientas poderosas como los Registros Akáshicos y el Reiki. Viajé por el mundo, me inicié con chamanes en Perú y Paraguay, y hoy dedico mi vida a acompañar a otras almas en su proceso de despertar y sanación. Mi misión es entregarte las llaves para que tú también encuentres tu norte.",
    read_more: "LEER MÁS",
    read_less: "LEER MENOS",

    // Value Ladder
    step1_tag: "PASO 1 • GRATIS",
    step1_title: "Guía para días difíciles",
    step1_desc: "Descarga mi guía gratuita para comenzar tu viaje de autoconocimiento y encontrar calma.",
    step1_cta: "DESCARGAR GRATIS",

    step2_tag: "PASO 2 • AUTOSANACIÓN",
    step2_title: "21 Días para volver a vos",
    step2_desc: "Un poderoso viaje práctico guiado. Incluye el manual completo y la guía de uso paso a paso para reconectar con tu esencia.",
    step2_cta: "COMPRAR POR $17",

    step2b_tag: "PASO 2 • MINDFULNESS",
    step2b_title: "Brújula Colorea",
    step2b_desc: "Libro de arte-terapia digital. Colorear mandalas y geometría sagrada es una forma de meditación activa para calmar tu mente.",
    step2b_cta: "COMPRAR POR $9",

    step3_tag: "PASO 3 • SESIONES 1 A 1",
    reiki_btn: "Sesión de Reiki",
    akashic_btn: "Registros Akáshicos",
    
    step4_tag: "PASO 4 • INMERSIÓN TOTAL",
    step4_title: "Retiro Espiritual & Iniciación Reiki",
    step4_desc: "Únete a un viaje transformador en Perú o Paraguay.\n• Rituales chamánicos ancestrales\n• Iniciación oficial al Reiki\n• Curso completo de Reiki\n• Ejercicios prácticos de canalización",
    step4_cta: "APLICAR AL RETIRO",

    step4b_tag: "PASO 4 • INMERSIÓN TOTAL",
    step4b_title: "Retiro Espiritual & Registros Akáshicos",
    step4b_desc: "Únete a un viaje transformador en Perú o Paraguay.\n• Rituales chamánicos ancestrales\n• Iniciación a los Registros Akáshicos\n• Curso de lectura de archivos\n• Ejercicios prácticos de conexión",
    step4b_cta: "APLICAR AL RETIRO",
  },
  en: {
    title: "35 BRÚJULA",
    calc_nav: "ASTRAL CALCULATOR",
    lang: "EN",
    hero_title: "AWAKEN YOUR POTENTIAL",
    hero_sub: "Transform your life through self-knowledge and energetic healing.",
    
    historia_title: "MY STORY",
    historia_preview: "Hi, I'm Lili. For years I sought answers in the outside world, until one day I understood that the true compass was always inside. This healing journey led me to discover...",
    historia_full: "...powerful tools like the Akashic Records and Reiki. I traveled the world, was initiated by shamans in Peru and Paraguay, and today I dedicate my life to accompanying other souls in their awakening process. My mission is to give you the keys so you too can find your true north.",
    read_more: "READ MORE",
    read_less: "READ LESS",

    step1_tag: "STEP 1 • FREE",
    step1_title: "Guide for Difficult Days",
    step1_desc: "Download my free guide to begin your journey of self-knowledge and find peace.",
    step1_cta: "DOWNLOAD FREE",

    step2_tag: "STEP 2 • SELF-HEALING",
    step2_title: "21 Days to return to yourself",
    step2_desc: "A powerful guided practical journey. Includes the complete manual and the step-by-step usage guide to reconnect with your essence.",
    step2_cta: "BUY FOR $17",

    step2b_tag: "STEP 2 • MINDFULNESS",
    step2b_title: "Compass Colors",
    step2b_desc: "Digital art-therapy book. Coloring mandalas and sacred geometry is a form of active meditation to calm your mind.",
    step2b_cta: "BUY FOR $9",

    step3_tag: "STEP 3 • 1-ON-1 SESSIONS",
    reiki_btn: "Reiki Session",
    akashic_btn: "Akashic Records",
    
    step4_tag: "STEP 4 • TOTAL IMMERSION",
    step4_title: "Spiritual Retreat & Reiki Initiation",
    step4_desc: "Join a transformative journey in Peru or Paraguay.\n• Ancestral shamanic rituals\n• Official Reiki initiation\n• Complete Reiki course\n• Practical channeling exercises",
    step4_cta: "APPLY FOR RETREAT",

    step4b_tag: "STEP 4 • TOTAL IMMERSION",
    step4b_title: "Spiritual Retreat & Akashic Records",
    step4b_desc: "Join a transformative journey in Peru or Paraguay.\n• Ancestral shamanic rituals\n• Akashic Records initiation\n• Reading archives course\n• Practical connection exercises",
    step4b_cta: "APPLY FOR RETREAT",
    }
  , fr: {
    title: "35 BRÚJULA",
    calc_nav: "CALCULATEUR ASTRAL",
    lang: "FR",
    hero_title: "RÉVEILLEZ VOTRE POTENTIEL",
    hero_sub: "Transformez votre vie grâce à la connaissance de soi et la guérison énergétique.",
    
    historia_title: "MON HISTOIRE",
    historia_preview: "Bonjour, je suis Lili. Pendant des années, j'ai cherché des réponses dans le monde extérieur, jusqu'au jour où j'ai compris que la véritable boussole était toujours à l'intérieur. Ce voyage de guérison m'a amenée à découvrir...",
    historia_full: "...des outils puissants comme les Annales Akashiques et le Reiki. J'ai voyagé à travers le monde, j'ai été initiée par des chamans au Pérou et au Paraguay, et aujourd'hui je consacre ma vie à accompagner d'autres âmes dans leur processus d'éveil et de guérison. Ma mission est de vous remettre les clés pour que vous trouviez vous aussi votre nord.",
    read_more: "LIRE PLUS",
    read_less: "LIRE MOINS",

    step1_tag: "ÉTAPE 1 • GRATUIT",
    step1_title: "Guide pour les Jours Difficiles",
    step1_desc: "Téléchargez mon guide gratuit pour commencer votre voyage de connaissance de soi et trouver la paix.",
    step1_cta: "TÉLÉCHARGER GRATUITEMENT",

    step2_tag: "ÉTAPE 2 • AUTO-GUÉRISON",
    step2_title: "21 Jours pour revenir à soi",
    step2_desc: "Un puissant voyage pratique guidé. Inclut le manuel complet et le guide d'utilisation étape par étape pour vous reconnecter à votre essence.",
    step2_cta: "ACHETER POUR 17$",

    step2b_tag: "ÉTAPE 2 • PLEINE CONSCIENCE",
    step2b_title: "Couleurs Boussole",
    step2b_desc: "Livre d'art-thérapie numérique. Colorier des mandalas et de la géométrie sacrée est une forme de méditation active pour calmer votre esprit.",
    step2b_cta: "ACHETER POUR 9$",

    step3_tag: "ÉTAPE 3 • SÉANCES 1 À 1",
    reiki_btn: "Séance de Reiki",
    akashic_btn: "Annales Akashiques",
    
    step4_tag: "ÉTAPE 4 • IMMERSION TOTALE",
    step4_title: "Retraite Spirituelle & Initiation Reiki",
    step4_desc: "Rejoignez un voyage transformateur au Pérou ou au Paraguay.\n• Rituels chamaniques ancestraux\n• Initiation officielle au Reiki\n• Cours complet de Reiki\n• Exercices pratiques de canalisation",
    step4_cta: "POSTULER À LA RETRAITE",

    step4b_tag: "ÉTAPE 4 • IMMERSION TOTALE",
    step4b_title: "Retraite Spirituelle & Annales Akashiques",
    step4b_desc: "Rejoignez un voyage transformateur au Pérou ou au Paraguay.\n• Rituels chamaniques ancestraux\n• Initiation aux Annales Akashiques\n• Cours de lecture des archives\n• Exercices pratiques de connexion",
    step4b_cta: "POSTULER À LA RETRAITE",
  }
  , 
};

const Polaroid = ({ src, className }: { src: string, className: string }) => (
  <div className={`bg-[#E6E5E1] p-2 md:p-3 pb-6 md:pb-10 shadow-xl border border-black/5 rotate-[-2deg] hover:rotate-0 transition-transform ${className}`}>
    <div className="w-full h-full relative overflow-hidden bg-black/5">
      <img src={src} alt="Polaroid" className="w-full h-full object-cover filter contrast-125 grayscale-[20%]" />
    </div>
  </div>
);

export default function UI() {
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguage();
  const [selectedOffer, setSelectedOffer] = useState<'reiki' | 'akashic' | null>(null);
  const [storyExpanded, setStoryExpanded] = useState(false);

  const t = dict[lang as 'es' | 'en' | 'fr'];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsApp = () => window.open('https://wa.me/542241552792', '_blank');
  

  return (
    <div className={`absolute inset-0 z-10 w-full h-full overflow-y-auto font-sans ${montserrat.variable}`}>
      
      {/* Topbar */}
      <Topbar />

      {/* Main Content (CRO Structured) */}
      <div className="max-w-4xl mx-auto px-6 pb-24 pt-10 flex flex-col gap-16 md:gap-24">
        
        {/* HERO SECTION */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center flex flex-col items-center justify-center min-h-[40vh]"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-xl mb-6">
            {t.hero_title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium drop-shadow-md">
            {t.hero_sub}
          </p>
        </motion.section>

        {/* MI HISTORIA */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden"
        >
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-4 border-b border-white/20 pb-4">{t.historia_title}</h2>
          
          <div className="text-sm md:text-base leading-relaxed text-white/90 space-y-4">
            {lang === 'es' ? <HistoriaPreview /> : <p>{t.historia_preview}</p>}
            <AnimatePresence>
              {storyExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {lang === 'es' ? <HistoriaFull /> : <p className="mt-4">{t.historia_full}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => setStoryExpanded(!storyExpanded)}
            className="mt-6 text-xs font-bold uppercase tracking-widest bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            {storyExpanded ? t.read_less : t.read_more}
          </button>
        </motion.section>

        {/* THE VALUE LADDER FUNNEL */}
        <div className="flex flex-col gap-12">
          
          {/* LEAD MAGNET (FREE) */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-white/40 cursor-pointer"
          >
            <div className="w-full md:w-1/3 aspect-[3/4] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/cover_guia.jpg" alt="Guia para dias dificiles" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center text-black">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">{t.step1_tag}</span>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight mb-4">{t.step1_title}</h3>
              <p className="text-sm md:text-base font-medium text-black/70 mb-6">{t.step1_desc}</p>
              <a 
                href="/guia_dias_dificiles.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-emerald-700 transition-colors self-start shadow-lg text-center"
              >
                {t.step1_cta}
              </a>
            </div>
          </motion.div>

          {/* LOW TICKET 1: 21 DIAS */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-white/40 cursor-pointer"
          >
            <div className="w-full md:w-1/3 aspect-[3/4] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/cover_21dias.jpg" alt="21 Dias para volver a vos" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center text-black">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">{t.step2_tag}</span>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight mb-4">{t.step2_title}</h3>
              <p className="text-sm md:text-base font-medium text-black/70 mb-6">{t.step2_desc}</p>
              <button 
                onClick={() => window.open(`https://wa.me/542241552792?text=Hola,%20quiero%20comprar%20el%20libro%20'21%20Días%20para%20volver%20a%20vos'`, '_blank')}
                className="bg-blue-600 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-blue-700 transition-colors self-start shadow-lg"
              >
                {t.step2_cta}
              </button>
            </div>
          </motion.div>

          {/* LOW TICKET 2: COLOREA */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-white/40 cursor-pointer"
          >
            <div className="w-full md:w-1/3 aspect-[3/4] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/cover_colorea.jpg" alt="Brujula Colorea" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center text-black">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-2">{t.step2b_tag}</span>
              <h3 className="text-2xl font-extrabold uppercase tracking-tight mb-4">{t.step2b_title}</h3>
              <p className="text-sm md:text-base font-medium text-black/70 mb-6">{t.step2b_desc}</p>
              <button 
                onClick={() => window.open(`https://wa.me/542241552792?text=Hola,%20quiero%20comprar%20el%20libro%20'Brújula%20Colorea'`, '_blank')}
                className="bg-pink-600 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-pink-700 transition-colors self-start shadow-lg"
              >
                {t.step2b_cta}
              </button>
            </div>
          </motion.div>

          {/* MEDIUM TICKET (Existing Sessions) */}
          <div className="flex flex-col w-full text-center mt-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-6 drop-shadow-md">{t.step3_tag}</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              
              {/* REIKI CARD */}
              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setSelectedOffer('reiki')}
                className="group relative flex flex-col items-center justify-start h-[300px] md:h-[400px] cursor-pointer"
              >
                <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-all duration-500 group-hover:bg-emerald-500/40 group-hover:border-emerald-400/50 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"></div>
                <div className="relative z-10 w-full h-full flex flex-col items-center p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-[var(--font-montserrat)] font-extrabold tracking-tight uppercase text-white mb-6 drop-shadow-lg text-center transition-transform duration-500 group-hover:scale-105">
                    {t.reiki_btn}
                  </h2>
                  <div className="flex-1 w-full flex items-center justify-center">
                    <Polaroid src="/reiki.jpeg" className="w-[60%] aspect-[3/4] group-hover:rotate-0 transition-all duration-500 shadow-2xl" />
                  </div>
                </div>
              </motion.div>

              {/* AKASHIC CARD */}
              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setSelectedOffer('akashic')}
                className="group relative flex flex-col items-center justify-start h-[300px] md:h-[400px] cursor-pointer"
              >
                <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500 group-hover:bg-blue-500/40 group-hover:border-blue-400/50 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"></div>
                <div className="relative z-10 w-full h-full flex flex-col items-center p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-[var(--font-montserrat)] font-extrabold tracking-tight uppercase text-white mb-6 drop-shadow-lg text-center transition-transform duration-500 group-hover:scale-105">
                    {t.akashic_btn}
                  </h2>
                  <div className="flex-1 w-full flex items-center justify-center">
                    <Polaroid src="/registro_akashico.jpeg" className="w-[60%] aspect-[3/4] group-hover:rotate-0 transition-all duration-500 shadow-2xl" />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* HIGH TICKET 1: REIKI RETREAT */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-fuchsia-500/20 backdrop-blur-xl p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-[0_0_50px_rgba(217,70,239,0.3)] border border-fuchsia-300/40 cursor-pointer mt-8"
          >
            <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden border border-blue-300/20">
              <img src="/cover_retiro.jpg" alt="Retiro Espiritual Reiki" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">{t.step4_tag}</span>
              <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4 text-white drop-shadow-md">{t.step4_title}</h3>
              <p className="text-sm md:text-base font-medium text-gray-300 mb-8 leading-relaxed whitespace-pre-line">{t.step4_desc}</p>
              <button 
                onClick={() => window.open(`https://wa.me/542241552792?text=Hola,%20quisiera%20más%20información%20sobre%20el%20Retiro%20Espiritual%20de%20Reiki`, '_blank')}
                className="bg-white text-fuchsia-900 font-extrabold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-gray-100 transition-colors self-start shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {t.step4_cta}
              </button>
            </div>
          </motion.div>

          {/* HIGH TICKET 2: AKASHIC RETREAT */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-fuchsia-500/20 backdrop-blur-xl p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-[0_0_50px_rgba(217,70,239,0.3)] border border-fuchsia-300/40 cursor-pointer mt-4"
          >
            <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden border border-blue-300/20">
              <img src="/cover_retiro_akashic.jpg" alt="Retiro Espiritual Registros Akashicos" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">{t.step4b_tag}</span>
              <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4 text-white drop-shadow-md">{t.step4b_title}</h3>
              <p className="text-sm md:text-base font-medium text-gray-300 mb-8 leading-relaxed whitespace-pre-line">{t.step4b_desc}</p>
              <button 
                onClick={() => window.open(`https://wa.me/542241552792?text=Hola,%20quisiera%20más%20información%20sobre%20el%20Retiro%20Espiritual%20de%20Registros%20Akáshicos`, '_blank')}
                className="bg-white text-fuchsia-900 font-extrabold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-gray-100 transition-colors self-start shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {t.step4b_cta}
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Modal Overlay for Medium Ticket (Reiki/Akashic images) */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 pointer-events-auto bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedOffer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full max-h-[95vh] flex flex-col items-center justify-center rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedOffer(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-black backdrop-blur-md transition-colors z-20"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              <img 
                src={selectedOffer === 'reiki' ? '/reiki_modal.png' : '/akashic_modal.jpg'} 
                alt={selectedOffer === 'reiki' ? 'Reiki Session' : 'Akashic Records'}
                className="w-full h-auto object-contain cursor-pointer hover:opacity-95 transition-opacity"
                onClick={handleWhatsApp}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}






