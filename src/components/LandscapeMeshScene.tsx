"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useTheme } from "next-themes";
import LandscapeMeshModel from "./LandscapeMeshModel";

export default function LandscapeMeshScene() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Canvas 
                camera={{ position: [0, 0, 20], fov: 55 }}
                shadows
            >
                {/* Directional light changes based on theme */}
                <directionalLight 
                    position={[10, 20, 10]} 
                    intensity={isDark ? 1 : 2}
                    color={isDark ? '#2038c4' : '#ffffff'}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-far={100}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                />
                
                {/* Ambient light changes based on theme */}
                <ambientLight 
                    intensity={isDark ? 0.2 : 3} 
                    color={isDark ? '#9092ff' : 'cyan'} 
                />
                
                <Suspense fallback={null}>
                    <LandscapeMeshModel />
                </Suspense>
            </Canvas>
        </div>
    );
}