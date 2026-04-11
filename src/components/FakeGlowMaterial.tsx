import { useMemo } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import type { Material, Side } from "three";
import { AdditiveBlending, Color, FrontSide } from "three";
import type { ColorRepresentation } from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    fakeGlowMaterial: any;
  }
}

type Props = {
  falloff?: number;
  glowInternalRadius?: number;
  glowColor?: ColorRepresentation;
  glowSharpness?: number;
  side?: Side;
  depthTest?: boolean;
  opacity?: number;
};

export const FakeGlowMaterial = ({
  falloff = 0.1,
  glowInternalRadius = 6.0,
  glowColor = "#00ff00",
  glowSharpness = 1.0,
  side = FrontSide,
  depthTest = false,
  opacity = 1.0,
}: Props) => {
  const FakeGlowMaterial = useMemo(() => {
    return shaderMaterial(
      {
        falloffAmount: falloff,
        glowInternalRadius,
        glowColor: new Color(glowColor),
        glowSharpness,
        opacity,
      },
      /* GLSL vertex */
      `
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
        vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
        vPosition = modelPosition.xyz;
        vNormal = modelNormal.xyz;
      }`,
      /* GLSL fragment */
      `
      uniform vec3 glowColor;
      uniform float falloffAmount;
      uniform float glowSharpness;
      uniform float glowInternalRadius;
      uniform float opacity;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vec3 normal = normalize(vNormal);
        if(!gl_FrontFacing) normal *= -1.0;
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = dot(viewDirection, normal);
        fresnel = pow(fresnel, glowInternalRadius + 0.1);
        float falloff = smoothstep(0., falloffAmount, fresnel);
        float fakeGlow = fresnel;
        fakeGlow += fresnel * glowSharpness;
        fakeGlow *= falloff;
        gl_FragColor = vec4(clamp(glowColor * fresnel, 0., 1.0), clamp(fakeGlow, 0., opacity));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    );
  }, [falloff, glowInternalRadius, glowColor, glowSharpness, opacity]);

  extend({ FakeGlowMaterial });

  return (
    <fakeGlowMaterial
      key={FakeGlowMaterial.key}
      side={side}
      transparent={true}
      blending={AdditiveBlending}
      depthTest={depthTest}
    />
  );
};

export default FakeGlowMaterial;