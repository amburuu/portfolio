"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import ChaosModel from "./ChaosModel";


export default function ChaosScene() {
    return (
        <div className="w-full aspect-square max-h-[60vh]">
            <Canvas camera={{ position: [0, 0, 15], fov: 20 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <ChaosModel />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
}