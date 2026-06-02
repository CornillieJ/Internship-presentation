'use strict';

import * as UTILS from './utils.js';
import { Bubble } from '../data/bubble.js';

export let sideBubbles = [];

export function layoutSideBubbles(){
    const centerBubble = document.querySelector('.center-bubble');
    centerBubble.addEventListener('mouseover', moveAllSideBubblesBack);
    centerBubble.addEventListener('mouseout', restartAllSideBubbles);

    const foundBubbles = document.querySelectorAll('.side-bubble');
    const parent = foundBubbles[0].parentElement;
    const amount = foundBubbles.length;
    // layout the bubbles in a circle around the center bubble
    const centerX = 50;
    const centerY = 50;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    foundBubbles.forEach((bubble, index) => {
        const width = parseFloat(getComputedStyle(bubble).width);
        const height = parseFloat(getComputedStyle(bubble).height);
        const radius = Math.max(width, height) / 2;

        const angle = (index / amount) * 2 * Math.PI;

        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        x = x- (width / windowWidth) * 100 / 2; // Adjust x to center the bubble without transform
        y = y- (height / windowHeight) * 100 / 2; // Adjust y to center the bubble without transform


        const bubbleObj = new Bubble(bubble, x, y);
        sideBubbles.push(bubbleObj);

        bubbleObj.gentlyFloatAround();
    });
}

function moveAllSideBubblesBack(e){
    const activeBubble = document.querySelector('.active-bubble');
    const activatingBubble = document.querySelector('.activating-bubble');
    if (activeBubble || activatingBubble) 
        return;
    for(const bubble of sideBubbles){
        bubble.moveBack();
        bubble.pauseMovement();
    }
}
function restartAllSideBubbles(e){
    const activeBubble = document.querySelector('.active-bubble');
    const activatingBubble = document.querySelector('.activating-bubble');
    if (activeBubble || activatingBubble) 
        return;
    for(const bubble of sideBubbles){
        bubble.continueMovement();
    }
}

function onSideBubbleClick(){
}