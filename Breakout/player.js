class Player {

  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 50;

    this.velX = 0;

    this.width = 120;
    this.height = 15
    this.dead = false;
    this.pucks = 3; //number of paddles
    this.deadOnGroundCount = 0;

    this.pipeRandomNo = 0;

    this.color = this.randomColor();

    this.wall = new Wall(this);

    this.puck = new Puck(this);


    this.isBest = false;

    // genome PROJECT SPECIFIC HACK
    // Vision values
    this.vision0 = 0; // paddle x position
    this.vision1 = 0; // puck x position
    this.vision2 = 0; // puck y position

    // every brick
    this.visionR0B0 = 0; // 
    this.visionR0B1 = 0; // 
    this.visionR0B2 = 0; // 
    this.visionR0B3 = 0; // 
    this.visionR0B4 = 0; // 
    this.visionR0B5 = 0; // 
    this.visionR0B6 = 0; // 
    this.visionR0B7 = 0; // 

    this.visionR1B0 = 0; // 
    this.visionR1B1 = 0; // 
    this.visionR1B2 = 0; // 
    this.visionR1B3 = 0; // 
    this.visionR1B4 = 0; // 
    this.visionR1B5 = 0; // 
    this.visionR1B6 = 0; // 
    this.visionR1B7 = 0; // 

    this.visionR2B0 = 0; // 
    this.visionR2B1 = 0; // 
    this.visionR2B2 = 0; // 
    this.visionR2B3 = 0; // 
    this.visionR2B4 = 0; // 
    this.visionR2B5 = 0; // 
    this.visionR2B6 = 0; // 
    this.visionR2B7 = 0; // 

    this.visionR3B0 = 0; // 
    this.visionR3B1 = 0; // 
    this.visionR3B2 = 0; // 
    this.visionR3B3 = 0; // 
    this.visionR3B4 = 0; // 
    this.visionR3B5 = 0; // 
    this.visionR3B6 = 0; // 
    this.visionR3B7 = 0; // 

    // Response values
    this.response0 = 0; // left
    this.response1 = 0; // right


    //-----------------------------------------------------------------------
    //neat stuff
    this.fitness = 0;
    this.vision = []; //the input array fed into the neuralNet
    this.decision = []; //the out put of the NN
    this.unadjustedFitness;
    this.lifespan = 0; //how long the player lived for this.fitness
    this.bestScore = 0; //stores the this.score achieved used for replay
    this.dead = false;
    this.score = 0; // 0  account for two new pipes to the left
    this.gen = 0;

    this.species = 0;

    this.genomeInputs = 8; //17
    this.genomeOutputs = 2;

    this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
  }

  // rgb(0,0,255)
  randomColor() {
    var r = Math.round(Math.random() * 256);
    var g = Math.round(Math.random() * 256);
    var b = Math.round(Math.random() * 256);
    var clr = "rgb(" + r + "," + g + "," + b + ")";
    return clr;
  }

  show() {
    //set fill color
    fill(this.color);

    this.wall.show();
    this.puck.show();

    // show paddle
    strokeWeight(1);
    stroke(64);
    rect(this.x, this.y, this.width, this.height);

  }


  move() {

    this.x += this.velX;

    if (this.velX < 0) {
      this.velX += .4;
    }
    if (this.velX > 0) {
      this.velX -= .4;
    }
  }


  update() {
    this.lifespan++;
    this.puck.update();

    this.move();

    if (!dieOff) {
      this.checkCollisions();
    }
  }

  checkCollisions() {
    if (!this.dead) {
      pauseBecauseDead = false;
    }


    // x boundaries
    if (this.x < 5) {
      this.x = 5;
    }

    if (this.x + this.width > canvas.width - 5) {
      this.x = canvas.width - this.width - 5;
    }

  }

  // ACTIONS


  right() {
    if (!this.dead && !this.isOnGround) {
      this.velX += 3;
    }
  }

  left() {
    if (!this.dead && !this.isOnGround) {
      this.velX += -3;
    }
  }

  //-------------------------------------------------------------------neat functions
  look() {
    //uses condensing filter
    this.vision = [];
    this.vision[0] = map(this.puck.x - this.x, -canvas.width, canvas.width, -1, 1); //delta paddle to puck

    //this.vision[1] = map(this.puck.x, 0, canvas.width, 0, 1); // puck x 
    this.vision[1] = map(this.puck.y, 0, canvas.height, 0, 1); // puck y


    //Blocks with 2x2 filter condensing
    var block1 = ((this.wall.rows[0].bricks[0].visible ? 1 : 0) + (this.wall.rows[0].bricks[1].visible ? 1 : 0) + (this.wall.rows[1].bricks[0].visible ? 1 : 0) + (this.wall.rows[1].bricks[1].visible ? 1 : 0)) / 4;
    var block2 = ((this.wall.rows[0].bricks[2].visible ? 1 : 0) + (this.wall.rows[0].bricks[3].visible ? 1 : 0) + (this.wall.rows[1].bricks[2].visible ? 1 : 0) + (this.wall.rows[1].bricks[3].visible ? 1 : 0)) / 4;
    var block3 = ((this.wall.rows[0].bricks[4].visible ? 1 : 0) + (this.wall.rows[0].bricks[5].visible ? 1 : 0) + (this.wall.rows[1].bricks[4].visible ? 1 : 0) + (this.wall.rows[1].bricks[5].visible ? 1 : 0)) / 4;
    var block4 = ((this.wall.rows[0].bricks[6].visible ? 1 : 0) + (this.wall.rows[0].bricks[7].visible ? 1 : 0) + (this.wall.rows[1].bricks[6].visible ? 1 : 0) + (this.wall.rows[1].bricks[7].visible ? 1 : 0)) / 4;
    var block5 = ((this.wall.rows[0].bricks[8].visible ? 1 : 0) + (this.wall.rows[0].bricks[9].visible ? 1 : 0) + (this.wall.rows[1].bricks[8].visible ? 1 : 0) + (this.wall.rows[1].bricks[9].visible ? 1 : 0)) / 4;
    var block6 = ((this.wall.rows[0].bricks[10].visible ? 1 : 0) + (this.wall.rows[0].bricks[11].visible ? 1 : 0) + (this.wall.rows[1].bricks[10].visible ? 1 : 0) + (this.wall.rows[1].bricks[11].visible ? 1 : 0)) / 4;
    var block7 = ((this.wall.rows[0].bricks[12].visible ? 1 : 0) + (this.wall.rows[0].bricks[13].visible ? 1 : 0) + (this.wall.rows[1].bricks[12].visible ? 1 : 0) + (this.wall.rows[1].bricks[13].visible ? 1 : 0)) / 4;


    var block8 = ((this.wall.rows[2].bricks[0].visible ? 1 : 0) + (this.wall.rows[2].bricks[1].visible ? 1 : 0) + (this.wall.rows[3].bricks[0].visible ? 1 : 0) + (this.wall.rows[3].bricks[1].visible ? 1 : 0)) / 4;
    var block9 = ((this.wall.rows[2].bricks[2].visible ? 1 : 0) + (this.wall.rows[2].bricks[3].visible ? 1 : 0) + (this.wall.rows[3].bricks[2].visible ? 1 : 0) + (this.wall.rows[3].bricks[3].visible ? 1 : 0)) / 4;
    var block10 = ((this.wall.rows[2].bricks[4].visible ? 1 : 0) + (this.wall.rows[2].bricks[5].visible ? 1 : 0) + (this.wall.rows[3].bricks[4].visible ? 1 : 0) + (this.wall.rows[3].bricks[5].visible ? 1 : 0)) / 4;
    var block11 = ((this.wall.rows[2].bricks[6].visible ? 1 : 0) + (this.wall.rows[2].bricks[7].visible ? 1 : 0) + (this.wall.rows[3].bricks[6].visible ? 1 : 0) + (this.wall.rows[3].bricks[7].visible ? 1 : 0)) / 4;
    var block12 = ((this.wall.rows[2].bricks[8].visible ? 1 : 0) + (this.wall.rows[2].bricks[9].visible ? 1 : 0) + (this.wall.rows[3].bricks[8].visible ? 1 : 0) + (this.wall.rows[3].bricks[9].visible ? 1 : 0)) / 4;
    var block13 = ((this.wall.rows[2].bricks[10].visible ? 1 : 0) + (this.wall.rows[2].bricks[11].visible ? 1 : 0) + (this.wall.rows[3].bricks[10].visible ? 1 : 0) + (this.wall.rows[3].bricks[11].visible ? 1 : 0)) / 4;
    var block14 = ((this.wall.rows[2].bricks[12].visible ? 1 : 0) + (this.wall.rows[2].bricks[13].visible ? 1 : 0) + (this.wall.rows[3].bricks[12].visible ? 1 : 0) + (this.wall.rows[3].bricks[13].visible ? 1 : 0)) / 4;

    this.vision[2] = (block1 + block2 + block8 + block9) / 4;
    this.vision[3] = (block2 + block3 + block9 + block10) / 4;
    this.vision[4] = (block3 + block4 + block10 + block11) / 4;
    this.vision[5] = (block4 + block5 + block11 + block12) / 4;
    this.vision[6] = (block5 + block6 + block12 + block13) / 4;
    this.vision[7] = (block6 + block7 + block13 + block14) / 4;

    //this.vision[3] = (this.wall.rows[0].bricks[0]) ? 1 : 0;
    //this.vision[4] = (this.wall.rows[0].bricks[1]) ? 1 : 0;
    //this.vision[5] = (this.wall.rows[0].bricks[2]) ? 1 : 0;
    //this.vision[6] = (this.wall.rows[0].bricks[3]) ? 1 : 0;
    //this.vision[7] = (this.wall.rows[0].bricks[4]) ? 1 : 0;
    //this.vision[8] = (this.wall.rows[0].bricks[5]) ? 1 : 0;
    //this.vision[9] = (this.wall.rows[0].bricks[6]) ? 1 : 0;
    //this.vision[10] = (this.wall.rows[0].bricks[7]) ? 1 : 0;
    //this.vision[11] = (this.wall.rows[0].bricks[8]) ? 1 : 0;
    //this.vision[12] = (this.wall.rows[0].bricks[9]) ? 1 : 0;
    //this.vision[13] = (this.wall.rows[0].bricks[10]) ? 1 : 0;
    //this.vision[14] = (this.wall.rows[0].bricks[11]) ? 1 : 0;
    //this.vision[15] = (this.wall.rows[0].bricks[12]) ? 1 : 0;
    //this.vision[16] = (this.wall.rows[0].bricks[13]) ? 1 : 0;


    //this.vision[17] = (this.wall.rows[1].bricks[0]) ? 1 : 0;
    //this.vision[18] = (this.wall.rows[1].bricks[1]) ? 1 : 0;
    //this.vision[19] = (this.wall.rows[1].bricks[2]) ? 1 : 0;
    //this.vision[20] = (this.wall.rows[1].bricks[3]) ? 1 : 0;
    //this.vision[21] = (this.wall.rows[1].bricks[4]) ? 1 : 0;
    //this.vision[22] = (this.wall.rows[1].bricks[5]) ? 1 : 0;
    //this.vision[23] = (this.wall.rows[1].bricks[6]) ? 1 : 0;
    //this.vision[24] = (this.wall.rows[1].bricks[7]) ? 1 : 0;
    //this.vision[25] = (this.wall.rows[1].bricks[8]) ? 1 : 0;
    //this.vision[26] = (this.wall.rows[1].bricks[9]) ? 1 : 0;
    //this.vision[27] = (this.wall.rows[1].bricks[10]) ? 1 : 0;
    //this.vision[28] = (this.wall.rows[1].bricks[11]) ? 1 : 0;
    //this.vision[29] = (this.wall.rows[1].bricks[12]) ? 1 : 0;
    //this.vision[30] = (this.wall.rows[1].bricks[13]) ? 1 : 0;

    /* this.vision[31] = (this.wall.rows[2].bricks[0]) ? 1 : 0;
    this.vision[32] = (this.wall.rows[2].bricks[1]) ? 1 : 0;
    this.vision[33] = (this.wall.rows[2].bricks[2]) ? 1 : 0;
    this.vision[34] = (this.wall.rows[2].bricks[3]) ? 1 : 0;
    this.vision[35] = (this.wall.rows[2].bricks[4]) ? 1 : 0;
    this.vision[36] = (this.wall.rows[2].bricks[5]) ? 1 : 0;
    this.vision[37] = (this.wall.rows[2].bricks[6]) ? 1 : 0;
    this.vision[38] = (this.wall.rows[2].bricks[7]) ? 1 : 0;
    this.vision[39] = (this.wall.rows[2].bricks[8]) ? 1 : 0;
    this.vision[40] = (this.wall.rows[2].bricks[9]) ? 1 : 0;
    this.vision[41] = (this.wall.rows[2].bricks[10]) ? 1 : 0;
    this.vision[42] = (this.wall.rows[2].bricks[11]) ? 1 : 0;
    this.vision[43] = (this.wall.rows[2].bricks[12]) ? 1 : 0;
    this.vision[44] = (this.wall.rows[2].bricks[13]) ? 1 : 0;

    this.vision[45] = (this.wall.rows[3].bricks[0]) ? 1 : 0;
    this.vision[46] = (this.wall.rows[3].bricks[1]) ? 1 : 0;
    this.vision[47] = (this.wall.rows[3].bricks[2]) ? 1 : 0;
    this.vision[48] = (this.wall.rows[3].bricks[3]) ? 1 : 0;
    this.vision[49] = (this.wall.rows[3].bricks[4]) ? 1 : 0;
    this.vision[50] = (this.wall.rows[3].bricks[5]) ? 1 : 0;
    this.vision[51] = (this.wall.rows[3].bricks[6]) ? 1 : 0;
    this.vision[52] = (this.wall.rows[3].bricks[7]) ? 1 : 0;
    this.vision[53] = (this.wall.rows[3].bricks[8]) ? 1 : 0;
    this.vision[54] = (this.wall.rows[3].bricks[9]) ? 1 : 0;
    this.vision[55] = (this.wall.rows[3].bricks[10]) ? 1 : 0;
    this.vision[56] = (this.wall.rows[3].bricks[11]) ? 1 : 0;
    this.vision[57] = (this.wall.rows[3].bricks[12]) ? 1 : 0;
    this.vision[58] = (this.wall.rows[3].bricks[13]) ? 1 : 0; */


    // set player object vision properties
    /* this.vision0 = this.velY;
    this.vision1 = this.x;

    this.vision2 = distanceToClosestPipe;
    this.vision3 = closestOver;
    this.vision4 = closestBelow;
    this.vision5 = distanceToFurthestPipe;
    this.vision6 = furthestOver;
    this.vision7 = furthestBelow;
    this.vision8 = waveX;
    this.vision9 = waveY; */
  }

  lookAllBricks() {
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    this.vision = [];
    this.vision[0] = map(this.x, 0, canvas.width, 0, 1); //paddle x

    this.vision[1] = map(this.puck.x, 0, canvas.width, 0, 1); // puck x 
    this.vision[2] = map(this.puck.y, 0, canvas.width, 0, 1); // puck y


    //Blocks
    this.vision[3] = (this.wall.rows[0].bricks[0]) ? 1 : 0;
    this.vision[4] = (this.wall.rows[0].bricks[1]) ? 1 : 0;
    this.vision[5] = (this.wall.rows[0].bricks[2]) ? 1 : 0;
    this.vision[6] = (this.wall.rows[0].bricks[3]) ? 1 : 0;
    this.vision[7] = (this.wall.rows[0].bricks[4]) ? 1 : 0;
    this.vision[8] = (this.wall.rows[0].bricks[5]) ? 1 : 0;
    this.vision[9] = (this.wall.rows[0].bricks[6]) ? 1 : 0;
    this.vision[10] = (this.wall.rows[0].bricks[7]) ? 1 : 0;
    this.vision[11] = (this.wall.rows[0].bricks[8]) ? 1 : 0;
    this.vision[12] = (this.wall.rows[0].bricks[9]) ? 1 : 0;
    this.vision[13] = (this.wall.rows[0].bricks[10]) ? 1 : 0;
    this.vision[14] = (this.wall.rows[0].bricks[11]) ? 1 : 0;
    this.vision[15] = (this.wall.rows[0].bricks[12]) ? 1 : 0;
    this.vision[16] = (this.wall.rows[0].bricks[13]) ? 1 : 0;


    this.vision[17] = (this.wall.rows[1].bricks[0]) ? 1 : 0;
    this.vision[18] = (this.wall.rows[1].bricks[1]) ? 1 : 0;
    this.vision[19] = (this.wall.rows[1].bricks[2]) ? 1 : 0;
    this.vision[20] = (this.wall.rows[1].bricks[3]) ? 1 : 0;
    this.vision[21] = (this.wall.rows[1].bricks[4]) ? 1 : 0;
    this.vision[22] = (this.wall.rows[1].bricks[5]) ? 1 : 0;
    this.vision[23] = (this.wall.rows[1].bricks[6]) ? 1 : 0;
    this.vision[24] = (this.wall.rows[1].bricks[7]) ? 1 : 0;
    this.vision[25] = (this.wall.rows[1].bricks[8]) ? 1 : 0;
    this.vision[26] = (this.wall.rows[1].bricks[9]) ? 1 : 0;
    this.vision[27] = (this.wall.rows[1].bricks[10]) ? 1 : 0;
    this.vision[28] = (this.wall.rows[1].bricks[11]) ? 1 : 0;
    this.vision[29] = (this.wall.rows[1].bricks[12]) ? 1 : 0;
    this.vision[30] = (this.wall.rows[1].bricks[13]) ? 1 : 0;

    this.vision[31] = (this.wall.rows[2].bricks[0]) ? 1 : 0;
    this.vision[32] = (this.wall.rows[2].bricks[1]) ? 1 : 0;
    this.vision[33] = (this.wall.rows[2].bricks[2]) ? 1 : 0;
    this.vision[34] = (this.wall.rows[2].bricks[3]) ? 1 : 0;
    this.vision[35] = (this.wall.rows[2].bricks[4]) ? 1 : 0;
    this.vision[36] = (this.wall.rows[2].bricks[5]) ? 1 : 0;
    this.vision[37] = (this.wall.rows[2].bricks[6]) ? 1 : 0;
    this.vision[38] = (this.wall.rows[2].bricks[7]) ? 1 : 0;
    this.vision[39] = (this.wall.rows[2].bricks[8]) ? 1 : 0;
    this.vision[40] = (this.wall.rows[2].bricks[9]) ? 1 : 0;
    this.vision[41] = (this.wall.rows[2].bricks[10]) ? 1 : 0;
    this.vision[42] = (this.wall.rows[2].bricks[11]) ? 1 : 0;
    this.vision[43] = (this.wall.rows[2].bricks[12]) ? 1 : 0;
    this.vision[44] = (this.wall.rows[2].bricks[13]) ? 1 : 0;

    this.vision[45] = (this.wall.rows[3].bricks[0]) ? 1 : 0;
    this.vision[46] = (this.wall.rows[3].bricks[1]) ? 1 : 0;
    this.vision[47] = (this.wall.rows[3].bricks[2]) ? 1 : 0;
    this.vision[48] = (this.wall.rows[3].bricks[3]) ? 1 : 0;
    this.vision[49] = (this.wall.rows[3].bricks[4]) ? 1 : 0;
    this.vision[50] = (this.wall.rows[3].bricks[5]) ? 1 : 0;
    this.vision[51] = (this.wall.rows[3].bricks[6]) ? 1 : 0;
    this.vision[52] = (this.wall.rows[3].bricks[7]) ? 1 : 0;
    this.vision[53] = (this.wall.rows[3].bricks[8]) ? 1 : 0;
    this.vision[54] = (this.wall.rows[3].bricks[9]) ? 1 : 0;
    this.vision[55] = (this.wall.rows[3].bricks[10]) ? 1 : 0;
    this.vision[56] = (this.wall.rows[3].bricks[11]) ? 1 : 0;
    this.vision[57] = (this.wall.rows[3].bricks[12]) ? 1 : 0;
    this.vision[58] = (this.wall.rows[3].bricks[13]) ? 1 : 0;


    // set player object vision properties
    /* this.vision0 = this.velY;
    this.vision1 = this.x;

    this.vision2 = distanceToClosestPipe;
    this.vision3 = closestOver;
    this.vision4 = closestBelow;
    this.vision5 = distanceToFurthestPipe;
    this.vision6 = furthestOver;
    this.vision7 = furthestBelow;
    this.vision8 = waveX;
    this.vision9 = waveY; */
  }


  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //gets the output of the this.brain then converts them to actions
  think() {

    var max = 0;
    var maxIndex = 0;
    //get the output of the neural network
    this.decision = this.brain.feedForward(this.vision);


    if (this.decision[0] > 0.6) {
      this.right();
    }

    if (this.decision[1] > 0.6) {
      this.left();
    }

    this.response0 = this.decision[0];
    this.response1 = this.decision[1];

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //returns a clone of this player with the same brian
  clone() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;
    print("cloning done");
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
  //this fuction does that

  cloneForReplay() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //fot Genetic algorithm
  calculateFitness() {
    this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  crossover(parent2) {

    var child = new Player();
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
  }

}
