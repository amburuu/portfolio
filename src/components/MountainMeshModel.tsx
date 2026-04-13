import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { ProceduralGrass } from "./ProceduralGrass";
import LettersMeshModel from "./LettersMeshModel";
import { useTheme } from "next-themes";

useGLTF.preload('/meshes/mountainsgrass.glb');

export default function MountainMeshModel() {
    const outer = useRef<Group>(null);
    const { nodes } = useGLTF('/meshes/mountainsgrass.glb') as any;
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <group ref={outer}>
            <mesh geometry={nodes.grass.geometry}>
                <meshStandardMaterial color={isDark ? "#1f832c" : "#167244"} />
            </mesh>
            <mesh geometry={nodes.mountains_1.geometry}>
                <meshStandardMaterial color="#73ddeb" />
            </mesh>
            <mesh geometry={nodes.mountains_2.geometry}>
                <meshStandardMaterial color="#49a7dd" />
            </mesh>
            <mesh geometry={nodes.mountains_3.geometry}>
                <meshStandardMaterial color="#2198c7" />
            </mesh>
            <mesh geometry={nodes.mountains_4.geometry}>
                <meshStandardMaterial color="#1b87b1" />
            </mesh>

            <ProceduralGrass
                bladeCount={50000}
                bladeHeight={2}
                bladeWidth={0.14}
                areaWidth={96}
                areaDepth={50}
                heightVariation={0.6}
                widthVariation={0.6}
                bendAmount={0.9}
                color={isDark ? "#0f9e2e" : "#095e1f"}
            />
            
            <LettersMeshModel />
        </group>
    );
}