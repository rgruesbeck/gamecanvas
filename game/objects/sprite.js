/**
 * game/objects/sprite.js
 * 
 * What it Does:
 *   This file is a basic sprite
 *   it implements abilities like move(x, y), speed, direction, and bounds,
 *   centerX and centerY (cx, cy) and radius
 * 
 * What to Change:
 *   Add any new methods you want all your
 *   game characters that are also sprites to have.
 *   eg. 
 * 
 */

class Sprite {
    constructor({ x, y, width, height, speed, direction, bounds }) {
        this.x = x;
        this.y = y;

        this.cx = x + (width/2);
        this.cy = y + (height/2);

        this.width = width;
        this.height = height;

        this.radius = (width + height) / 4;

        this.speed = speed || 1;

        this.direction = direction || 'right';

        this.bounds = { top: 0, right: 0, bottom: 0, left: 0 };
        this.setBounds(bounds);
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
}

export default Sprite;