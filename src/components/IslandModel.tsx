import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { useWaterObject } from "./water/hooks/useWaterObject";

useGLTF.preload('/meshes/island.glb');

export default function IslandModel() {
    const outer = useRef<THREE.Group>(null);
    const { nodes } = useGLTF('/meshes/island.glb') as any;

    useWaterObject("island", outer, [nodes.sand.geometry, nodes.water_patch.geometry]);

    return (
        <group ref={outer} position={[0, -0.3, 0]}>
            <mesh castShadow receiveShadow geometry={nodes.foliage.geometry}>
                <meshStandardMaterial color={'green'}/>
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.patch.geometry}>
                <meshStandardMaterial color={'green'}/>
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.water_patch.geometry}>
                <meshStandardMaterial color={'green'}/>
            </mesh>
            <mesh castShadow receiveShadow geometry={nodes.sand.geometry}>
                <meshStandardMaterial color={'beige'}/>
            </mesh>
        </group>
    );
}
