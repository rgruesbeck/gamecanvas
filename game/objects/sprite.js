// Sprite
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

        this.bounds = { top: -100, right: this.ctx.canvas.width + 100, bottom: this.ctx.canvas.height + 100, left: -100 };
    }

    move(x, y, m) {
        let dx = x === 0 ? this.x : this.x + (x * this.speed * m);
        let dy = y === 0 ? this.y : this.y + (y * this.speed * m);
        
        // apply bounds
        let inBoundsX = dx >= this.bounds.left && dx <= this.bounds.right;
        if (inBoundsX) { this.setX(dx); }

        let inBoundsY = dy >= this.bounds.top && dy <= this.bounds.bottom;
        if (inBoundsY) { this.setY(dy); }

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

    setBounds(bounds) {
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