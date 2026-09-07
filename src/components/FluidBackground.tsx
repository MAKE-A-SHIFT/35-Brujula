'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1; // White background
uniform sampler2D uTexture;

varying vec2 vUv;

// Simplex 3D Noise 
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0; 
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vec2 st = vUv;
  
  // Parallax on mouse move
  st -= uMouse * 0.02;

  // We distort the image UVs to simulate flowing liquid
  vec2 texUV = st;
  float t = uTime * 0.1;
  
  // Add downward flow
  texUV.y += uTime * 0.05; 
  
  // Distort
  float n1 = snoise(vec3(st * 2.0, t));
  float n2 = snoise(vec3(st * 4.0, t * 1.5));
  texUV.x += n1 * 0.05 + n2 * 0.02;
  texUV.y += n2 * 0.05;

  // Mirror repeat to avoid hard edges when it flows
  texUV = abs(mod(texUV, 2.0) - 1.0);

  // Sample the exact image uploaded by the user!
  vec4 imageColor = texture2D(uTexture, texUV);
  
  // Paint falling from the top. Progress stops after a few seconds.
  float fallProgress = clamp(uTime * 0.4, 0.0, 1.2);
  
  // Easing so it falls fast then slows down smoothly
  float easeProgress = 1.0 - pow(1.0 - (fallProgress / 1.2), 3.0);
  float drop = easeProgress * 1.2;
  
  // Drip effect: uneven edge using 1D noise on the X axis
  float drip1 = snoise(vec3(st.x * 3.0, 0.0, 0.0)) * 0.2;
  float drip2 = snoise(vec3(st.x * 8.0, 0.0, 0.0)) * 0.1;
  
  // The Y coordinate of the paint edge. Starts above screen (1.2), falls down.
  float edgeY = 1.3 - drop + drip1 + drip2;
  
  // If we are above the edge, it's paint. Below is white background.
  float isPaint = smoothstep(edgeY - 0.02, edgeY + 0.02, st.y);
  
  // Final composite
  vec3 finalColor = mix(uColor1, imageColor.rgb, isPaint);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const FluidPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, pointer } = useThree();
  
  // Load the user's exact image as a texture
  const texture = useTexture('/fluid.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#FFFFFF') },
      uTexture: { value: texture },
    }),
    [texture]
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(pointer.x, pointer.y),
        0.05
      );
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FluidPlane />
      </Canvas>
    </div>
  );
}
