// Enemy character

class Enemy {
    constructor(ctx, image, x, y, w, h, s) {
        this.ctx = ctx;
        this.image = image;

        this.x = x;
        this.y = y;

        this.cx = x + (w/2);
        this.cy = y + (h/2);

        this.width = w;
        this.height = h;

        this.radius = (w + h) / 4;

        this.speed = s || 0;
    }

    move(x, y, m) {
        let dx = x === 0 ? this.x : this.x + (x * this.speed * m);
        let dy = y === 0 ? this.y : this.y + (y * this.speed * m);

        this.setX(dx);
        this.setY(dy);
    }

    setX(x) {
        this.x = x;
        this.cx = this.x + (this.width/2);
    }

    setY(y) {
        this.y = y;
        this.cy = this.y + (this.height/2);
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    static spawn(ctx, image, topBound, bottomBound, w, h, topSpeed) {

        let top = topBound;
        let bottom = bottomBound - 2 * h;

        let height = Math.floor((bottomBound - topBound) / h);
        let randY = (Math.floor(Math.random() * height) * h ) + top;

        // topBound
        let randomSpeed = Math.floor(Math.random() * topSpeed);

        return new Enemy(ctx, image, (-1 * w), randY, w, h, randomSpeed);
    }
}

export default Enemy;