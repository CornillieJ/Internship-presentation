'use strict';
import { sideBubbles } from './side-bubbles.js';

let canvas, ctx;
let centerNode;

export function initialize() {
    canvas = document.createElement('canvas');
    canvas.id = 'connections-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '4'; // between ripple (2) and bubbles (5)
    canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    centerNode = document.querySelector('.center-bubble');
    
    window.addEventListener('resize', resize);
    resize();
    
    requestAnimationFrame(draw);
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(!centerNode) return requestAnimationFrame(draw);
    
    const centerRect = centerNode.getBoundingClientRect();
    const cx = centerRect.left + centerRect.width / 2;
    const cy = centerRect.top + centerRect.height / 2;
    
    ctx.lineWidth = 2;
    // Draw lines to all side bubbles
    sideBubbles.forEach((bubble, index) => {
        const sideRect = bubble.element.getBoundingClientRect();
        const sx = sideRect.left + sideRect.width / 2;
        const sy = sideRect.top + sideRect.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        
        let gradient = ctx.createLinearGradient(cx, cy, sx, sy);
        // Using neon glowing colors
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.2, 'transparent');
        gradient.addColorStop(0.2, 'rgba(238, 186, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.49)');
        ctx.strokeStyle = gradient;
        ctx.stroke();
    });
    
    requestAnimationFrame(draw);
}