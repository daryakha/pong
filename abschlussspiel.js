//_____CC1 // Herr Coenen // WS 21/22_____//
//_____Pong Abschlussspiel // Darya Khaylo_____//

// size variables
let canvasWidth = 1080;
let canvasHeight = 720;
let fieldWidth = 700;
let fieldHeight = 480;

let dottedLineStartingPoint = 145;

// screen variables
let currentScreen = 0;
let WELCOME_SCREEN = 0;
let INSTRUCTIONS_SCREEN = -1;
let GAME_SCREEN = 1;
let PLAYER1_WON_SCREEN = 2;
let PLAYER2_WON_SCREEN = 3;

// score variables
let scorePlayer1 = 0;
let scorePlayer2 = 0;

// image variables
let gamescreen;
let welcomescreenNeutral;
let welcomescreenStartGame;
let welcomescreenInstructions;
let instructionsscreenNeutral;
let instructionsscreenBack;
let instructionsscreenContinue;
let player1won;
let player1wonPlayAgain;
let player1wonStartMenu;
let player2won;
let player2wonPlayAgain;
let player2wonStartMenu;
let flame;
let icecube;
let happyface;
let sadface;

// sound variables
let gamewon;
let ball_hits_border;
let ball_hits_paddle;
let freeze;
let boost;
let countDown;

//speed variables
let boosterSpeed = 36.65;
let ballStop = false;

//item variables
let boosterTouched = false;
let freezeTouchedPlayer1 = false;
let freezeTouchedPlayer2 = false;
let activatedPlayer1 = false; 
let activatedPlayer2 = false;

function preload() {
//______IMAGES____________________________________________________________________________________________________
  gamescreen = loadImage("images/PongGameScreen.png");
  welcomescreenNeutral = loadImage("images/WelcomeScreen-neutral.png");
  welcomescreenStartGame = loadImage("images/WelcomeScreen-startGame.png");
  welcomescreenInstructions = loadImage("images/WelcomeScreen-instructions.png");
  instructionsscreenNeutral = loadImage("images/Instructions.png");
  instructionsscreenBack = loadImage("images/Instructions-back.png");
  instructionsscreenContinue = loadImage("images/Instructions-continue.png");
  player1won = loadImage("images/Player_1_won.png");
  player1wonPlayAgain = loadImage("images/Player_1_won-play_again.png");
  player1wonStartMenu = loadImage("images/Player_1_won-start_menu.png");
  player2won = loadImage("images/Player_2_won.png");
  player2wonPlayAgain = loadImage("images/Player_2_won-play_again.png");
  player2wonStartMenu = loadImage("images/Player_2_won-start_menu.png");
  flame = loadImage("images/flame.png");
  icecube = loadImage("images/icecube.png");
  happyface = loadImage("images/Gesicht-lächeln.png");
  sadface = loadImage("images/Gesicht-aua.png");
//______SOUNDS____________________________________________________________________________________________________
  soundFormats('mp3', 'wav');
  gamewon = loadSound('soundclips/game_won.mp3');
  ball_hits_border = loadSound('soundclips/sport_table_tennis_ping_pong_ball_bounce_hit_table_003.mp3');
  ball_hits_paddle = loadSound('soundclips/zapsplat_sport_table_tennis_ping_pong_ball_single_bounce_21160.mp3');
  freeze = loadSound('soundclips/446112__justinvoke__freeze.wav');
  boost = loadSound('soundclips/comedy_missle_launch.wav');
  countDown = loadSound('soundclips/mixkit-simple-countdown-922.wav');
}

//______OBJECTS___________________________________________________________________________________________________

let paddle1 = {
  x: 200,
  y: canvasHeight / 2 + 20,
  movement: 18,
  touchTop: false,
  touchBottom: false,
  colour_r: 255,
  colour_g: 255,
  colour_b: 255,
};

let paddle2 = {
  x: 880,
  y: canvasHeight / 2 + 20,
  movement: 18,
  touchTop: false,
  touchBottom: false,
  colour_r: 255,
  colour_g: 255,
  colour_b: 255,
};

