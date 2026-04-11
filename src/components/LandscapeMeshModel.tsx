'use client'

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

useGLTF.preload('/meshes/clouds.glb');

export default function LandscapeMeshModel() {
    const groups = useRef<Group[]>([]);
    const { scene } = useGLTF('/meshes/clouds.glb') as any;
    
    const speed = 0.006;
    const cloudWidth = 110;

    useFrame(() => {
        groups.current.forEach((group) => {
            if (group) {
                group.position.x += speed;
                
                // Loop back when off screen
                if (group.position.x > cloudWidth) {
                    group.position.x = -cloudWidth * 2;
                }
            }
        });
    });

    return (
        <group>
            {/* Create 3 cloud instances for seamless looping */}
            {[-cloudWidth, 0, cloudWidth].map((startX, idx) => (
                <group 
                    key={idx}
                    ref={(el) => {
                        if (el) groups.current[idx] = el;
                    }}
                    position={[startX, 0, -10]}
                >
                    <primitive object={scene.clone()} />
                    <meshStandardMaterial color="white" />
                </group>
            ))}
        </group>
    );
}