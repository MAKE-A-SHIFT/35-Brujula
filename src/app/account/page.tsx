'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { useLanguage } from '@/components/LanguageProvider';
import { dictionaries } from '@/lib/dictionaries';
import Topbar from '@/components/Topbar';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export default function AccountPage() {
  const { lang } = useLanguage();
  const t = dictionaries[lang];
  const [astralArchives, setAstralArchives] = useState<any[]>([]);
  const [numArchives, setNumArchives] = useState<any[]>([]);
  const [isLogged, setIsLogged] = useState(true); // Simulation : On assume qu'ils sont connectés s'ils accèdent à cette page via localStorage

  useEffect(() => {
    // Charger les archives
    const aArchives = JSON.parse(localStorage.getItem('astral_archives') || '[]');
    const nArchives = JSON.parse(localStorage.getItem('numerology_archives') || '[]');
    setAstralArchives(aArchives);
    setNumArchives(nArchives);
  }, []);

  const handleLogout = () => {
    // En réalité, on supprimerait le token
    setIsLogged(false);
    window.location.href = "/";
  };

  const clearArchives = (type: 'astro' | 'num') => {
    if(confirm("¿Estás seguro de que deseas borrar este historial?")) {
      if (type === 'astro') {
        localStorage.removeItem('astral_archives');
        setAstralArchives([]);
      } else {
        localStorage.removeItem('numerology_archives');
        setNumArchives([]);
      }
    }
  };

  if (!isLogged) return null;

  return (
    <div 
      className={`min-h-screen text-white font-sans ${montserrat.variable} bg-cover bg-center bg-fixed`}
      style={{ backgroundImage: "url('/cuenta_background.png')" }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-[2px]">
        
        {/* Navbar */}
        <Topbar />

        <main className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-12">
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-2">{t.acc_title}</h1>
            <p className="text-white/60">{t.acc_sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ARCHIVES ASTRALES */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold uppercase tracking-widest text-blue-300">{t.acc_astro_archives}</h2>
                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">{astralArchives.length} {t.acc_saved}</span>
              </div>
              
              <div className="flex flex-col gap-4 overflow-y-auto flex-1 max-h-[400px] pr-2">
                {astralArchives.length === 0 ? (
                  <p className="text-white/40 text-sm text-center my-10 uppercase tracking-widest">{t.acc_empty}</p>
                ) : (
                  astralArchives.map((archive) => (
                    <div key={archive.id} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{archive.name}</span>
                        <span className="text-[10px] text-white/40 font-mono">{new Date(archive.id).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-white/60 mb-3">{archive.date} - {archive.location}</div>
                      
                      {/* Résumé de l'archive */}
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest text-white/40">{t.acc_sun}</span>
                          <span className="text-sm font-semibold">{archive.footprint.solarVector.constellation}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest text-white/40">{t.acc_asc}</span>
                          <span className="text-sm font-semibold">{archive.footprint.geomagneticFilter.constellation}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {astralArchives.length > 0 && (
                <button onClick={() => clearArchives('astro')} className="mt-6 text-xs text-red-400 hover:text-red-300 uppercase tracking-widest w-full text-center">
                  {t.acc_del_astro}
                </button>
              )}
            </div>

            {/* ARCHIVES NUMEROLOGIQUES */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold uppercase tracking-widest text-yellow-500">Matrices Numéricas</h2>
                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">{numArchives.length} {t.acc_saved}</span>
              </div>
              
              <div className="flex flex-col gap-4 overflow-y-auto flex-1 max-h-[400px] pr-2">
                {numArchives.length === 0 ? (
                  <p className="text-white/40 text-sm text-center my-10 uppercase tracking-widest">{t.acc_empty}</p>
                ) : (
                  numArchives.map((archive) => (
                    <div key={archive.id} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{archive.name}</span>
                        <span className="text-[10px] text-white/40 font-mono">{new Date(archive.id).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-white/60 mb-3">{archive.date}</div>
                      
                      {/* Résumé de l'archive */}
                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest text-white/40">Life Path</span>
                          <span className="text-lg font-bold text-yellow-400">{archive.results.core.lifePath.display}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest text-white/40">Talent</span>
                          <span className="text-lg font-bold">{archive.results.core.birthday.display}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest text-white/40">{t.acc_destiny}</span>
                          <span className="text-lg font-bold">{archive.results.core.expression.display}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {numArchives.length > 0 && (
                <button onClick={() => clearArchives('num')} className="mt-6 text-xs text-red-400 hover:text-red-300 uppercase tracking-widest w-full text-center">
                  Borrar historial Numérico
                </button>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}



