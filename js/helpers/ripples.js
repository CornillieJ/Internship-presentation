import * as BACKGROUND from './background-bubbles.js';

const rippleSettings = {
  maxSize: 300,
  maxSizeInPercentage: 0.3,
  animationSpeed: 0.8,
  strokeColor: [250,250,250],
  startOpacity: 0.6,
  maxOpacityForMouseAvoidance: 0.4,
};

const canvasSettings = {
  blur: 8,
  ratio: 1,
};

function Coords(x, y) {
  this.x = x || null;
  this.y = y || null;
}

const Ripple = function Ripple(x, y, circleSize, ctx) {
  this.position = new Coords(x, y);
  this.circleSize = circleSize;
  this.maxSize = rippleSettings.maxSize;
  this.opacity = rippleSettings.startOpacity;
  this.ctx = ctx;
  this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
    ${Math.floor(rippleSettings.strokeColor[1])},
    ${Math.floor(rippleSettings.strokeColor[2])},
    ${this.opacity})`;

  this.animationSpeed = rippleSettings.animationSpeed;
  this.opacityStep = (this.animationSpeed / (this.maxSize - circleSize)) / 2;
};

Ripple.prototype = {
  update: function update() {
    this.circleSize = this.circleSize + this.animationSpeed;
    this.opacity = this.opacity - this.opacityStep;
    this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
      ${Math.floor(rippleSettings.strokeColor[1])},
      ${Math.floor(rippleSettings.strokeColor[2])},
      ${this.opacity})`;
    if(this.opacity >= rippleSettings.maxOpacityForMouseAvoidance && frameCount % 2 === 0){
      BACKGROUND.avoidPosition(this.position.x, this.position.y, this.circleSize);
    }
  },
  draw: function draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.arc(this.position.x, this.position.y, this.circleSize, 0,
      2 * Math.PI);
    this.ctx.stroke();
  },
  setStatus: function setStatus(status) {
    this.status = status;
  },
};

let animationFrame;
let canvas;
let ctx;
let ripples = [];
let currentCircleSize = 0;
let frameCount = 0;

export function initialize() {
  canvas = document.querySelector('#ripple-canvas');
  ctx = canvas.getContext('2d');
  ripples = [];

  const height = window.innerHeight;
  const width = window.innerWidth;
  rippleSettings.maxSize = Math.min(width, height) * rippleSettings.maxSizeInPercentage;
  const rippleStartStatus = 'start';
  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  canvas.style.filter = `blur(${canvasSettings.blur}px)`;
  canvas.width = width * canvasSettings.ratio;
  canvas.height = height * canvasSettings.ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  animation();
  window.addEventListener('mousemove', canvasMouseOver);
  window.addEventListener('resize', ()=>{
      const height = window.innerHeight;
      const width = window.innerWidth;
      canvas.width = width * canvasSettings.ratio;
      canvas.height = height * canvasSettings.ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
  });
}

// Function which is executed on mouse hover on canvas
const canvasMouseOver = (e) => {
  const x = e.clientX * canvasSettings.ratio;
  const y = e.clientY * canvasSettings.ratio;
  ripples.unshift(new Ripple(x, y, 1, ctx));
};

const animation = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const length = ripples.length;
  for (let i = length - 1; i >= 0; i -= 1) {
    const r = ripples[i];

    r.update();
    r.draw();

    if (r.opacity <= 0) {
      ripples[i] = null;
      delete ripples[i];
      ripples.pop();
    }
  }
  frameCount++;
  if(frameCount > 10000) frameCount = 0;
  animationFrame = window.requestAnimationFrame(animation);
};