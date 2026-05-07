import * as THREE from "three";

export const sharedDepth = {
  texture:    null as THREE.DepthTexture | null,
  resolution: new THREE.Vector2(),
  near:       0.1,
  far:        1000,
};
