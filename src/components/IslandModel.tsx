import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useTheme } from "next-themes";

useGLTF.preload('/meshes/island.glb');

export default function IslandModel() {
    const outer = useRef<Group>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { nodes, materials } = useGLTF('/meshes/island.glb') as any;


    return (
        <group ref={outer} position={[0, -0.9, 0]}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane.geometry}
                material={materials['Procedural Ocean Sand']}
            />
        </group>
    );
}