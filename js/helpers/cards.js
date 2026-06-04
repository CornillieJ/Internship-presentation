'use strict';
import * as UTILS from './utils.js';

class BubbleWithCard{
    bubbleElement;
    cards = [];
    wrappers = [];
    activeCardIndex = -1;
    offset = 20;
    isActive = false;
    indicators = [];

    constructor(bubbleElement){
        this.bubbleElement = bubbleElement;
        this.cards = bubbleElement.querySelectorAll('.card');
        window.addEventListener('resize', () =>{if(this.isActive) this.reactivateBubble()});
    }

    reactivateBubble(){
        this.deactivateBubble();
        this.activateBubble();
    }
    activateBubble(){
        this.isActive = true;
        this.cards.forEach((card, index) => {
            card.classList.remove('hidden');
            const wrapperDiv = document.createElement('div');
            const indicator = document.createElement('div');
            indicator.classList.add('card-indicator');
            indicator.style.backgroundColor = UTILS.getRandomColorWithSeed(index);
            wrapperDiv.appendChild(indicator);
            wrapperDiv.appendChild(card);
            wrapperDiv.classList.add('card-visual');
            wrapperDiv.style.position = 'absolute';
            wrapperDiv.style.left = `${50 + index}%`;
            wrapperDiv.style.top = `${50 + index}%`;
            wrapperDiv.style.width = `${this.getBubbleWidth()}px`;
            wrapperDiv.style.height = `${this.getBubbleHeight()}px`;
            this.bubbleElement.parentElement.append(wrapperDiv);
            this.wrappers.push(wrapperDiv);
            this.indicators.push(indicator);
        });
        this.wrappers.forEach((card, index) => {
            card.addEventListener('wheel', (e) => {
                // if(e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 5 && e.deltaY > 0){
                if(e.deltaY > 0){
                    this.activateNextCard();
                }
                // else if(e.target.scrollTop <= 5 && e.deltaY < 0){
                else if(e.deltaY < 0){
                    this.activatePreviousCard();
                }
            });
        });
        this.activateFirstCard();
    }

    deactivateBubble(){
        this.isActive = false;
        this.cards.forEach((card, index) => {
            this.bubbleElement.append(card);
            card.classList.add('hidden');
        });
        this.wrappers.forEach(wrapper => wrapper.remove());
        this.wrappers = [];
        this.indicators.forEach(indicator => indicator.remove());
        this.indicators = [];
        this.deactivateCards();
    }

    activateCard(index){
        index = ((index % this.cards.length) + this.cards.length) % this.cards.length; // Handle negative indices
        console.log(`Activating card ${index} of bubble with title: ${this.bubbleElement.querySelector('.bubble-title').textContent}`);
        const amount = this.wrappers.length;
        this.wrappers.forEach((card, i) => {
            if(i === index){
                this.animateCardToBubble(card,()=>{
                    this.indicators[i].classList.remove('card-indicator-behind');
                    card.classList.remove('card-visual-behind');
                    card.classList.remove('hidden-children');
                });
                card.parentElement.appendChild(card);
            }
            else{
                card.classList.add('hidden-children');
                card.classList.add('card-visual-behind');
                this.indicators[i].classList.add('card-indicator-behind');
                card.style.top = `${50 + (i + amount - index) % amount}%`;
                card.style.left = `${50 + (i  + amount - index) % amount}%`;
            }
        });
        const newSortedWrappers = Array.from(this.wrappers).sort((a, b) => {
            const aIndex = this.wrappers.indexOf(a);
            const bIndex = this.wrappers.indexOf(b);
            return ((bIndex - index + amount) % amount) - ((aIndex - index + amount) % amount);
        });
        newSortedWrappers.forEach(wrapper => wrapper.parentElement.appendChild(wrapper));
        this.activeCardIndex = index;
    }
    activateFirstCard(){
        this.activateCard(0);
    }
    activateNextCard(){
        if(this.cards.length <= 1) return;
        if(this.activeCardIndex === -1){
            this.activateFirstCard();
            return;
        }
        const nextIndex = (this.activeCardIndex + 1) % this.cards.length;
        this.activateCard(nextIndex);
        this.activeCardIndex = nextIndex;
    }
    activatePreviousCard(){
        if(this.activeCardIndex === -1){
            this.activateFirstCard();
            return;
        }
        const prevIndex = (this.activeCardIndex - 1 + this.cards.length) % this.cards.length;
        this.activateCard(prevIndex);
        this.activeCardIndex = prevIndex;
    }
    deactivateCards(){
        this.wrappers.forEach(card => {
            card.classList.add('hidden');
            card.classList.add('hidden-children');
        });
        this.activeCardIndex = -1;
    }
    getBubbleLeft(){
        return this.bubbleElement.getBoundingClientRect().left;
    }
    getBubbleTop(){
        return this.bubbleElement.getBoundingClientRect().top;
    }
    getBubbleWidth(){
        return this.bubbleElement.getBoundingClientRect().width;
    }
    getBubbleHeight(){
        return this.bubbleElement.getBoundingClientRect().height;
    }
    animateCardToBubble(card, OnComplete){
        console.log(`Animating card to bubble with title: ${this.bubbleElement.querySelector('.bubble-title').textContent}`);
        let currentLeft = parseFloat(card.style.left);
        let currentTop = parseFloat(card.style.top);
        const targetLeft = 50;
        const targetTop = 50;
        const step = 0.1;
        const interval = setInterval (() => {
            currentLeft = parseFloat(card.style.left);
            currentTop = parseFloat(card.style.top);
            if(Math.abs(currentLeft - targetLeft) < 0.5 && Math.abs(currentTop - targetTop) < 0.5){
                card.style.left =''
                card.style.top = '';
                clearInterval(interval);
                if (OnComplete) OnComplete();
            }
            else{
                card.style.left = `${currentLeft + (targetLeft - currentLeft) * step}%`;
                card.style.top = `${currentTop + (targetTop - currentTop) * step}%`;
            }
        },20);
    }
}

let bubblesWithCards = [];

export function initialize(){
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        bubblesWithCards.push(new BubbleWithCard(bubble));
    });
}
export function activateBubble(bubbleElement){
    const bubble = bubblesWithCards.find(b => b.bubbleElement === bubbleElement);
    if(bubble){
        bubble.activateBubble();
    }
}
export function deactivateBubble(bubbleElement){
    const bubble = bubblesWithCards.find(b => b.bubbleElement === bubbleElement);
    if(bubble){
        bubble.deactivateBubble();
    }
}