let gameBall = {
  x: canvasWidth/2,
  y: canvasHeight/2 + 20,
  speed: 15,
  direction: createNewBallDirection(),
  changeFace: false,
};

let boosterItem = {
  x: canvasWidth/2,
  y: 0, 
};

let freezeItem = {
  x: canvasWidth/2,
  y: 0,
  positionXPlayer1: 340,
  positionYPlayer1: 660,
  positionXPlayer2: 675,
  positionYPlayer2: 660,
};

//______MAIN_GAME_FUNCTONS________________________________________________________________________________________

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  image(gamescreen, canvasWidth/2, canvasHeight/2, 1080, 720);
  rectMode(CENTER, CENTER);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  frameRate(30);
}

function field() {
  push();
  noFill();
  stroke("white");
  rect(canvasWidth / 2, canvasHeight / 2 + 20, fieldWidth, fieldHeight);
  // middle line: draws a 20px line starting from 145 px and shifts the beginning of the next line by 30 px after every drawn line
  dottedLineStartingPoint = 145;
  for (i = 0; i < 16; i++) {
    line(540, dottedLineStartingPoint, 540, dottedLineStartingPoint + 20);
    dottedLineStartingPoint += 30;
  }
  pop();
}

function score() {
  textSize(30);
  fill(255);
  text(scorePlayer1, canvasWidth / 3, canvasHeight / 4);
  text(scorePlayer2, (canvasWidth / 3) * 2, canvasHeight / 4);
  if (scorePlayer1 === 10) {
    // player 1 won
    currentScreen = PLAYER1_WON_SCREEN; // = 2
    gamewonSound();
  }
  if (scorePlayer2 === 10) {
    // player 2 won
    currentScreen = PLAYER2_WON_SCREEN; // = 3
    gamewonSound();
  }
}

function overlay() {
  image(gamescreen, canvasWidth/2, canvasHeight/2, 1080, 720);
  field();
  score();
  drawPaddle(paddle1, paddle2);
}

function overlayItem(x, y) {
  fill(0); // black
  rect(x, y, 60, 60);
}

function drawPaddle(paddle1, paddle2) {
   if (activatedPlayer1 === true) {
    paddle2.colour_r = 0;
    paddle2.colour_g = 165; // blue
    paddle2.colour_b = 255;
  } else {  
    paddle2.colour_r = 255;
    paddle2.colour_g = 255; // white
    paddle2.colour_b = 255;
  }

  if (activatedPlayer2 === true) {
    paddle1.colour_r = 0;
    paddle1.colour_g = 165; // blue
    paddle1.colour_b = 255;
  } else {  
    paddle1.colour_r = 255;
    paddle1.colour_g = 255; // white
    paddle1.colour_b = 255;
  }
  //draws paddle 1
  fill(paddle1.colour_r, paddle1.colour_g, paddle1.colour_b);
  rect(paddle1.x, paddle1.y, 5, 100);
  //draws paddle 2
  fill(paddle2.colour_r, paddle2.colour_g, paddle2.colour_b);
  rect(paddle2.x, paddle2.y, 5, 100);
}

