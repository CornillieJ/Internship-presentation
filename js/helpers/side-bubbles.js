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
        const distanceFromCenter = radius - 30;

        const angle = (index / amount) * 2 * Math.PI;

        let x = centerX + distanceFromCenter * Math.cos(angle);
        let y = centerY + distanceFromCenter * Math.sin(angle);

        x = x- (width / windowWidth) * 100 / 2; // Adjust x to center the bubble without transform
        y = y- (height / windowHeight) * 100 / 2; // Adjust y to center the bubble without transform


        const bubbleObj = new Bubble(bubble, x, y);
        sideBubbles.push(bubbleObj);

        bubbleObj.gentlyFloatAround();
        setInterval(() => {
            avoidAllOtherBubbles();
        }, 100);
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
function avoidAllOtherBubbles(){
    sideBubbles.forEach(bubble => {
        avoidOtherBubbles(bubble.element);
    });
}

function avoidOtherBubbles(bubble){
    const bubbles = document.querySelectorAll('.bubble');
    const centerBubble = document.querySelector('.center-bubble');
    const centerBubbleWidth = parseFloat(getComputedStyle(centerBubble).width);
    const centerBubbleHeight = parseFloat(getComputedStyle(centerBubble).height);
    const bubbleWidth = parseFloat(getComputedStyle(bubble).width);
    const bubbleHeight = parseFloat(getComputedStyle(bubble).height);
    for(const otherBubble of bubbles){
        if(otherBubble === bubble) return;
        if(otherBubble === centerBubble || bubble === centerBubble)
            moveBubbleAway(bubble, centerBubble, Math.max(centerBubbleWidth, centerBubbleHeight));
        else
            moveBubbleAway(otherBubble, bubble, Math.max(bubbleWidth, bubbleHeight));
    }
}

export function moveBubbleAway(bubble, otherBubble, minDistance){
    const bubbleRect = bubble.getBoundingClientRect();
    const bubbleX = bubbleRect.left + bubbleRect.width / 2;
    const bubbleY = bubbleRect.top + bubbleRect.height / 2;
    const otherBubbleRect = otherBubble.getBoundingClientRect();
    const otherBubbleX = otherBubbleRect.left + otherBubbleRect.width / 2;
    const otherBubbleY = otherBubbleRect.top + otherBubbleRect.height / 2;
    let deltaX = bubbleX - otherBubbleX;
    let deltaY = bubbleY - otherBubbleY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if(distance < minDistance){
        const bubbleObj = sideBubbles.find(b => b.element === bubble);
        const otherBubbleObj = sideBubbles.find(b => b.element === otherBubble);
        if(bubbleObj && Date.now() - bubbleObj.lastFlipped > 500){
            bubbleObj.flipDirection();
        }
        else if(otherBubbleObj && Date.now() - otherBubbleObj.lastFlipped > 500){
            otherBubbleObj.flipDirection();
        }
    }
}