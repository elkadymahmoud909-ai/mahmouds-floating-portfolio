import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** WebGL needs concrete colors; these mirror the --electric / --violet / --silver tokens. */
const PALETTE = {
  electric: new THREE.Color("#4f8dff"),
  violet: new THREE.Color("#8f5bff"),
  silver: new THREE.Color("#dde2f0"),
  deep: new THREE.Color("#0c0c1c"),
  fog: "#06060d",
};

/** World units the camera descends while the page scrolls top → bottom. */
const TRAVEL = 46;

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Scroll moves the camera through the world; the mouse adds parallax. */
function CameraRig({ mobile }: { mobile: boolean }) {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const k = 1 - Math.pow(0.0015, delta);
    const tx = pointer.x * (mobile ? 0.35 : 1.3);
    const ty = -scrollProgress() * TRAVEL + pointer.y * (mobile ? 0.25 : 0.8);
    camera.position.x += (tx - camera.position.x) * k * 0.7;
    camera.position.y += (ty - camera.position.y) * k;
    camera.lookAt(0, camera.position.y - pointer.y * 0.4, -6);
  });
  return null;
}

/** A light that follows the cursor and shifts from blue to violet as you scroll. */
function DynamicLights() {
  const cursor = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const color = useMemo(() => new THREE.Color(), []);
  useFrame((state) => {
    const p = scrollProgress();
    const camY = state.camera.position.y;
    if (cursor.current) {
      cursor.current.position.set(state.pointer.x * 7, camY + state.pointer.y * 4, 3);
      color.copy(PALETTE.electric).lerp(PALETTE.violet, (Math.sin(p * Math.PI * 3) + 1) / 2);
      cursor.current.color.copy(color);
    }
    if (rim.current) rim.current.position.set(-6, camY + 3, -2);
  });
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 6]} intensity={0.8} color={PALETTE.silver} />
      <pointLight ref={cursor} intensity={40} distance={18} decay={2} />
      <pointLight ref={rim} intensity={30} distance={20} decay={2} color={PALETTE.violet} />
    </>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = 10 - Math.random() * (TRAVEL + 20);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4;
      const r = Math.random();
      c.copy(r < 0.45 ? PALETTE.electric : r < 0.8 ? PALETTE.violet : PALETTE.silver);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += delta * 0.012;
    p.rotation.x += (state.pointer.y * 0.04 - p.rotation.x) * 0.03;
    p.rotation.z += (-state.pointer.x * 0.04 - p.rotation.z) * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Floating, slowly rotating object that spins up and grows when hovered. */
function Floating({
  position,
  scale = 1,
  speed = 1,
  drift = 0.35,
  children,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  drift?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const t = useRef(Math.random() * 10);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    t.current += delta;
    const boost = hovered ? 5 : 1;
    g.rotation.x += delta * 0.18 * speed * boost;
    g.rotation.y += delta * 0.24 * speed * boost;
    g.position.y = position[1] + Math.sin(t.current * 0.7) * drift;
    const s = scale * (hovered ? 1.18 : 1);
    g.scale.lerp(target.set(s, s, s), 0.08);
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
}

function Chrome({ color = PALETTE.silver }: { color?: THREE.Color }) {
  return <meshStandardMaterial color={color} metalness={1} roughness={0.18} />;
}

function Neon({ color }: { color: THREE.Color }) {
  return <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />;
}

function HeroCore({ quality, mobile }: { quality: "high" | "low"; mobile: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.25;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.18;
  });
  return (
    <Floating position={mobile ? [1.4, 3.4, -5] : [4.1, -0.1, -1.2]} scale={mobile ? 0.62 : 1} speed={0.6} drift={0.25}>
      <mesh>
        <icosahedronGeometry args={[1.55, 0]} />
        {quality === "high" ? (
          <meshPhysicalMaterial
            color={PALETTE.silver}
            metalness={0.1}
            roughness={0.05}
            transmission={1}
            thickness={1.4}
            ior={1.45}
            iridescence={0.8}
            iridescenceIOR={1.3}
            clearcoat={1}
            flatShading
          />
        ) : (
          <meshStandardMaterial color={PALETTE.deep} metalness={0.95} roughness={0.15} flatShading />
        )}
      </mesh>
      <mesh scale={1.45}>
        <icosahedronGeometry args={[1.55, 1]} />
        <Neon color={PALETTE.electric} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.85, 0.012, 12, 180]} />
        <meshBasicMaterial color={PALETTE.violet} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.7, -0.4, 0]}>
        <torusGeometry args={[3.3, 0.008, 12, 180]} />
        <meshBasicMaterial color={PALETTE.electric} transparent opacity={0.6} />
      </mesh>
    </Floating>
  );
}

function WorldObjects({ quality }: { quality: "high" | "low" }) {
  const full = quality === "high";
  return (
    <>
      <Floating position={[-6.6, -3.2, -5]} scale={0.9}>
        <mesh>
          <torusKnotGeometry args={[0.7, 0.22, full ? 180 : 90, 24]} />
          <Chrome />
        </mesh>
      </Floating>
      <Floating position={[6.6, -9.5, -4.5]} scale={0.95} speed={1.3}>
        <mesh>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={PALETTE.violet} metalness={0.7} roughness={0.2} flatShading />
        </mesh>
        <mesh scale={1.5}>
          <octahedronGeometry args={[1, 0]} />
          <Neon color={PALETTE.violet} />
        </mesh>
      </Floating>
      <Floating position={[-6.4, -16, -4]}>
        <mesh>
          <dodecahedronGeometry args={[0.9, 0]} />
          <Chrome color={PALETTE.electric} />
        </mesh>
      </Floating>
      {full && (
        <Floating position={[6.8, -22, -5]} speed={0.8}>
          <mesh>
            <torusGeometry args={[1.1, 0.32, 24, 80]} />
            <Chrome />
          </mesh>
        </Floating>
      )}
      <Floating position={[-6.8, -28.5, -5]} scale={1.2} speed={0.7}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <Neon color={PALETTE.electric} />
        </mesh>
      </Floating>
      {full && (
        <Floating position={[6.4, -34.5, -4]}>
          <mesh>
            <sphereGeometry args={[0.8, 48, 48]} />
            <meshPhysicalMaterial color={PALETTE.silver} metalness={0.6} roughness={0.08} clearcoat={1} iridescence={1} iridescenceIOR={1.4} />
          </mesh>
        </Floating>
      )}
      <Floating position={[-6.4, -40.5, -4.5]} speed={1.2}>
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <Chrome color={PALETTE.violet} />
        </mesh>
      </Floating>
      <Floating position={[6.6, -46.5, -5]} scale={1.1}>
        <mesh>
          <torusKnotGeometry args={[0.8, 0.12, full ? 200 : 100, 16, 3, 5]} />
          <meshStandardMaterial color={PALETTE.electric} metalness={0.9} roughness={0.15} />
        </mesh>
      </Floating>
    </>
  );
}

export default function Scene3D({
  quality,
  mobile,
  still,
}: {
  quality: "high" | "low";
  mobile: boolean;
  still: boolean;
}) {
  return (
    <Canvas
      eventSource={document.body}
      eventPrefix="client"
      frameloop={still ? "demand" : "always"}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 8], fov: mobile ? 62 : 50, near: 0.1, far: 80 }}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={[PALETTE.fog, 7, 24]} />
      <Environment />
      <DynamicLights />
      {!still && <CameraRig mobile={mobile} />}
      <Particles count={quality === "high" ? 2400 : 700} />
      <HeroCore quality={quality} mobile={mobile} />
      <WorldObjects quality={quality} />
    </Canvas>
  );
}
