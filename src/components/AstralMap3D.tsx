'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Body, Equator, Ecliptic, AstroTime, Observer } from 'astronomy-engine';
import { IAU_13_SIGNS } from '@/lib/astronomy';
import { useLanguage } from '@/components/LanguageProvider';
import { dictionaries } from '@/lib/dictionaries';

const ZODIAC_RADIUS = 20;

export default function AstralMap3D({ date, lat = 0, lng = 0 }: { date: Date, lat?: number, lng?: number }) {
  const { lang } = useLanguage();
  const t = dictionaries[lang];

  // Les planètes à afficher
  const BODIES = [
    { name: t.sun, body: Body.Sun, color: '#FDB813', size: 1.2, radius: 5 },
    { name: t.moon, body: Body.Moon, color: '#F4F6F0', size: 0.5, radius: 2.5 },
    { name: t.mercury, body: Body.Mercury, color: '#888888', size: 0.4, radius: 3.5 },
    { name: t.venus, body: Body.Venus, color: '#E39E8C', size: 0.6, radius: 4.2 },
    { name: t.mars, body: Body.Mars, color: '#AD6242', size: 0.5, radius: 6 },
    { name: t.jupiter, body: Body.Jupiter, color: '#C88B3A', size: 1.0, radius: 8 },
    { name: t.saturn, body: Body.Saturn, color: '#EADD9E', size: 0.9, radius: 10 },
    { name: 'Uranus', body: Body.Uranus, color: '#D1E7E7', size: 0.7, radius: 12 },
    { name: 'Neptune', body: Body.Neptune, color: '#5B5DDF', size: 0.7, radius: 14 },
    { name: 'Pluton', body: Body.Pluto, color: '#DDDDDD', size: 0.3, radius: 16 },
  ];

  // Calcule la géométrie du ciel en fonction de la date
  const constructData = useMemo(() => {
    const time = new AstroTime(date);
    const observer = new Observer(lat, lng, 0);

    const planets = BODIES.map(b => {
      const eq = Equator(b.body, time, observer, true, true);
      const ecl = Ecliptic(eq.vec);
      const lon = ecl.elon;
      
      const rad = lon * Math.PI / 180;
      const x = b.radius * Math.cos(rad);
      const z = -b.radius * Math.sin(rad); // -sin pour que l'ordre des signes soit anti-horaire en vue top-down

      return {
        ...b,
        lon,
        position: new THREE.Vector3(x, 0, z)
      };
    });

    return { planets };
  }, [date, lat, lng, BODIES]);

  return (
    <div className="w-full h-full relative bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,100,255,0.2)] border border-white/10">
      <Canvas camera={{ position: [0, 25, 25], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        {/* Atmosphère cosmique */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" /> 

        {/* LA TIERRA (Centre du Modèle Geocentrique) */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#2b82c9" emissive="#103050" emissiveIntensity={0.5} wireframe />
          <Html position={[0, -1.5, 0]} center className="text-white/50 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
            {t.earth}
          </Html>
        </mesh>

        {/* LIGNES & PLANETES */}
        {constructData.planets.map((planet, i) => (
          <group key={planet.name}>
            <Line 
              points={[[0,0,0], [planet.position.x, 0, planet.position.z]]}
              color={planet.color}
              lineWidth={0.5}
              transparent
              opacity={0.3}
            />
            <Line 
              points={
                Array.from({length: 65}).map((_, idx) => {
                  const angle = (idx / 64) * Math.PI * 2;
                  return [planet.radius * Math.cos(angle), 0, -planet.radius * Math.sin(angle)];
                })
              }
              color="#ffffff"
              lineWidth={0.2}
              transparent
              opacity={0.05}
            />
            <mesh position={planet.position}>
              <sphereGeometry args={[planet.size, 16, 16]} />
              <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={0.8} />
              <Html position={[0, -1.5, 0]} center className="text-white/80 text-[10px] font-bold tracking-widest pointer-events-none drop-shadow-md">
                {planet.name}
              </Html>
            </mesh>
          </group>
        ))}

        {/* ANNEAU ZODIACAL (13 Signes IAU) */}
        <group>
          <Line 
            points={
              Array.from({length: 129}).map((_, idx) => {
                const angle = (idx / 128) * Math.PI * 2;
                return [ZODIAC_RADIUS * Math.cos(angle), 0, -ZODIAC_RADIUS * Math.sin(angle)];
              })
            }
            color="#445566"
            lineWidth={1}
            transparent
            opacity={0.5}
          />
          
          {IAU_13_SIGNS.map((sign, idx) => {
            let midLon = (sign.startLon + sign.endLon) / 2;
            if (sign.name === 'Poissons') {
              midLon = (348.6 + (29.1 + 360)) / 2; // Midpoint for Pisces crossing 0
            }
            
            const startRad = sign.startLon * Math.PI / 180;
            const endRad = sign.endLon * Math.PI / 180;
            const midRad = midLon * Math.PI / 180;

            const x = ZODIAC_RADIUS * Math.cos(midRad);
            const z = -ZODIAC_RADIUS * Math.sin(midRad);
            
            const startX = ZODIAC_RADIUS * Math.cos(startRad);
            const startZ = -ZODIAC_RADIUS * Math.sin(startRad);

            return (
              <group key={sign.name}>
                <Line 
                  points={[[startX * 0.95, 0, startZ * 0.95], [startX * 1.05, 0, startZ * 1.05]]}
                  color="#ffffff"
                  lineWidth={1}
                  transparent
                  opacity={0.3}
                />
                
                <Text 
                  position={[x, 0, z]} 
                  rotation={[-Math.PI/2, 0, midRad - Math.PI/2]}
                  fontSize={0.8} 
                  color="#ffffff"
                  fillOpacity={0.6}
                  anchorX="center" 
                  anchorY="middle"
                >
                  {sign.name.toUpperCase()}
                </Text>
              </group>
            );
          })}
        </group>

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={false}
          maxDistance={40}
          minDistance={2}
          maxPolarAngle={Math.PI / 2 + 0.2}
        />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-none">
        <p className="text-white text-xs font-bold tracking-widest uppercase">{t.astro_3d_title}</p>
        <p className="text-white/50 text-[10px] mt-1 uppercase">{t.astro_3d_sub}</p>
        <p className="text-blue-400 text-[10px] mt-2">{t.astro_3d_hint}</p>
      </div>
    </div>
  );
}
