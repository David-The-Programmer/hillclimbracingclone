var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2StaticBody = Box2D.Dynamics.b2Body.b2_staticBody;
var b2DynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;
var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint;
var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
var b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;
var b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;
var b2Contact = Box2D.Dynamics.Contacts.b2Contact;

var world;

// variable to allow the "camera " to pan on the car and follow it
var panX = 0;

var contactListener = new b2ContactListener();

const SCALE = 30;

const CANVAS_WIDTH = 1028;

const CANVAS_HEIGHT = 550;

const WHEEL_RADIUS = 15;

const CAR_BODY_WIDTH = 110;

const CAR_HEIGHT = 40;

const HEAD_WIDTH = 20;

const HEAD_HEIGHT = 20;

const BODY_WIDTH = 10;

const BODY_HEIGHT = 30;

const GROUND_WIDTH = CANVAS_WIDTH * 100;

contactListener.BeginContact = function(contactPoint) {
  if(contactPoint.GetFixtureA().GetBody().GetUserData().id == "Ground") {
    if(contactPoint.GetFixtureB().GetBody().GetUserData().id == "Head") {
      flipOver = true;
    }
  } else if(contactPoint.GetFixtureB().GetBody().GetUserData().id == "Ground") {
    if(contactPoint.GetFixtureA().GetBody().GetUserData().id == "Head") {
      flipOver = true;
    }
  }

}

function preload() {

  /// All images are from Code Bullet , credits go to him.
  headImg = loadImage("Pics/headLarge.png");
  carBodyImg = loadImage("Pics/car.png");
  wheelImg = loadImage("Pics/wheel.png");
  skyImg = loadImage("Pics/sky.png");
  darknessImg = loadImage("Pics/darkness.png");
}


function setup() {
  let motorSpeed = 10 * PI;
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.position((windowWidth - canvas.width) / 2, (windowHeight - canvas.height) / 2);
  controlsInstructions = createP("Press the right arrow key to accelerate, press the left arrow key to brake/go backwards");
  controlsInstructions.position(canvas.x + CANVAS_WIDTH / 4, canvas.y - CANVAS_HEIGHT / 12);
  world = new b2World(new b2Vec2(0, 10), true);
  ground = new Ground(GROUND_WIDTH);
  car = new Car(CAR_BODY_WIDTH * 2, CAR_HEIGHT, CAR_BODY_WIDTH, CAR_HEIGHT, WHEEL_RADIUS, motorSpeed);
  world.SetContactListener(contactListener);
}


function keyPressed() {
  if(gameOver && keyCode == UP_ARROW) {
    panX = 0;
    score = 0;
    world.DestroyBody(car.chassisBody);
    world.DestroyBody(car.person.head.body);
    world.DestroyBody(car.person.body.body);
    world.DestroyBody(car.wheels[0].body);
    world.DestroyBody(car.wheels[1].body);
    world.DestroyBody(car.axles[0].body);
    world.DestroyBody(car.axles[1].body);


    gameOver = false;
    let motorSpeed = 10 * PI;
    car = new Car(CAR_BODY_WIDTH * 2, CAR_HEIGHT, CAR_BODY_WIDTH, CAR_HEIGHT, WHEEL_RADIUS, motorSpeed);

  } else if(keyCode == RIGHT_ARROW) {
      car.motorOn(true);

  } else if(keyCode == LEFT_ARROW) {
      car.motorOn(false);
  }


}

function keyReleased() {
  if(keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    car.motorOff();
  }

}




function draw() {
  background(255);
  image(skyImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  image(darknessImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  world.Step(1 / 30, 10, 10);

  ground.draw();

  car.draw(carBodyImg);

  if(flipOver) {
    world.DestroyJoint(car.hipRevoluteJoint);
    world.DestroyJoint(car.shoulderDistanceJoint);
    world.DestroyJoint(car.person.headDistanceJoint);
    world.DestroyJoint(car.person.headRevoluteJoint);
  }

  computeResult();
  displayResult();

  computeScore();
  displayScore();

}


function computeScore() {
  prevScore = score;
  // if the player has not won or lost the game, continue to calculate the score
  if(!win && !gameOver) {
    score = Math.floor(((car.chassisBody.GetPosition().x * SCALE) - car.x) / SCALE);
  }

  // to ensure score does not decrease
  if(score < prevScore && !gameOver) {
    score = prevScore;
  }

  if(highScore < score && gameOver) {
    highScore = score;
  }
}

function displayScore() {
  fill(0);
  textSize(20);
  let scoreLabel = "Score: " + score + " m";
  text(scoreLabel, CANVAS_WIDTH / 20, CANVAS_HEIGHT / 10);
  let highScoreLabel = "High Score: " + highScore + " m";
  text(highScoreLabel, CANVAS_WIDTH / 5, CANVAS_HEIGHT / 10);
}

// function which computes the result of the game
function computeResult() {
  if(flipOver || car.chassisBody.GetPosition().x * SCALE + (car.chassisWidth / 2) < ground.vectors[0].x * SCALE) {
    gameOver = true;
    flipOver = false;
  } else if(car.chassisBody.GetPosition().x * SCALE - (car.chassisWidth / 2) > (ground.vectors[ground.vectors.length - 1].x * SCALE)) {
    win = true;
  }
}

// displays the result of the game when game is over
function displayResult() {
  if(gameOver) {
    fill(0);
    textSize(20);
    let gameOverLabel = "Game Over";
    let restartInstructionsLabel = "Press Up Arrow to restart";
    text(gameOverLabel, (CANVAS_WIDTH - textWidth(gameOverLabel)) / 2, (CANVAS_HEIGHT - textAscent()) / 2);
    text(restartInstructionsLabel, (CANVAS_WIDTH - textWidth(restartInstructionsLabel)) / 2, ((CANVAS_HEIGHT - textAscent()) / 2) + 20);

  } else if(win) {
    fill(0);
    textSize(20);
    let winLabel = "You Win";
    let restartInstructionsLabel = "Press F5 to replay";
    text(winLabel, (CANVAS_WIDTH - textWidth(winLabel)) / 2, (CANVAS_HEIGHT - textAscent()) / 2);
    text(restartInstructionsLabel, (CANVAS_WIDTH - textWidth(restartInstructionsLabel)) / 2, ((CANVAS_HEIGHT - textAscent()) / 2) + 20);

  }

}

let ground;

let car;

let flipOver = false;

let headImg;

let carBodyImg;

let wheelImg;

let skyImg;

let darknessImg;

let canvas;

let score;

let prevScore;

let highScore = 0;

let gameOver = false;

let win = false;

let controlsInstructions;
