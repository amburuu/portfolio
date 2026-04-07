import { useGLTF, Center } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three"


useGLTF.preload('/chaos3D.glb')

export default function ChaosModel(){
    const group = useRef<Group>(null);
    const { scene } = useGLTF('/chaos3D.glb');
    return (
         <Center>
            <group ref={group}>
                <primitive object={scene} />
            </group>
        </Center>
    );
}