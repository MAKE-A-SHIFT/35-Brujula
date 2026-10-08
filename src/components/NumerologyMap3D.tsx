'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLanguage } from '@/components/LanguageProvider';
import { dictionaries } from '@/lib/dictionaries';
import { OrbitControls, Stars, Text, Line, Html, Icosahedron, Octahedron, Tetrahedron, Torus, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const numColors: Record<number, string> = {
  1: '#FF3333', 2: '#FF9933', 3: '#FFFF33', 4: '#33FF33', 
  5: '#33FFFF', 6: '#3333FF', 7: '#9933FF', 8: '#FF33FF', 
  9: '#FFD700', 11: '#FFFFFF', 22: '#FFFFFF', 33: '#FFFFFF'
};

function NumberShape({ num, position, label, radius }: { num: number, position: [number, number, number], label: string, radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const color = numColors[num] || '#FFFFFF';
  const isMaster = num === 11 || num === 22 || num === 33;
  const size = isMaster ? 1.5 : 1;

  // Rendu de la forme géométrique sacrée selon le nombre
  const renderShape = () => {
    switch(num % 5) {
      case 0: return <Sphere args={[size, 32, 32]} />;
      case 1: return <Tetrahedron args={[size]} />;
      case 2: return <Octahedron args={[size]} />;
      case 3: return <Icosahedron args={[size]} />;
      case 4: return <Box args={[size, size, size]} />;
      default: return <Sphere args={[size, 32, 32]} />;
    }
  };

  return (
    <group position={position}>
      {/* Orbite Line */}
      {radius > 0 && (
        <Line 
          points={
            Array.from({length: 65}).map((_, idx) => {
              const angle = (idx / 64) * Math.PI * 2;
              return [radius * Math.cos(angle) - position[0], 0, -radius * Math.sin(angle) - position[2]];
            })
          }
          color="#ffffff"
          lineWidth={0.2}
          transparent
          opacity={0.1}
        />
      )}
      
      <mesh ref={meshRef}>
        {renderShape()}
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isMaster ? 1 : 0.5} 
          wireframe={isMaster} 
        />
      </mesh>
      
      <Html position={[0, -size - 0.5, 0]} center className="text-white font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] pointer-events-none">
        <div>{label}</div>
        <div className="text-lg text-yellow-400">{num}</div>
      </Html>
    </group>
  );
}

function MerkabaSystem({ coreNumbers, t }: { coreNumbers: any, t: any }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  if (!coreNumbers) {
    return (
      <group ref={groupRef}>
        <Icosahedron args={[3, 1]}>
          <meshStandardMaterial color="#555555" wireframe transparent opacity={0.3} />
        </Icosahedron>
        <Html center className="text-white/50 text-sm font-mono tracking-widest uppercase">
          {t.num_3d_wait}
        </Html>
      </group>
    );
  }

  // Placer les nombres sur des orbites concentriques
  return (
    <group ref={groupRef}>
      {/* Centre : Life Path */}
      <NumberShape num={coreNumbers.lifePath.final} position={[0, 0, 0]} label="Life Path" radius={0} />

      {/* Orbit 1 : Expression & Heart's Desire */}
      <NumberShape num={coreNumbers.expression.final} position={[6, 0, 0]} label="Expression" radius={6} />
      <NumberShape num={coreNumbers.heartsDesire.final} position={[-6, 0, 0]} label="Heart's Desire" radius={6} />

      {/* Orbit 2 : Personality & Maturity */}
      <NumberShape num={coreNumbers.personality.final} position={[0, 0, 9]} label="Personality" radius={9} />
      <NumberShape num={coreNumbers.maturity.final} position={[0, 0, -9]} label="Maturity" radius={9} />
      
      {/* Orbit 3 : Birthday (Talent) */}
      <NumberShape num={coreNumbers.birthday.final} position={[8.5, 0, 8.5]} label="Talent" radius={12} />

      {/* Connexions géométriques centrales */}
      <Line 
        points={[ [6,0,0], [0,0,9], [-6,0,0], [0,0,-9], [6,0,0] ]}
        color="#ffffff"
        lineWidth={0.5}
        transparent
        opacity={0.15}
      />
    </group>
  );
}

export default function NumerologyMap3D({ coreNumbers }: { coreNumbers: any }) {
  const { lang } = useLanguage();
  const t = dictionaries[lang];
  return (
    <div className="w-full h-full relative bg-black/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,200,0,0.1)] border border-white/10">
      <Canvas camera={{ position: [0, 15, 20], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        {/* Grille cosmique abstraite */}
        <Stars radius={50} depth={20} count={2000} factor={2} saturation={1} fade speed={0.5} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={5} distance={20} color="#FFD700" />

        <MerkabaSystem coreNumbers={coreNumbers} t={t} />

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={!coreNumbers}
          autoRotateSpeed={1}
          maxDistance={30}
          minDistance={5}
        />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-none">
        <p className="text-white text-xs font-bold tracking-widest uppercase">Matriz Geométrica 3D</p>
        <p className="text-white/50 text-[10px] mt-1 uppercase">Geometría Sagrada Pitagórica</p>
        <p className="text-yellow-500 text-[10px] mt-2">Interactúa: Arrastra para rotar</p>
      </div>
    </div>
  );
}

