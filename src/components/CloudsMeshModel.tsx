'use client'

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

useGLTF.preload('/meshes/clouds_circle.glb');

export default function CloudsMeshModel() {
    const { nodes } = useGLTF('/meshes/clouds_circle.glb') as any;
    const outer = useRef<Group>(null);
     const rotationSpeed = 0.0001;
 
    useFrame(() => {
        if (outer.current) {
            outer.current.rotation.y += rotationSpeed;
        }
    });

    return (
        <group ref={outer}>
            <mesh geometry={nodes.clouds.geometry} position={[0, 0, 0]}>
                <meshStandardMaterial color={'white'} />
            </mesh>
        </group>
    );
}