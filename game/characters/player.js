/**
 * game/character/player.js
 * 
 * What it Does:
 *   This file is a basic player character
 *   it extends the sprite class and adds two collision detections methods
 * 
 * What to Change:
 *   Add any character specific methods
 *   eg. eat
 * 
 */

import Sprite from '../objects/sprite.js';

class Player extends Sprite {
    constructor(ctx, image, x, y, w, h, s) {
        super(ctx, image, x, y, w, h, s);
    }

    collisionsWith(entities) {
        let result = Object.entries(entities)
        .find((ent) => { return this.collidesWith(ent[1]); })
        ? true : false;

        return result;
    };

    collidesWith(entity) {
        let vx = entity.cx - this.cx;
        let vy = entity.cy - this.cy;
        let distance = Math.sqrt(vx * vx + vy * vy);
        return distance < (entity.radius + this.radius);
    }
}

export default Player;