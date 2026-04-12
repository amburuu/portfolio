import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";

useGLTF.preload('/meshes/mountains.glb');

export default function MountainMeshModel() {
    const outer = useRef<Group>(null);
    const { nodes } = useGLTF('/meshes/mountains.glb') as any;

    return (
        <group ref={outer}>
            <mesh geometry={nodes.Curve004.geometry}>
                <meshStandardMaterial color="#62b1e6" />
            </mesh>
            <mesh geometry={nodes.Curve004_1.geometry}>
                <meshStandardMaterial color="#3e8bbe" />
            </mesh>
            <mesh geometry={nodes.Curve004_2.geometry}>
                <meshStandardMaterial color="#62b1e6" />
            </mesh>
            <mesh geometry={nodes.Curve004_3.geometry}>
                <meshStandardMaterial color="#4d8bb4" />
            </mesh>
        </group>
    );
}