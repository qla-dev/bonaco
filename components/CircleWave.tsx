import { useEffect, useId, useRef, useState } from 'react';
import { asset } from '../lib/asset';
import { useLang } from '../lib/i18n';
import { useReducedMotion } from '../lib/motion';

const CIRCLES = [[126, 220, 116], [402, 176, 148], [744, 208, 180], [1062, 228, 120]];
const VERTEX = `attribute vec2 position;
varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const FRAGMENT = `precision highp float;
varying vec2 uv;
uniform sampler2D photo;
uniform vec2 crop;
uniform float focus;
uniform float single;
uniform float mosaic;
uniform float contain;
uniform float time;
uniform vec4 waves[4];
float circle(vec2 p,vec2 center,float r){return 1.-smoothstep(r-1.5,r+1.5,length(p-center));}
void main(){
 vec2 p=vec2(uv.x,1.-uv.y);
 vec2 px=p*vec2(1200.,400.);
 float mask=max(max(circle(px,vec2(126.,220.),116.),circle(px,vec2(402.,176.),148.)),max(circle(px,vec2(744.,208.),180.),circle(px,vec2(1062.,228.),120.)));
 if(single>.5) mask=1.-smoothstep(.497,.5,length(p-vec2(.5)));
 if(mosaic>.5) mask=1.;
 vec2 aspect=vec2(mix(mix(3.,1.,single),4./3.,mosaic),1.);
 vec2 offset=vec2(0.);float light=0.;
 for(int i=0;i<4;i++){
   float age=time-waves[i].z;
   vec2 delta=(p-waves[i].xy)*aspect;
   float d=length(delta);
   float envelope=exp(-abs(d-age*.5)*9.)*exp(-age*1.7)*waves[i].w;
   float wave=sin(d*42.-age*19.)*envelope;
   offset+=normalize(delta+vec2(.0001))*wave*.018/aspect;
   light+=wave*.055;
 }
 vec2 sampleUv=(p+offset)*crop+vec2((1.-crop.x)*.5,(1.-crop.y)*mix(focus,.5,contain));
 if(contain>.5 && (sampleUv.x<0. || sampleUv.x>1. || sampleUv.y<0. || sampleUv.y>1.)) mask=0.;
 vec3 color=texture2D(photo,clamp(sampleUv,0.,1.)).rgb+light;
 gl_FragColor=vec4(color,mask);
}`;

export default function CircleWave({ src, name, focus = .5, single = false, mosaic = false, passive = false, contain = false }: { src: string; name: string; focus?: number; single?: boolean; mosaic?: boolean; passive?: boolean; contain?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const activate = useRef<(x: number, y: number, power: number) => void>(() => {});
  const [ready, setReady] = useState(false);
  const maskId = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const { t } = useLang();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setReady(false);
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return;
    let dead = false, visible = false, frame = 0, next = 0, lastEvent = 0;
    let imageReady = false, activeUntil = 0;
    const waves = new Float32Array(16);
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Wave shader unavailable');
      return shader;
    };
    const program = gl.createProgram()!;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Wave renderer unavailable');
    } catch {
      shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); return;
    }
    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program,'single'),single?1:0);
    gl.uniform1f(gl.getUniformLocation(program,'mosaic'),mosaic?1:0);
    gl.uniform1f(gl.getUniformLocation(program,'contain'),contain?1:0);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const locTime = gl.getUniformLocation(program, 'time');
    const locWaves = gl.getUniformLocation(program, 'waves[0]');
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const draw = () => {
      frame = 0;
      if (dead || !imageReady || !visible || document.hidden) return;
      gl.uniform1f(locTime,performance.now()/1000);
      gl.uniform4fv(locWaves,waves);
      gl.drawArrays(gl.TRIANGLES,0,6);
      if (performance.now() < activeUntil) frame=requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame && !dead) frame=requestAnimationFrame(draw); };
    const size = () => {
      const dpr = Math.min(devicePixelRatio,2);
      el.width=Math.round(el.clientWidth*dpr); el.height=Math.round(el.clientHeight*dpr);
      gl.viewport(0,0,el.width,el.height); schedule();
    };
    const image = new Image();
    image.onload = () => {
      if (dead) return;
      gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      const ratio=image.naturalWidth/image.naturalHeight;
      const fit = contain ? Math.max : Math.min;
      gl.uniform2f(gl.getUniformLocation(program,'crop'),fit(1,(mosaic?4/3:single?1:3)/ratio),fit(1,ratio/(mosaic?4/3:single?1:3)));
      gl.uniform1f(gl.getUniformLocation(program,'focus'),focus);
      imageReady=true; setReady(true); size();
    };
    image.src=asset(src);
    const ro=new ResizeObserver(size); ro.observe(el);
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;} });
    io.observe(el);
    const visibility = () => { if (!document.hidden) schedule(); };
    document.addEventListener('visibilitychange',visibility);
    activate.current=(x,y,power)=>{
      const now=performance.now();
      if(power<1 && now-lastEvent<110)return;
      lastEvent=now;
      waves.set([x,y,now/1000,power*(reduce?.35:1)],next*4);next=(next+1)%4;
      activeUntil=now+(reduce?900:2800);schedule();
    };
    const lost = (event: Event) => {event.preventDefault();setReady(false);cancelAnimationFrame(frame);};
    el.addEventListener('webglcontextlost',lost);
    return()=>{
      dead=true;activate.current=()=>{};cancelAnimationFrame(frame);ro.disconnect();io.disconnect();
      image.onload=null;document.removeEventListener('visibilitychange',visibility);el.removeEventListener('webglcontextlost',lost);
      gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  },[src,focus,reduce,single,mosaic,contain,inView]);
  return <div ref={host} className={`circle-wave${single?' circle-wave-single':''}${mosaic?' circle-wave-mosaic':''}`} role={passive ? undefined : 'button'} tabIndex={passive ? undefined : 0}
    aria-hidden={passive || undefined} aria-label={passive ? undefined : t(`${name}. Klikni ili dodirni za valove.`, `${name}. Click or touch to make waves.`)}
    onPointerDown={e=>{const r=e.currentTarget.getBoundingClientRect();activate.current((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height,1.5);}}
    onPointerMove={e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();activate.current((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height,e.buttons?1.2:.35);}}
    onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate.current(.5,.5,1.5);}}}>
    {single || mosaic ? <img src={asset(src)} alt="" className="circle-wave-photo" style={{objectFit:contain?'contain':'cover',objectPosition:contain?'50% 50%':`50% ${focus*100}%`}} loading="lazy"/> : <svg viewBox="0 0 1200 400" aria-hidden="true" className="circle-wave-fallback">
      <defs><clipPath id={maskId}>{CIRCLES.map(([cx,cy,r])=><circle key={cx} cx={cx} cy={cy} r={r}/>)}</clipPath></defs>
      <image href={asset(src)} width="1200" height="400" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${maskId})`} />
    </svg>}
    {inView && <canvas key={contain?'contain':'cover'} ref={canvas} aria-hidden="true" className={ready?'is-ready':''} />}
  </div>;
}
