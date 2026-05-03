'use client';

import { useMemo, useRef } from 'react';
import { CanvasTexture } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

function makeStarSprite() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

function Particles({ count, size, color, opacity, rotateSpeed = 0.02, sprite }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * rotateSpeed;
    ref.current.rotation.x = Math.sin(t * 0.04) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        map={sprite}
        alphaTest={0.001}
      />
    </points>
  );
}

export default function StarFieldCanvas() {
  const sprite = useMemo(() => makeStarSprite(), []);
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Particles
        count={130}
        size={0.2}
        color="#fda4af"
        opacity={0.45}
        rotateSpeed={0.02}
        sprite={sprite}
      />
      <Particles
        count={35}
        size={0.42}
        color="#f0abfc"
        opacity={0.3}
        rotateSpeed={0.015}
        sprite={sprite}
      />
    </Canvas>
  );
}
