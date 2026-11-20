import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/motion';

const VERTEX = `attribute vec2 position;
varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const FRAGMENT = `precision highp float;
varying vec2 uv;
uniform sampler2D photo;
uniform vec4 imageRect;
uniform float frameRatio;
uniform float time;
uniform vec4 waves[4];
void main(){
 vec2 p=vec2(uv.x,1.-uv.y);
 vec2 aspect=vec2(frameRatio,1.);
 vec2 offset=vec2(0.);float light=0.;
 for(int i=0;i<4;i++){
   float age=max(0.,time-waves[i].z);
   vec2 delta=(p-waves[i].xy)*aspect;
   float d=length(delta);
   float envelope=exp(-abs(d-age*.5)*9.)*exp(-age*1.7)*waves[i].w;
   float wave=sin(d*42.-age*19.)*envelope;
   offset+=normalize(delta+vec2(.0001))*wave*.018/aspect;
   light+=wave*.045;
 }
 vec2 sampleUv=(p+offset-imageRect.xy)/imageRect.zw;
 float mask=step(0.,sampleUv.x)*step(sampleUv.x,1.)*step(0.,sampleUv.y)*step(sampleUv.y,1.);
 gl_FragColor=vec4(texture2D(photo,clamp(sampleUv,0.,1.)).rgb+light,mask);
}`;

/** Paint over the existing image bounds only while ripples are active.
 * The original image remains the accessible, responsive, no-WebGL fallback. */
export default function ImageRipple({ target }: { target: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = canvas.current;
    const parent = el?.parentElement;
    const img = parent?.querySelector<HTMLImageElement>(target);
    if (!el || !parent || !img) return;
    const trigger = parent.closest('.project-strip, .service-strip') || parent;
    let dispose: (() => void) | undefined;
    let pulse: ((event: PointerEvent) => void) | undefined;
    let visible = false;
    let failed = false;
    const stop = () => { dispose?.(); dispose = undefined; pulse = undefined; el.style.opacity = '0'; };
    const start = () => {
      if (pulse || failed || !img.complete || !img.naturalWidth) return;
      const gl = el.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
      if (!gl) { failed = true; return; }
      const shaders: WebGLShader[] = [];
      const program = gl.createProgram()!;
      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type)!;
        shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Ripple unavailable');
        return shader;
      };
      try {
        gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Ripple unavailable');
      } catch {
        shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); failed = true; return;
      }
      gl.useProgram(program);
      const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      const waves = new Float32Array(16);
      const locTime = gl.getUniformLocation(program, 'time');
      const locWaves = gl.getUniformLocation(program, 'waves[0]');
      let frame = 0, until = 0, last = -Infinity, next = 0;
      const size = () => {
        const rect = img.getBoundingClientRect(), bounds = parent.getBoundingClientRect();
        const css = getComputedStyle(img);
        const left = parseFloat(css.paddingLeft) + parseFloat(css.borderLeftWidth);
        const top = parseFloat(css.paddingTop) + parseFloat(css.borderTopWidth);
        const width = rect.width - left - parseFloat(css.paddingRight) - parseFloat(css.borderRightWidth);
        const height = rect.height - top - parseFloat(css.paddingBottom) - parseFloat(css.borderBottomWidth);
        if (width <= 0 || height <= 0) return;
        Object.assign(el.style, { left: `${rect.left - bounds.left - parent.clientLeft + left}px`, top: `${rect.top - bounds.top - parent.clientTop + top}px`, width: `${width}px`, height: `${height}px` });
        el.width = Math.round(width * Math.min(devicePixelRatio, 2));
        el.height = Math.round(height * Math.min(devicePixelRatio, 2));
        gl.viewport(0, 0, el.width, el.height);
        const fit = css.objectFit;
        let scale = fit === 'cover' ? Math.max(width / img.naturalWidth, height / img.naturalHeight) : Math.min(width / img.naturalWidth, height / img.naturalHeight);
        if (fit === 'scale-down') scale = Math.min(1, scale);
        const w = fit === 'fill' ? width : img.naturalWidth * scale;
        const h = fit === 'fill' ? height : img.naturalHeight * scale;
        const [x = '50%', y = '50%'] = css.objectPosition.split(' ');
        const offset = (value: string, space: number) => value.endsWith('%') ? space * parseFloat(value) / 100 : parseFloat(value) || 0;
        gl.uniform4f(gl.getUniformLocation(program, 'imageRect'), offset(x, width - w) / width, offset(y, height - h) / height, w / width, h / height);
        gl.uniform1f(gl.getUniformLocation(program, 'frameRatio'), width / height);
      };
      const draw = () => {
        frame = 0;
        if (!visible || document.hidden || performance.now() > until) { el.style.opacity = '0'; return; }
        gl.uniform1f(locTime, performance.now() / 1000); gl.uniform4fv(locWaves, waves);
        gl.drawArrays(gl.TRIANGLES, 0, 6); el.style.opacity = '1';
        frame = requestAnimationFrame(draw);
      };
      pulse = event => {
        const now = performance.now();
        if (event.type === 'pointermove' && (event.pointerType !== 'mouse' || now - last < 110)) return;
        if (!frame) size();
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return;
        last = now;
        waves.set([x, y, now / 1000, reduce ? .2 : event.type === 'pointermove' ? .45 : 1.2], next * 4);
        next = (next + 1) % 4; until = now + (reduce ? 650 : 2800);
        if (!frame) frame = requestAnimationFrame(draw);
      };
      const resize = new ResizeObserver(() => { size(); el.style.opacity = '0'; }); resize.observe(img);
      dispose = () => {
        cancelAnimationFrame(frame); resize.disconnect();
        gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program); shaders.forEach(s => gl.deleteShader(s));
      };
      size();
    };
    const interact = (event: Event) => {
      if (!visible || document.hidden) return;
      // Reduced motion permits only a brief, gentle response to an explicit press.
      if (reduce && event.type !== 'pointerdown') return;
      start(); pulse?.(event as PointerEvent);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) stop(); });
    observer.observe(parent);
    const lost = () => { failed = true; stop(); };
    const visibility = () => { if (document.hidden) stop(); };
    el.addEventListener('webglcontextlost', lost);
    trigger.addEventListener('pointermove', interact, { passive: true });
    trigger.addEventListener('pointerdown', interact, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    return () => {
      stop(); observer.disconnect();
      el.removeEventListener('webglcontextlost', lost);
      trigger.removeEventListener('pointermove', interact); trigger.removeEventListener('pointerdown', interact);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [target, reduce]);
  return <canvas ref={canvas} className="image-ripple" aria-hidden="true" />;
}
