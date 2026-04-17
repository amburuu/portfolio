"use client";

import { useMemo, useRef, useEffect, useState } from 'react';
import { BufferGeometry, BufferAttribute } from 'three';
import { useFrame } from '@react-three/fiber';

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
    pondRadius: number;
}

function generateGrassGeometry(
    bladeCount: number,
    bladeHeight: number,
    bladeWidth: number,
    areaWidth: number,
    areaDepth: number,
    heightVariation: number,
    widthVariation: number,
    bendAmount: number,
    color: string,
    pondRadius: number = 5,
    letterPositions: any[] = []
) {
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
        let x = (Math.random() - 0.5) * areaWidth;
        let z = (Math.random() - 0.5) * areaDepth;
        
        // Calculate distance from center
        const distFromCenter = Math.sqrt(x * x + z * z);
        
        // Skip if too close to pond center
        if (distFromCenter < pondRadius) {
            continue;
        }
        
        // Calculate fade factor - grass gets smaller approaching pond
        const fadeDistance = pondRadius + 3;
        let fadeFactor = 1.0;
        if (distFromCenter < fadeDistance) {
            fadeFactor = (distFromCenter - pondRadius) / (fadeDistance - pondRadius);
        }
        
        // Push grass away from letters
        for (const letterPos of letterPositions) {
            const dx = x - letterPos[0];
            const dz = z - letterPos[2];
            const dist = Math.sqrt(dx * dx + dz * dz);
            
            if (dist < 4.0) {
                const angle = Math.atan2(dz, dx);
                const pushAmount = (1 - dist / 4.0) * 3.0;
                x += Math.cos(angle) * pushAmount;
                z += Math.sin(angle) * pushAmount;
            }
        }
        
        // Apply fade factor to height and width
        const height = bladeHeight * (0.8 + Math.random() * heightVariation) * fadeFactor;
        const width = bladeWidth * (0.7 + Math.random() * widthVariation) * fadeFactor;
        
        // Skip very small blades
        if (height < 0.1 || width < 0.01) {
            continue;
        }
        
        const bendX = (Math.random() - 0.5) * bendAmount;
        const bendZ = (Math.random() - 0.5) * bendAmount;
        
        const colorVar = 0.85 + Math.random() * 0.15;
        const r = (baseR / 255) * colorVar;
        const g = (baseG / 255) * colorVar;
        const b = (baseB / 255) * colorVar;
        
        const baseIndex = positions.length / 3;
        const groundY = 0;
        
        // Alternate rotation based on index
        const rotation = i % 3; // 0, 1, or 2 for different angles
        
        if (rotation === 0) {
            // Original orientation (X/Z axis)
            positions.push(x - width / 2, groundY, z);
            colors.push(r * 0.9, g * 0.9, b * 0.9);
            
            positions.push(x + width / 2, groundY, z);
            colors.push(r * 0.9, g * 0.9, b * 0.9);
            
            positions.push(x - width / 2 + bendX, groundY + height, z + bendZ);
            colors.push(r, g, b);
            
            positions.push(x + width / 2 + bendX, groundY + height, z + bendZ);
            colors.push(r, g, b);
        } else if (rotation === 1) {
            // 45 degree rotation
            const cos45 = Math.cos(Math.PI / 4);
            const sin45 = Math.sin(Math.PI / 4);
            const offsetX1 = -width / 2 * cos45;
            const offsetZ1 = -width / 2 * sin45;
            const offsetX2 = width / 2 * cos45;
            const offsetZ2 = width / 2 * sin45;
            
            positions.push(x + offsetX1, groundY, z + offsetZ1);
            colors.push(r * 0.9, g * 0.9, b * 0.9);
            
            positions.push(x + offsetX2, groundY, z + offsetZ2);
            colors.push(r * 0.9, g * 0.9, b * 0.9);
            
            positions.push(x + offsetX1 + bendX, groundY + height, z + offsetZ1 + bendZ);
            colors.push(r, g, b);
            
            positions.push(x + offsetX2 + bendX, groundY + height, z + offsetZ2 + bendZ);
            colors.push(r, g, b);
        } else {
            // 90 degree rotation (perpendicular)
            positions.push(x, groundY, z - width / 2);
            colors.push(r * 0.9, g * 0.9, b * 0.9);
            
            positions.push(x, groundY, z + width / 2);
            colors.push(r * 0.9, g * 0.9, b * 0.9);
            
            positions.push(x + bendX, groundY + height, z - width / 2 + bendZ);
            colors.push(r, g, b);
            
            positions.push(x + bendX, groundY + height, z + width / 2 + bendZ);
            colors.push(r, g, b);
        }
        
        indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
        indices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2);
    }

    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
    geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
    geometry.computeVertexNormals();

    return geometry;
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
    color = '#5fb376',
    pondRadius = 5,
}: Partial<GrassConfig> = {}) {
    
    const meshRef = useRef<any>(null);
    const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
    const [hasLetters, setHasLetters] = useState(false);

    // Create initial geometry without letters
    useEffect(() => {
        const geo = generateGrassGeometry(
            bladeCount,
            bladeHeight,
            bladeWidth,
            areaWidth,
            areaDepth,
            heightVariation,
            widthVariation,
            bendAmount,
            color,
            pondRadius,
            []
        );
        setGeometry(geo);
    }, [bladeCount, bladeHeight, bladeWidth, areaWidth, areaDepth, heightVariation, widthVariation, bendAmount, color, pondRadius]);

    // Watch for letter positions and regenerate
    useFrame(() => {
        const letterPos = (window as any).letterPositions;
        if (letterPos && !hasLetters) {
            setHasLetters(true);
            const newGeo = generateGrassGeometry(
                bladeCount,
                bladeHeight,
                bladeWidth,
                areaWidth,
                areaDepth,
                heightVariation,
                widthVariation,
                bendAmount,
                color,
                pondRadius,
                letterPos
            );
            setGeometry(newGeo);
        }
    });

    if (!geometry) return null;

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial 
                vertexColors={true}
                side={2}
                roughness={0.7}
                metalness={0}
            />
        </mesh>
    );
}