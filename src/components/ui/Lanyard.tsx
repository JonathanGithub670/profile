"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import type { RapierRigidBody } from "@react-three/rapier";

// Extend meshline components
extend({ MeshLineGeometry, MeshLineMaterial });

// Types
import { Mesh, Vector3, CatmullRomCurve3 } from "three";

// Styles
import "./Lanyard.css";

/* ── Electric Border Shader ── */
const electricVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const electricFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uChaos;
  uniform vec2 uSize;
  uniform vec2 uCardSize;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  float sdRoundedRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    float t = uTime * uSpeed;
    // Standardize to half-extents based on the larger plane size
    vec2 p = (vUv * 2.0 - 1.0) * uSize * 0.5;
    vec2 b = uCardSize * 0.5; // Use original card size for the border collision
    float r = 0.08; 

    // Jagged noise logic for the electric arcs
    float n1 = fbm(vUv * 15.0 + t);
    float n2 = fbm(vUv * 30.0 - t * 0.5);
    float n = mix(n1, n2, 0.5);

    // Get distance to the card's edge
    float d = sdRoundedRect(p, b, r);
    
    // Distort distance field for the jagged lightning feel
    float distortion = n * uChaos;

    // Lightning arc formula: sharp intensity core
    float arc = 0.005 / abs(d + distortion);
    float bolt = pow(arc, 1.2) * 3.0;
    
    // Aura glow around the lightning
    float glow = exp(-abs(d + distortion * 0.4) * 25.0) * 0.5;
    
    // Mask to strictly clear the center of the card
    float mask = smoothstep(0.12, 0.04, abs(d));

    // Flickering intensity
    float flicker = 0.8 + 0.2 * sin(t * 15.0) * noise(vec2(t));
    float intensity = (bolt + glow) * flicker * mask;

    // Vibrant cyan-blue coloring
    vec3 col = uColor * 2.0;

    gl_FragColor = vec4(col * intensity, intensity);
  }
`;

function ElectricEdge({ width = 0.96, height = 1.12, color = "#00d2ff", speed = 1.0, chaos = 0.08, position = [0, 0.62, 0.01] }: {
  width?: number; height?: number; color?: string; speed?: number; chaos?: number; position?: [number, number, number];
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Increase plane size by 1.25x to allow lightning arcs to extend outside the card
  const planeWidth = width * 1.25;
  const planeHeight = height * 1.25;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uSpeed: { value: speed },
    uChaos: { value: chaos },
    uSize: { value: new THREE.Vector2(planeWidth, planeHeight) },
    uCardSize: { value: new THREE.Vector2(width, height) },
  }), []);

  // Update uniforms reactively
  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uColor.value.set(color);
      matRef.current.uniforms.uSpeed.value = speed;
      matRef.current.uniforms.uChaos.value = chaos;
      matRef.current.uniforms.uSize.value.set(planeWidth, planeHeight);
      matRef.current.uniforms.uCardSize.value.set(width, height);
    }
  }, [color, speed, chaos, width, height, planeWidth, planeHeight]);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={electricVertexShader}
        fragmentShader={electricFragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// --------------------------------------------------------
// Lanyard Component (Main Export)
// --------------------------------------------------------

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  cardImage,
  electricColor = "#00d2ff",
  electricSpeed = 1.0,
  electricChaos = 0.08,
}: {
  position?: [number, number, number] | number[];
  gravity?: [number, number, number] | number[];
  fov?: number;
  transparent?: boolean;
  cardImage?: string;
  electricColor?: string;
  electricSpeed?: number;
  electricChaos?: number;
}) {
  return (
    <div className="lanyard-wrapper min-h-[500px]">
      <Canvas
        camera={{ position: position as any, fov: fov }}
        dpr={[1, 2]}
        gl={{ 
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        }}
        onCreated={({ gl }) => {
            const canvas = gl.domElement;
            const handleContextLost = (e: Event) => {
                e.preventDefault();
                console.warn('WebGL Context Lost');
            };
            canvas.addEventListener('webglcontextlost', handleContextLost, false);
        }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity as any} timeStep={1 / 60}>
          <Band cardImage={cardImage} electricColor={electricColor} electricSpeed={electricSpeed} electricChaos={electricChaos} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

// --------------------------------------------------------
// Band Component (Physics & Mesh)
// --------------------------------------------------------

type ExtendedRigidBody = RapierRigidBody & { lerped?: Vector3 };

function Band({ 
    maxSpeed = 50, 
    minSpeed = 0, 
    cardImage, 
    electricColor = "#00d2ff", 
    electricSpeed = 1.0, 
    electricChaos = 0.08 
}: { 
    maxSpeed?: number; 
    minSpeed?: number;
    cardImage?: string;
    electricColor?: string;
    electricSpeed?: number;
    electricChaos?: number;
}) {
  const band = useRef<Mesh>(null);
  const fixed = useRef<ExtendedRigidBody>(null);
  const j1 = useRef<ExtendedRigidBody>(null);
  const j2 = useRef<ExtendedRigidBody>(null);
  const j3 = useRef<ExtendedRigidBody>(null);
  const card = useRef<ExtendedRigidBody>(null);

  const vec = new Vector3();
  const ang = new Vector3();
  const rot = new Vector3();
  const dir = new Vector3();

  const { nodes, materials } = useGLTF("/model/card.glb") as any;
  const texture = useTexture("/lanyard/lanyard.png");
  const cardTexture = useTexture(cardImage || "/lanyard/lanyard.png");

  const [curve] = useState(() => new CatmullRomCurve3([new Vector3(), new Vector3(), new Vector3(), new Vector3()]));
  const [dragged, drag] = useState<Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed as any, j1 as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as any, j2 as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as any, j3 as any, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as any, card as any, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => { document.body.style.cursor = "auto"; };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current) return;
        if (!ref.current.lerped) ref.current.lerped = new Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      if (j3.current && j2.current?.lerped && j1.current?.lerped && fixed.current) {
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixed.current.translation());
        (band.current?.geometry as any)?.setPoints((curve as any).getPoints(32));
      }

      if (card.current) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
      }
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} colliders={false} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} colliders={false} angularDamping={2} linearDamping={2}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} colliders={false} angularDamping={2} linearDamping={2}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} colliders={false} angularDamping={2} linearDamping={2}><BallCollider args={[0.1]} /></RigidBody>
        
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          colliders={false} 
          type={dragged ? "kinematicPosition" : "dynamic"}
          angularDamping={2} 
          linearDamping={2}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.75}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              if (card.current) {
                drag(new Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardImage ? cardTexture : materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={cardImage ? 0.5 : 0.9}
                metalness={cardImage ? 0.1 : 0.8}
              />
            </mesh>
            
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
