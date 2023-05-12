import { ShaderMaterial } from "three";
import { extend } from "@react-three/fiber";

class ImageShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
        varying vec2 vUv;
        varying vec2 b1;
        varying vec2 c1;
        uniform float sX;
        uniform float sY;
        uniform float wX;
        uniform float wY;
        void main() {
            vec4 a1 = modelViewMatrix * vec4(position.xy, 0., 1.0);
            gl_Position = projectionMatrix * a1;
            vUv = uv;
            b1=(vUv-.5)/vec2(sX, sY)+.5;
            b1.y+=0.;
            c1=(a1.xy/vec2(wX, wY))+.5;
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

          // vec2 v=b1;
          // v.x-=a*.3;
          // v.x+=b*.3;
          // vec2 n=c1;
          // n.y=1.-n.y;
          // vec3 o=texture2D(shiftTexture,n).rgb;
          // vec2 aa=o.rg*(1.-g);
          // vec3 f=texture2D(imgTexture,v-.02*aa).rgb;
          // f=vec3(texture2D(imgTexture,v-.023*aa).r,f.g,texture2D(imgTexture,v-.017*aa).b);
          // f=mix(f,s(f),g);
          // gl_FragColor= vec4(f, 1.);
        }
      `,
      uniforms: {
        imgTexture: {
          value: null,
        },
        shiftTexture: {
          value: null,
        },
        g: {
          value: 0,
        },
        a: {
          value: 0,
        },
        b: {
          value: 0,
        },
        sX: {
          value: 0,
        },
        sY: {
          value: 0,
        },
        wX: {
          value: 0,
        },
        wY: {
          value: 0,
        },
        r: {
          value: 0,
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

  set g(value) {
    this.uniforms.g.value = value;
  }

  get g() {
    return this.uniforms.g.value;
  }

  set a(value) {
    this.uniforms.a.value = value;
  }

  get a() {
    return this.uniforms.a.value;
  }

  set b(value) {
    this.uniforms.b.value = value;
  }

  get b() {
    return this.uniforms.b.value;
  }

  set sX(value) {
    this.uniforms.sX.value = value;
  }

  get sX() {
    return this.uniforms.sX.value;
  }

  set sY(value) {
    this.uniforms.sY.value = value;
  }

  get sY() {
    return this.uniforms.sY.value;
  }

  set wX(value) {
    this.uniforms.wX.value = value;
  }

  get wX() {
    return this.uniforms.wX.value;
  }

  set wY(value) {
    this.uniforms.wY.value = value;
  }

  get wY() {
    return this.uniforms.wY.value;
  }

  set r(value) {
    this.uniforms.r.value = value;
  }

  get r() {
    return this.uniforms.r.value;
  }
}

extend({ ImageShaderMaterial });
