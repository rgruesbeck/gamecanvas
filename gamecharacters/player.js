// Player character
import Image from '../gameobjects/image';

class Player extends Image {
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