function paddleMovement() {
  if (keyIsDown(87) && activatedPlayer2 === false) { // w // prevents paddle1 from glitching and moving up while frozen if player1 presses 'w' at the same time as the freeze item gets activated with 'k'
    //up
    paddle1.y = paddle1.y - paddle1.movement;
  }
  if (keyIsDown(83) && activatedPlayer2 === false) { // s // prevents paddle1 from glitching and moving down while frozen if player1 presses 's' at the same time as the freeze item gets activated with 'k'
    //down
    paddle1.y = paddle1.y + paddle1.movement;
  }
  if (keyIsDown(79) && activatedPlayer1 === false) { // o // prevents paddle2 from glitching and moving up while frozen if player2 presses 'o' at the same time as the freeze item gets activated with 'd'
    //up
    paddle2.y = paddle2.y - paddle2.movement;
  }
  if (keyIsDown(76) && activatedPlayer1 === false) { // l // prevents paddle2 from glitching and moving down while frozen if player2 presses 'l' at the same time as the freeze item gets activated with 'd'
    //down
    paddle2.y = paddle2.y + paddle2.movement;
  }
  // conditons touching border
  // paddle left player
  if (paddle1.y <= 200) {
    paddle1.movement = 0;
    paddle1.touchTop = true;
  }
  if (paddle1.y > 550) {
    paddle1.movement = 0;
    paddle1.touchBottom = true;
  }
  // paddle right player
  if (paddle2.y <= 200) {
    paddle2.movement = 0;
    paddle2.touchTop = true;
  }
  if (paddle2.y > 550) {
    paddle2.movement = 0;
    paddle2.touchBottom = true;
  }
  // left player
  if (paddle1.movement === 0) {
    if (keyIsDown(83) && paddle1.touchTop === true) {
      //down pressed
      paddle1.movement = 18;
      paddle1.touchTop = false;
    }
    if (keyIsDown(87) && paddle1.touchBottom === true) {
      //up pressed
      paddle1.movement = 18;
      paddle1.touchBottom = false;
    }
  }
  // right player
  if (paddle2.movement === 0) {
    if (keyIsDown(76) && paddle2.touchTop === true) {
      paddle2.movement = 18;
      paddle2.touchTop = false;
    }
    if (keyIsDown(79) && paddle2.touchBottom === true) {
      paddle2.movement = 18;
      paddle2.touchBottom = false;
    }
  }
}

function ball(object) {
  if (object.changeFace === false) {
    image(happyface, object.x, object.y, 31.5, 45);
  }
  if (object.x <= 210 || object.x >= 860 || object.y <= 160 || object.y >= 600) {
    object.changeFace = true;
    image(sadface, object.x, object.y, 31.5, 45);
  }
  if (object.x > 350 || object.x < 750 || object.y > 280 || object.y < 470) {
    object.changeFace = false;
  }
}

function ballMovement(ball, paddle1, paddle2) {
  ballStop = false; // activates ballMovement() function in draw() function
  // basic ball movement
  ball.x = ball.x - ball.speed;
  ball.y = ball.y - ball.direction;
  // ball touching paddles
  // left player
  if (ball.x < 220 && ball.x >= 206 && paddle1.y - 50 <= ball.y && paddle1.y + 50 >= ball.y) {
    ball.speed = -ball.speed; // ball moves to the right
    ballHitsPaddleSound();
  } else if (ball.x < 0){
    scorePlayer2 += 1; // player 2 gets 1 point
    // reset postition ball
    ball.x = canvasWidth/2;
    ball.y = canvasHeight/2 + 20;
    ballStop = true; // deactivates ballmovement() function in draw() function
    setTimeout(ballMovement, 1000); // stops the ball for 1 sec when reset
    ball.direction = createNewBallDirection();
  }
  // right player
  if (ball.x > 860 && ball.x <= 874 && paddle2.y - 50 <= ball.y && paddle2.y + 50 >= ball.y) {
    ball.speed = -ball.speed; // ball moves to the left
    ballHitsPaddleSound();
  } else if (ball.x > 1080) {
    scorePlayer1 += 1; // player 1 gets 1 point
    // reset postition ball
    ball.x = canvasWidth/2;
    ball.y = canvasHeight/2 + 20;
    ballStop = true; // deactivates ballmovement() function in draw() function
    setTimeout(ballMovement, 1000); // stops the ball for 1 sec when reset
    ball.direction = createNewBallDirection();
  }
  // ball touching field border
  //_top______________bottom___________
  if (ball.y <= 163 || ball.y >= 597) {
    ball.direction = -ball.direction;
  }
}

function createNewBallDirection() {
  let value = random(4, 8); // value for vertical movement of the ball
  let direction = Math.round(Math.random());
  if (direction === 0) {
    direction = -value; // ball goes up
  } else if (direction === 1) {
    direction = value; // ball goes down
  }
  return direction;
}

function reset() {
  restartTimer();
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  frameCount = 0;
  freezeTouchedPlayer1 = false;
  freezeTouchedPlayer2 = false;
}

