import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import { useControls } from "leva";

useGLTF.preload('/chaos3D.glb');

export default function ChaosModel() {
    const outer = useRef<Group>(null);
    const { nodes } = useGLTF('/chaos3D.glb') as any;

    const config = useControls({
        backside: true,
        transmission: { value: 1, min: 0, max: 1 },
        roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
        thickness: { value: 0.20, min: 0, max: 10, step: 0.01 },
        ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
        chromaticAberration: { value: 0.06, min: 0, max: 1 },
    });

    return (
        <group ref={outer}>
            <mesh geometry={nodes.Curve.geometry}>
                <MeshTransmissionMaterial {...config} />
            </mesh>
        </group>
    );
}