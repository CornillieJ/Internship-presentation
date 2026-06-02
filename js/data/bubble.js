import * as UTILS from '../helpers/utils.js';

export class Bubble {
    element = null;
    width = 0;
    height = 0;
    startingPosition = { x: 0, y: 0 };
    position = { x: 0, y: 0 };
    floatSpeed = 0.05;
    moveBackSpeed = 0.08;
    directionX = 0;
    directionY = 0;
    isMovingBack = false;
    canMove = true;
    cancelMovement = false;
    lastFlipped = 0;

    constructor(element, x, y){
        this.element = element;
        this.startingPosition = { x, y };
        const calculatedWidth = element.getBoundingClientRect().width;
        const calculatedHeight = element.getBoundingClientRect().height;
        this.width = (calculatedWidth / window.innerWidth) * 100;
        this.height = (calculatedHeight / window.innerHeight) * 100;
        this.setPosition(x, y);
        element.addEventListener('mouseover', () => this.onHover());
        element.addEventListener('mouseout', () => this.onHoverEnd());
    }

    setPosition(x, y, isXImportant = false, isYImportant = false){
        x = Math.max(0, Math.min(100 - this.width, x));
        y = Math.max(0, Math.min(100 - this.height, y));
        this.position = { x, y };
        this.element.style.left = `${x}%`;
        this.element.style.top = `${y}%`;
        if(isXImportant) this.element.style.left += ' !important';
        if(isYImportant) this.element.style.top += ' !important';
    }

    addPosition(x, y){
        this.setPosition(this.position.x + x, this.position.y + y);
    }

    resetPosition(){
        this.setPosition(this.startingPosition.x, this.startingPosition.y);
    }

    gentlyFloatAround(turnOdds = 0.01){
        this.directionX = UTILS.getRandomDirection();
        this.directionY = UTILS.getRandomDirection();
        const interval = setInterval(() => {
            if(!this.isMovingBack && this.canMove){
                this.addPosition(this.floatSpeed * this.directionX, this.floatSpeed * this.directionY);
                if(UTILS.getRandomTrue(turnOdds) || this.position.y <= 0 || this.position.y >= 100 - this.height) this.directionY *= -1;
                if(UTILS.getRandomTrue(turnOdds) || this.position.x <= 0 || this.position.x >= 100 - this.width) this.directionX *= -1;
            }
            if(this.cancelMovement){
                clearInterval(interval);
                return;
            }
        }, 50);
    }

    moveBack(){
        if(this.isMovingBack) return;
        this.isMovingBack = true;
        let initialDirectionY = Math.sign(this.startingPosition.y - this.position.y);
        let initialDirectionX = Math.sign(this.startingPosition.x - this.position.x);
        
        const interval = setInterval(() => {
            const deltaY = this.startingPosition.y - this.position.y;
            const deltaX = this.startingPosition.x - this.position.x;
            this.addPosition(deltaX * this.moveBackSpeed, deltaY * this.moveBackSpeed);
            if(Math.abs(deltaY) < this.moveBackSpeed && Math.abs(deltaX) < this.moveBackSpeed){
                this.resetPosition();
                clearInterval(interval);
                this.isMovingBack = false;
            }
            if(this.cancelMovement){
                this.isMovingBack = false;
                clearInterval(interval);
                return;
            }
        }, 50);

    }

    stopMovement(){
        this.cancelMovement = true;
        this.pauseMovement();
    }
    restartMovement(){
        this.cancelMovement = false;
        this.continueMovement();
        this.moveBack();
        this.gentlyFloatAround();
    }
    pauseMovement(){
        this.canMove = false;
    }
    continueMovement(flipDirection = false){
        this.canMove = true;
        if(flipDirection){
            this.directionX *= -1;
            this.directionY *= -1;
        }
    }
    flipDirection(){
        this.directionX *= -1;
        this.directionY *= -1;
        this.lastFlipped = Date.now();
        console.log(`Flipped direction to (${this.directionX}, ${this.directionY})`);
    }
    onHover(){
        this.pauseMovement()
    }
    onHoverEnd(){
        this.continueMovement();
    }
}
