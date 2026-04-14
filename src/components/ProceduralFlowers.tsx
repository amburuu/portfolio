"use client";

import { useMemo } from 'react';
import { BufferGeometry, BufferAttribute } from 'three';

interface FlowerConfig {
    flowerCount: number;
    flowerHeight: number;
    petalSize: number;
    areaWidth: number;
    areaDepth: number;
    colors: string[];
}

// Seeded random number generator for consistent results
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function ProceduralFlowers({
    flowerCount = 200,
    flowerHeight = 1.5,
    petalSize = 0.3,
    areaWidth = 96,
    areaDepth = 50,
    colors = ['#ff6b9d', '#ffd93d', '#6bcf7f'],
}: Partial<FlowerConfig> = {}) {
    
    const geometry = useMemo(() => {
        const geometry = new BufferGeometry();
        const positions: number[] = [];
        const colorData: number[] = [];
        const indices: number[] = [];

        // Generate flowers with seeded randomness
        for (let i = 0; i < flowerCount; i++) {
            // Use seeded random for consistent positions
            const seedX = seededRandom(i * 2);
            const seedZ = seededRandom(i * 2 + 1);
            const seedColor = seededRandom(i * 3);

            // Random position in grass area
            const x = (seedX - 0.5) * areaWidth;
            const z = (seedZ - 0.5) * areaDepth;
            const groundY = -10;

            // Consistent random color from the array
            const colorIndex = Math.floor(seedColor * colors.length);
            const color = colors[colorIndex];
            const hexColor = parseInt(color.replace('#', ''), 16);
            const r = ((hexColor >> 16) & 255) / 255;
            const g = ((hexColor >> 8) & 255) / 255;
            const b = (hexColor & 255) / 255;

            // Stem
            const stemBaseIndex = positions.length / 3;
            
            positions.push(x, groundY, z);
            colorData.push(r * 0.6, g * 0.6, b * 0.6);
            
            positions.push(x, groundY + flowerHeight, z);
            colorData.push(r * 0.6, g * 0.6, b * 0.6);

            // Create petals
            const petalCount = 5;

            for (let p = 0; p < petalCount; p++) {
                const angle = (p / petalCount) * Math.PI * 2;
                const nextAngle = ((p + 1) / petalCount) * Math.PI * 2;

                const px1 = x + Math.cos(angle) * petalSize;
                const pz1 = z + Math.sin(angle) * petalSize;
                const px2 = x + Math.cos(nextAngle) * petalSize;
                const pz2 = z + Math.sin(nextAngle) * petalSize;

                const petalBase = positions.length / 3;

                positions.push(px1, groundY + flowerHeight, pz1);
                colorData.push(r, g, b);

                positions.push(px2, groundY + flowerHeight, pz2);
                colorData.push(r, g, b);

                positions.push(x, groundY + flowerHeight + petalSize * 0.5, z);
                colorData.push(r * 1.1, g * 1.1, b * 1.1);

                indices.push(petalBase, petalBase + 1, petalBase + 2);
            }
        }

        geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute('color', new BufferAttribute(new Float32Array(colorData), 3));
        geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
        geometry.computeVertexNormals();

        return geometry;
    }, [flowerCount, flowerHeight, petalSize, areaWidth, areaDepth, colors.join(',')]);

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial 
                vertexColors={true}
                side={2}
                roughness={0.6}
                metalness={0}
            />
        </mesh>
    );
}