//______ITEMS_____________________________________________________________________________________________________

freezeItem.y = randomItemPosition();
boosterItem.y = randomItemPosition();

function randomItemPosition() {
  let itemPositionY = random(170, 590); // places item somewhere on the middle line of the field
  while ((itemPositionY > 330 && itemPositionY < 430) || (itemPositionY <= boosterItem.y + 45 && itemPositionY >= boosterItem.y - 45) || (itemPositionY <= freezeItem.y + 45 && itemPositionY >= freezeItem.y - 45)) { // avoids placing an item too close to the spawn point of the ball and avoids placing 2 items on top of each other
    itemPositionY = random(170, 590);
  }
  return itemPositionY;
}

function booster(boosterPosition, ballPosition) {
  image(flame, boosterPosition.x, boosterPosition.y, 55, 55);
  if ((ballPosition.x >= canvasWidth/2 - 14.5 && ballPosition.x <= canvasWidth/2 + 14.5) && (ballPosition.y >= boosterPosition.y - 25 && ballPosition.y <= boosterPosition.y + 25) && ballPosition.speed <= 0) { // does the ball touch the booster item and moves to the right? (x-position: -14.5 & +14.5; y-positon: -25 & + 25)
    ballPosition.speed = -boosterSpeed; // fast ball to the right
    boosterTouched = true;
  }
  if (ballPosition.speed === -boosterSpeed) {
    if (ballPosition.x <= 220 || ballPosition.x >= 860) { //ball touches left or right border
      ballPosition.speed = -15; // reset speed to default
      boosterTouched = false;
    }
  }
  if ((ballPosition.x >= canvasWidth/2 - 14.5 && ballPosition.x <= canvasWidth/2 + 14.5) && (ballPosition.y >= boosterPosition.y - 25 && ballPosition.y <= boosterPosition.y + 25) && ballPosition.speed >= 0) { // does the ball touch the booster item and moves to the left? (x-position: -14.5 & +14.5; y-positon: -25 & + 25)
    ballPosition.speed = boosterSpeed; // fast ball to the left
    boosterTouched = true;
  }
  if (ballPosition.speed === boosterSpeed) {
    if (ballPosition.x <= 220 || ballPosition.x >= 860) { //ball touches left or right border
      ballPosition.speed = 15; // reset speed to default
      boosterTouched = false;
    }
  }
}

function draw_and_collectFreezeItem(freezePosition, ballPosition) {
  image(icecube, freezePosition.x, freezePosition.y, 50, 50);
  if ((ballPosition.x >= canvasWidth/2 - 25 && ballPosition.x <= canvasWidth/2 + 25) && (ballPosition.y >= freezePosition.y - 25 && ballPosition.y <= freezePosition.y + 25) && ballPosition.speed <= 0) { // does the ball touch the freeze item and moves to the right? (x-positon & y-position: -25 & + 25)
    freezeTouchedPlayer1 = true;
  }
  if ((ballPosition.x >= canvasWidth/2 - 25 && ballPosition.x <= canvasWidth/2 + 25) && (ballPosition.y >= freezePosition.y - 25 && ballPosition.y <= freezePosition.y + 25) && ballPosition.speed >= 0) { // does the ball touch the freeze item and moves to the left? (x-positon & y-positon -25 & + 25)
    freezeTouchedPlayer2 = true;
  }   
}

function activateFreezeItem() {
  if (freezeTouchedPlayer1 === true && keyIsDown(68)) { // d
    freezeSound();
    activatedPlayer1 = true; 
    paddle2.movement = 0; //paddle stops
    setTimeout(reactivatePaddle, 1000);
    overlayItem(340, 660);
  }
  if (freezeTouchedPlayer2 === true && keyIsDown(75)) { // k
    freezeSound();
    activatedPlayer2 = true; 
    paddle1.movement = 0; //paddle stops
    setTimeout(reactivatePaddle, 1000);
    overlayItem(675, 660);
  }
}

