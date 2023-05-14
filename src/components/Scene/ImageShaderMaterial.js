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
        uniform sampler2D imgTexture;
        uniform sampler2D shiftTexture;
        vec3 s(vec3 t){
          return vec3((t.r+t.g+t.b)/3.);
        }
        void main() {
            vec2 v=vUv;
            vec2 n=vUv;
            vec3 o=texture2D(shiftTexture,n).rgb;
            float g = 0.;
            vec2 aa=o.rg*(1.-g);
            vec3 f=texture2D(imgTexture,v-.02*aa).rgb;
            f=vec3(texture2D(imgTexture,v-.023*aa).r,f.g,texture2D(imgTexture,v-.017*aa).b);
            f=mix(f,s(f),g);
            gl_FragColor = vec4(f, 1.);
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
