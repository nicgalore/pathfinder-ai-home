import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface StatusOrbProps {
  className?: string;
  size?: number;
  isListening?: boolean;
  audioLevel?: number; // 0-1 normalized audio level
}

interface AnimatedSphereProps {
  isListening: boolean;
  audioLevel: number;
  prefersReducedMotion: boolean;
}

function AnimatedSphere({ isListening, audioLevel, prefersReducedMotion }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create gradient-like color based on audio level
  const color = useMemo(() => {
    const hue = 200;
    const saturation = 0.98;
    const lightness = 0.5 + audioLevel * 0.15;
    return new THREE.Color().setHSL(hue / 360, saturation, lightness);
  }, [audioLevel]);

  useFrame(() => {
    if (!meshRef.current || prefersReducedMotion) return;

    // Spin based on audio level: 0.5° to 8° per frame
    const rotationSpeed = isListening 
      ? THREE.MathUtils.degToRad(0.5 + audioLevel * 7.5)
      : THREE.MathUtils.degToRad(0.2);
    
    meshRef.current.rotation.y += rotationSpeed;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export function StatusOrb({ 
  className = "", 
  size = 60, 
  isListening = false, 
  audioLevel = 0 
}: StatusOrbProps) {
  // Detect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ 
          width: size, 
          height: size,
          background: 'transparent'
        }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, -3, 2]} intensity={0.5} color="#88ccff" />
        <pointLight 
          position={[0, 0, 3]} 
          intensity={isListening ? 0.5 + audioLevel : 0.3} 
          color="#00aaff" 
        />

        {/* 3D Sphere */}
        <AnimatedSphere
          isListening={isListening}
          audioLevel={audioLevel}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
}
