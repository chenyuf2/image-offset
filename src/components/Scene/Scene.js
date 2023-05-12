import { useTexture } from "@react-three/drei";
import "./ImageShaderMaterial";
import img from "images/img.jpg";
import * as THREE from "three";
import { useControls } from "leva";
import { useRef } from "react";
const ratio = 1.75;
const imageHeight = 3.008 * ratio;
const imageWidth = 2 * ratio;
const Scene = () => {
  const width = 10;
  const height = 16;
  const meshRef = useRef();
  const { g, a, b, sX, sY, wX, wY, r } = useControls({
    g: {
      value: 0,
      max: 1,
      min: 0,
      step: 0.01,
    },
    a: {
      value: 0,
      max: 1,
      min: 0,
      step: 0.01,
    },
    b: {
      value: 0,
      max: 1,
      min: 0,
      step: 0.01,
    },
    sX: {
      value: 1,
      max: 30,
      min: 0,
      step: 0.1,
    },
    sY: {
      value: 1,
      max: 30,
      min: 0,
      step: 0.1,
    },
    wX: {
      value: 1,
      max: 30,
      min: 0,
      step: 0.1,
    },
    wY: {
      value: 1,
      max: 30,
      min: 0,
      step: 0.1,
    },
    r: {
      value: 0,
      max: 1,
      min: 0,
      step: 0.01,
    },
  });
  const [texture] = useTexture([img]);

  const size = width * height;
  const data = new Uint8Array(4 * size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    data[stride] = Math.floor(Math.random() * 255);
    data[stride + 1] = Math.floor(Math.random() * 255);
    data[stride + 2] = Math.floor(Math.random() * 255);
    data[stride + 3] = 255;
  }

  // used the buffer to create a DataTexture
  const shiftTexture = new THREE.DataTexture(data, width, height);
  shiftTexture.needsUpdate = true;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[imageWidth, imageHeight, 512, 512]} />
      <imageShaderMaterial
        imgTexture={texture}
        shiftTexture={shiftTexture}
        g={g}
        a={a}
        b={b}
        sX={sX}
        sY={sY}
        wX={wX}
        wY={wY}
        r={r}
      />
    </mesh>
  );
};

export default Scene;

// const vertex = 'precision highp float;
// attribute vec2 p;
// attribute vec2 u;
// uniform mat4 e;
// uniform mat4 f;
// uniform vec2 s;
// uniform vec2 w;
// uniform float r;
// varying vec2 b;
// varying vec2 c;
// void main(){
//   vec4 a=f*vec4(p.x,p.y,0.,1);
//   gl_Position=e*a;
//   b=(u-.5)/s+.5;
//   b.y+=r;
//   c=(a.xy/w)+.5;
// }',

// fragment = `#extension GL_OES_standard_derivatives: enable
// precision highp float;
// uniform sampler2D d;
// uniform sampler2D i;
// varying vec2 b;
// varying vec2 c;
// uniform int t;
// uniform int h;
// uniform vec4 m;
// uniform vec2 q;
// uniform float j;
// uniform float g;
// vec3 s(vec3 t){
//   return vec3((t.r+t.g+t.b)/3.);
// }
// void main(){
//   vec3 f;
//   float l=1.;
//   vec3 w=vec3(.10196);
//   if(t==2){
//     vec2 v=b;
//     v.x-=q.x*.3;
//     v.x+=q.y*.3;
//     f=texture2D(d,v).rgb;
//     float e=max(min(f.r,f.g),min(max(f.r,f.g),f.b))-.5;
//     float k=fwidth(e);
//     l=smoothstep(-k,k,e);
//     l*=step(j,1.-b.y);
//      f=w;
//   }
//   else if(t==1){
//     vec2 v=b;
//     v.x-=q.x*.3;
//     v.x+=q.y*.3;
//     vec2 n=c;
//     n.y=1.-n.y;
//     vec3 o=texture2D(i,n).rgb;
//     vec2 aa=o.rg*(1.-g);
//     f=texture2D(d,v-.02*aa).rgb;
//     f=vec3(texture2D(d,v-.023*aa).r,f.g,texture2D(d,v-.017*aa).b);
//     f=mix(f,s(f),g);
//     l=step(q.x,b.x)*step(q.y,1.-b.x);
//   }else{
//     f = w;
//   }
//   float r=step(m.x,c.x)*step(m.y,1.-c.x);
//   float p=step(m.w,c.y)*step(m.z,1.-c.y);
//   float n=h==1?2.-(r+p):r*p;
//   gl_FragColor=vec4(f,n*l);}
// `;
