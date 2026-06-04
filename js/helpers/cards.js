'use strict';
import * as UTILS from './utils.js';

class BubbleWithCard{
    bubbleElement;
    cards = [];
    wrappers = [];
    activeCardIndex = -1;
    isActive = false;
    indicators = [];
    isAnimating = false;
    animateTimeInMs = 200; //ms
    lastWheelTime = 0;

    constructor(bubbleElement){
        this.bubbleElement = bubbleElement;
        this.cards = bubbleElement.querySelectorAll('.card');
        window.addEventListener('resize', () =>{if(this.isActive) this.reactivateBubble()});
    }

    getBubbleLeft(){ return this.bubbleElement.getBoundingClientRect().left; }
    getBubbleTop(){ return this.bubbleElement.getBoundingClientRect().top; }
    getBubbleWidth(){ return this.bubbleElement.getBoundingClientRect().width; }
    getBubbleHeight(){return this.bubbleElement.getBoundingClientRect().height; }

    activateBubble(){
        this.isActive = true;
        this.cards.forEach((card, index) => {
            const wrapperDiv = document.createElement('div');
            this.createIndicator(index, wrapperDiv);
            wrapperDiv.appendChild(card);
            card.classList.remove('hidden');
            wrapperDiv.classList.add('card-visual');
            wrapperDiv.classList.add('hidden-children');
            wrapperDiv.classList.add('card-visual-behind');
            wrapperDiv.style.position = 'absolute';
            wrapperDiv.style.left = `${50 + index}%`;
            wrapperDiv.style.top = `${50 + index}%`;
            wrapperDiv.style.width = `${this.getBubbleWidth()}px`;
            wrapperDiv.style.height = `${this.getBubbleHeight()}px`;
            this.bubbleElement.parentElement.append(wrapperDiv);
            this.wrappers.push(wrapperDiv);
        });
        this.wrappers.forEach((wrapper, index) => {
            wrapper.addEventListener('wheel', (e) => {
                const debounceTimeInMs = this.animateTimeInMs / (this.wrappers.length - 1);
                e.preventDefault();
                if(this.lastWheelTime + debounceTimeInMs > Date.now()) return;
                this.lastWheelTime = Date.now();
                if(this.isAnimating) return;
                if(e.deltaY > 0) this.activateNextCard();
                else if(e.deltaY < 0) this.activatePreviousCard();
            });
            wrapper.addEventListener('touchmove', (e) => {
                const debounceTimeInMs = this.animateTimeInMs / (this.wrappers.length - 1);
                e.preventDefault();
                if(this.lastWheelTime + debounceTimeInMs > Date.now()) return;
                this.lastWheelTime = Date.now();
                if(this.isAnimating) return;
                if(e.deltaY > 0) this.activateNextCard();
                else if(e.deltaY < 0) this.activatePreviousCard();
            })
        });
        this.activateNextCard();
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
    reactivateBubble(){
        this.deactivateBubble();
        this.activateBubble();
    }

    activateCard(index, direction = 1){
        if(this.isAnimating) return;
        index = ((index % this.cards.length) + this.cards.length) % this.cards.length; // Handle negative indices
        let targetLeft = direction < 1 ? 51 : 50 + this.wrappers.length;
        let targetTop = direction < 1 ? 51 : 50 + this.wrappers.length;

        const lastActive = this.wrappers[this.activeCardIndex];
        if(lastActive){
            console.log(`Animating last active card to left: ${targetLeft}, top: ${targetTop}`);
            console.log(`direction: ${direction}`);
            this.animateCard(lastActive, ()=>{
                this.deactivateOtherCards(index);
                console.log(`Finished animating last active card to left: ${targetLeft}, top: ${targetTop}`);
            }, targetLeft, targetTop);
        }

        const newActive = this.wrappers[index]
        this.animateCard(newActive, ()=>{
            if(this.indicators[index]) this.indicators[index].classList.remove('card-indicator-behind');
            newActive.classList.remove('card-visual-behind');
            newActive.classList.remove('hidden-children');
        });

        newActive.parentElement.appendChild(newActive);
        this.activeCardIndex = index;

        this.reorderCards();
    }
    deactivateOtherCards(activeIndex){
        this.wrappers.forEach((wrapper, i) => {
            if(i === activeIndex) return;
            wrapper.classList.add('hidden-children');
            wrapper.classList.add('card-visual-behind');
            this.indicators[i].classList.add('card-indicator-behind');
            wrapper.style.top = `${50 + (i + this.wrappers.length - activeIndex) % this.wrappers.length}%`;
            wrapper.style.left = `${50 + (i  + this.wrappers.length - activeIndex) % this.wrappers.length}%`;
        });
    }
    reorderCards(){
        const newSortedWrappers = Array.from(this.wrappers).sort((a, b) => {
            const aIndex = this.wrappers.indexOf(a);
            const bIndex = this.wrappers.indexOf(b);
            return ((bIndex - this.activeCardIndex + this.wrappers.length) % this.wrappers.length) 
                    - 
                    ((aIndex - this.activeCardIndex + this.wrappers.length) % this.wrappers.length);
        });
        newSortedWrappers.forEach(wrapper => wrapper.parentElement.appendChild(wrapper));
    }
    activateNextCard(){
        if(this.activeCardIndex === -1){
            this.activateCard(0);
            return;
        }
        const nextIndex = (this.activeCardIndex + 1) % this.cards.length;
        this.activateCard(nextIndex, 1);
        this.activeCardIndex = nextIndex;
    }

    activatePreviousCard(){
        if(this.activeCardIndex === -1){
            this.activateCard(0);
            return;
        }
        const prevIndex = (this.activeCardIndex - 1 + this.cards.length) % this.cards.length;
        this.activateCard(prevIndex, -1);
        this.activeCardIndex = prevIndex;
    }
    deactivateCards(){
        this.wrappers.forEach(card => {
            card.classList.add('hidden');
            card.classList.add('hidden-children');
        });
        this.activeCardIndex = -1;
    }

    animateCard(card, OnComplete, targetLeft = 50, targetTop = 50){
        console.log(`Animating card to left: ${targetLeft}, top: ${targetTop}`);
        this.isAnimating = true;
        let currentLeft = parseFloat(card.style.left) || 50;
        let currentTop = parseFloat(card.style.top) || 50;
        const distance = Math.sqrt((targetLeft - currentLeft) ** 2 + (targetTop - currentTop) ** 2);
        const step = 0.1;
        const intervalTime = this.animateTimeInMs / (distance / step);

        const OnFinished = ()=>{
            card.style.left = '';
            card.style.top = '';
            clearInterval(interval);
            clearTimeout(emergencyStop);
            if (OnComplete) OnComplete();
            this.isAnimating = false;
        }


        const interval = setInterval (() => {
            currentLeft = parseFloat(card.style.left) || 50;
            currentTop = parseFloat(card.style.top) || 50;
            if(Math.abs(currentLeft - targetLeft) < 1 && Math.abs(currentTop - targetTop) < 1){
                card.style.left = '';
                card.style.top = '';
                clearInterval(interval);
                clearTimeout(emergencyStop);
                if (OnComplete) OnComplete();
                this.isAnimating = false;
                return;
            }
            else{
                card.style.left = `${currentLeft + (targetLeft - currentLeft) * step}%`;
                card.style.top = `${currentTop + (targetTop - currentTop) * step}%`;
            }
        }, intervalTime);

        const emergencyStop = setTimeout(() => {
            console.warn('Emergency stop triggered for card animation');
            card.style.left = '';
            card.style.top = '';
            clearInterval(interval);
            clearTimeout(emergencyStop);
            if (OnComplete) OnComplete();
            this.isAnimating = false;
            return;
        }, this.animateTimeInMs * 5);
    }

    createIndicator(index, wrapperDiv) {
        if (this.cards.length > 1) {
            const indicator = document.createElement('div');
            indicator.classList.add('card-indicator');
            indicator.style.backgroundColor = UTILS.makeColorPastel(UTILS.getRandomColorWithSeed(index));
            if(this.cards[index] && this.cards[index].id) indicator.innerText = this.cards[index].id;
            wrapperDiv.appendChild(indicator);
            this.indicators.push(indicator);
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                if(this.isAnimating) return;
                if(this.activeCardIndex === index) this.activateNextCard();
                this.activateCard(index);
            });
        }
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
