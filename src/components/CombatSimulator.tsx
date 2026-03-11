import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky, Stars, PerspectiveCamera, Environment, Box, Sphere, Cylinder, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Target, Crosshair, Zap, Shield, Sword, Flame, Radio } from 'lucide-react';

type WeaponType = 'Repulsor' | 'Laser' | 'Pulse';

interface WeaponConfig {
  name: WeaponType;
  color: string;
  speed: number;
  damage: number;
  cooldown: number;
  icon: React.ReactNode;
}

const WEAPONS: Record<WeaponType, WeaponConfig> = {
  Repulsor: { name: 'Repulsor', color: '#10b981', speed: 60, damage: 10, cooldown: 200, icon: <Zap className="w-4 h-4" /> },
  Laser: { name: 'Laser', color: '#ef4444', speed: 120, damage: 5, cooldown: 50, icon: <Flame className="w-4 h-4" /> },
  Pulse: { name: 'Pulse', color: '#3b82f6', speed: 40, damage: 25, cooldown: 500, icon: <Radio className="w-4 h-4" /> },
};

// Stickman Model Component
function Stickman({ color = "#10b981" }: { color?: string }) {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arms */}
      <group position={[0, 1.4, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      {/* Legs */}
      <group position={[0, 0.7, 0]}>
        <mesh rotation={[0, 0, 0.3]} position={[0.15, -0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh rotation={[0, 0, -0.3]} position={[-0.15, -0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

// Player Component
function Player({ activeWeapon, playerRef, onBulletHit }: { activeWeapon: WeaponType; playerRef: React.RefObject<THREE.Group>; onBulletHit: (pos: THREE.Vector3, damage: number) => void }) {
  const { camera } = useThree();
  const [bullets, setBullets] = useState<{ id: number; pos: THREE.Vector3; dir: THREE.Vector3; config: WeaponConfig }[]>([]);
  const bulletId = useRef(0);
  const lastShot = useRef(0);

  // Movement state
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w') moveState.current.forward = true;
      if (e.key === 's') moveState.current.backward = true;
      if (e.key === 'a') moveState.current.left = true;
      if (e.key === 'd') moveState.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w') moveState.current.forward = false;
      if (e.key === 's') moveState.current.backward = false;
      if (e.key === 'a') moveState.current.left = false;
      if (e.key === 'd') moveState.current.right = false;
    };
    const handleMouseDown = () => {
      const now = Date.now();
      const config = WEAPONS[activeWeapon];
      if (now - lastShot.current < config.cooldown) return;
      
      lastShot.current = now;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      const position = camera.position.clone().add(direction.clone().multiplyScalar(1));
      
      setBullets(prev => [...prev, { 
        id: bulletId.current++, 
        pos: position, 
        dir: direction,
        config
      }]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [camera, activeWeapon]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const speed = 8 * delta;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(moveState.current.backward) - Number(moveState.current.forward));
    const sideVector = new THREE.Vector3(Number(moveState.current.left) - Number(moveState.current.right), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation);

    playerRef.current.position.add(new THREE.Vector3(direction.x, 0, direction.z));
    
    // Camera follow
    const relativeCameraOffset = new THREE.Vector3(0, 2.5, 6);
    const cameraOffset = relativeCameraOffset.applyMatrix4(playerRef.current.matrixWorld);
    camera.position.lerp(cameraOffset, 0.1);
    camera.lookAt(playerRef.current.position.clone().add(new THREE.Vector3(0, 1.5, 0)));
  });

  return (
    <group ref={playerRef}>
      <Stickman />
      <pointLight position={[0, 1.2, 0.3]} intensity={0.5} color="#10b981" />
      
      {bullets.map(b => (
        <Bullet 
          key={b.id} 
          initialPos={b.pos} 
          direction={b.dir} 
          config={b.config}
          onHit={(pos) => onBulletHit(pos, b.config.damage)}
          onFinish={() => setBullets(prev => prev.filter(p => p.id !== b.id))} 
        />
      ))}
    </group>
  );
}

function Bullet({ initialPos, direction, config, onFinish, onHit }: { initialPos: THREE.Vector3; direction: THREE.Vector3; config: WeaponConfig; onFinish: () => void; onHit: (pos: THREE.Vector3) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.add(direction.clone().multiplyScalar(config.speed * delta));
    
    // Call onHit every frame with current position
    onHit(ref.current.position.clone());
    
    if (Date.now() - startTime.current > 2000) {
      onFinish();
    }
  });

  return (
    <mesh ref={ref} position={initialPos}>
      <sphereGeometry args={[config.name === 'Pulse' ? 0.3 : 0.1, 8, 8]} />
      <meshBasicMaterial color={config.color} />
    </mesh>
  );
}

function Enemy({ position, playerRef, onDeath }: { position: [number, number, number], playerRef: React.RefObject<THREE.Group>, onDeath: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const [health, setHealth] = useState(100);
  const [active, setActive] = useState(true);

  // Expose a way to take damage
  useEffect(() => {
    const checkHit = (e: any) => {
      if (!ref.current || !active) return;
      const bulletPos = e.detail.pos as THREE.Vector3;
      const damage = e.detail.damage as number;
      
      if (ref.current.position.distanceTo(bulletPos) < 1.5) {
        setHealth(prev => {
          const next = prev - damage;
          if (next <= 0) {
            setActive(false);
            onDeath();
          }
          return next;
        });
      }
    };
    window.addEventListener('bullet-hit', checkHit);
    return () => window.removeEventListener('bullet-hit', checkHit);
  }, [active, onDeath]);

  useFrame((state, delta) => {
    if (!ref.current || !active || !playerRef.current) return;

    // Simple AI: Move towards player
    const direction = new THREE.Vector3();
    direction.subVectors(playerRef.current.position, ref.current.position).normalize();
    ref.current.position.add(direction.multiplyScalar(2 * delta));
    ref.current.lookAt(playerRef.current.position);
  });

  if (!active) return null;

  return (
    <group ref={ref} position={position}>
      <Stickman color="#ef4444" />
      {/* Health Bar */}
      <group position={[0, 2.2, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[-(0.8 * (1 - health / 100)) / 2, 0, 0.01]}>
          <planeGeometry args={[0.8 * (health / 100), 0.1]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
}

function Arena() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      <gridHelper args={[200, 100, "#10b981", "#1e293b"]} rotation={[0, 0, 0]} position={[0, 0.01, 0]} />

      {/* Outer Walls */}
      <Box args={[200, 10, 1]} position={[0, 5, 100]} receiveShadow castShadow>
        <meshStandardMaterial color="#0a0a0a" />
      </Box>
      <Box args={[200, 10, 1]} position={[0, 5, -100]} receiveShadow castShadow>
        <meshStandardMaterial color="#0a0a0a" />
      </Box>
      <Box args={[1, 10, 200]} position={[100, 5, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#0a0a0a" />
      </Box>
      <Box args={[1, 10, 200]} position={[-100, 5, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#0a0a0a" />
      </Box>

      {/* Cool Arena Obstacles */}
      <group>
        {[...Array(10)].map((_, i) => (
          <Box key={i} args={[4, 8, 4]} position={[Math.sin(i) * 30, 4, Math.cos(i) * 30]} castShadow receiveShadow>
            <meshStandardMaterial color="#111" emissive="#10b981" emissiveIntensity={0.1} />
          </Box>
        ))}
        <Cylinder args={[10, 10, 2, 32]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#111" emissive="#10b981" emissiveIntensity={0.2} />
        </Cylinder>
        <pointLight position={[0, 10, 0]} intensity={2} color="#10b981" />
      </group>
    </group>
  );
}

export default function CombatSimulator() {
  const [activeWeapon, setActiveWeapon] = useState<WeaponType>('Repulsor');
  const [score, setScore] = useState(0);
  const playerRef = useRef<THREE.Group>(null);

  const handleBulletHit = (pos: THREE.Vector3, damage: number) => {
    window.dispatchEvent(new CustomEvent('bullet-hit', { detail: { pos, damage } }));
  };

  return (
    <div className="w-full h-full relative bg-black">
      {/* HUD Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tactical HUD v2.0</span>
              </div>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[100%]" />
              </div>
            </div>

            {/* Weapon Selector */}
            <div className="flex gap-2 pointer-events-auto">
              {(Object.keys(WEAPONS) as WeaponType[]).map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWeapon(w)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 min-w-[70px] ${
                    activeWeapon === w 
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                      : "bg-black/40 border-white/10 text-white/40 hover:border-white/20"
                  }`}
                >
                  {WEAPONS[w].icon}
                  <span className="text-[8px] font-bold uppercase tracking-tighter">{w}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-right">
            <p className="text-emerald-500/40 text-[10px] uppercase">Score</p>
            <p className="text-emerald-400 text-3xl font-mono">{score.toString().padStart(6, '0')}</p>
            <p className="text-emerald-500/20 text-[8px] uppercase mt-1">Weapon: {activeWeapon}</p>
          </div>
        </div>

        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-10 h-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-emerald-400" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-emerald-400" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-emerald-400" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-emerald-400" />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
              activeWeapon === 'Laser' ? 'bg-red-500' : activeWeapon === 'Pulse' ? 'bg-blue-500' : 'bg-emerald-400'
            }`} />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="p-4 border border-emerald-500/20 bg-black/60 rounded-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] text-emerald-400 uppercase">System Status</span>
            </div>
            <div className="space-y-1 text-[8px] text-emerald-500/60 font-mono">
              <p>{`> CORE TEMPERATURE: OPTIMAL`}</p>
              <p>{`> NEURAL LINK: STABLE`}</p>
              <p className="text-emerald-400 animate-pulse">{`> COMBAT MODE: ACTIVE`}</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <p className="text-emerald-500/40 text-[10px] uppercase tracking-widest">Movement: WASD</p>
            <p className="text-emerald-500/40 text-[10px] uppercase tracking-widest">Fire: MOUSE1</p>
            <p className="text-emerald-500/40 text-[10px] uppercase tracking-widest">Switch: HUD PANEL</p>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <PointerLockControls />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        
        <Sky sunPosition={[100, 10, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Player activeWeapon={activeWeapon} playerRef={playerRef} onBulletHit={handleBulletHit} />
        
        <Arena />

        {/* Enemies */}
        <Enemy position={[20, 0, -20]} playerRef={playerRef} onDeath={() => setScore(s => s + 100)} />
        <Enemy position={[-20, 0, -30]} playerRef={playerRef} onDeath={() => setScore(s => s + 100)} />
        <Enemy position={[0, 0, -50]} playerRef={playerRef} onDeath={() => setScore(s => s + 100)} />
        <Enemy position={[40, 0, -10]} playerRef={playerRef} onDeath={() => setScore(s => s + 100)} />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
