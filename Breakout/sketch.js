var player;

var army;

var pauseBecauseDead;
var yetiSprite;
var bestYetiSprite;
var soldierSprite;
var caveSprite;
var campSprite;

var dieOff = false;

var dayCounter = 360 * Math.random();

//---------------------------------------- neat globals

var nextConnectionNo = 1000;
var population;
var speciesCount = 0; // global variable (yuck) for number of species
var speed = 120; // 60

var superSpeed = 1;  //  Integer. Number of population life cycles per game cycle
var showBest = false; //true if only show the best of the previous generation
var runBest = false; //true if replaying the best ever game
var humanPlaying = false; //true if the user is playing

var humanPlayer;
var currentBest;

var showBrain = false;
var showBestEachGen = false;
var upToGen = 0;
var genPlayerTemp; //player

var showNothing = false;



function preload() {

  //blockSprite = loadImage("images/block.png");

  backgroundSprite = loadImage("images/background.png");

}

function setup() {
  window.canvas = createCanvas(1170, 900);
  player = new Player();
  pauseBecauseDead = false;


  population = new Population(300);
  //humanPlayer = new Player();
  //humanPlaying = true;
  if (humanPlaying) {
    speed = 20;
  }
  frameRate(speed);

}

function draw() {

  dayCounter++;
  if (dayCounter > 3600) { dayCounter = 0 }

  drawToScreen(dayCounter);

  if (showBestEachGen) { //show the best of each gen
    showBestPlayersForEachGeneration();
  } else if (humanPlaying) { // if the user is controling the ship
    showHumanPlaying();
  } else if (runBest) { // if replaying the best ever game
    showBestEverPlayer();
  } else { //if just evolving normally
    if (!population.done()) { //if any players are alive then update them
      population.updateAlive();
    } else { //all dead
      //genetic algorithm
      population.naturalSelection();
    }
  }

  drawBrain();
  writeInfo();

}




//--------------------------------------
function showBestPlayersForEachGeneration() {
  if (!genPlayerTemp.dead) { //if current gen player is not dead then update it

    genPlayerTemp.look();
    genPlayerTemp.think();
    genPlayerTemp.update();
    genPlayerTemp.show();
  } else { //if dead move on to the next generation
    upToGen++;
    if (upToGen >= population.genPlayers.length) { //if at the end then return to the start and stop doing it
      upToGen = 0;
      showBestEachGen = false;
    } else { //if not at the end then get the next generation
      genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
    }
  }
}

//--------------------------------------
function showHumanPlaying() {
  if (!humanPlayer.dead) { //if the player isnt dead then move and show the player based on input
    humanPlayer.look();
    humanPlayer.update();
    humanPlayer.show();
  } else {

    humanPlaying = false; //once done return to ai
  }
}

//--------------------------------------
function showBestEverPlayer() {
  if (!population.bestPlayer.dead) { //if best player is not dead
    population.bestPlayer.look();
    population.bestPlayer.think();
    population.bestPlayer.update();
    population.bestPlayer.show();
  } else { //once dead
    runBest = false; //stop replaying it
    population.bestPlayer = population.bestPlayer.cloneForReplay(); //reset the best player so it can play again
  }
}


//-------------------------------------
//draws the display screen
function drawToScreen(dCounter) {
  if (!showNothing) {
    //pretty stuff

    image(backgroundSprite, 0, 0, 1180, 900);

    // showAll();
    // updateAll();
    // drawBrain();

  }
}




//---------------------------------------
function drawBrain() { //show the brain of whatever genome is currently showing

  strokeWeight(0);
  fill(150, 150, 150);
  //rect(1180, 0, canvas.width, canvas.height);
  //image(panelBackgroundSprite, 1166, 0, 470, canvas.height);

  var startX = 340;
  var startY = 290;
  var w = 680;
  var h = 560;

  if (runBest) {
    population.bestPlayer.brain.drawGenome(startX, startY, w, h);
  } else
    if (humanPlaying) {
      showBrain = false;
    } else if (showBestEachGen) {
      genPlayerTemp.brain.drawGenome(startX, startY, w, h);
    } else {

      currentBest = population.getCurrentBest();
      currentBest.brain.drawGenomeDetail(startX, startY, w, h, currentBest);


    }
}
//--------------------------------------
//writes info about the current player
function writeInfo() {
  fill(255);
  stroke(255);
  textAlign(LEFT);
  textSize(29);
  textFont('Lucida Sans Unicode');//Tahoma, Geneva, sans-serif
  //textAlign(CENTER);
  if (humanPlaying) {

    text("Human Player", 30, 40);
    //text("TIME: " + humanPlayer.timer, 870, 40);
    text("SCORE: " + humanPlayer.score.toFixed(0), 640, 35);
    text("PUCKS: " + humanPlayer.pucks, 1020, 35);

  } else {
    var bestCurrentPlayer = population.getCurrentBest();

    text("PLAYERS: " + population.leftAlive, 30, 35);
    text("GEN: " + population.gen, 370, 35);
    //text("TIME: " + bestCurrentPlayer.timer, 870, 35);
    text("SCORE: " + bestCurrentPlayer.score.toFixed(0), 640, 35);
    text("PUCKS: " + bestCurrentPlayer.pucks, 1020, 35);

  }


}



function keyPressed() {
  switch (key) {
    case 'A':
      if (humanPlaying) {
        humanPlayer.left();
      }
      break;

    case 'D':
      if (humanPlaying) {
        humanPlayer.right();
      }
      break;



    case '=': //speed up frame rate
      speed += 10;
      frameRate(speed);
      print(speed);
      break;

    case '-': //slow down frame rate
      if (speed > 10) {
        speed -= 10;
        frameRate(speed);
        print(speed);
      }
      break;

    case 'B': //run the best
      runBest = !runBest;
      break;

    case 'G': //show generations
      showBestEachGen = !showBestEachGen;
      upToGen = 0;
      genPlayerTemp = population.genPlayers[upToGen].clone();
      break;

    case 'N': //show absolutely nothing in order to speed up computation
      showNothing = !showNothing;
      break;

    case 'P': //play
      humanPlaying = !humanPlaying;
      humanPlayer = new Player();
      break;
  }

  //any of the arrow keys
  switch (keyCode) {

    case RIGHT_ARROW: //right is used to move through the generations

      if (showBestEachGen) { //if showing the best player each generation then move on to the next generation
        upToGen++;
        if (upToGen >= population.genPlayers.length) { //if reached the current generation then exit out of the showing generations mode
          showBestEachGen = false;
        } else {
          genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
        }
      }
      break;
  }
}
