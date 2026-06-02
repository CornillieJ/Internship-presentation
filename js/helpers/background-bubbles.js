'use strict';

import * as UTILS from './utils.js';

let pausedBubbles = []

function onMouseMove(e){
    const bubbles = document.querySelectorAll('.background-bubble');
    for(const bubble of bubbles){
        avoidMouse(bubble, e.clientX, e.clientY);
    }
}

export function createBackgroundBubbles(){
    const container = document.querySelector('.background-bubbles-container');
    for(let i = 0; i < 40; i++){
        createNewBubble();
    }
}

function createNewBubble(x,y, size){
    const container = document.querySelector('.background-bubbles-container');
    const centerBubble = document.querySelector('.center-bubble');
    const bubble = document.createElement('div');
    const color1 = { r: 46, g: 204, b: 113 };
    const color2 = { r: 52, g: 152, b: 219 };
    const borderColor = UTILS.getRandomColor(color1, color2);
    if(!y) y = UTILS.getRandomNumberExcludeRange(0, 100, 45, 55);
    if(!x) x = UTILS.getRandomNumberExcludeRange(0, 100, 0,0);
    if(!size) size = UTILS.getRandomNumberAroundCenter(1, 0.8);

    bubble.classList.add('background-bubble');
    bubble.style.top = `${y}%`;
    bubble.style.left = `${x}%`;
    bubble.style.width = `${size}rem`;
    bubble.style.borderColor = borderColor;
    bubble.style.height = `${size}rem`;
    container.appendChild(bubble);
    moveUpwards(bubble);
}

const timeOut = 500;
export function moveUpwards(element){
    let position = parseFloat(element.style.top);
    const speed = UTILS.getRandomNumberAroundCenter(0.5, 0.3);
    const interval = setInterval(() => {
        const bubbleInfo = pausedBubbles.find(b => b.element === element);
        if(!bubbleInfo || bubbleInfo.lastMoved < Date.now() - timeOut){
            position = parseFloat(element.style.top);
            pausedBubbles.splice(pausedBubbles.indexOf(bubbleInfo), 1);
            position -= speed;
            element.style.top = `${position}%`;
        }
        if(parseFloat(element.style.top) < -10 || parseFloat(element.style.left) < -10 || parseFloat(element.style.left) > 110 || parseFloat(element.style.top) > 150){
            clearInterval(interval);
            element.remove();
            createNewBubble(undefined, 100, undefined);
        }
    }, 50);
}

export function avoidPosition(x, y, distance){
    const bubbles = document.querySelectorAll('.background-bubble');
    for(const bubble of bubbles){
        moveBubbleAway(bubble, x, y, distance);
    }
}


export function moveBubbleAway(bubble, x, y, minDistance, isAvoidingMouse = true){
    const bubbleRect = bubble.getBoundingClientRect();
    const bubbleX = bubbleRect.left + bubbleRect.width / 2;
    const bubbleY = bubbleRect.top + bubbleRect.height / 2;
    let deltaX = bubbleX - x;
    let deltaY = bubbleY - y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if(distance < minDistance){
        if(!isAvoidingMouse) console.log(`Avoiding bubble at (${bubbleX}, ${bubbleY}) with distance ${distance} < ${minDistance}`);
        pausedBubbles.push({element:bubble, lastMoved: Date.now()});
        const angle = Math.atan2(deltaY, deltaX);
        const moveX = Math.cos(angle);
        const moveY = Math.sin(angle);
        // also add some random movement to make it less predictable
        const left = (bubble.offsetLeft + moveX)
        const top = (bubble.offsetTop + moveY)
        const randomAngle = UTILS.getRandomNumber(0, Math.PI/8);
        const randomDistance = UTILS.getRandomNumber(0.5, 0.8);
        const randomMoveX = Math.cos(randomAngle) * randomDistance;
        const randomMoveY = Math.sin(randomAngle) * randomDistance;
        bubble.x = left + randomMoveX;
        bubble.y = top + randomMoveY;
        const leftAsPercentage = (bubble.x / window.innerWidth) * 100;
        const topAsPercentage = (bubble.y / window.innerHeight) * 100;

        bubble.style.left = `${leftAsPercentage}%`;
        bubble.style.top = `${topAsPercentage}%`;
        avoidOtherBubbles(bubble);
    }
}
function avoidOtherBubbles(bubble){
    const bubbles = document.querySelectorAll('.background-bubble');
    const bubbleWidth = parseFloat(getComputedStyle(bubble).width);
    const bubbleHeight = parseFloat(getComputedStyle(bubble).height);
    const bubbleRect = bubble.getBoundingClientRect();
    const bubbleX = bubbleRect.left + bubbleRect.width / 2;
    const bubbleY = bubbleRect.top + bubbleRect.height / 2;
    for(const otherBubble of bubbles){
        if(otherBubble === bubble) return;
        moveBubbleAway(otherBubble, bubbleX, bubbleY, Math.max(bubbleWidth, bubbleHeight, false));
    }
}