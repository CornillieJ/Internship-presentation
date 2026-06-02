'use strict';
import * as BACKGROUND from '/js/helpers/background-bubbles.js';
import * as SIDE from '/js/helpers/side-bubbles.js';
import * as RIPPLES from '/js/helpers/ripples.js';
import * as ACTIVE from '/js/helpers/active-bubble.js';

window.addEventListener('DOMContentLoaded', initialize);


function initialize(){
    BACKGROUND.createBackgroundBubbles();
    SIDE.layoutSideBubbles();
    RIPPLES.initialize();
    ACTIVE.initialize();
}
