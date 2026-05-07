export const FRAG = /* glsl */ `
  uniform sampler2D uDepthTex;
  uniform vec2  uResolution;
  uniform float uNear;
  uniform float uFar;
  uniform float uTime;
  uniform float uRippleFreq;
  uniform float uRippleSpeed;
  uniform float uRippleDecay;
  uniform float uRippleStart;
  uniform float uRippleDepth;
  uniform float uRippleOpacity;
  uniform vec3  uRippleColor;

  float linearDepth(float raw) {
    float z = raw * 2.0 - 1.0;
    return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;
    float rawScene = texture2D(uDepthTex, screenUV).r;

    if (rawScene > 0.9999) discard;

    float sceneD = linearDepth(rawScene);
    float waterD = linearDepth(gl_FragCoord.z);
    float diff   = abs(sceneD - waterD);

    float n1 = noise2(screenUV * 6.0  + uTime * 0.04);
    float n2 = noise2(screenUV * 13.0 - uTime * 0.07 + 5.3);
    float perturb = (n1 * 0.7 + n2 * 0.3) * 0.45;

    float pd = diff + perturb;

    // Oscillating phase: forward → stop → reverse → stop → forward...
    float oscFreq  = 0.4;
    float oscAmp   = uRippleSpeed / max(oscFreq, 0.001);
    float oscPhase = sin(uTime * oscFreq) * oscAmp;

    float r1 = sin(pd * uRippleFreq        + oscPhase);
    float r2 = sin(pd * uRippleFreq * 1.61 + oscPhase * 0.73 + 1.9);
    float r3 = sin(pd * uRippleFreq * 2.29 + oscPhase * 1.35 + 0.7);
    float r4 = sin(pd * uRippleFreq * 0.47 + oscPhase * 0.41 + 3.8);

    // Signed wave: crest (+1) then trough (-1) gives visible up-down cycle
    float rSigned = r1 * 0.4 + r2 * 0.3 + r3 * 0.2 + r4 * 0.1;
    float crest  = max( rSigned, 0.0);
    float trough = max(-rSigned, 0.0) * 0.3;

    // Shore fade: ripples blur in softly from the sand boundary
    float shoreFade = smoothstep(0.0, 0.7, diff);

    // Swell envelope: slow sine creates wave groups that rise and recede
    float rawSwell = sin(pd * uRippleFreq * 0.20 + uTime * uRippleSpeed * 0.32);
    float swell    = smoothstep(-0.3, 1.0, rawSwell);

    float pulse  = 0.75 + 0.25 * sin(uTime * 0.4 + diff * 0.8 + n1 * 2.0);
    float d      = diff - uRippleStart;
    float inBand = smoothstep(0.0, uRippleStart * 0.4, d) *
                   smoothstep(uRippleDepth, uRippleDepth * 0.5, diff);
    float decay  = exp(-max(d, 0.0) * uRippleDecay) * inBand;
    float ripple = (crest + trough) * swell * shoreFade * decay * pulse * uRippleOpacity;

    if (ripple < 0.005) discard;

    gl_FragColor = vec4(uRippleColor, ripple);
  }
`;
