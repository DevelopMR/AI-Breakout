class Wall {
    constructor(player) {

        this.rows = [];

        this.rows[0] = new Row(0, player);
        this.rows[1] = new Row(1, player);
        this.rows[2] = new Row(2, player);
        this.rows[3] = new Row(3, player);

    }

    show() {

        this.rows.forEach(row => {
            row.show();
        })
    }

    update() {
        this.rows.forEach(row => {
            row.update();
        })

    }

    collided(p) {

        var result = false;
        this.rows.forEach(row => {
            if (row.collided(p)) {
                result = true;
            }
        })

        return result;

    }

    // NOT needed for blocks
    detected(p) {
        var result = false;
        this.rows.forEach(row => {
            if (row.detected(p)) {
                result = true;
            }
        })

        return result;


    }

}