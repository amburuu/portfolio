"use client";

import { useMemo } from 'react';
import { BufferGeometry, BufferAttribute } from 'three';

interface GrassConfig {
    bladeCount: number;
    bladeHeight: number;
    bladeWidth: number;
    areaWidth: number;
    areaDepth: number;
    heightVariation: number;
    widthVariation: number;
    bendAmount: number;
    color: string;
}

export function ProceduralGrass({
    bladeCount = 5000,
    bladeHeight = 2,
    bladeWidth = 0.1,
    areaWidth = 20,
    areaDepth = 20,
    heightVariation = 0.3,
    widthVariation = 0.2,
    bendAmount = 0.3,
    color = '#752350',
}: Partial<GrassConfig> = {}) {
    
    const geometry = useMemo(() => {
        const geometry = new BufferGeometry();
        const positions: number[] = [];
        const colors: number[] = [];
        const indices: number[] = [];

        // Parse hex color
        const hexColor = parseInt(color.replace('#', ''), 16);
        const baseR = (hexColor >> 16) & 255;
        const baseG = (hexColor >> 8) & 255;
        const baseB = hexColor & 255;

        // Generate grass blades
        for (let i = 0; i < bladeCount; i++) {
            // Random position on the terrain
            const x = (Math.random() - 0.5) * areaWidth;
            const z = (Math.random() - 0.5) * areaDepth;
            
            // Height variation
            const height = bladeHeight * (0.8 + Math.random() * heightVariation);
            const width = bladeWidth * (0.7 + Math.random() * widthVariation);
            
            // Blade bend/tilt
            const bendX = (Math.random() - 0.5) * bendAmount;
            const bendZ = (Math.random() - 0.5) * bendAmount;
            
            // Color variation (slight shade differences for cartoon look)
            const colorVar = 0.85 + Math.random() * 0.45;
            const r = (baseR / 255) * colorVar;
            const g = (baseG / 255) * colorVar;
            const b = (baseB / 255) * colorVar;
            
            // Create a simple quad for each blade (2 triangles)
            const baseIndex = positions.length / 3;
            
            // Ground level (adjust y offset to match your terrain)
            const groundY = -9;
            
            // Bottom left
            positions.push(x - width / 2, groundY, z);
            colors.push(r * 0.9, g * 0.9, b * 0.9); // Slightly darker at base
            
            // Bottom right
            positions.push(x + width / 2, groundY, z);
            colors.push(r * 0.9, g * 0.9, b * 0.9);
            
            // Top left
            positions.push(x - width / 2 + bendX, groundY + height, z + bendZ);
            colors.push(r, g, b);
            
            // Top right
            positions.push(x + width / 2 + bendX, groundY + height, z + bendZ);
            colors.push(r, g, b);
            
            // Two triangles per blade
            // First triangle
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
            // Second triangle
            indices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2);
        }

        geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
        geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
        geometry.computeVertexNormals();

        return geometry;
    }, [bladeCount, bladeHeight, bladeWidth, areaWidth, areaDepth, heightVariation, widthVariation, bendAmount, color]);

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial 
                vertexColors={true}
                side={2} // DoubleSide
                roughness={0.7}
                metalness={0}
            />
        </mesh>
    );
}