export const WAVE_VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const WAVE_FRAG = /* glsl */ `
  uniform sampler2D uWaveTex;
  uniform sampler2D uInjection;
  uniform float     uTexelSize;
  uniform float     uResolution;
  uniform float     uSpeed;
  uniform float     uDamping;
  uniform float     uInjectStr;
  uniform float     uInjectAmp;
  uniform float     uBorderWidth;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    float cur  = texture2D(uWaveTex, uv).r;
    float prev = texture2D(uWaveTex, uv).g;

    float left  = texture2D(uWaveTex, uv + vec2(-uTexelSize, 0.0)).r;
    float right = texture2D(uWaveTex, uv + vec2( uTexelSize, 0.0)).r;
    float up    = texture2D(uWaveTex, uv + vec2(0.0,  uTexelSize)).r;
    float down  = texture2D(uWaveTex, uv + vec2(0.0, -uTexelSize)).r;

    float laplacian = left + right + up + down - 4.0 * cur;
    float next = 2.0 * cur - prev + uSpeed * laplacian;
    next *= uDamping;

    float edge   = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float border = smoothstep(0.0, uBorderWidth, edge);
    next *= border;

    float inject = texture2D(uInjection, uv).r;
    next = mix(next, uInjectAmp, inject * uInjectStr);
    next = clamp(next, -1.0, 1.0);

    gl_FragColor = vec4(next, cur, 0.0, 1.0);
  }
`;
