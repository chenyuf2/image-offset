import { useTexture } from "@react-three/drei";
import "./ImageShaderMaterial";
import img from "images/img.jpg";
import * as THREE from "three";
import { useCallback, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { clamp } from "three/src/math/MathUtils";
const ratio = 1.75;
const imageHeight = 3.008 * ratio;
const imageWidth = 2 * ratio;
const width = 15;
const height = 24;
const relaxation = 0.9;
const strength = 0.9;
const Scene = () => {
  const meshRef = useRef();
  const mouseRef = useRef({
    x: 0,
    y: 0,
    diffX: 0,
    diffY: 0,
  });
  const [texture] = useTexture([img]);
  const gridUnitWidth = imageWidth / width;
  const gridUnitHeight = imageHeight / height;
  const shiftTexture = generateShiftTexture();

  const { viewport, size } = useThree();

  const mouseOnMove = useCallback(
    (e) => {
      const canvasWidth = size.width;
      const canvasHeight = size.height;
      const mouseX =
        ((e.clientX - canvasWidth / 2) * (viewport.width / 2)) /
        (canvasWidth / 2);
      const mouseY =
        ((canvasHeight / 2 - e.clientY) * (viewport.height / 2)) /
        (canvasHeight / 2);
      mouseRef.current.diffX = mouseX - mouseRef.current.x;
      mouseRef.current.diffY = mouseY - mouseRef.current.y;
      mouseRef.current.x = mouseX;
      mouseRef.current.y = mouseY;
    },
    [size.height, size.width, viewport.height, viewport.width]
  );

  useEffect(() => {
    window.addEventListener("mousemove", mouseOnMove);
    return () => {
      window.removeEventListener("mousemove", mouseOnMove);
    };
  }, [mouseOnMove]);

  function generateShiftTexture() {
    const size = width * height;
    const data = new Float32Array(4 * size).fill(0);
    // used the buffer to create a DataTexture
    const shiftTexture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    shiftTexture.needsUpdate = true;
    return shiftTexture;
  }

  useFrame(() => {
    const shiftTextureData =
      meshRef.current.material.uniforms.shiftTexture.value.image.data;
    for (let i = 0; i < shiftTextureData.length; i += 4) {
      shiftTextureData[i] *= relaxation;
      shiftTextureData[i + 1] *= relaxation;
    }

    const { x, y, diffX, diffY } = mouseRef.current;
    const mouseGridX = Math.floor((x + imageWidth / 2) / gridUnitWidth);
    const mouseGridY = Math.floor((y + imageHeight / 2) / gridUnitHeight);
    if (
      !(
        x < -imageWidth / 2 ||
        x > imageWidth / 2 ||
        y < -imageHeight / 2 ||
        y > imageHeight / 2
      )
    ) {
      const maxDist = 8;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const distance = (mouseGridX - i) ** 2 + (mouseGridY - j) ** 2;
          const maxDistSq = maxDist ** 2;
          if (distance < maxDistSq) {
            const index = 4 * (i + width * j);

            let power = maxDist / Math.sqrt(distance);
            power = clamp(power, 0, 10);

            shiftTextureData[index] += strength * 1.5 * diffX * power;
            shiftTextureData[index + 1] += strength * 1.5 * diffY * power;
          }
        }
      }
    }

    mouseRef.current.diffX *= 0.9;
    mouseRef.current.diffY *= 0.9;
    meshRef.current.material.uniforms.shiftTexture.value.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[imageWidth, imageHeight, 1, 1]} />
      <imageShaderMaterial
        imgTexture={texture}
        shiftTexture={shiftTexture}
        progress={0}
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
