import { useGLTF, Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import FakeGlowMaterial from "./FakeGlowMaterial";
import { useTheme } from "next-themes";

useGLTF.preload('/meshes/fish_sign.glb');

export default function FishSignMeshModel() {
    const outer = useRef<Group>(null);
    const { nodes } = useGLTF('/meshes/fish_sign.glb') as any;
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const glassControls = {
        backside: true,
        transmission: 1.0,
        roughness: 0.2,
        thickness: 3.04,
        ior: 4.5,
        chromaticAberration: 3.5
    };

    const glowControlsDay = {
        falloff: 1.4,
        glowSharpness: 0.0,
        glowColor: '#992f2f',
        glowInternalRadius: 6,
        opacity: 0.5,
        depthTest: false
    };

    const glowControlsNight = {
        falloff: 1.4,
        glowSharpness: 0.0,
        glowColor: '#f77e2e',
        glowInternalRadius: 6,
        opacity: 0.5,
        depthTest: false
    };

    const glowControls = isDark ? glowControlsNight : glowControlsDay;

    return (
        <group ref={outer} position={[0, 8, 0]} scale={0.5}>
            <mesh geometry={nodes.body.geometry} position={[0, 4, 0]}>
                <MeshTransmissionMaterial {...glassControls} />
                <Sphere args={[10, 32, 32]} position={[0, 2, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>
                <Sphere args={[10, 32, 32]} position={[-6, 2, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>
                <Sphere args={[10, 32, 32]} position={[6, 2, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>
            </mesh>
            <mesh geometry={nodes.fins.geometry} position={[0, 4, 0]}>
                <meshStandardMaterial color={'black'} />
            </mesh>
            <mesh geometry={nodes.pupil_1.geometry} position={[0, 4, 0]}>
                <meshStandardMaterial color={'black'} />
            </mesh>
            <mesh geometry={nodes.pupil_2.geometry} position={[0, 4, 0]}>
                <meshStandardMaterial color={'black'} />
            </mesh>
            <mesh geometry={nodes.eye_1.geometry} position={[0, 4, 0]}>
                <meshStandardMaterial color={'white'} />
            </mesh>
            <mesh geometry={nodes.eye_2.geometry} position={[0, 4, 0]}>
                <meshStandardMaterial color={'white'} />
            </mesh>
            <mesh geometry={nodes.text_1.geometry} position={[0, 4, 0]}>
                <meshStandardMaterial color={'black'} />
            </mesh>
            <mesh geometry={nodes.text_2.geometry} position={[0, 4, 0]}>
                <meshStandardMaterial color={'black'} />
            </mesh>
        </group>
    );
}