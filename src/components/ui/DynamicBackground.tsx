"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Suppress THREE.Clock deprecation warning from @react-three/fiber
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn(...args);
  };
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  // Generate 7000 particles in a wide spatial box
  const originalPositions = useMemo(() => {
    const count = 7000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  const particles = useMemo(() => new Float32Array(originalPositions), [originalPositions]);

  // Track global mouse position for the parallax effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to +1 range
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Slow, elegant drift
    ref.current.rotation.x -= delta * 0.015;
    ref.current.rotation.y -= delta * 0.025;

    // Smooth camera parallax based on mouse
    const targetX = mouse.current.x * 2.5;
    const targetY = mouse.current.y * 2.5;
    
    state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);

    // Mouse repulsion logic in local space
    const positionsArray = ref.current.geometry.attributes.position.array as Float32Array;
    let needsUpdate = false;
    
    // Approximate mouse position in the particle's local space
    const mx = mouse.current.x * 20;
    const my = mouse.current.y * 20;

    for (let i = 0; i < 7000; i++) {
      const i3 = i * 3;
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      
      const px = positionsArray[i3];
      const py = positionsArray[i3 + 1];

      const dx = px - mx;
      const dy = py - my;
      const distSq = dx * dx + dy * dy;

      if (distSq < 15) {
        // Repel
        const force = (15 - distSq) / 15;
        positionsArray[i3] = ox + dx * force * 0.8;
        positionsArray[i3 + 1] = oy + dy * force * 0.8;
        needsUpdate = true;
      } else {
        // Spring back to original
        if (Math.abs(ox - px) > 0.01 || Math.abs(oy - py) > 0.01) {
          positionsArray[i3] += (ox - px) * 0.1;
          positionsArray[i3 + 1] += (oy - py) * 0.1;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 8]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-black pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.autoClearColor = false;
        }}
      >
        <fog attach="fog" args={["#000000", 8, 25]} />
        
        {/* Motion blur / trail fade layer */}
        <mesh position={[0, 0, -10]} renderOrder={1}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.25} 
            depthWrite={false} 
            depthTest={false} 
          />
        </mesh>

        <group renderOrder={2}>
          <ParticleField />
        </group>
      </Canvas>
    </div>
  );
}
