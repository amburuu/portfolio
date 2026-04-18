"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Mesh } from 'three';

export function Water() {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const vertexShader = `
        uniform float uTime;
        uniform float uWaveAmplitude;
        
        varying vec2 vWorldPos;
        varying vec2 vUv;
        varying float vWave;

        void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xz;
            vUv = uv;
            
            vec3 pos = position;
            
            // Gentle wave animation
            float wave = sin(pos.x * 0.5 + uTime) * 0.2 + sin(pos.z * 0.5 + uTime * 0.8) * 0.2;
            pos.y += wave * uWaveAmplitude;
            vWave = wave;
            
            gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform float uScale;
        uniform float uCellSpeed;
        uniform float uFlowX;
        uniform float uFlowZ;
        uniform float uEdgeThreshold;
        uniform float uEdgeSoftness;
        uniform vec3 uDeepColor;
        uniform vec3 uHighlight;
        
        varying vec2 vWorldPos;
        varying vec2 vUv;
        varying float vWave;

        vec2 hash2(vec2 p) {
            p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
            return fract(sin(p) * 43758.5453);
        }

        float smin(float a, float b, float k) {
            float h = max(k - abs(a - b), 0.0) / k;
            return min(a, b) - h * h * h * k / 6.0;
        }

        vec2 cellPt(vec2 seed) {
            return 0.5 + 0.5 * sin(uTime * uCellSpeed + 6.2831 * seed);
        }

        float voronoiF1(vec2 p) {
            vec2 i = floor(p), f = fract(p);
            float md = 8.0;
            for (int y = -1; y <= 1; y++)
                for (int x = -1; x <= 1; x++) {
                    vec2 n = vec2(float(x), float(y));
                    vec2 pt = cellPt(hash2(i + n));
                    md = min(md, length(n + pt - f));
                }
            return md;
        }

        float voronoiSF1(vec2 p) {
            vec2 i = floor(p), f = fract(p);
            float res = 8.0;
            for (int y = -1; y <= 1; y++)
                for (int x = -1; x <= 1; x++) {
                    vec2 n = vec2(float(x), float(y));
                    vec2 pt = cellPt(hash2(i + n));
                    res = smin(res, length(n + pt - f), 0.85);
                }
            return res;
        }

        void main() {
            // Circular mask
            vec2 centerUv = vUv - 0.5;
            float dist = length(centerUv);
            float circleMask = smoothstep(0.24, 0.19, dist);
            
            if(circleMask < 0.01) discard;
            
            // Voronoi
            vec2 uv = vWorldPos * uScale + vec2(uFlowX, uFlowZ) * uTime;
            float f1 = voronoiF1(uv);
            float sf1 = voronoiSF1(uv);
            float edge = f1 - sf1;

            float t = smoothstep(uEdgeThreshold - uEdgeSoftness,
                                uEdgeThreshold + uEdgeSoftness, edge);
            t = t * t * (3.0 - 2.0 * t);
            vec3 color = mix(uDeepColor, uHighlight, t);

            gl_FragColor = vec4(color, 0.7 * circleMask);
        }
    `;

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh 
            ref={meshRef} 
            position={[0, 0, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
        >
            <planeGeometry args={[30, 30, 256, 256]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uWaveAmplitude: { value: 0.1 },
                    uScale: { value: 0.4 },
                    uCellSpeed: { value: 0.3 },
                    uFlowX: { value: 0.1 },
                    uFlowZ: { value: 0.1 },
                    uEdgeThreshold: { value: 0.12 },
                    uEdgeSoftness: { value: 0.10 },
                    uDeepColor: { value: { r: 0.0, g: 0.4, b: 0.8 } },
                    uHighlight: { value: { r: 0.2, g: 0.5, b: 0.8 } },
                }}
                side={2}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
}