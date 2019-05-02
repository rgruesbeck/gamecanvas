/**
 * game/objects/sprite.js
 * 
 * What it Does:
 *   This file is a basic sprite
 *   it extends the image class and adds
 *   move(x, y), speed, direction, and bounds,
 *   centerX and centerY (cx, cy) and radius
 * 
 * What to Change:
 *   Add any new methods you want all your
 *   game characters that are also sprites to have.
 *   eg. 
 * 
 */

import Image from './image.js';

class Sprite extends Image {
    constructor(ctx, image, x, y, w, h, s) {
        super(ctx, image, x, y, w, h);

        this.cx = x + (w/2);
        this.cy = y + (h/2);

        this.width = w;
        this.height = h;

        this.radius = (w + h) / 4;

        this.speed = s || 1;

        this.direction = 'right';

        this.bounds = { top: 0, right: 0, bottom: 0, left: 0 };
    }

    move(x, y, m) {
        let dx = x === 0 ? this.x : this.x + (x * this.speed * m);
        let dy = y === 0 ? this.y : this.y + (y * this.speed * m);
        
        // apply x bounds
        let inBoundsX = dx >= this.bounds.left && dx <= this.bounds.right - this.width;
        if (inBoundsX) {
            this.setX(dx);
        } else {
            let snapTo = dx < 0 ? 0 : this.bounds.right - this.width;
            this.setX(snapTo);
        }

        // apply y bounds
        let inBoundsY = dy >= this.bounds.top && dy <= this.bounds.bottom - this.height;
        if (inBoundsY) {
            this.setY(dy);
        } else {
            let snapTo = dy < 0 ? 0 : this.bounds.bottom - this.height;
            this.setY(snapTo);
        }

        // set direction
        if (x < 0) { this.direction = 'right'; }
        if (x > 0) { this.direction = 'left'; }
    }

    setX(x) {
        this.x = x;
        this.cx = this.x + (this.width/2);
    }

    setY(y) {
        this.y = y;
        this.cy = this.y + (this.height/2);
    }

    setBounds({ top, right, bottom, left }) {
        let bounds = {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        };

        this.bounds = {
            ...this.bounds,
            ...bounds
        }
    }

    draw() {
        this.ctx.save();

        let scaleX = this.direction === 'left' ? -1 : 1;
        let xPosition = this.direction === 'left' ? -1 * this.x : this.x;
        let trX = this.direction === 'left' ? this.width : 0;

        this.ctx.translate(trX, 0);
        this.ctx.scale(scaleX, 1);

        super.draw(xPosition, this.y);

        this.ctx.restore();
    }
}

export default Sprite;