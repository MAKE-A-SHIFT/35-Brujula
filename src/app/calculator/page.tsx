'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { calculateGeoFootprint } from '@/lib/astronomy';
import AstralMap3D from '@/components/AstralMap3D';
import Topbar from '@/components/Topbar';
import { useLanguage } from '@/components/LanguageProvider';
import { dictionaries } from '@/lib/dictionaries';
import AstroLogicText from '@/components/AstroLogicText';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export default function CalculatorPage() {
  const { lang } = useLanguage();
  const t = dictionaries[lang];
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState<number | ''>('');
  const [lng, setLng] = useState<number | ''>('');
  const [elevation, setElevation] = useState<number>(0);
  
  const [results, setResults] = useState<any>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Mécanique de Rétention (Authentification & Sauvegarde)
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileName, setProfileName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);

  useEffect(() => {
    // Charger les archives locales (Contingence DB)
    const archives = localStorage.getItem('astral_archives');
    if (archives) {
      setSavedProfiles(JSON.parse(archives));
    }
  }, []);

  const handleGeocode = async () => {
    if (!city) return;
    setIsGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLat(parseFloat(data[0].lat));
        setLng(parseFloat(data[0].lon));
      } else {
        alert("Coordonnées introuvables. Saisie manuelle requise.");
      }
    } catch (e) {
      console.error(e);
    }
    setIsGeocoding(false);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || lat === '' || lng === '') return;
    
    const dateObj = new Date(`${date}T${time}:00Z`);
    const footprint = calculateGeoFootprint(dateObj, Number(lat), Number(lng), elevation);
    setResults(footprint);
    setIsSaved(false);
  };

  const handleSaveToArchive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !profileName) return;

    const newProfile = {
      id: Date.now(),
      name: profileName,
      date,
      time,
      location: city || `${lat}, ${lng}`,
      footprint: results
    };

    const updatedProfiles = [...savedProfiles, newProfile];
    setSavedProfiles(updatedProfiles);
    localStorage.setItem('astral_archives', JSON.stringify(updatedProfiles));
    
    setShowAuthPopup(false);
    setIsSaved(true);
  };

  return (
    <div 
      className={`min-h-screen text-white font-sans ${montserrat.variable} bg-cover bg-center bg-fixed`}
      style={{ backgroundImage: "url('/num_background.webp')" }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-[2px] p-6 md:p-10">
      <Topbar />

      <main className="max-w-6xl mx-auto flex flex-col gap-8 pt-4">`n        <AstroLogicText />`n        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT FORM */}
        <div className="lg:col-span-4 bg-black border border-white/10 rounded-2xl p-6 shadow-2xl h-fit">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6 text-white border-b border-white/10 pb-2">Paramètres Temporels & Spatiaux</h2>
          
          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">{t.astro_date}</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#111] border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white transition-colors" />
            </div>
            
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">{t.astro_time}</label>
              <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[#111] border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white transition-colors" />
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-xs uppercase text-gray-400 mb-1">{t.astro_city}</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Ex: Paris, FR" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-[#111] border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white transition-colors" />
                <button type="button" onClick={handleGeocode} disabled={isGeocoding} className="bg-white text-black px-3 rounded-md text-xs font-bold hover:bg-gray-200 transition-colors">
                  {isGeocoding ? '...' : 'GEO'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Latitude</label>
                <input type="number" step="any" required value={lat} onChange={(e) => setLat(Number(e.target.value))} className="w-full bg-[#111] border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Longitude</label>
                <input type="number" step="any" required value={lng} onChange={(e) => setLng(Number(e.target.value))} className="w-full bg-[#111] border border-white/20 rounded-md p-2 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 bg-white text-black py-3 rounded-md font-bold uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
              Extraire l'Empreinte
            </button>
          </form>
        </div>

        {/* DASHBOARD RESULTS & 3D MAP */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* THE 3D ASTRAL MATRIX */}
          <div className="w-full h-[500px]">
            <AstralMap3D 
              date={date ? new Date(`${date}T${time || '12:00:00'}Z`) : new Date()} 
              lat={Number(lat) || 0} 
              lng={Number(lng) || 0} 
            />
          </div>

          {!results ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-2xl p-6 h-32">
              <p className="text-gray-500 uppercase tracking-widest text-sm text-center">
                Cliquez sur Extraire pour voir l'analyse détaillée.
              </p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Vecteur Solaire */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-all"></div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Vecteur Solaire</h3>
                  <p className="text-3xl font-extrabold uppercase text-white mb-4">{results.solarVector.constellation}</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Longitude Écliptique</span>
                      <span className="font-mono text-orange-400">{results.solarVector.longitude.toFixed(4)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Angle d'Incidence</span>
                      <span className="font-mono text-orange-400">{results.solarVector.incidenceAngle.toFixed(4)}°</span>
                    </div>
                  </div>
                </div>

                {/* Gradient Lunaire */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Gradient Gravitationnel Lunaire</h3>
                  <p className="text-3xl font-extrabold uppercase text-white mb-4">{results.lunarGradient.constellation}</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Phase (Illumination)</span>
                      <span className="font-mono text-blue-400">{results.lunarGradient.illumination.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Angle Géocentrique</span>
                      <span className="font-mono text-blue-400">{results.lunarGradient.phaseAngle.toFixed(2)}°</span>
                    </div>
                  </div>
                </div>

                {/* Filtre Géomagnétique */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Filtre Géomagnétique (Horizon)</h3>
                  <p className="text-3xl font-extrabold uppercase text-white mb-4">{results.geomagneticFilter.constellation}</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Intersection Écliptique Est</span>
                      <span className="font-mono text-emerald-400">{results.geomagneticFilter.longitude.toFixed(4)}°</span>
                    </div>
                  </div>
                </div>

                {/* Résonance Planétaire */}
                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Résonance des Masses</h3>
                  <p className="text-3xl font-extrabold uppercase text-white mb-4">Jupiter / Saturne</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Déviation Barycentre JUP</span>
                      <span className="font-mono text-purple-400">{results.planetaryResonance.jupiterDev.toFixed(2)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Déviation Barycentre SAT</span>
                      <span className="font-mono text-purple-400">{results.planetaryResonance.saturnDev.toFixed(2)}°</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE TO ARCHIVE CTA */}
              <div className="mt-4 bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                {isSaved ? (
                  <div className="text-emerald-400 font-bold uppercase tracking-widest">
                    ✓ Empreinte archivée avec succès
                  </div>
                ) : (
                  <>
                    <h4 className="text-lg font-bold mb-2 uppercase">Créer une Archive Permanente</h4>
                    <p className="text-gray-400 text-sm mb-6 max-w-md">
                      Sauvegardez cette matrice gravitationnelle dans votre espace personnel pour l'analyser plus tard ou la comparer avec celle de vos amis.
                    </p>
                    <button 
                      onClick={() => setShowAuthPopup(true)}
                      className="bg-transparent border border-white text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                      {t.astro_save_btn}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
        </div>
      </main>

      {/* AUTH POPUP / PAYWALL */}
      <AnimatePresence>
        {showAuthPopup && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              className="bg-[#111] border border-white/20 p-8 rounded-2xl max-w-md w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setShowAuthPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold uppercase mb-2">Création de Compte</h2>
              <p className="text-gray-400 text-sm mb-6">Accédez à votre chambre d'archivage personnelle pour stocker vos matrices.</p>
              
              <form onSubmit={handleSaveToArchive} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Nom du profil (ex: "Moi", "Ami 1")</label>
                  <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-black border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Adresse Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Mot de passe</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/20 rounded-md p-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                
                <button type="submit" className="w-full mt-4 bg-white text-black py-3 rounded-md font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Créer et Sauvegarder
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}






