'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { calcCoreNumbers, calcMinorNumbers, calcCycles } from '@/lib/numerology';
import NumerologyMap3D from '@/components/NumerologyMap3D';
import Topbar from '@/components/Topbar';
import { useLanguage } from '@/components/LanguageProvider';
import { dictionaries } from '@/lib/dictionaries';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export default function NumerologyPage() {
  const { lang } = useLanguage();
  const t = dictionaries[lang];
  const [birthName, setBirthName] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [date, setDate] = useState('');
  
  const [results, setResults] = useState<any>(null);

  // Mécanique de Rétention (Authentification & Sauvegarde)
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCalculate = () => {
    if (!birthName || !date) {
      alert("Le Nom de naissance et la Date de naissance sont requis.");
      return;
    }

    const [yyyy, mm, dd] = date.split('-');
    const day = parseInt(dd, 10);
    const month = parseInt(mm, 10);
    const year = parseInt(yyyy, 10);

    const core = calcCoreNumbers(birthName, day, month, year);
    const minor = currentName ? calcMinorNumbers(currentName) : null;
    const cycles = calcCycles(day, month, year, core.lifePath.final);

    setResults({ core, minor, cycles });
  };

  const handleSaveToArchive = () => {
    // Affiche le popup pour retenir le user
    setShowAuthPopup(true);
  };

  const submitAuth = () => {
    if (!email || !password) return alert("{t.num_auth_req}");
    
    // Sauvegarde réelle dans le localStorage
    const archives = JSON.parse(localStorage.getItem('numerology_archives') || '[]');
    const newProfile = {
      id: Date.now(),
      name: birthName,
      date,
      results
    };
    archives.push(newProfile);
    localStorage.setItem('numerology_archives', JSON.stringify(archives));

    setShowAuthPopup(false);
    alert("{t.num_save_success}");
  };

  return (
    <div 
      className={`min-h-screen text-white font-sans ${montserrat.variable} bg-cover bg-center bg-fixed`}
      style={{ backgroundImage: "url('/num_background2.jpg')" }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-[2px]">
        
        {/* Navbar Minimaliste */}
        <Topbar />

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-12 flex flex-col items-center">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">Calculadora Pitagórica</h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">Algoritmo analítico estricto (Método Hans Decoz). Incluye Detección de Deudas Kármicas y Números Maestros.</p>
        </div>

        {/* INPUT FORM (UI Analytique) */}
        <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl mb-12 backdrop-blur-sm">
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/80">{t.num_name_label}</label>
              <input 
                type="text" 
                value={birthName}
                onChange={(e) => setBirthName(e.target.value)}
                placeholder="{t.num_name_ph}"
                className="bg-black/50 border border-white/20 p-3 rounded-lg text-white font-mono focus:border-white outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/80">{t.num_curr_label}</label>
              <input 
                type="text" 
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                placeholder="{t.num_curr_ph}"
                className="bg-black/50 border border-white/20 p-3 rounded-lg text-white font-mono focus:border-white outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/80">{t.num_date_label}</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-black/50 border border-white/20 p-3 rounded-lg text-white font-mono focus:border-white outline-none transition-colors"
              />
            </div>

            <button 
              onClick={handleCalculate}
              className="mt-4 w-full bg-white text-black font-extrabold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Extraer Matriz Numérica
            </button>
          </div>
        </div>

        {/* LA MATRICE 3D NUMÉROLOGIQUE */}
        <div className="w-full max-w-5xl h-[400px] mb-12">
          <NumerologyMap3D coreNumbers={results ? results.core : null} />
        </div>

        {/* RESULTS DASHBOARD */}
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl flex flex-col gap-8"
          >
            {/* CORE NUMBERS */}
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-6">Números Centrales (Core)</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <DataCard title="Life Path" value={results.core.lifePath.display} desc={t.num_life_path_desc} highlight />
                <DataCard title="Talent (Birthday)" value={results.core.birthday.display} desc={t.num_talent_desc} />
                <DataCard title="Expression" value={results.core.expression.display} desc={t.num_expr_desc} />
                <DataCard title="Heart's Desire" value={results.core.heartsDesire.display} desc={t.num_heart_desc} />
                <DataCard title="Personality" value={results.core.personality.display} desc={t.num_pers_desc} />
                <DataCard title="Maturity" value={results.core.maturity.display} desc={t.num_mat_desc} />
              </div>
            </div>

            {/* MINOR NUMBERS */}
            {results.minor && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-6">Números Menores (Nombre Actual)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataCard title="Minor Expression" value={results.minor.minorExpression.display} desc={t.num_minor_expr_desc} />
                  <DataCard title="Minor Heart's Desire" value={results.minor.minorHeartsDesire.display} desc={t.num_minor_heart_desc} />
                  <DataCard title="Minor Personality" value={results.minor.minorPersonality.display} desc={t.num_minor_pers_desc} />
                </div>
              </div>
            )}

            {/* CYCLES */}
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-6">Ciclos Temporales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* PINNACLES */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-bold uppercase tracking-widest text-emerald-400 mb-4">{t.num_apogee}s (Pinnacles)</h3>
                  <div className="flex flex-col gap-3">
                    <CycleRow label="{t.num_apogee} 1" timing={results.cycles.timing.phase1} value={results.cycles.pinnacles[0].display} />
                    <CycleRow label="{t.num_apogee} 2" timing={results.cycles.timing.phase2} value={results.cycles.pinnacles[1].display} />
                    <CycleRow label="{t.num_apogee} 3" timing={results.cycles.timing.phase3} value={results.cycles.pinnacles[2].display} />
                    <CycleRow label="{t.num_apogee} 4" timing={results.cycles.timing.phase4} value={results.cycles.pinnacles[3].display} />
                  </div>
                </div>

                {/* CHALLENGES */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-bold uppercase tracking-widest text-red-400 mb-4">Desafíos (Challenges)</h3>
                  <div className="flex flex-col gap-3">
                    <CycleRow label="Desafío 1" timing={results.cycles.timing.phase1} value={results.cycles.challenges[0].display} />
                    <CycleRow label="Desafío 2" timing={results.cycles.timing.phase2} value={results.cycles.challenges[1].display} />
                    <CycleRow label="Desafío Principal" timing={`(${results.cycles.timing.phase3})`} value={results.cycles.challenges[2].display} />
                    <CycleRow label="Desafío 4" timing={results.cycles.timing.phase4} value={results.cycles.challenges[3].display} />
                  </div>
                </div>

              </div>
            </div>

            {/* CTA RETENTION */}
            <div className="flex justify-center mt-8 pb-20">
              <button 
                onClick={handleSaveToArchive}
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-extrabold uppercase tracking-widest px-8 py-4 rounded-full transition-colors shadow-[0_0_20px_rgba(202,138,4,0.4)]"
              >
                Guardar Matriz en mi Cuenta
              </button>
            </div>
          </motion.div>
        )}

      </main>

      {/* POPUP D'AUTHENTIFICATION */}
      <AnimatePresence>
        {showAuthPopup && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-[#111] border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-2">Crear Cuenta</h3>
              <p className="text-white/60 text-sm mb-6">Regístrate gratis para guardar y acceder a las matrices numerológicas de todos tus seres queridos.</p>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="email" placeholder="Correo electrónico" value={email} onChange={e=>setEmail(e.target.value)}
                  className="bg-black border border-white/20 p-3 rounded-lg text-white outline-none focus:border-yellow-500"
                />
                <input 
                  type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)}
                  className="bg-black border border-white/20 p-3 rounded-lg text-white outline-none focus:border-yellow-500"
                />
                <div className="flex gap-4 mt-2">
                  <button onClick={() => setShowAuthPopup(false)} className="flex-1 border border-white/20 py-3 rounded-lg font-bold hover:bg-white/5 transition-colors">Cancelar</button>
                  <button onClick={submitAuth} className="flex-1 bg-yellow-600 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors">Registrarse</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

function DataCard({ title, value, desc, highlight = false }: { title: string, value: string, desc: string, highlight?: boolean }) {
  return (
    <div className={`flex flex-col p-4 rounded-xl border ${highlight ? 'bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-black/50 border-white/10'}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">{title}</span>
      <span className={`text-4xl font-extrabold mb-2 ${highlight ? 'text-white' : 'text-white/90'}`}>{value}</span>
      <span className="text-[10px] text-white/40 leading-tight">{desc}</span>
    </div>
  );
}

function CycleRow({ label, timing, value }: { label: string, timing: string, value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white/90">{label}</span>
        <span className="text-xs text-white/40 font-mono">{timing}</span>
      </div>
      <span className="text-2xl font-extrabold text-white">{value}</span>
    </div>
  );
}







