'use strict';

export function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomDirection() {
    return Math.random() < 0.5 ? -1 : 1;
}
export function getRandomTrue(odds = 0.5) {
    return Math.random() < odds;
}
export function getRandomNumberExcludeRange(min, max, excludeMin, excludeMax) {
    let randomNum;
    do {
        randomNum = Math.random() * (max - min) + min;
    } while (randomNum >= excludeMin && randomNum <= excludeMax);
    return randomNum;
}
export function getRandomNumberAroundCenter(center, range) {
    const min = center - range;
    const max = center + range;
    return Math.random() * (max - min) + min;
}
export function getRandomColor(minColor, maxColor) {
    const r = getRandomInt(minColor.r, maxColor.r);
    const g = getRandomInt(minColor.g, maxColor.g);
    const b = getRandomInt(minColor.b, maxColor.b);
    return `rgb(${r}, ${g}, ${b})`;
}

export function getMouseMovement(e){
    if(typeof getMouseMovement.lastX === 'undefined'){
        getMouseMovement.lastX = e.clientX;
        getMouseMovement.lastY = e.clientY;
        return {x: 0, y: 0};
    }

    const deltaX = e.clientX - getMouseMovement.lastX;
    const deltaY = e.clientY - getMouseMovement.lastY;
    return { x: deltaX, y: deltaY };
}