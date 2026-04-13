import { useGLTF, Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import FakeGlowMaterial from "./FakeGlowMaterial";
import { useTheme } from "next-themes";

useGLTF.preload('/meshes/chaos.glb');

export default function LettersMeshModel() {
    const outer = useRef<Group>(null);
    const { nodes } = useGLTF('/meshes/chaos.glb') as any;
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const glassControls = {
        backside: true,
        transmission: 1.0,
        roughness: 0.32,
        thickness: 2.04,
        ior: 4.5
    };

    const glowControls = {
        falloff: 1.4,
        glowSharpness: 0.0,
        glowColor: '#f0680d',
        glowInternalRadius: 6,
        opacity: 0.5,
        depthTest: false
    };

    return (
        <group ref={outer} position={[0, -5, 0]}>
            <mesh geometry={nodes.chaos_1.geometry}>
                <MeshTransmissionMaterial {...glassControls} />
                {isDark && (<Sphere args={[8, 32, 32]} position={[-10.5, 0, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>)}
            </mesh>
            <mesh geometry={nodes.chaos_5.geometry}>
                <MeshTransmissionMaterial {...glassControls} />
                {isDark && (<Sphere args={[8, 32, 32]} position={[-5.5, 0, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>)}
            </mesh>
            <mesh geometry={nodes.chaos_4.geometry}>
                <MeshTransmissionMaterial {...glassControls} />
                {isDark && (<Sphere args={[8, 32, 32]} position={[0, 0, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>)}
            </mesh>
            <mesh geometry={nodes.chaos_3.geometry}>
                <MeshTransmissionMaterial {...glassControls} />
                {isDark && (<Sphere args={[8, 32, 32]} position={[6, 0, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>)}
            </mesh>
            <mesh geometry={nodes.chaos_2.geometry}>
                <MeshTransmissionMaterial {...glassControls} />
                {isDark && (<Sphere args={[8, 32, 32]} position={[12, 0, 0]}>
                    <FakeGlowMaterial {...glowControls} />
                </Sphere>)}
            </mesh>
        </group>
    );
}