'use strict';

import * as UTILS from './utils.js';
import * as CARDS from './cards.js';
import { FloatingBubble } from '../data/FloatingBubble.js';
import { sideBubbles } from './side-bubbles.js';

let centerBubble, centerSpan;
let activeBubble;
let isAnimating = false;
const animationTime = 0.5;

//#region Initialization
export function initialize(){
    centerBubble = document.querySelector('.center-bubble');
    if(centerBubble){
        centerSpan = centerBubble.querySelector('.bubble-title');
        centerBubble.addEventListener('click', onBubbleClick);
    }
    sideBubbles.forEach(bubble => {
        bubble.element.addEventListener('click', onBubbleClick);
    });
    const references = document.querySelectorAll('.reference');
    references.forEach(ref => {
        ref.addEventListener('mouseover', () => {
            const text = ref.textContent || ref.innerText;
            console.log(`Hovering over reference: ${text}`);
            animateRelatedBubble(text);
        });
        ref.addEventListener('mouseout', () => {
            const text = ref.textContent || ref.innerText;
            stopAnimateRelatedBubble(text);
        });
        ref.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}
//#endregion Initialization

//#region event handlers
function onBubbleClick(e){
    if(e.target === activeBubble) return;
    if(activeBubble && activeBubble.contains(e.target)) return;
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
    if(activeBubble && !activeBubble.classList.contains('bubble')){
        activeBubble = activeBubble.closest('.bubble');
    }


    const foundBubble = sideBubbles.find(b => b.element === activeBubble);
    if(foundBubble) foundBubble.stopMovement(true);
    if(!activeBubble) activeBubble = e.target;
    activeBubble.classList.remove('inactive-bubble-left');
    activeBubble.classList.remove('inactive-bubble-right');
    activeBubble.classList.add('activating-bubble');

    animateOnSetActiveBubble();
    animateSideBubbles();

    setTimeout(() => {
        activeBubble.classList.add('active-bubble');
        activeBubble.classList.add('blur');
        activeBubble.classList.remove('activating-bubble');
        animateSideBubbles();
        
        CARDS.activateBubble(activeBubble);
        clearAnimations();
        isAnimating = false;
    }, animationTime * 1000);
    createOverlay();
}
function onActiveBubbleClick(e, resetSideBubbles = true, overrideAnimatingCheck = false){
    if(isAnimating && !overrideAnimatingCheck) return;
    isAnimating = true;
    CARDS.deactivateBubble(activeBubble);
    activeBubble.classList.remove('active-bubble');
    activeBubble.classList.remove('blur');
    removeOverlay();
    clearAnimations();
    if(activeBubble === centerBubble)
        activeBubble.style.animation = `zoom-back ${animationTime}s ease-out`;
    else
        activeBubble.style.animation = `zoom-back ${animationTime}s ease-out`;

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
//#endregion event handlers

//#region helpers
function createOverlay(){
    const divOverlay = document.createElement('div');
    divOverlay.classList.add('overlay');
    document.body.appendChild(divOverlay);
    divOverlay.addEventListener('click', onActiveBubbleClick);
}
function removeOverlay(){
    const overlay = document.querySelector('.overlay');
    if(overlay) overlay.remove();
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
function animateOnSetActiveBubble(){
    const children = activeBubble.querySelectorAll('.bubble-title');
    activeBubble.style.animation = `zoom-in ${animationTime}s ease-out`;
    children.forEach(child => {
        child.style.animation = `move-to-top ${animationTime}s ease-out`;
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
function animateRelatedBubble(text){
    const relatedBubble = sideBubbles.find(b => {
        const title = b.element.querySelector('.bubble-title');
        return title.innerText.toLowerCase().includes(text.toLowerCase());
    });
    if(relatedBubble){
        relatedBubble.classList.add('referenced');
    }
}
function stopAnimateRelatedBubble(text){
    const relatedBubble = sideBubbles.find(b => {
        const title = b.element.querySelector('.bubble-title');
        return title.innerText.toLowerCase().includes(text.toLowerCase());
    });
    if(relatedBubble){
        relatedBubble.classList.remove('referenced');
    }
}
// #endregion Helpers