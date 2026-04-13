import { useGLTF, Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useTheme } from "next-themes";
import { FakeGlowMaterial } from './FakeGlowMaterial';

useGLTF.preload('/meshes/sun.glb');
useGLTF.preload('/meshes/moon.glb');

export default function AstralMeshModel() {
    const outer = useRef<Group>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const meshFile = isDark ? '/meshes/moon.glb' : '/meshes/sun.glb';
    const { nodes } = useGLTF(meshFile) as any;
    const nodeName = isDark ? 'moon' : 'sun';

    const glassControls = {
        backside: true,
        transmission: 1.0,
        roughness: 0.36,
        thickness: 4.04,
        ior: 1.6
    };

    const moonGlowControls = {
        falloff: 1.4,
        glowSharpness: 0.0,
        glowColor: '#528eff',
        glowInternalRadius: 3.7,
        opacity: 1.0,
        depthTest: false
    };

    const sunGlowControls = {
        falloff: 1.4,
        glowSharpness: 0.0,
        glowColor: '#ff6900',
        glowInternalRadius: 3.7,
        opacity: 1.0,
        depthTest: false
    };

    const glowControls = isDark ? moonGlowControls : sunGlowControls;

    return (
        <group ref={outer}>
            <Sphere args={[8, 32, 32]} position={[0, 0, 0]}>
                <FakeGlowMaterial {...glowControls} />
            </Sphere>

            <mesh {...nodes[nodeName]}>
                <MeshTransmissionMaterial {...glassControls} />
            </mesh>
        </group>
    );
}