function reactivatePaddle() {
  if (freezeTouchedPlayer1 === true && activatedPlayer1 === true) {
    paddle2.movement = 18;
    freezeTouchedPlayer1 = false;
    activatedPlayer1 = false; 
  }
  if (freezeTouchedPlayer2 === true && activatedPlayer2 === true) {
    paddle1.movement = 18;
    freezeTouchedPlayer2 = false;
    activatedPlayer2 = false; //
  }
}

//______COUNTDOWN_________________________________________________________________________________________________

//source: https://www.javascript-kurs.de/javascript-window-setInterval.htm
let timeLeft = 3;
let secondsCounter = setInterval(countdown, 1100);
function countdown() {
  if (currentScreen === 1) {
    timeLeft--; // output of current countdown and substraction of 1
  }
  if (timeLeft <= 0) {
    timeLeft = 0; // timeLeft doesn't show negative numbers
  }
  if (timeLeft === 0) {
    clearInterval(secondsCounter);
  }
}

function restartTimer() {
  timeLeft = 3; // reset countdown for GAME_SCREEN
  clearInterval(secondsCounter);
  secondsCounter = setInterval(countdown, 1200);
}

//______NAVIGATION________________________________________________________________________________________________

function textHighlight() {

  if (currentScreen === WELCOME_SCREEN) {
    if (mouseX > 385 && mouseX < 518 && mouseY > 505 && mouseY < 520) {
      image(welcomescreenStartGame, canvasWidth/2, canvasHeight/2);
    } else if (mouseX > 360 && mouseX < 518 && mouseY > 553 && mouseY < 567) {
      image(welcomescreenInstructions, canvasWidth/2, canvasHeight/2);
    } else {
      image(welcomescreenNeutral, canvasWidth/2, canvasHeight/2);
    }
  }
  
  if (currentScreen === INSTRUCTIONS_SCREEN) {
    if (mouseX > 184 && mouseX < 225 && mouseY > 664 && mouseY < 677) {
      image(instructionsscreenBack, canvasWidth/2, canvasHeight/2);
    } else if (mouseX > 537 && mouseX < 623 && mouseY > 664 && mouseY < 677) {
      image(instructionsscreenContinue, canvasWidth/2, canvasHeight/2);
    } else {
      image(instructionsscreenNeutral, canvasWidth/2, canvasHeight/2);
    }
  }
  
  if (currentScreen === PLAYER1_WON_SCREEN) {
    if (mouseX > 386 && mouseX < 518 && mouseY > 505 && mouseY < 525) {
      image(player1wonPlayAgain, canvasWidth/2, canvasHeight/2);
    } else if (mouseX > 386 && mouseX < 518 && mouseY > 553 && mouseY < 568) {
      image(player1wonStartMenu, canvasWidth/2, canvasHeight/2);
    } else {
      image(player1won, canvasWidth/2, canvasHeight/2);
    }
  }

  if (currentScreen === PLAYER2_WON_SCREEN) {
    if (mouseX > 386 && mouseX < 518 && mouseY > 505 && mouseY < 525) {
      image(player2wonPlayAgain, canvasWidth/2, canvasHeight/2);
    } else if (mouseX > 386 && mouseX < 518 && mouseY > 553 && mouseY < 568) {
      image(player2wonStartMenu, canvasWidth/2, canvasHeight/2);
    } else {
      image(player2won, canvasWidth/2, canvasHeight/2);
    }
  }
}

