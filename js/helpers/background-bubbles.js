'use strict';

import * as UTILS from './utils.js';

let pausedBubbles = []
const timeOut = 500;
const color1 = { r: 185, g: 2, b: 250 };
const color2 = { r: 5, g: 198, b: 252 };


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

function createNewBubble(x,y, size, rotation){
    const container = document.querySelector('.background-bubbles-container');
    const centerBubble = document.querySelector('.center-bubble');
    const bubble = document.createElement('div');
    const borderColor = UTILS.getRandomColor(color1, color2);
    if(!y) y = UTILS.getRandomNumberExcludeRange(0, 100, 45, 55);
    if(!x) x = UTILS.getRandomNumberExcludeRange(0, 100, 0,0);
    if(!size) size = UTILS.getRandomNumberAroundCenter(1.5, 0.8);
    if(!rotation) rotation = UTILS.getRandomNumber(0, 360);
    if(UTILS.getRandomTrue(0.33)) bubble.classList.add('leaf-1');
    else if(UTILS.getRandomTrue(0.33)) bubble.classList.add('leaf-2');
    else bubble.classList.add('leaf-3');

    bubble.classList.add('background-bubble');
    bubble.style.top = `${y}%`;
    bubble.style.left = `${x}%`;
    bubble.style.width = `${size}rem`;
    bubble.style.borderColor = borderColor;
    bubble.style.height = `${size}rem`;
    bubble.style.transform = `rotate(${rotation}deg)`;
    container.appendChild(bubble);
    moveContinuously(bubble, 1, -1, true);
}

export function moveContinuously(element, directionY = 1, directionX = 0, shouldScale = false){
    let positionY = parseFloat(element.style.top);
    let positionX = parseFloat(element.style.left);
    let scale = parseFloat(element.style.scale) || 1;
    const startY = directionY > 0 ? UTILS.getRandomNumber(-5, 60) : (directionY < 0 ? UTILS.getRandomNumber(40, 105) : 100);
    const startX = directionX > 0 ? UTILS.getRandomNumber(-5, 60) : (directionX < 0 ? UTILS.getRandomNumber(40, 105) : 100);
    const speed = UTILS.getRandomNumberAroundCenter(0.5, 0.3);
    const interval = setInterval(() => {
        const bubbleInfo = pausedBubbles.find(b => b.element === element);
        if(!bubbleInfo || bubbleInfo.lastMoved < Date.now() - timeOut){
            positionY = parseFloat(element.style.top);
            positionX = parseFloat(element.style.left);
            scale = parseFloat(element.style.scale) || 1;
            pausedBubbles.splice(pausedBubbles.indexOf(bubbleInfo), 1);
            const xAmount = UTILS.getRandomNumber(0.7, 1.3);
            const yAmount = UTILS.getRandomNumber(0.7, 1.3);
            positionX += speed * directionX * xAmount;
            positionY += speed * directionY * yAmount;
            element.style.left = `${positionX}%`;
            element.style.top = `${positionY}%`;
            if(shouldScale) element.style.scale = `${scale - 0.01}`;
        }
        if(positionX < -10 || positionX > 110 || positionY < -10 || positionY > 110){
            clearInterval(interval);
            element.remove();
            createNewBubble(startX, startY);
        }
    }, 50);
}

export function avoidPosition(x, y, distance){
    const bubbles = document.querySelectorAll('.background-bubble');
    for(const bubble of bubbles){
        moveBubbleAway(bubble, x, y, distance);
    }
}


export function moveBubbleAway(bubble, x, y, minDistance){
    const bubbleRect = bubble.getBoundingClientRect();
    const bubbleX = bubbleRect.left + bubbleRect.width / 2;
    const bubbleY = bubbleRect.top + bubbleRect.height / 2;
    let deltaX = bubbleX - x;
    let deltaY = bubbleY - y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if(distance < minDistance){
        // pausedBubbles.push({element:bubble, lastMoved: Date.now()});
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
        moveBubbleAway(otherBubble, bubbleX, bubbleY, Math.max(bubbleWidth, bubbleHeight));
    }
}