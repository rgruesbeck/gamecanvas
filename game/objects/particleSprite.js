/**
 * game/objects/particleSprite.js
 * 
 * What it Does:
 *   This file is a basic particle sprite it extends the sprite class
 *   and draws an particle to the screen
 * 
 * What to Change:
 *   Add any new methods you want all your
 *   game characters that are also sprites to have.
 *   eg. 
 * 
 */

import { randomBetween } from '../utils/baseUtils.js';

import Sprite from './sprite.js';

class ParticleSprite extends Sprite {
    constructor(options) {
        super(options);
        this.ctx = options.ctx;

        this.r = randomBetween(7, 2, true);
        this.hue = randomBetween(60, 0, true);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x >> 0, this.y >> 0, this.r >> 0, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.75)`;
        this.ctx.fill();
    }
}

export default ParticleSprite;