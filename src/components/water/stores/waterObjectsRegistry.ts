import type * as THREE from "three";

export interface WaterObjectEntry {
  id: string;
  /** Root Object3D of the model — position/rotation/scale read each frame. */
  ref: { current: THREE.Object3D | null };
  /** Geometries rendered into the depth + injection passes. */
  geometries: THREE.BufferGeometry[];
}

const registry = new Map<string, WaterObjectEntry>();

export const waterObjectsRegistry = {
  register(entry: WaterObjectEntry) {
    registry.set(entry.id, entry);
  },

  unregister(id: string) {
    registry.delete(id);
  },

  getAll(): WaterObjectEntry[] {
    return Array.from(registry.values());
  },
};
