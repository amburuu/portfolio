"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VERT } from "./shaders/waterFloor.vert";
import { FRAG } from "./shaders/waterFloor.frag";
import { waterObjectsRegistry } from "./stores/waterObjectsRegistry";
import { sharedDepth } from "./stores/sharedDepthStore";

interface WaterFloorProps {
  deepOpacityOverride?: number;
}

export default function WaterFloor({ deepOpacityOverride }: WaterFloorProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { size, gl: renderer } = useThree();

  const {
    waterScale, cellSmoothness, edgeThreshold, edgeSoftness,
    flowX, flowZ, cellSpeed, noiseScale, noiseFlowSpeed, distortAmount,
    deepColor, midColor, midPos, highlightColor, opacity, deepOpacity,
    fadeDistance, fadeStrength, shoreDepth, blur,
  } = {
    waterScale: 0.23,
    cellSmoothness: 0.46,
    edgeThreshold: 0.09,
    edgeSoftness: 0.10,
    flowX: 0.07,
    flowZ: -0.2,
    cellSpeed: 0.55,
    noiseScale: 1.06,
    noiseFlowSpeed: 0.24,
    distortAmount: 0.26,
    deepColor: "#51b0d1",
    midColor: "#52c9e5",
    midPos: 0.65,
    highlightColor: "#ffffff",
    opacity: 0.70,
    deepOpacity: 1.0,
    fadeDistance: 300,
    fadeStrength: 5,
    shoreDepth: 3.0,
    blur: 0.02
  };

  const depthRT = useMemo(() => {
    const dpr = renderer.getPixelRatio();
    const w   = Math.round(size.width  * dpr);
    const h   = Math.round(size.height * dpr);
    const rt  = new THREE.WebGLRenderTarget(w, h);
    rt.depthTexture      = new THREE.DepthTexture(w, h);
    rt.depthTexture.type = THREE.UnsignedShortType;
    return rt;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, renderer]);

  useEffect(() => () => depthRT.dispose(), [depthRT]);

  const depthScene  = useMemo(() => new THREE.Scene(), []);
  const depthMat    = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.FrontSide }), []);
  const sceneGroups = useRef(new Map<string, THREE.Group>());

  useEffect(() => () => depthMat.dispose(), [depthMat]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    side:        THREE.FrontSide,
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime:          { value: 0 },
      uScale:         { value: 0.23 },
      uSmoothness:    { value: 0.46 },
      uEdgeThreshold: { value: 0.09 },
      uEdgeSoftness:  { value: 0.10 },
      uFlowX:         { value: 0.07 },
      uFlowZ:         { value: -0.23 },
      uCellSpeed:     { value: 0.55 },
      uNoiseScale:    { value: 0.87 },
      uNoiseFlowSpeed:{ value: 0.11 },
      uDistortAmount: { value: 0.26 },
      uDeepColor:     { value: new THREE.Color("#1a3a5c") },
      uMidColor:      { value: new THREE.Color("#59c0e8") },
      uMidPos:        { value: 0.31 },
      uHighlight:     { value: new THREE.Color("#ffffff") },
      uOpacity:       { value: 1.0 },
      uDeepOpacity:   { value: 0.65 },
      uFadeDistance:  { value: 275.0 },
      uFadeStrength:  { value: 1.3 },
      uDepthTex:      { value: null },
      uResolution:    { value: new THREE.Vector2() },
      uNear:          { value: 0.1 },
      uFar:           { value: 1000 },
      uShoreDepth:    { value: 1.5 },
      uBlur:          { value: 0.12 },
      uCamXZ:         { value: new THREE.Vector2() },
    },
  }), []);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const u = material.uniforms;
    u.uScale.value          = waterScale;
    u.uSmoothness.value     = cellSmoothness;
    u.uEdgeThreshold.value  = edgeThreshold;
    u.uEdgeSoftness.value   = edgeSoftness;
    u.uFlowX.value          = flowX;
    u.uFlowZ.value          = flowZ;
    u.uCellSpeed.value      = cellSpeed;
    u.uNoiseScale.value     = noiseScale;
    u.uNoiseFlowSpeed.value = noiseFlowSpeed;
    u.uDistortAmount.value  = distortAmount;
    u.uDeepColor.value.set(deepColor);
    u.uMidColor.value.set(midColor);
    u.uMidPos.value         = midPos;
    u.uHighlight.value.set(highlightColor);
    u.uOpacity.value        = opacity;
    u.uDeepOpacity.value    = deepOpacityOverride ?? deepOpacity;
    u.uFadeDistance.value   = fadeDistance;
    u.uFadeStrength.value   = fadeStrength;
    u.uShoreDepth.value     = shoreDepth;
    u.uBlur.value           = blur;
  }, [material, waterScale, cellSmoothness, edgeThreshold, edgeSoftness,
      flowX, flowZ, cellSpeed, noiseScale, noiseFlowSpeed, distortAmount,
      deepColor, midColor, midPos, highlightColor, opacity, deepOpacity,
      deepOpacityOverride, fadeDistance, fadeStrength, shoreDepth, blur]);

  useFrame(({ gl, camera, clock, size: frameSize }) => {
    const objects = waterObjectsRegistry.getAll();

    for (const obj of objects) {
      if (!obj.ref.current) continue;
      if (!sceneGroups.current.has(obj.id)) {
        const group = new THREE.Group();
        obj.geometries.forEach(geo => group.add(new THREE.Mesh(geo, depthMat)));
        depthScene.add(group);
        sceneGroups.current.set(obj.id, group);
      }
      const group = sceneGroups.current.get(obj.id)!;
      group.position.copy(obj.ref.current.position);
      group.rotation.copy(obj.ref.current.rotation);
      group.scale.copy(obj.ref.current.scale);
    }

    for (const [id, group] of sceneGroups.current) {
      if (!objects.find(o => o.id === id)) {
        depthScene.remove(group);
        sceneGroups.current.delete(id);
      }
    }

    const prevRT        = gl.getRenderTarget();
    const prevAutoClear = gl.autoClear;
    gl.autoClear = true;
    gl.setRenderTarget(depthRT);
    gl.render(depthScene, camera);
    gl.setRenderTarget(prevRT);
    gl.autoClear = prevAutoClear;

    const dpr = gl.getPixelRatio();
    const u   = material.uniforms;
    u.uTime.value = clock.getElapsedTime();
    u.uCamXZ.value.set(camera.position.x, camera.position.z);
    u.uDepthTex.value = depthRT.depthTexture;
    u.uResolution.value.set(frameSize.width * dpr, frameSize.height * dpr);
    u.uNear.value = camera.near;
    u.uFar.value  = camera.far;

    sharedDepth.texture = depthRT.depthTexture;
    sharedDepth.resolution.set(frameSize.width * dpr, frameSize.height * dpr);
    sharedDepth.near = camera.near;
    sharedDepth.far  = camera.far;

    meshRef.current.position.x = camera.position.x;
    meshRef.current.position.z = camera.position.z;
  });

  return (
    <mesh
      ref={meshRef}
      rotation-x={-Math.PI / 2}
      position={[0, -0.3, 0]}
      frustumCulled={false}
      renderOrder={2}
    >
      <planeGeometry args={[600, 600]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
