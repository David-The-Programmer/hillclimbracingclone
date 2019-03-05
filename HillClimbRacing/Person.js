class Person {
  constructor(x, y, headWidth, headHeight, bodyWidth, bodyHeight) {
    // x and y are to be in the centre of the body
    this.x = x;
    this.y = y;
    this.headWidth = headWidth;
    this.bodyWidth = bodyWidth;
    this.headHeight = headHeight;
    this.bodyHeight = bodyHeight;
    this.head;
    this.body;
    
    this.headRevoluteJoint;
    this.headDistanceJoint;


    this.head = new Head(this.x, this.y - (this.headHeight / 2) - (this.bodyHeight / 2), this.headWidth, this.headHeight);
    this.body =  new Body(this.x, this.y, this.bodyWidth, this.bodyHeight);

    let headToBodyRevoluteJointDef = new b2RevoluteJointDef();
    let neckVector = new b2Vec2(this.head.x / SCALE, (this.head.y + this.head.height / 2 ) / SCALE);
    headToBodyRevoluteJointDef.Initialize(this.head.body, this.body.body, neckVector);
    this.headRevoluteJoint = world.CreateJoint(headToBodyRevoluteJointDef);

    let headToBodyDistanceJointDef = new b2DistanceJointDef();
    let topOfHeadVector = new b2Vec2(this.head.x / SCALE, (this.head.y - this.head.height / 2 ) / SCALE);
    let centreOfBodyVector = new b2Vec2(this.body.x / SCALE, this.body.y / SCALE);
    headToBodyDistanceJointDef.Initialize(this.head.body, this.body.body, topOfHeadVector, centreOfBodyVector);
    headToBodyDistanceJointDef.dampingRatio = 1;
    headToBodyDistanceJointDef.frequencyHz = 0;
    this.headDistanceJoint = world.CreateJoint(headToBodyDistanceJointDef);

  }

  draw() {
    this.head.draw(headImg);
    this.body.draw();
  }
}

class Head {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.body;
    this.id = "Head";

    let bodyDef = new b2BodyDef();
    bodyDef.type = b2DynamicBody;

    bodyDef.position.x = this.x / SCALE;
    bodyDef.position.y = this.y / SCALE;

    let fixDef = new b2FixtureDef();
    fixDef.friction = 0.1;
    fixDef.restitution = 0.3;
    fixDef.density = 0.6;
    fixDef.shape = new b2CircleShape(this.width / 2 / SCALE);

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
    this.body.SetUserData(this);


  }

  draw(img) {
    push();
    let x = this.body.GetPosition().x * SCALE;
    let y = this.body.GetPosition().y * SCALE;
    let angle = this.body.GetAngle();
    translate(x - panX, y);
    rotate(angle);
    //fill(0, 255, 0);
    //noStroke();
    //ellipse(0, 0, this.width);
    image(img, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
    pop();
  }
}

class Body {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.body;
    this.id = "Body";


    let bodyDef = new b2BodyDef();
    bodyDef.type = b2DynamicBody;

    bodyDef.position.x = this.x / SCALE;
    bodyDef.position.y = this.y / SCALE;

    let fixDef = new b2FixtureDef();
    fixDef.friction = 0.4;
    fixDef.restitution = 0.3;
    fixDef.density = 0.3;
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(this.width / 2 / SCALE, this.height / 2 / SCALE);

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
    this.body.SetUserData(this);
  }

  draw() {
    push();
    let x = this.body.GetPosition().x * SCALE;
    let y = this.body.GetPosition().y * SCALE;
    let angle = this.body.GetAngle();
    translate(x - panX, y);
    rectMode(CENTER);
    rotate(angle);
    fill(200, 0, 0);
    noStroke();
    rect(0, 0, this.width, this.height);
    pop();
  }
}
