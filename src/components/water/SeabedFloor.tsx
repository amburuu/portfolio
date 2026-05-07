"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VERT } from "./shaders/waterFloor.vert";
import { FRAG } from "./shaders/seabedFloor.frag";
import { sharedDepth } from "./stores/sharedDepthStore";

export default function SeabedFloor() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const {
    seabedDepth, seabedScale, seabedCellSpeed, seabedFlowX, seabedFlowZ,
    seabedEdgeThreshold, seabedEdgeSoftness, seabedDeepColor, seabedHighlightColor,
    seabedFadeDistance, seabedFadeStrength, seabedShoreDepth,
  } = {
    seabedDepth: -1.1,
    seabedScale: 0.16,
    seabedCellSpeed: 0.12,
    seabedFlowX: 0.0,
    seabedFlowZ: -0.11,
    seabedEdgeThreshold: 0.00,
    seabedEdgeSoftness: 0.07,
    seabedDeepColor: "#39acce",
    seabedHighlightColor: "#1e7296",
    seabedFadeDistance: 300,
    seabedFadeStrength: 5,
    seabedShoreDepth: 1.3
  };

  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent:    true,
    depthWrite:     false,
    side:           THREE.FrontSide,
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime:          { value: 0 },
      uScale:         { value: 0.16 },
      uCellSpeed:     { value: 0.49 },
      uFlowX:         { value: 0.0 },
      uFlowZ:         { value: -0.11 },
      uEdgeThreshold: { value: 0.06 },
      uEdgeSoftness:  { value: 0.03 },
      uDeepColor:     { value: new THREE.Color("#1aaae8") },
      uHighlight:     { value: new THREE.Color("#177096") },
      uFadeDistance:  { value: 250.0 },
      uFadeStrength:  { value: 2.0 },
      uCamXZ:         { value: new THREE.Vector2() },
      uDepthTex:      { value: null },
      uResolution:    { value: new THREE.Vector2() },
      uNear:          { value: 0.1 },
      uFar:           { value: 1000 },
      uShoreDepth:    { value: 1.5 },
    },
  }), []);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const u = material.uniforms;
    u.uScale.value         = seabedScale;
    u.uCellSpeed.value     = seabedCellSpeed;
    u.uFlowX.value         = seabedFlowX;
    u.uFlowZ.value         = seabedFlowZ;
    u.uEdgeThreshold.value = seabedEdgeThreshold;
    u.uEdgeSoftness.value  = seabedEdgeSoftness;
    u.uDeepColor.value.set(seabedDeepColor);
    u.uHighlight.value.set(seabedHighlightColor);
    u.uFadeDistance.value  = seabedFadeDistance;
    u.uFadeStrength.value  = seabedFadeStrength;
    u.uShoreDepth.value    = seabedShoreDepth;
  }, [material, seabedScale, seabedCellSpeed, seabedFlowX, seabedFlowZ,
      seabedEdgeThreshold, seabedEdgeSoftness, seabedDeepColor, seabedHighlightColor,
      seabedFadeDistance, seabedFadeStrength, seabedShoreDepth]);

  useFrame(({ camera, clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uCamXZ.value.set(camera.position.x, camera.position.z);
    meshRef.current.position.x = camera.position.x;
    meshRef.current.position.z = camera.position.z;
    meshRef.current.position.y = seabedDepth;

    if (sharedDepth.texture) {
      material.uniforms.uDepthTex.value = sharedDepth.texture;
      material.uniforms.uResolution.value.copy(sharedDepth.resolution);
      material.uniforms.uNear.value = sharedDepth.near;
      material.uniforms.uFar.value  = sharedDepth.far;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation-x={-Math.PI / 2}
      position={[0, -1.0, 0]}
      frustumCulled={false}
      renderOrder={0}
    >
      <planeGeometry args={[1000, 1000]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
