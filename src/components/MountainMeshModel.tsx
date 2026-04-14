import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { ProceduralGrass } from "./ProceduralGrass";
import LettersMeshModel from "./LettersMeshModel";
import { ProceduralFlowers } from "./ProceduralFlowers";
import { useTheme } from "next-themes";
import { Sparkles } from "@react-three/drei";

useGLTF.preload('/meshes/mountains.glb');

export default function MountainMeshModel() {
    const outer = useRef<Group>(null);
    const { nodes } = useGLTF('/meshes/mountains.glb') as any;
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <group ref={outer}>
            <mesh geometry={nodes.grass.geometry}>
                <meshStandardMaterial color={isDark ? "#1f832c" : "#49a02f"} />
            </mesh>
            <mesh geometry={nodes.mountains_2.geometry}>
                <meshStandardMaterial color={isDark ? "#d321b5" : "#438eff"} />
            </mesh>
            <mesh geometry={nodes.mountains_3.geometry}>
                <meshStandardMaterial color={isDark ? "#a8138f" : "#3071eb"} />
            </mesh>
            <mesh geometry={nodes.mountains_4.geometry}>
                <meshStandardMaterial color={isDark ? "#bb3ea6" : "#2460e0"}  />
            </mesh>
            <mesh geometry={nodes.mountains_1.geometry}>
                <meshStandardMaterial color={isDark ? "#fa5ce0" : "#4586ff"} />
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
                color={isDark ? "#0f9e2e" : "#0b6449"}
            />

            <ProceduralFlowers
                flowerCount={200}
                flowerHeight={3.2}
                petalSize={0.3}
                areaWidth={96}
                areaDepth={50}
                colors={['#f1410c', '#ca0c1c', '#ffdc15']}
            />

            <group scale={[2, 0.6, 0.6]} position={[0,-5,0]}> 
                <Sparkles
                    count={66}
                    scale={16.8}
                    size={42.5}
                    speed={1.50}
                    opacity={0.79}
                    color={'#d2ff42'}
                />
            </group>
            
            <LettersMeshModel />
        </group>
    );
}