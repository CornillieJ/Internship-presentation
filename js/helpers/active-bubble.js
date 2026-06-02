'use strict';

import * as UTILS from './utils.js';
import { Bubble } from '../data/bubble.js';
import { sideBubbles } from './side-bubbles.js';

let centerBubble, centerSpan;
let activeBubble;
let isAnimating = false;
const animationTime = 0.5;

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
    const foundBubble = sideBubbles.find(b => b.element === activeBubble);
    if(foundBubble) foundBubble.stopMovement(true);
    if(!activeBubble) activeBubble = e.target;
    activeBubble.classList.remove('inactive-bubble-left');
    activeBubble.classList.remove('inactive-bubble-right');
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
    animateSideBubbles();

    setTimeout(() => {
        activeBubble.classList.add('active-bubble');
        activeBubble.classList.remove('activating-bubble');
        centerSpan.classList.add('right');
        animateSideBubbles();
        
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
        activeBubble.style.animation = `zoom-back ${animationTime}s ease-out`;
    const splitPanes = activeBubble.querySelectorAll('.split-pane');
    splitPanes.forEach(p => {
        p.classList.add('hidden');
    });

    setTimeout(() => {
        if(!activeBubble) return;
        activeBubble.classList.remove('active-bubble');
        if(resetSideBubbles){
            sideBubbles.forEach((bubble, index) => {
                bubble.element.classList.remove('inactive-bubble-left');
                bubble.element.classList.remove('inactive-bubble-right');
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

function animateSideBubbles(){
    const amountPerSide = Math.ceil(sideBubbles.length / 2);
    const margin = 20;
    const sectionHeight = (100 - margin * 2) / amountPerSide;
    sideBubbles.forEach((bubble, index) => {
            //rearrange index so last is first
            bubble.stopMovement(true);
            if(bubble.element === activeBubble) return;
            bubble.element.style.animation = '';
            let yPosition = (index % amountPerSide) * sectionHeight + margin;
            const xPosition = (index / amountPerSide) >= 1 ? 20 : 80;
            // yPosition = 
            if(xPosition > 50){
                bubble.element.style.animation = `move-to-right ${animationTime}s ease-out`;
                bubble.element.classList.add('inactive-bubble-right');
            }
            else{
                bubble.element.style.animation = `move-to-left ${animationTime}s ease-out`;
                bubble.element.classList.add('inactive-bubble-left');
            }

            bubble.setPosition(xPosition, yPosition);
        });
}