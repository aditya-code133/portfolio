// GARGANTUA — High-Performance 120 FPS Schwarzschild Black Hole Raytracer GLSL Kernels

export const RAY_VERT = /* glsl */`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const RAY_FRAG = /* glsl */`
precision highp float;

varying vec2 vUv;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCamPos;
uniform vec3  uCamTarget;
uniform float uFov;
uniform int   uSteps;
uniform float uRotSign;
uniform int   uDebug;
uniform float uDin;
uniform float uDout;
uniform float uDopMax;
uniform float uOpNear;
uniform float uOpFar;
uniform float uDiskBright;
uniform float uStarBright;
uniform float uSkyFloor;
uniform float uRotSpeed;

#define RS 1.0

// ---------------- Fast Noise & Procedural FBM ----------------
float hash1(vec3 p){
  p = fract(p*0.3183099 + vec3(0.10,0.17,0.13));
  p *= 17.0;
  return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}

float vnoise(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f*f*(3.0-2.0*f);
  float n000 = hash1(i);
  float n100 = hash1(i+vec3(1.0,0.0,0.0));
  float n010 = hash1(i+vec3(0.0,1.0,0.0));
  float n110 = hash1(i+vec3(1.0,1.0,0.0));
  float n001 = hash1(i+vec3(0.0,0.0,1.0));
  float n101 = hash1(i+vec3(1.0,0.0,1.0));
  float n011 = hash1(i+vec3(0.0,1.0,1.0));
  float n111 = hash1(i+vec3(1.0,1.0,1.0));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
             mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}

// Optimized 3-octave FBM for silky 120 FPS throughput
float fbm(vec3 p){
  float v = 0.55 * vnoise(p);
  v += 0.30 * vnoise(p * 2.05 + 5.3);
  v += 0.15 * vnoise(p * 4.12 + 10.7);
  return v;
}

// ---------------- Pseudo-Blackbody Spectrum ----------------
vec3 blackbody(float t){
  vec3 c = mix(vec3(0.55,0.06,0.01), vec3(1.00,0.42,0.10), smoothstep(0.00,0.55,t));
  c = mix(c, vec3(1.00,0.86,0.55), smoothstep(0.50,1.05,t));
  c = mix(c, vec3(0.85,0.92,1.25), smoothstep(1.05,1.90,t));
  return c;
}

// ---------------- Fast Cosmic Background ----------------
vec3 background(vec3 d){
  // Subtle deep-space gradient
  vec3 col = vec3(0.012, 0.014, 0.020);
  
  // High-performance procedural starfield without heavy loop iterations
  vec3 p = d * 45.0;
  vec3 id = floor(p);
  float h = hash1(id);
  if(h > 0.965){
    vec3 f = fract(p) - 0.5;
    float dist = length(f);
    float star = exp(-dist * dist * 32.0) * pow((h - 0.965) / 0.035, 2.0);
    vec3 tint = mix(vec3(0.85, 0.92, 1.0), vec3(1.0, 0.90, 0.75), fract(h * 13.7));
    col += star * tint * 2.5 * uStarBright;
  }
  return col;
}

// ---------------- Schwarzschild Null-Geodesic Accel ----------------
vec3 accAt(vec3 p, vec3 v){
  vec3 h = cross(p, v);
  float r2 = dot(p, p);
  return -1.5*RS*dot(h, h)/(r2*r2*sqrt(r2))*p;
}

