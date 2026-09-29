class Brick {

    constructor(x, y, player) {

        this.width = 83;
        this.height = 30;
        this.x = x;
        this.y = y;

        this.score = 100;

        this.visible = true;

    }


    show() {
        if (this.visible) {

            strokeWeight(1);
            stroke(64);
            rect(this.x, this.y, this.width, this.height);
        }
    }


    collidedWithPuck(p) {

        if ((this.visible) && ((p.puck.y < this.y + this.height) && (p.puck.y + p.puck.size > this.y))) {

            if ((p.puck.x < this.x + this.width) && (p.puck.x + p.puck.size > this.x)) {
                this.visible = false;
                p.score += 300;
                p.puck.velY = -p.puck.velY;
                return true;
            }
        }
        else {
            return false;
        }
    }


}