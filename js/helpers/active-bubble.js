'use strict';

import * as UTILS from '/js/helpers/utils.js';
import { Bubble } from '/js/data/bubble.js';
import { sideBubbles } from '/js/helpers/side-bubbles.js';

let centerBubble;
let activeBubble;
let isAnimating = false;

export function initialize(){
    const foundBubble = document.querySelector('.center-bubble');
    if(foundBubble){
        centerBubble = new Bubble(foundBubble, 50, 50);
        foundBubble.addEventListener('click', onBubbleClick);
    }
    sideBubbles.forEach(bubble => {
        bubble.element.addEventListener('click', onBubbleClick);
    });
}

function onBubbleClick(e){
    const animationTime = 1;
    if(e.target === activeBubble) return;
    if(isAnimating) return;
    isAnimating = true;

    if(activeBubble){
        isAnimating = false;
        onActiveBubbleClick({currentTarget: document.querySelector('.overlay')}, false);
        setTimeout(() => {
            onBubbleClick(e);
            isAnimating = false;
        }, animationTime * 1050);
        return;
    }

    activeBubble = e.currentTarget;
    if(!activeBubble) activeBubble = e.target;
    activeBubble.classList.add('activating-bubble');
    activeBubble.classList.remove('inactive-bubble');

    const children = activeBubble.querySelectorAll('span');
    const Paragraphs = activeBubble.querySelectorAll('p');

    activeBubble.style.animation = `zoom-in ${animationTime}s ease-out`;
    children.forEach(child => {
        child.style.animation = `move-to-top ${animationTime}s ease-out`;
    });
    Paragraphs.forEach(p => {
        p.style.animation = `fade-in ${animationTime}s ease-out`;
        p.style.animationFillMode = 'forwards';
    });
    sideBubbles.forEach((bubble, index) => {
        bubble.stopMovement();
        if(bubble.element === activeBubble) return;
        const yPosition = (index + 1) * (100 / (sideBubbles.length + 1));
        bubble.setPosition(75, yPosition);
        bubble.element.style.animation = `move-to-right ${animationTime}s ease-out`;
    });

    setTimeout(() => {
        activeBubble.classList.add('active-bubble');
        activeBubble.classList.remove('activating-bubble');
        sideBubbles.forEach((bubble, index) => {
            bubble.stopMovement();
            if(bubble.element === activeBubble) return;
            bubble.element.classList.add('inactive-bubble');
            bubble.element.style.animation = '';
            const yPosition = (index + 1) * (100 / (sideBubbles.length + 1));
            bubble.setPosition(75, yPosition);
        });
        Paragraphs.forEach(p => {
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


function onActiveBubbleClick(e, resetSideBubbles = true){
    if(isAnimating) return;
    isAnimating = true;
    const animationTime = 1;
    e.currentTarget.remove();
    clearAnimations();
    activeBubble.style.animation = `zoom-back ${animationTime}s ease-out`;
    const Paragraphs = activeBubble.querySelectorAll('p');
    Paragraphs.forEach(p => {
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
    }, animationTime * 1000);
}

function clearAnimations(){
    const bubbles = document.querySelectorAll('.side-bubble, .center-bubble');
    bubbles.forEach(bubble => {
        bubble.style.animation = '';
        const children = bubble.querySelectorAll('span');
        children.forEach(child => {
            child.style.animation = '';
        });
    });
}
