"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Mesh, Vector3 } from 'three';

interface WaterProps {
    // Géométrie
    position?: [number, number, number];
    rotation?: [number, number, number];
    size?: number;
    segmentsW?: number;
    segmentsH?: number;

    // Animation des vagues
    waveAmplitude?: number;
    waveFrequencyX?: number;
    waveFrequencyZ?: number;
    waveSpeedX?: number;
    waveSpeedZ?: number;

    // Voronoi / Pattern
    voronoiScale?: number;
    cellSpeed?: number;
    flowX?: number;
    flowZ?: number;

    // Edges
    edgeThreshold?: number;
    edgeSoftness?: number;

    // Couleurs
    deepColor?: [number, number, number];
    highlightColor?: [number, number, number];

    // Transparency & rendering
    opacity?: number;
    circleRadius?: number;
    enableCircleMask?: boolean;
}

export function Water({
    // Géométrie
    position = [0, 0, 0],
    rotation = [-Math.PI / 2, 0, 0],
    size = 30,
    segmentsW = 256,
    segmentsH = 256,

    // Animation des vagues
    waveAmplitude = 0.1,
    waveFrequencyX = 0.5,
    waveFrequencyZ = 0.5,
    waveSpeedX = 1,
    waveSpeedZ = 0.8,

    // Voronoi / Pattern
    voronoiScale = 0.4,
    cellSpeed = 0.3,
    flowX = 0.1,
    flowZ = 0.1,

    // Edges
    edgeThreshold = 0.12,
    edgeSoftness = 0.1,

    // Couleurs
    deepColor = [0.0, 0.4, 0.8],
    highlightColor = [0.2, 0.5, 0.8],

    // Transparency & rendering
    opacity = 0.7,
    circleRadius = 0.5,
    enableCircleMask = true,
}: WaterProps = {}) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const vertexShader = `
        uniform float uTime;
        uniform float uWaveAmplitude;
        uniform float uWaveFrequencyX;
        uniform float uWaveFrequencyZ;
        uniform float uWaveSpeedX;
        uniform float uWaveSpeedZ;
        
        varying vec2 vWorldPos;
        varying vec2 vUv;
        varying float vWave;

        void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xz;
            vUv = uv;
            
            vec3 pos = position;
            
            // Wave animation avec paramètres contrôlables
            float waveX = sin(pos.x * uWaveFrequencyX + uTime * uWaveSpeedX) * 0.2;
            float waveZ = sin(pos.z * uWaveFrequencyZ + uTime * uWaveSpeedZ) * 0.2;
            float wave = waveX + waveZ;
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
        uniform float uOpacity;
        uniform float uCircleRadius;
        uniform bool uEnableCircleMask;
        
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
            // Circular mask (optionnel)
            float circleMask = 1.0;
            if (uEnableCircleMask) {
                vec2 centerUv = vUv - 0.5;
                float dist = length(centerUv);
                circleMask = smoothstep(uCircleRadius, uCircleRadius - 0.05, dist);
                if(circleMask < 0.01) discard;
            }
            
            // Voronoi pattern
            vec2 uv = vWorldPos * uScale + vec2(uFlowX, uFlowZ) * uTime;
            float f1 = voronoiF1(uv);
            float sf1 = voronoiSF1(uv);
            float edge = f1 - sf1;

            float t = smoothstep(uEdgeThreshold - uEdgeSoftness,
                                uEdgeThreshold + uEdgeSoftness, edge);
            t = t * t * (3.0 - 2.0 * t);
            vec3 color = mix(uDeepColor, uHighlight, t);

            gl_FragColor = vec4(color, uOpacity * circleMask);
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
            position={position}
            rotation={rotation}
        >
            <planeGeometry args={[size, size, segmentsW, segmentsH]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uWaveAmplitude: { value: waveAmplitude },
                    uWaveFrequencyX: { value: waveFrequencyX },
                    uWaveFrequencyZ: { value: waveFrequencyZ },
                    uWaveSpeedX: { value: waveSpeedX },
                    uWaveSpeedZ: { value: waveSpeedZ },
                    uScale: { value: voronoiScale },
                    uCellSpeed: { value: cellSpeed },
                    uFlowX: { value: flowX },
                    uFlowZ: { value: flowZ },
                    uEdgeThreshold: { value: edgeThreshold },
                    uEdgeSoftness: { value: edgeSoftness },
                    uDeepColor: { value: new Vector3(deepColor[0], deepColor[1], deepColor[2]) },
                    uHighlight: { value: new Vector3(highlightColor[0], highlightColor[1], highlightColor[2]) },
                    uOpacity: { value: opacity },
                    uCircleRadius: { value: circleRadius },
                    uEnableCircleMask: { value: enableCircleMask },
                }}
                side={2}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
}