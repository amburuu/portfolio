"use client";

import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { Suspense } from "react";
import { useTheme } from "next-themes";
import IslandModel from "./IslandModel";
import FishSignMeshModel from "./FishSignMeshModel";
import { useCamera } from "./useCamera";
import { SkyDome, SKY_PRESETS } from "./SkyDome";
import SeabedFloor from "./water/SeabedFloor";
import WaterFloor from "./water/WaterFloor";
import WaterDepthIntersection from "./water/WaterDepthIntersection";

export default function SceneView() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    function CameraController() {
        useCamera({
            minRadius: 12,
            maxRadius: 48,
            speed: 0.4,
            rotationSpeed: 2.5
        });
        return null;
    }

    return (
        <>
            <Leva collapsed={false} />
            <div className="w-full h-screen flex items-center justify-center">
                <Canvas
                    gl={{
                        powerPreference: 'high-performance',
                        antialias: true,
                        precision: 'highp',
                        logarithmicDepthBuffer: false,
                    }}
                >
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
                    <ambientLight
                        intensity={isDark ? 0.3 : 1}
                        color={isDark ? '#dd703e' : '#ffb380'}
                    />

                    <Suspense fallback={null}>
                        <IslandModel />
                        <FishSignMeshModel />

                        <group scale={[1, 0.5, 1]} position={[0, 1, 0]}>
                            <Sparkles
                                count={isDark ? 33 : 16}
                                scale={16.8}
                                size={42.5}
                                speed={1.66}
                                opacity={0.79}
                                color={isDark ? "#0cf1f1" : "#ffdc15"}
                            />
                        </group>

                        <WaterFloor />
                        <SeabedFloor />
                        <WaterDepthIntersection />

                        <SkyDome
                            position={[0, -20, 0]}
                            radius={600}
                            height={300}
                            gradientStops={isDark ? SKY_PRESETS.night : SKY_PRESETS.day}
                            widthSegments={32}
                            heightSegments={32}
                        />

                        <OrbitControls />
                    </Suspense>
                </Canvas>
            </div>
        </>
    );
}
