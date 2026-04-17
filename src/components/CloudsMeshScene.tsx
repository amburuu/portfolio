"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useTheme } from "next-themes";
import CloudsMeshModel from "./CloudsMeshModel";
import MountainMeshModel from "./MountainMeshModel";
import { OrbitControls } from "@react-three/drei";
import { useCamera } from "./useCamera";

export default function CloudsMeshScene() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

     function CameraController() {
        useCamera({
            minRadius: 5,      // Pond radius
            maxRadius: 48,     // Mountains radius (adjust to your terrain size)
            speed: 0.3,        // Movement speed
            mouseSensitivity: 0.005,
        });
        return null;
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Canvas camera={{ position: [0, 7, 20], fov: 65 }}>
                <CameraController />
                <directionalLight 
                    position={isDark ? [-10, 30, 10] : [0, 10, -10]} 
                    intensity={isDark ? 2 : 3}
                    color={isDark ? '#5547cf' : '#d88f4b'}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-far={100}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                />
                <directionalLight 
                    position={isDark ? [-10, 30, 10] : [0, 10, 10]} 
                    intensity={isDark ? 2 : 3}
                    color={isDark ? '#5547cf' : '#d88f4b'}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-far={100}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                     target-position={[0, -5, 0]}
                />
                
                {/* <ambientLight 
                    intensity={isDark ? 0.3 : 1} 
                    color={isDark ? '#6e3edd' : '#ffb380'} 
                /> */}

                {/* light up the logo */}
                {isDark && (
                    <>
                        <rectAreaLight
                            width={25}
                            height={6}
                            intensity={10}
                            color="#b69816"
                            position={[0, 7, 5]}
                            rotation={[-Math.PI / 2, 0, 0]}
                        />    
                    </>
                )}; 

                <Suspense fallback={null}>
                    <CloudsMeshModel />
                    <MountainMeshModel />
                </Suspense>  
            </Canvas>
        </div>
    );
}