import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import PopupModal from '@/components/UI/Modal/PopupModal';
import Shape, { type ShapeType } from '@/components/BackgroundImage/Shape';
import { changeModal } from '@/lib/context';
import { useAppContext } from '@/lib/hooks';

const MarkerFlowers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAnimationComplete, setIsModalAnimationComplete] = useState(false);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !isModalAnimationComplete) return;
    
    const canvas = canvasRef.current
    const pointer = {
      x: 0.66,
      y: 0.3,
      clicked: false,
      vanishCanvas: false,
    };

    let renderer: THREE.WebGLRenderer;
    let sceneShader: THREE.Scene;
    let sceneBasic: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let clock: THREE.Clock;
    let renderTargets: THREE.WebGLRenderTarget[];
    let shaderMaterial: THREE.ShaderMaterial;
    let basicMaterial: THREE.MeshBasicMaterial;

    const init = () => {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      sceneShader = new THREE.Scene();
      sceneBasic = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
      clock = new THREE.Clock();

      renderTargets = [
        new THREE.WebGLRenderTarget(containerRef.current!.clientWidth, containerRef.current!.clientHeight),
        new THREE.WebGLRenderTarget(containerRef.current!.clientWidth, containerRef.current!.clientHeight),
      ];

      createPlane();
      updateSize();
    };

    const createPlane = () => {
      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          u_stop_time: { value: 0 },
          u_stop_randomizer: { value: new THREE.Vector2(Math.random(), Math.random()) },
          u_cursor: { value: new THREE.Vector2(pointer.x, pointer.y) },
          u_ratio: { value: containerRef.current!.clientWidth / containerRef.current!.clientHeight },
          u_texture: { value: null },
          u_clean: { value: 1 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      basicMaterial = new THREE.MeshBasicMaterial();
      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
      const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);
      sceneBasic.add(planeBasic);
      sceneShader.add(planeShader);
    };

    const updateSize = () => {
      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;
      
      if (shaderMaterial && shaderMaterial.uniforms) {
        shaderMaterial.uniforms.u_ratio.value = width / height;
      }
      renderer.setSize(width, height);
      renderTargets.forEach(rt => rt.setSize(width, height));
    };

    const cleanCanvas = () => {
      pointer.vanishCanvas = true;
      setTimeout(() => {
        pointer.vanishCanvas = false;
      }, 50);
    };

    const render = () => {
      if (shaderMaterial && shaderMaterial.uniforms) {
        shaderMaterial.uniforms.u_clean.value = pointer.vanishCanvas ? 0 : 1;
        shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;

        if (pointer.clicked) {
          shaderMaterial.uniforms.u_cursor.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
          shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector2(Math.random(), Math.random());
          shaderMaterial.uniforms.u_stop_time.value = 0;
          pointer.clicked = false;
        }
        shaderMaterial.uniforms.u_stop_time.value += clock.getDelta();
      }

      renderer.setRenderTarget(renderTargets[1]);
      renderer.render(sceneShader, camera);
      if (basicMaterial) {
        basicMaterial.map = renderTargets[1].texture;
      }
      renderer.setRenderTarget(null);
      renderer.render(sceneBasic, camera);

      let tmp = renderTargets[0];
      renderTargets[0] = renderTargets[1];
      renderTargets[1] = tmp;

      requestAnimationFrame(render);
    };

    const handleResize = () => {
      updateSize();
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.clicked = true;
    };

    init();
    render();

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('click', handleClick); 

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [isModalAnimationComplete]);

  const shape: ShapeType = {
    type: 'polygon',
    onClick: () => {
      dispatch(changeModal({name: "flowers"}));
      setIsModalOpen(true);
    },
    title: 'flowers',
    points: "732.627 1324.85 901.105 1327.41 903.658 1067.03 888.342 1031.29 903.658 931.738 916.422 867.92 964.923 829.63 941.949 778.576 783.681 804.103 765.812 635.624 770.917 556.49 650.94 668.809 597.333 939.396 681.573 1018.53 684.125 1207.43",
  };

  const handleCleanCanvas = () => {
    if (canvasRef.current) {
      const event = new Event('cleanCanvas');
      canvasRef.current.dispatchEvent(event);
    }
  };

  return (
    <>
      <PopupModal 
        name="flowers" 
        handleClose={() => {
          setIsModalOpen(false);
          setIsModalAnimationComplete(false);
        }}
        onAnimationComplete={() => setIsModalAnimationComplete(true)}
      >
        <div ref={containerRef} className="top-0 left-0 w-full h-screen flex flex-col-reverse items-start">
          <canvas ref={canvasRef} />
        </div>
      </PopupModal>
      <Shape shape={shape} index="flowers" />
    </>
  );
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.);
  }
