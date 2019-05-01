// Image base

class Image {
    constructor(ctx, image, x, y, w, h) {
        this.ctx = ctx;
        this.image = image;

        this.x = x;
        this.y = y;

        this.width = w;
        this.height = h;
    }

    draw(x, y) {
        let xPosition = x || this.x;
        let yPosition = y || this.y;

        this.ctx.drawImage(this.image, xPosition, yPosition, this.width, this.height);
    }
}

export default Image;