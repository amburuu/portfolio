"use client";

import { useRef, useMemo } from 'react';
import { Mesh, BufferGeometry, BufferAttribute, ShaderMaterial, Vector3 } from 'three';

interface SkyDomeProps {
    position?: [number, number, number];
    radius?: number;
    height?: number;
    gradientStops?: Array<{
        position: number;
        color: [number, number, number];
    }>;
    widthSegments?: number;
    heightSegments?: number;
}

export const SKY_PRESETS = {
    day: [
        { position: 0, color: [122/255, 100/255, 116/255] as [number, number, number] },
        { position: 0.10, color: [183/255, 123/255, 96/255] as [number, number, number] },
        { position: 0.25, color: [169/255, 170/255, 138/255] as [number, number, number] },
        { position: 1, color: [93/255, 141/255, 161/255] as [number, number, number] },
    ],
    night: [
        { position: 0, color: [201/255, 115/255, 73/255] as [number, number, number] },
        { position: 0.23, color: [108/255, 50/255, 110/255] as [number, number, number] },
        { position: 0.43, color: [62/255, 31/255, 125/255] as [number, number, number] },
        { position: 0.57, color: [21/255, 18/255, 99/255] as [number, number, number] },
        { position: 1, color: [1/255, 1/255, 7/255] as [number, number, number] },
    ],
};

export function SkyDome({
    position = [0, 0, 0],
    radius = 500,
    height = 200,
    gradientStops = SKY_PRESETS.day,
    widthSegments = 32,
    heightSegments = 32,
}: SkyDomeProps = {}) {
    const meshRef = useRef<Mesh>(null);

    const vertexShader = `
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
            vPosition = position;
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform vec3 uColor0;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform float uPos0;
        uniform float uPos1;
        uniform float uPos2;
        uniform float uPos3;
        uniform float uPos4;
        
        varying vec3 vPosition;
        varying vec2 vUv;

        vec3 getColor(float t) {
            if (t <= uPos0) return uColor0;
            if (t <= uPos1) return mix(uColor0, uColor1, (t - uPos0) / (uPos1 - uPos0));
            if (t <= uPos2) return mix(uColor1, uColor2, (t - uPos1) / (uPos2 - uPos1));
            if (t <= uPos3) return mix(uColor2, uColor3, (t - uPos2) / (uPos3 - uPos2));
            if (t <= uPos4) return mix(uColor3, uColor4, (t - uPos3) / (uPos4 - uPos3));
            
            return uColor4;
        }

        void main() {
            float t = vUv.y;
            t = clamp(t, 0.0, 1.0);
            
            vec3 color = getColor(t);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const geometry = useMemo(() => {
        const geo = new BufferGeometry();
        const positions: number[] = [];
        const uvs: number[] = [];
        const indices: number[] = [];

        // Créer seulement la demi-sphère supérieure (hémisphère)
        // Du zénith (angle PI/2) à l'horizon (angle 0)
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            // De PI/2 (zénith, y=0) à 0 (horizon, y=1)
            const angle = (1 - v) * (Math.PI / 2);
            
            const verticalRadius = Math.sin(angle) * radius;
            const verticalHeight = Math.cos(angle) * height;

            for (let x = 0; x <= widthSegments; x++) {
                const u = x / widthSegments;
                const horizontalAngle = u * Math.PI * 2;

                const px = Math.cos(horizontalAngle) * verticalRadius;
                const py = verticalHeight;
                const pz = Math.sin(horizontalAngle) * verticalRadius;

                positions.push(px, py, pz);
                uvs.push(u, v);
            }
        }

        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < widthSegments; x++) {
                const a = y * (widthSegments + 1) + x;
                const b = a + widthSegments + 1;

                indices.push(a, b, a + 1);
                indices.push(b, b + 1, a + 1);
            }
        }

        geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
        geo.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
        geo.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
        geo.computeVertexNormals();

        return geo;
    }, [radius, height, widthSegments, heightSegments]);

    const uniforms = useMemo(() => {
        const colorUniforms: any = {};
        const posUniforms: any = {};

        for (let i = 0; i < Math.min(5, gradientStops.length); i++) {
            const stop = gradientStops[i];
            colorUniforms[`uColor${i}`] = {
                value: new Vector3(stop.color[0], stop.color[1], stop.color[2])
            };
            posUniforms[`uPos${i}`] = { value: stop.position };
        }

        for (let i = gradientStops.length; i < 5; i++) {
            const lastStop = gradientStops[gradientStops.length - 1];
            colorUniforms[`uColor${i}`] = {
                value: new Vector3(lastStop.color[0], lastStop.color[1], lastStop.color[2])
            };
            posUniforms[`uPos${i}`] = { value: lastStop.position };
        }

        return { ...colorUniforms, ...posUniforms };
    }, [gradientStops]);

    return (
        <mesh ref={meshRef} position={position} geometry={geometry}>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={1}
                fog={false}
            />
        </mesh>
    );
}