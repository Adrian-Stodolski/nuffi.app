import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface AnimatedParticlesProps {
  count?: number;
  color?: string;
  size?: number;
}

const ParticleField: React.FC<{ count: number; color: string; size: number }> = ({ 
  count, 
  color, 
  size 
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.01;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        color={color}
        size={size}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
    </Points>
  );
};

const AnimatedParticles: React.FC<AnimatedParticlesProps> = ({ 
  count = 1000, 
  color = "#00BFFF", 
  size = 0.05 
}) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ParticleField count={count} color={color} size={size} />
      </Canvas>
    </motion.div>
  );
};

export default AnimatedParticles;