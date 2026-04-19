"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { Suspense } from "react";
import { useTheme } from "next-themes";
import { ProceduralGrass } from "./ProceduralGrass";
import FishSignMeshModel from "./FishSignMeshModel";
import { ProceduralFlowers } from "./ProceduralFlowers";
import { Water } from "./Water";
import { useCamera } from "./useCamera";
import IslandModel from "./IslandModel";
import { SkyDome, SKY_PRESETS } from "./SkyDome";

export default function SceneView() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

     function CameraController() {
        useCamera({
            minRadius: 12,      // Pond radius
            maxRadius: 48,     // Mountains radius (adjust to your terrain size)
            speed: 0.4,        // Movement speed
            rotationSpeed: 2.5
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
                
                <ambientLight 
                    intensity={isDark ? 0.3 : 1} 
                    color={isDark ? '#6e3edd' : '#ffb380'} 
                />

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
                    <IslandModel />
                    <ProceduralGrass
                        bladeCount={20000}
                        bladeHeight={1}
                        bladeWidth={0.14}
                        areaWidth={30}
                        areaDepth={30}
                        heightVariation={0.3}
                        widthVariation={0.6}
                        bendAmount={0.6}
                        pondRadius={5}
                        color={isDark ? "#0f9e2e" : "#1b9973"}
                    />

                    <ProceduralFlowers
                        flowerCount={500}
                        flowerHeight={3.2}
                        petalSize={0.3}
                        pondRadius={7}
                        colors={['#f1410c', '#ca0c1c', '#ffdc15']}
                    />

                    <group scale={[1, 0.5, 1]} position={[0, 1,0]}> 
                        <Sparkles
                            count={isDark ? 66 : 33}
                            scale={16.8}
                            size={42.5}
                            speed={1.66}
                            opacity={0.79}
                            color={isDark ? "#0cf1f1" : "#ffdc15"}
                        />
                    </group>
                    {/* pond */}
                    <Water
                        position={[0, 0, 0]}
                        size={15}
                        waveAmplitude={0.05}
                        enableCircleMask={true}
                        deepColor={[0.0, 0.4, 0.8]}     
                        highlightColor={[0.2, 0.5, 0.8]}   
                    />

                    {/* ocean */}
                    <Water
                        position={[0, -8, 0]}
                        size={1000}
                        waveAmplitude={0.3}
                        voronoiScale={0.06}
                        cellSpeed={0.5}
                        enableCircleMask={true}
                        deepColor={[0.0, 0.0, 1]}     
                        highlightColor={[0.1, 0.2, 1]} 
                    />         
                    <FishSignMeshModel />

                    <SkyDome
                        position={[0, -20, 0]}
                        radius={600}
                        height={300}
                        gradientStops={ isDark ? SKY_PRESETS.night : SKY_PRESETS.day}
                        widthSegments={32}
                        heightSegments={32}
                    />
                </Suspense>  
            </Canvas>
        </div>
    );
}