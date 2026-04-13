"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useTheme } from "next-themes";
import CloudsMeshModel from "./CloudsMeshModel";
import MountainMeshModel from "./MountainMeshModel";
import { OrbitControls } from "@react-three/drei";

export default function CloudsMeshScene() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Canvas camera={{ position: [0, 0, 20], fov: 65 }}>
                <directionalLight 
                    position={isDark ? [-10, 30, 10] : [0, 10, 10]} 
                    intensity={2}
                    color={isDark ? '#4c20c4' : '#ffea8f'}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-far={100}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                />
                
                <ambientLight 
                    intensity={isDark ? 0.2 : 1} 
                    color={isDark ? '#9092ff' : '#aefcff'} 
                />

                {/* light up the logo */}
                {isDark ? (
                    <>
                        <rectAreaLight
                            width={25}
                            height={6}
                            intensity={10}
                            color="#b69816"
                            position={[0, 2, 5]}
                            rotation={[-Math.PI / 2, 0, 0]}
                        />    
                    </>
                ) : (
                    <>
                        <rectAreaLight
                            width={120}
                            height={20}
                            intensity={0}
                            color="#ff0000"
                            position={[0, 2, 0]}
                            rotation={[-Math.PI / 2, 0.4, 0]}
                        />    
                    </>
                )}; 

                <Suspense fallback={null}>
                    <CloudsMeshModel />
                    <MountainMeshModel />
                </Suspense>
                <OrbitControls /> 
            </Canvas>
        </div>
    );
}