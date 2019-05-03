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
        // x and y
        this.x = x;
        this.y = y;

        // previous x and y
        this.px = x;
        this.py = y;

        // center x and y
        this.cx = x + (width/2);
        this.cy = y + (height/2);

        // velocity x and y
        this.vx = 0;
        this.vy = 0;

        // width and height
        this.width = width;
        this.height = height;

        // radius
        this.radius = (width + height) / 4;

        // speed of sprite
        this.speed = speed || 1;

        // direction
        this.direction = direction || 'right';

        // bounds
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
        this.px = this.x; // store previous x value
        this.x = x; // set x

        this.cx = this.x + (this.width/2); // set center x
        this.vx = this.x - this.px; // set velocity x
    }

    setY(y) {
        this.py = this.y; // store previous y value
        this.y = y; // set y

        this.cy = this.y + (this.height/2); // set center y
        this.vy = this.y - this.py; // set velocity y
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