function mouseClicked() {

  if (currentScreen === WELCOME_SCREEN) { 
    if (mouseX > 385 && mouseX < 518 && mouseY > 505 && mouseY < 520) {
      currentScreen += 1; // change to GAME_SCREEN
      frameCount = 0;
      countdownSound();
    }
    if (mouseX > 360 && mouseX < 518 && mouseY > 553 && mouseY < 567) {
      currentScreen -= 1; // change to INSTRUCTIONS_SCREEN
    }
  }

  if (currentScreen === INSTRUCTIONS_SCREEN) {
    if (mouseX > 184 && mouseX < 225 && mouseY > 664 && mouseY < 677) {
      currentScreen += 1; // change back to WELCOME_SCREEN
    }
    if (mouseX > 537 && mouseX < 623 && mouseY > 664 && mouseY < 677) {
      currentScreen += 2; // change to GAME_SCREEN
      frameCount = 0;
      countdownSound();
    }
  }

  if (currentScreen === PLAYER1_WON_SCREEN) {
    if (mouseX > 385 && mouseX < 517 && mouseY > 505 && mouseY < 524) {
      currentScreen = 1; // change back to GAME_SCREEN
      countdownSound();
    } 
    if (mouseX > 385 && mouseX < 517 && mouseY > 553 && mouseY < 568) {
      currentScreen = 0; // change back to WELCOME_SCREEN
    }
    reset();
  }

  if (currentScreen === PLAYER2_WON_SCREEN) {
    if (mouseX > 385 && mouseX < 517 && mouseY > 505 && mouseY < 524) {
      currentScreen -= 2; // change back to GAME_SCREEN
      countdownSound();
    } 
    if (mouseX > 385 && mouseX < 517 && mouseY > 553 && mouseY < 568) {
      currentScreen = 0; // change back to WELCOME_SCREEN
    }
    reset();
  }
}

//________________________________________________________________________________________________________________

function draw() {
  textHighlight();
  if (currentScreen === 1) {
    overlay();
    paddleMovement();

    fill(255);
    textSize(60);
    // draws countdown only at the beginning of GAME_SCREEN
    if (frameCount < 100) {
      text(timeLeft, canvasWidth/2, canvasHeight/2 + 20); // countdown
    }
    // draws ball after countdown and after a player gets a point
    if (frameCount > 100) {
      ball(gameBall);
    }
    if (timeLeft === 0 && ballStop === false) {
      ballMovement(gameBall, paddle1, paddle2); // activates movement of ball
      // redraws element to overlay countdown
      overlay();
      ball(gameBall);
    }

    //booster item
    if (frameCount >= 400 && currentScreen === 1) {
      booster(boosterItem, gameBall);
      if (boosterTouched === true) {
        overlay();
        ball(gameBall);
        boosterItem.y = randomItemPosition();
      }
    }

    //freeze item
    activateFreezeItem();
    if (frameCount >= 500 && currentScreen === 1) {
      draw_and_collectFreezeItem(freezeItem, gameBall);
      if (freezeTouchedPlayer1 === true) {
        overlay();
        ball(gameBall);
        freezeItem.y = -100;
        image(icecube, freezeItem.positionXPlayer1, freezeItem.positionYPlayer1, 50, 50);
        if (activatedPlayer1 === true) {
          freezeItem.y = randomItemPosition();
        }
      }
      if (freezeTouchedPlayer2 === true) {
        overlay();
        ball(gameBall);
        freezeItem.y = -100;
        image(icecube, freezeItem.positionXPlayer2, freezeItem.positionYPlayer2, 50, 50);
        if (activatedPlayer2 === true) {
          freezeItem.y = randomItemPosition();
        }
      }
      booster(boosterItem, gameBall);
    }
  }
  // activates sounds
  ballHitsBorderSound();
  boostSound();
}
//_______SOUND____________________________________________________________________________________________________

function gamewonSound() {
  gamewon.playMode('untilDone');
  gamewon.setVolume(0.3);
  gamewon.play();
}

function ballHitsBorderSound() {
  if (gameBall.y <= 163 || gameBall.y >= 597){
    ball_hits_border.playMode('untilDone');
    ball_hits_border.setVolume(0.5);
    ball_hits_border.play();
  }
}

function ballHitsPaddleSound() {
  ball_hits_paddle.playMode('untilDone');
  ball_hits_paddle.setVolume(0.5);
  ball_hits_paddle.play();
}

function freezeSound() {
  freeze.playMode('untilDone');
  freeze.setVolume(0.5);
  freeze.play();
}

function boostSound() {
  if (gameBall.speed === boosterSpeed || gameBall.speed === -boosterSpeed)  {
    boost.playMode('untilDone');
    boost.setVolume(0.5);
    boost.play(); 
  }
}

function countdownSound() {
  countDown.playMode('untilDone');
  countDown.play();
}
