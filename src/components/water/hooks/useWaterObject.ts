import { useEffect } from "react";
import type { RefObject } from "react";
import type { Object3D, BufferGeometry } from "three";
import { waterObjectsRegistry } from "../stores/waterObjectsRegistry";

export function useWaterObject(
  id: string,
  ref: RefObject<Object3D | null>,
  geometries: BufferGeometry[]
) {
  useEffect(() => {
    waterObjectsRegistry.register({ id, ref, geometries });
    return () => waterObjectsRegistry.unregister(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
}
