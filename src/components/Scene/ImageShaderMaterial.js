import { ShaderMaterial } from "three";
import { extend } from "@react-three/fiber";

class ImageShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
        varying vec2 vUv;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, 0., 1.0);
            vUv = uv;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec2 b1;
        varying vec2 c1;
        uniform sampler2D imgTexture;
        uniform sampler2D shiftTexture;
        uniform float g;
        uniform float a;
        uniform float b;
        vec3 s(vec3 t){
          return vec3((t.r+t.g+t.b)/3.);
        }
        void main() {
            vec4 texShift=texture2D(shiftTexture,vUv);
            gl_FragColor=texture2D(imgTexture, vUv - .02 * texShift.rg);
            // gl_FragColor=texture2D(shiftTexture, vUv);
        }
      `,
      uniforms: {
        imgTexture: {
          value: null,
        },
        shiftTexture: {
          value: null,
        },
      },
    });
  }

  set imgTexture(value) {
    this.uniforms.imgTexture.value = value;
  }

  get imgTexture() {
    return this.uniforms.imgTexture.value;
  }

  set shiftTexture(value) {
    this.uniforms.shiftTexture.value = value;
  }

  get shiftTexture() {
    return this.uniforms.shiftTexture.value;
  }
}

extend({ ImageShaderMaterial });
