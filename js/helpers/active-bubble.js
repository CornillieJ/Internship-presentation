'use strict';

import * as UTILS from './utils.js';
import { Bubble } from '../data/bubble.js';
import { sideBubbles } from './side-bubbles.js';

let centerBubble, centerSpan;
let activeBubble;
let isAnimating = false;
const animationTime = 0.7;

export function initialize(){
    centerBubble = document.querySelector('.center-bubble');
    if(centerBubble){
        centerSpan = centerBubble.querySelector('.bubble-title');
        centerBubble.addEventListener('click', onBubbleClick);
    }
    sideBubbles.forEach(bubble => {
        bubble.element.addEventListener('click', onBubbleClick);
    });
}

function onBubbleClick(e){
    if(e.target === activeBubble) return;
    if(isAnimating) return;
    isAnimating = true;

    if(activeBubble){
        onActiveBubbleClick({currentTarget: document.querySelector('.overlay')}, false, true);
        setTimeout(() => {
            onBubbleClick(e);
            isAnimating = false;
        }, animationTime * 1100);
        return;
    }

    activeBubble = e.currentTarget;
    if(!activeBubble) activeBubble = e.target;
    activeBubble.classList.remove('inactive-bubble');
    activeBubble.classList.add('activating-bubble');

    const children = activeBubble.querySelectorAll('.bubble-title');
    const splitPanes = activeBubble.querySelectorAll('.split-pane');

    activeBubble.style.animation = `zoom-in ${animationTime}s ease-out`;
    children.forEach(child => {
        child.style.animation = `move-to-top ${animationTime}s ease-out`;
    });
    splitPanes.forEach(p => {
        p.style.animation = `fade-in ${animationTime}s ease-out`;
        p.style.animationFillMode = 'forwards';
    });
    sideBubbles.forEach((bubble, index) => {
        bubble.stopMovement();
        if(bubble.element === activeBubble) return;
        bubble.element.style.animation = `move-to-right ${animationTime}s ease-out`;
        const yPosition = (index + 1) * (100 / (sideBubbles.length + 1));
        bubble.setPosition(75, yPosition);
    });

    setTimeout(() => {
        activeBubble.classList.add('active-bubble');
        activeBubble.classList.remove('activating-bubble');
        centerSpan.classList.add('right');
        sideBubbles.forEach((bubble, index) => {
            bubble.stopMovement();
            if(bubble.element === activeBubble) return;
            bubble.element.classList.add('inactive-bubble');
            bubble.element.style.animation = '';
            bubble.element.style.animation = `move-to-right ${animationTime}s ease-out`;
            const yPosition = (index + 1) * (100 / (sideBubbles.length + 1));
            bubble.setPosition(75, yPosition);
        });
        splitPanes.forEach(p => {
            p.style.animation = '';
            p.classList.remove('hidden');
        });
        clearAnimations();
        isAnimating = false;
    }, animationTime * 1000);

    const divOverlay = document.createElement('div');
    divOverlay.classList.add('overlay');
    document.body.appendChild(divOverlay);
    divOverlay.addEventListener('click', onActiveBubbleClick);
}


function onActiveBubbleClick(e, resetSideBubbles = true, overrideAnimatingCheck = false){
    if(isAnimating && !overrideAnimatingCheck) return;
    isAnimating = true;
    centerSpan.classList.remove('right');
    activeBubble.classList.remove('active-bubble');
    e.currentTarget.remove();
    clearAnimations();
    if(activeBubble === centerBubble)
        activeBubble.style.animation = `zoom-back ${animationTime}s ease-out`;
    else
        activeBubble.style.animation = `zoom-back-side ${animationTime}s ease-out`;
    const splitPanes = activeBubble.querySelectorAll('.split-pane');
    splitPanes.forEach(p => {
        p.classList.add('hidden');
    });

    setTimeout(() => {
        if(!activeBubble) return;
        activeBubble.classList.remove('active-bubble');
        if(resetSideBubbles){
            sideBubbles.forEach((bubble, index) => {
                bubble.element.classList.remove('inactive-bubble');
                bubble.restartMovement();
            });
        }
        clearAnimations();
        activeBubble = null;
        isAnimating = false;
    }, animationTime * 1100);
}

function clearAnimations(){
    const bubbles = document.querySelectorAll('.side-bubble, .center-bubble');
    bubbles.forEach(bubble => {
        bubble.style.animation = '';
        const children = bubble.querySelectorAll('.bubble-title');
        children.forEach(child => {
            child.style.animation = '';
        });
    });
}
