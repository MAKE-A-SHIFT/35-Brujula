import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { dictionaries } from '@/lib/dictionaries';

export default function AstroLogicText() {
  const { lang } = useLanguage();
  const t = dictionaries[lang];
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden mb-12"
    >
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-4 border-b border-white/20 pb-4">
        {t.astro_logic_title}
      </h2>
      
      <div className="text-sm md:text-base leading-relaxed text-white/90 space-y-4">
        <p dangerouslySetInnerHTML={{ __html: t.astro_logic_p1 }}></p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4 pt-4"
            >
              <p dangerouslySetInnerHTML={{ __html: t.astro_logic_p2 }}></p>
              <p dangerouslySetInnerHTML={{ __html: t.astro_logic_p3 }}></p>
              <p dangerouslySetInnerHTML={{ __html: t.astro_logic_p4 }}></p>
              <p dangerouslySetInnerHTML={{ __html: t.astro_logic_p5 }}></p>
              <p dangerouslySetInnerHTML={{ __html: t.astro_logic_p6 }}></p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="mt-6 text-xs font-bold uppercase tracking-widest bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        {expanded ? t.astro_read_less : t.astro_read_more}
      </button>
    </motion.section>
  );
}
