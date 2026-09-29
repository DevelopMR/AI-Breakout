class Puck {

    constructor(p) {

        this.size = 15;
        this.player = p; //to help locate player paddle
        // starting point
        this.x = 850;
        this.y = 500;


        this.velX = -4;
        this.velY = 4;
        this.maxVel = 7; //6 

        this.visible = true;

    }


    show() {

        // show puck
        rect(this.x, this.y, this.size, this.size)
    }

    update() {

        this.velX = constrain(this.velX, -this.maxVel, this.maxVel);
        this.velY = constrain(this.velY, -this.maxVel, this.maxVel);

        this.x += this.velX;
        this.y += this.velY;

        this.collision(this.player);
    }



    collidedWithPlayer(p) {

        if ((p.y < this.y + this.size) && (p.y + p.size > this.y)) {

            if ((p.x < this.x + this.size) && (p.x + p.size > this.x)) {
                return true;
            }
        }
        else {
            return false;
        }
    }

    // borders, other soldiers, trail, cave, camp
    collision(p) {

        // 6 point boundary
        if (this.x < 5 || this.x + this.size > 1170) {
            this.velX = -this.velX;
        }
        // top boundery bounce
        if (this.y < 5) {
            this.velY = -this.velY;
        }

        // wall collisions
        if (this.y < 250) {
            p.wall.collided(p);
        }

        // check against player paddle
        if ((this.y > 825) && (((this.y + this.size > p.y) && (this.y + this.size < p.y + 5)) && ((this.x > p.x) && (this.x < p.x + p.width)))) {

            if ((this.x > p.x) && (this.x < p.x + p.width / 3)) {
                this.velY = -this.velY;
                this.velX -= 1;
            }
            else if ((this.x > p.x + 2 / 3 * p.width) && (this.x < p.x + p.width)) {
                this.velY = -this.velY;
                this.velX += 1;
            }
            else {
                this.velY = -this.velY; // flip on strike
            }

            this.y = p.y - this.size;
            p.score += 200;
        }

        // death
        if (this.y + this.size > canvas.height) {
            p.pucks -= 1;
            if (p.pucks == 0) {
                p.dead = true;
            }
            else {
                this.x = 1050 - Math.random() * 950;
                this.y = 500 - Math.random() * 250;
                if (Math.random() > .5) {
                    this.velX = -this.velX;
                }
            }

        }

    }


}