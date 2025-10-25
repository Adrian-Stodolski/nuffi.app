import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Epic3DChartProps {
  data: number[];
  title: string;
  color: string;
}

const AnimatedBars: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const meshRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        // Smooth animation
        const targetHeight = data[i] / 100 * 3;
        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetHeight, 0.1);
        
        // Floating animation
        mesh.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.1 + targetHeight / 2;
        
        // Color pulsing
        const material = mesh.material as THREE.MeshStandardMaterial;
        const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
        material.emissive.setHex(parseInt(color.replace('#', ''), 16));
        material.emissiveIntensity = intensity * 0.3;
      }
    });
  });

  return (
    <>
      {data.map((value, index) => (
        <mesh
          key={index}
          ref={(el) => el && (meshRefs.current[index] = el)}
          position={[index * 1.5 - (data.length * 1.5) / 2, 0, 0]}
        >
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </>
  );
};

const Epic3DChart: React.FC<Epic3DChartProps> = ({ data, title, color }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <motion.div
      className="h-64 w-full rounded-xl overflow-hidden bg-gradient-to-br from-bg-quaternary/20 to-bg-quaternary/5 border border-white/10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      </div>
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          ref={lightRef}
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00BFFF" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#8B5CF6" />
        
        <AnimatedBars data={data} color={color} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </motion.div>
  );
};

export default Epic3DChart;