`;

const fragmentShader = `
  #define PI 3.14159265359

  uniform float u_ratio;
  uniform vec2 u_cursor;
  uniform float u_stop_time;
  uniform float u_clean;
  uniform vec2 u_stop_randomizer;

  uniform sampler2D u_texture;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float get_flower_shape(vec2 _p, float _pet_n, float _angle, float _outline) {
    _angle *= 3.;

    _p = vec2(_p.x * cos(_angle) - _p.y * sin(_angle),
    _p.x * sin(_angle) + _p.y * cos(_angle));

    float a = atan(_p.y, _p.x);

    float flower_sectoral_shape = pow(abs(sin(a * _pet_n)), .4) + .25;

    vec2 flower_size_range = vec2(.03, .1);
    float size = flower_size_range[0] + u_stop_randomizer[0] * flower_size_range[1];

    float flower_radial_shape = pow(length(_p) / size, 2.);
    flower_radial_shape -= .1 * sin(8. * a);
    flower_radial_shape = max(.1, flower_radial_shape);
    flower_radial_shape += smoothstep(0., 0.03, -_p.y + .2 * abs(_p.x));

    float grow_time = step(.25, u_stop_time) * pow(u_stop_time, .3);
    float flower_shape = 1. - smoothstep(0., flower_sectoral_shape, _outline * flower_radial_shape / grow_time);

    flower_shape *= (1. - step(1., grow_time));

    return flower_shape;
  }

  float get_stem_shape(vec2 _p, vec2 _uv, float _w, float _angle) {
    _w = max(.004, _w);
     
    float x_offset = _p.y * sin(_angle);
    x_offset *= pow(3. * _uv.y, 2.);
    _p.x -= x_offset;

    float noise_power = .5;
    float cursor_horizontal_noise = noise_power * snoise(2. * _uv * u_stop_randomizer[0]);
    cursor_horizontal_noise *= pow(dot(_p.y, _p.y), .6);
    cursor_horizontal_noise *= pow(dot(_uv.y, _uv.y), .3);
    _p.x += cursor_horizontal_noise;

    float left = smoothstep(-_w, 0., _p.x);
    float right = 1. - smoothstep(0., _w, _p.x);
    float stem_shape = left * right;

    float grow_time = 1. - smoothstep(0., .2, u_stop_time);
    float stem_top_mask = smoothstep(0., pow(grow_time, .5), .03 -_p.y);
    stem_shape *= stem_top_mask;

    stem_shape *= (1. - step(.17, u_stop_time));

    return stem_shape;
  }

  void main() {
    vec3 base = texture2D(u_texture, vUv).xyz;

    vec2 uv = vUv;
    uv.x *= u_ratio;
    vec2 cursor = vUv - u_cursor.xy;
    cursor.x *= u_ratio;
    
    vec3 stem_color = vec3(.1 + u_stop_randomizer[0] * .6, .6, .2);
    vec3 flower_color = vec3(.6 + .5 * u_stop_randomizer[1], .1, .9 - .5 * u_stop_randomizer[1]);

    float angle = .5 * (u_stop_randomizer[0] - .5);

    float stem_shape = get_stem_shape(cursor, uv, .003, angle);
    stem_shape += get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .003, angle);
    float stem_mask = 1. - get_stem_shape(cursor, uv, .004, angle);
    stem_mask -= get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .004, angle);

    float petals_back_number = 1. + floor(u_stop_randomizer[0] * 2.);
    float angle_offset = -(2. * step(0., angle) - 1.) * .1 * u_stop_time;
    float flower_back_shape = get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.5);
    float flower_back_mask = 1. - get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.6);

    float petals_front_number = 2. + floor(u_stop_randomizer[1] * 2.);
    float flower_front_shape = get_flower_shape(cursor, petals_front_number, angle, 1.);
    float flower_front_mask = 1. - get_flower_shape(cursor, petals_front_number, angle, .95);

    vec3 color = base;
    color *= stem_mask;
    color *= flower_back_mask;
    color *= flower_front_mask;

    color += (stem_shape * stem_color);

    color += (flower_back_shape * (flower_color + vec3(0., .8 * u_stop_time, 0.)));
    color += (flower_front_shape * flower_color);

    color.r *= 1. - (.5 * flower_back_shape * flower_front_shape);
    color.b *= 1. - (flower_back_shape * flower_front_shape);

    color *= u_clean;

    gl_FragColor = vec4(color, 1.);
  }
`;

export default MarkerFlowers;