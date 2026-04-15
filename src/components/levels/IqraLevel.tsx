"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, Text, TorusKnot
} from '@react-three/drei';
import * as THREE from 'three';
import InkFloor from '../three/InkFloor';

interface IqraLevelProps {
  pulse: number; // 13.13 MHz synchronization
  intensity: number;
}

export default function IqraLevel({ pulse, intensity }: IqraLevelProps) {
  // 1. RUNE DATA (The 5 Steps of the First Recitation)
  const runes = useMemo(() => [
    { word: "IQRA", pos: [-15, 2, -10], color: "#ff50c8" },
    { word: "BISM", pos: [-5, 4, -15], color: "#f59e0b" },
    { word: "RABIK", pos: [5, 3, -12], color: "#ec4899" },
    { word: "AL-LATHI", pos: [15, 5, -18], color: "#0ea5e9" },
    { word: "KHALAQ", pos: [0, 8, -25], color: "#ffffff" },
    { word: "THE APPLE", pos: [10, 2, 5], color: "#ef4444", identity: 'SNAKE' },
  ], []);

  const [hasBitten, setHasBitten] = React.useState(false);

  return (
    <group>
      {/* AL ARDA MIDADAAN (The Ink Fabric) */}
      <InkFloor pulse={pulse} intensity={intensity} />

      {/* RITUAL RUNE CIRCLE */}
      {runes.map((rune, i) => (
        <group key={rune.word} position={rune.pos as [number, number, number]}>
          <Float speed={2 + i} rotationIntensity={0.5} floatIntensity={0.5}>
            {/* THE CELTIC TORUS (Mortal Instruments Style) */}
            <TorusKnot args={[1.5, 0.4, 128, 16, 2, 3]}>
              <meshPhysicalMaterial 
                color={rune.color} 
                emissive={rune.color} 
                emissiveIntensity={0.5 + pulse * 2} 
                wireframe 
                transparent
                opacity={0.8}
              />
            </TorusKnot>

            {/* THE SCRIPTURE */}
            <Text
              position={[0, -2.5, 0]}
              fontSize={0.5}
              color="white"
              font="https://fonts.gstatic.com/s/syncopate/v12/v4mQeKy9S19Ujkp1I1v7nE_q.woff"
              maxWidth={5}
              textAlign="center"
            >
              {rune.word}
              <meshBasicMaterial color={rune.color} toneMapped={false} />
            </Text>

            {/* THE AETHER GLOW */}
            <mesh scale={1.2}>
               <sphereGeometry args={[2, 32, 32]} />
               <meshBasicMaterial color={rune.color} transparent opacity={0.05 * pulse} side={THREE.BackSide} />
            </mesh>
          </Float>
        </group>
      ))}

      {/* THE PHILOSOPHER'S RAIN (Gaia Sync) */}
      <Points limit={1000} range={1000}>
        <pointsMaterial size={0.05} color="#0ea5e9" transparent opacity={0.3 * pulse} />
        {useMemo(() => {
          const positions = new Float32Array(3000);
          for (let i = 0; i < 3000; i++) positions[i] = (Math.random() - 0.5) * 50;
          return positions;
        }, [])}
      </Points>

      {/* GOD LIGHT (The Apex) / SNAKE TINT */}
      <pointLight 
        position={[0, 15, -30]} 
        intensity={10 * pulse} 
        color={hasBitten ? "#ef4444" : "white"} 
      />
      
      <ambientLight intensity={hasBitten ? 0.5 : 0.1} color={hasBitten ? "#3e0000" : "#4040ff"} />

      {/* THE SNAKE / APPLE INTERACTION */}
      <Float position={[10, 2, 5]} speed={5} rotationIntensity={2}>
        <mesh onClick={() => setHasBitten(true)}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
        <Text position={[0, -1.5, 0]} fontSize={0.2} color="white" font="https://fonts.gstatic.com/s/syncopate/v12/v4mQeKy9S19Ujkp1I1v7nE_q.woff">
          GAIA_HARMONY :: PHILOSOPHER'S TONE
        </Text>
        {/* The Coiling Snake (Abstract) */}
        <TorusKnot args={[0.8, 0.05, 128, 16, 10, 3]} rotation={[Math.PI/2, 0, 0]}>
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
        </TorusKnot>
      </Float>

      <fog attach="fog" args={[hasBitten ? '#1a0000' : '#020205', 10, 60]} />
    </group>
  );
}
