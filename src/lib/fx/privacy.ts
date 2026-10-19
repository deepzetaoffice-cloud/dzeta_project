import { effectsOn, onEffectsChange, pointerFine } from '@/lib/fx/motion';

// The privacy page's scene (privacy.md; 13 §4.4).
// - The contents mark the section being read (aria-current="location"), in both lists. Always on.
// - drape: the hero's pleats on a small WebGL canvas (no library), pushed by a fine pointer like cloth,
//   then settling. Only while effects are on and WebGL is there; it draws only while the pleats move,
//   so a still page costs nothing, and nothing plays by itself. The CSS pleats rest underneath.

type Stop = () => void;

function contents(): Stop {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-legal-section]')];
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  if (sections.length === 0 || links.length === 0) return () => {};
  const mark = (id: string) => {
    for (const link of links) {
      if (link.dataset.tocLink === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      const seen = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);
      if (seen[0]) mark(seen[0]);
    },
    { rootMargin: '-25% 0px -65% 0px' },
  );
  for (const section of sections) observer.observe(section);
  return () => {
    observer.disconnect();
    for (const link of links) link.removeAttribute('aria-current');
  };
}

const VERTEX = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Vertical pleats one `period` apart (white into violet soft, as the CSS draws them); the pointer bends
// them sideways with a ripple that fades as `push` decays
const FRAGMENT = `precision mediump float;
uniform vec2 size;uniform vec2 pointer;uniform float push;uniform float time;uniform float period;
uniform vec3 light;uniform vec3 deep;
void main(){
  vec2 at=gl_FragCoord.xy;
  float d=distance(at,pointer);
  float bend=push*28.*exp(-d*d/52000.)*sin(time*5.-d/34.);
  float sway=push*6.*sin(at.y/90.+time*2.);
  float x=at.x+bend+sway;
  float shade=.5-.5*cos(6.28318*x/period);
  gl_FragColor=vec4(mix(light,deep,shade),1.);
}`;

// A colour token as three 0–1 channels, read through the browser so the canvas paints the token
function channels(variable: string, host: HTMLElement): [number, number, number] {
  const probe = document.createElement('span');
  probe.style.color = `var(${variable})`;
  host.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  const [r = 255, g = 255, b = 255] = (value.match(/[\d.]+/g) ?? []).map(Number);
  return [r / 255, g / 255, b / 255];
}

function drape(): Stop {
  const host = document.querySelector<HTMLElement>('.dz-drape');
  const canvas = host?.querySelector<HTMLCanvasElement>('.dz-drape-canvas');
  if (!host || !canvas || !effectsOn() || !pointerFine()) return () => {};
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl || gl.isContextLost()) return () => {};

  const shader = (type: number, source: string) => {
    const made = gl.createShader(type);
    if (!made) return null;
    gl.shaderSource(made, source);
    gl.compileShader(made);
    return gl.getShaderParameter(made, gl.COMPILE_STATUS) ? made : null;
  };
  const vertex = shader(gl.VERTEX_SHADER, VERTEX);
  const fragment = shader(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return () => {};
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const u = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform3fv(u('light'), channels('--dz-color-bg-surface', host));
  gl.uniform3fv(u('deep'), channels('--dz-color-bg-violet-soft', host));

  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  let push = 0;
  let time = 0;
  let last = 0;
  let frame = 0;
  let pointer = [0, 0];

  const draw = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u('size'), canvas.width, canvas.height);
    gl.uniform2f(u('pointer'), pointer[0] ?? 0, pointer[1] ?? 0);
    gl.uniform1f(u('push'), push);
    gl.uniform1f(u('time'), time);
    gl.uniform1f(u('period'), 3 * rootSize * ratio);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const loop = (now: number) => {
    time += Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    push *= 0.95;
    draw();
    if (push > 0.01) frame = requestAnimationFrame(loop);
    else {
      push = 0;
      last = 0;
      frame = 0;
      draw();
    }
  };
  const resize = () => {
    canvas.width = Math.round(host.clientWidth * ratio);
    canvas.height = Math.round(host.clientHeight * ratio);
    draw();
  };
  const move = (event: PointerEvent) => {
    const box = host.getBoundingClientRect();
    pointer = [(event.clientX - box.left) * ratio, (box.bottom - event.clientY) * ratio];
    push = Math.min(1, push + 0.12);
    if (!frame) frame = requestAnimationFrame(loop);
  };

  const sizes = new ResizeObserver(resize);
  sizes.observe(host);
  resize();
  canvas.hidden = false;
  host.addEventListener('pointermove', move, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    sizes.disconnect();
    host.removeEventListener('pointermove', move);
    canvas.hidden = true;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

export function start(): Stop {
  const stopContents = contents();
  let stopDrape: Stop = () => {};
  const run = (on: boolean) => {
    stopDrape();
    stopDrape = on ? drape() : () => {};
  };
  run(effectsOn());
  const stopWatching = onEffectsChange(run);
  return () => {
    stopWatching();
    stopDrape();
    stopContents();
  };
}
