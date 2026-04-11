"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import AstralMeshModel from "./AstralMeshModel";

export default function AstralMeshScene() {
    return (
        <div className="w-[10vw] min-w-[80px] h-[15vh] flex items-center justify-center">
            <Canvas camera={{ position: [0, 0, 20], fov: 35 }}>
                <Suspense fallback={null}>
                <AstralMeshModel />
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