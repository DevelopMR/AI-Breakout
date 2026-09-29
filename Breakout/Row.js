class Row {
    constructor(rownum, player) {

        this.bricks = [];

        var brickWidth = 83;
        var topPadding = 90;
        var leftPadding = 4;

        this.bricks[0] = new Brick(leftPadding, topPadding + rownum * 30, player);
        this.bricks[1] = new Brick(leftPadding + brickWidth, topPadding + rownum * 30, player);
        this.bricks[2] = new Brick(leftPadding + 2 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[3] = new Brick(leftPadding + 3 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[4] = new Brick(leftPadding + 4 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[5] = new Brick(leftPadding + 5 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[6] = new Brick(leftPadding + 6 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[7] = new Brick(leftPadding + 7 * brickWidth, topPadding + rownum * 30, player);

        this.bricks[8] = new Brick(leftPadding + 8 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[9] = new Brick(leftPadding + 9 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[10] = new Brick(leftPadding + 10 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[11] = new Brick(leftPadding + 11 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[12] = new Brick(leftPadding + 12 * brickWidth, topPadding + rownum * 30, player);
        this.bricks[13] = new Brick(leftPadding + 13 * brickWidth, topPadding + rownum * 30, player);
    }

    show() {

        this.bricks.forEach(brick => {
            brick.show();
        })
    }

    update() {
        this.bricks.forEach(brick => {
            brick.update();
        })

    }

    collided(p) {

        var result = false;
        this.bricks.forEach(brick => {
            if (brick.collidedWithPuck(p)) {
                result = true;
            }
        })

        return result;

    }

}