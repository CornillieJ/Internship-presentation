'use strict';
import * as BACKGROUND from './helpers/background-bubbles.js';
import * as SIDE from './helpers/side-bubbles.js';
import * as RIPPLES from './helpers/ripples.js';
import * as CONNECTIONS from './helpers/connections.js';
import * as ACTIVE from './helpers/active-bubble.js';
import * as CARDS from './helpers/cards.js';
import * as ONBOARDING from './helpers/onboarding.js';

window.addEventListener('DOMContentLoaded', initialize);


function initialize(){
    BACKGROUND.createBackgroundBubbles();
    SIDE.layoutSideBubbles();
    RIPPLES.initialize();
    CONNECTIONS.initialize();
    ACTIVE.initialize();
    CARDS.initialize();
    ONBOARDING.initialize();
}