// ---------------- Accretion Disk Crossing ----------------
bool diskCross(vec3 a, vec3 b, vec3 rayDir, inout vec3 col, inout float trans){
  if(a.y*b.y > 0.0) return false;
  float t = abs(a.y)/(abs(a.y) + abs(b.y) + 1e-5);
  vec3 q = mix(a, b, t);
  float qr = length(q.xz);
  if(qr <= uDin || qr >= uDout) return false;

  float ang = atan(q.z, q.x);
  float x = max(qr, 3.001);
  float flux = max(pow(x/3.0, -3.0)*(1.0 - sqrt(3.0/x)), 0.0);
  float temp = pow(flux*10.0, 0.25);

  float omega = uRotSign*1.1*uRotSpeed*pow(3.0/qr, 1.5);
  float rot = omega*uTime;
  float ca = cos(rot), sa = sin(rot);
  vec3 qp = vec3(ca*q.x + sa*q.z, 0.0, -sa*q.x + ca*q.z);
  vec2 rp = qp.xz/qr;

  // Ultra-fast accretion disk procedural texture
  vec3 pc = vec3(rp.x*3.0, rp.y*3.0, qr*0.85);
  float turb = fbm(pc * 1.6);
  float streak = 0.75 + 0.25 * sin(ang * 8.0 + qr * 1.5 + uTime * uRotSpeed * 1.2);
  float innerDetail = 1.0 - smoothstep(4.0, 18.0, qr);
  float I = flux * 12.0 * turb * streak * mix(0.45, 1.1, innerDetail);
  I += exp(-pow((qr-3.1)*3.0, 2.0))*2.8;

  float outerFade = 1.0 - smoothstep(uDout-14.0, uDout, qr);
  I *= outerFade;

  // Relativistic Doppler Beaming + Gravitational Redshift
  float beta = sqrt(0.5/qr);
  float gamma = 1.0/sqrt(max(1.0 - beta*beta, 1e-4));
  vec3 tdir = normalize(vec3(-sin(ang), 0.0, cos(ang)))*uRotSign;
  float dop = 1.0/(gamma*(1.0 - dot(tdir*beta, rayDir)));
  dop = clamp(dop, 0.50, uDopMax);
  float g = sqrt(max(1.0 - RS/qr, 0.0));

  vec3 dcol = blackbody(temp*dop*g) * I * (dop*dop*dop) * g * uDiskBright;
  float alpha = mix(uOpFar, uOpNear, 1.0 - smoothstep(4.0, 13.0, qr)) * outerFade;
  col += trans * alpha * dcol;
  trans *= 1.0 - alpha;
  if(trans < 0.02){ trans = 0.0; return true; }
  return false;
}

// ACES Filmic Tone Mapping for cinematic output
vec3 aces(vec3 x){
  return clamp((x*(2.51*x + 0.03))/(x*(2.43*x + 0.59) + 0.14), 0.0, 1.0);
}

// ---------------- Raymarcher Main Loop ----------------
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  vec3 ro = uCamPos;
  vec3 ww = normalize(uCamTarget - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0,1.0,0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(p.x*uu + p.y*vv + uFov*ww);

  vec3 pos = ro;
  vec3 vel = rd;
  vec3 col = vec3(0.0);
  vec3 haloCol = vec3(0.0);
  float trans = 1.0;
  float minR = 1e5;
  float lastR = length(ro);

  int maxSteps = min(uSteps, 36);

  for(int i=0; i<36; i++){
    if(i >= maxSteps) break;
    float r = length(pos);
    lastR = r;
    if(r < 1.03*RS){ trans = 0.0; break; } // Event Horizon
    if(r > 40.0 && dot(pos,vel) > 0.0){ break; } // Escaped ray
    minR = min(minR, r);

    float dt = max(0.025, r*mix(0.03, 0.08, smoothstep(6.0, 20.0, r)));

    // Volumetric Disk Glow
    float absY = abs(pos.y);
    if(absY < 0.40 && r > uDin && r < uDout){
      float dens = exp(-absY*26.0)*0.035*(1.0 - smoothstep(10.0, uDout-1.0, r));
      float xh = max(r, 3.001);
      float fluxh = max(pow(xh/3.0, -3.0)*(1.0 - sqrt(3.0/xh)), 0.0);
      vec3 glowc = blackbody(pow(fluxh*10.0, 0.25)*0.9);
      haloCol += trans * glowc * (fluxh*3.5) * dens * dt * uDiskBright;
    }

    // Velocity update & step
    vel = normalize(vel + accAt(pos, vel)*dt);
    vec3 npos = pos + vel*dt;
    if(diskCross(pos, npos, vel, col, trans)){
      pos = npos;
      break;
    }
    pos = npos;
  }

  vec3 bgAdd = vec3(0.0);
  if(trans > 0.0){
    float deep = clamp((lastR-1.03)*0.45, 0.45, 1.0);
    col += haloCol * deep;
    bgAdd = trans * background(vel) * deep;
  }

  // Photon ring perigee critical curve
  vec3 ringAdd = vec3(1.0,0.92,0.80) * exp(-pow((minR-1.55)*4.0, 2.0)) * 0.05;

  vec3 outCol = col + bgAdd + ringAdd;

  // Built-in ACES tone mapping + subtle cinematic vignette
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 dir = uv - 0.5;
  float vig = smoothstep(1.35, 0.35, length(dir * vec2(uRes.x / uRes.y, 1.0)));
  outCol = aces(outCol * 1.05) * mix(1.0, vig, 0.45);

  gl_FragColor = vec4(outCol, 1.0);
}
`;

export const COMPOSITE_VERT = /* glsl */`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const COMPOSITE_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main(){
  gl_FragColor = texture2D(tDiffuse, vUv);
}
`;
