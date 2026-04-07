"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import ChaosModel from "./ChaosModel";

export default function ChaosScene() {
    return (
        <div className="w-full h-[50vh]">
            <Leva collapsed />
            <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={null}>
                <Environment preset="park" />
                <ChaosModel />
                </Suspense>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
}

// apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse