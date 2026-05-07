"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { waterObjectsRegistry } from "./stores/waterObjectsRegistry";
import { VERT } from "./shaders/depthIntersection.vert";
import { FRAG } from "./shaders/depthIntersection.frag";

export default function WaterDepthIntersection() {
  const { size, gl: glState } = useThree();
  const planeRef = useRef<THREE.Mesh>(null!);

  const { enabled, rippleFreq, rippleSpeed, rippleDecay, rippleStart, rippleDepth, rippleOpacity, rippleColor } =
    {
      enabled: true,
      rippleColor: "#7cd8ff",
      rippleFreq: 3.5,
      rippleSpeed: 1.5,
      rippleDecay: 1.2,
      rippleStart: 1.3,
      rippleDepth: 3.8,
      rippleOpacity: 0.71
    };

  const depthRT = useMemo(() => {
    const dpr = glState.getPixelRatio();
    const w   = Math.round(size.width  * dpr);
    const h   = Math.round(size.height * dpr);
    const rt  = new THREE.WebGLRenderTarget(w, h);
    rt.depthTexture      = new THREE.DepthTexture(w, h);
    rt.depthTexture.type = THREE.UnsignedShortType;
    return rt;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, glState]);

  useEffect(() => () => { depthRT.dispose(); }, [depthRT]);

  const depthScene  = useMemo(() => new THREE.Scene(), []);
  const depthMat    = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.FrontSide }), []);
  const sceneGroups = useRef(new Map<string, THREE.Group>());

  useEffect(() => () => { depthMat.dispose(); }, [depthMat]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: {
      uDepthTex:      { value: null },
      uResolution:    { value: new THREE.Vector2(size.width, size.height) },
      uNear:          { value: 0.1 },
      uFar:           { value: 1000 },
      uTime:          { value: 0 },
      uRippleFreq:    { value: 3.5 },
      uRippleSpeed:   { value: 1.5 },
      uRippleDecay:   { value: 1.2 },
      uRippleStart:   { value: 2.0 },
      uRippleDepth:   { value: 6.0 },
      uRippleOpacity: { value: 0.35 },
      uRippleColor:   { value: new THREE.Color("#ffffff") },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useEffect(() => () => { material.dispose(); }, [material]);

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

    if (enabled) {
      const prevRT        = gl.getRenderTarget();
      const prevAutoClear = gl.autoClear;
      gl.autoClear = true;
      gl.setRenderTarget(depthRT);
      gl.render(depthScene, camera);
      gl.setRenderTarget(prevRT);
      gl.autoClear = prevAutoClear;
    }

    const u   = material.uniforms;
    const dpr = gl.getPixelRatio();
    u.uDepthTex.value      = depthRT.depthTexture;
    u.uResolution.value.set(frameSize.width * dpr, frameSize.height * dpr);
    u.uNear.value          = camera.near;
    u.uFar.value           = camera.far;
    u.uTime.value          = clock.getElapsedTime();
    u.uRippleFreq.value    = rippleFreq;
    u.uRippleSpeed.value   = rippleSpeed;
    u.uRippleDecay.value   = rippleDecay;
    u.uRippleStart.value   = rippleStart;
    u.uRippleDepth.value   = rippleDepth;
    u.uRippleOpacity.value = rippleOpacity;
    u.uRippleColor.value.set(rippleColor);
  });

  return (
    <mesh
      ref={planeRef}
      visible={enabled}
      rotation-x={-Math.PI / 2}
      position={[0, -0.095, 0]}
      renderOrder={5}
      frustumCulled={false}
    >
      <planeGeometry args={[600, 600]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
