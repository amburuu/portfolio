import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface UseCameraProps {
    minRadius: number;
    maxRadius: number;
    speed: number;
    mouseSensitivity: number;
}

export function useCamera({
    minRadius = 14,
    maxRadius = 48,
    speed = 0.3,
    mouseSensitivity = 0.005,
}: UseCameraProps) {
    const { camera } = useThree();
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const positionRef = useRef({ x: 0, z: 20 });
    const rotationRef = useRef({ x: 0, y: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, z: 0 });

    // Set initial camera position
    useEffect(() => {
        camera.position.set(0, 10, 20);
        positionRef.current.x = 0;
        positionRef.current.z = 20;
    }, [camera]);

    // Mouse movement listener
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x += e.movementX;
            mouseRef.current.y += e.movementY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Keyboard listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd', 'z', 'q'].includes(key)) {
                keysPressed.current[key] = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd', 'z', 'q'].includes(key)) {
                keysPressed.current[key] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Main loop using useFrame with delta time
    useFrame((state, delta) => {
        let newX = positionRef.current.x;
        let newZ = positionRef.current.z;
        
        // Handle keyboard input - adapt to camera rotation
        let moveX = 0;
        let moveZ = 0;

        if (keysPressed.current['w'] || keysPressed.current['z']) {
            moveZ -= speed;
        }
        if (keysPressed.current['s']) {
            moveZ += speed;
        }
        if (keysPressed.current['a'] || keysPressed.current['q']) {
            moveX -= speed;
        }
        if (keysPressed.current['d']) {
            moveX += speed;
        }

        // Rotate movement vector based on camera Y rotation
        const dirX = moveX * Math.cos(rotationRef.current.y) - moveZ * Math.sin(rotationRef.current.y);
        const dirZ = moveX * Math.sin(rotationRef.current.y) + moveZ * Math.cos(rotationRef.current.y);

        // Apply velocity with delta time
        if (dirX !== 0 || dirZ !== 0) {
            velocityRef.current.x = dirX;
            velocityRef.current.z = dirZ;
        } else {
            velocityRef.current.x *= 0.9;
            velocityRef.current.z *= 0.9;
        }

        newX += velocityRef.current.x * delta * 30;
        newZ += velocityRef.current.z * delta * 30;

        // Calculate distance from center
        const distFromCenter = Math.sqrt(newX * newX + newZ * newZ);

        // Apply radius constraints
        if (distFromCenter >= minRadius && distFromCenter <= maxRadius) {
            positionRef.current.x = newX;
            positionRef.current.z = newZ;
        } else if (distFromCenter < minRadius) {
            const angle = Math.atan2(newZ, newX);
            positionRef.current.x = Math.cos(angle) * minRadius;
            positionRef.current.z = Math.sin(angle) * minRadius;
            velocityRef.current.x = 0;
            velocityRef.current.z = 0;
        } else if (distFromCenter > maxRadius) {
            const angle = Math.atan2(newZ, newX);
            positionRef.current.x = Math.cos(angle) * maxRadius;
            positionRef.current.z = Math.sin(angle) * maxRadius;
            velocityRef.current.x = 0;
            velocityRef.current.z = 0;
        }

        // Handle mouse rotation with delta time
        rotationRef.current.y += mouseRef.current.x * mouseSensitivity * delta * 100;
        rotationRef.current.x -= mouseRef.current.y * mouseSensitivity * delta * 100;

        // Clamp vertical rotation to prevent flipping
        rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));

        // Reset mouse movement
        mouseRef.current.x = 0;
        mouseRef.current.y = 0;

        // Update camera position
        camera.position.x = positionRef.current.x;
        camera.position.z = positionRef.current.z;

        // Apply rotation and look direction
        const distance = 20;
        const lookAtPoint = new Vector3(
            positionRef.current.x + Math.sin(rotationRef.current.y) * distance * Math.cos(rotationRef.current.x),
            8 + Math.sin(rotationRef.current.x) * distance,
            positionRef.current.z - Math.cos(rotationRef.current.y) * distance * Math.cos(rotationRef.current.x)
        );
        camera.lookAt(lookAtPoint);
    });

    return positionRef.current;
}