class Car {
  constructor(x, y, w, h, r, s) {
    this.x = x;
    this.y = y;
    this.chassisWidth = w;
    this.chassisHeight = h;
    this.wheelRadius = r;
    this.wheels = [];
    this.frontWheelRevoluteJoint;
    this.backWheelRevoluteJoint;
    this.frontAxleDistanceJoint;
    this.backAxleDistanceJoint;
    this.frontAxelPrismaticJoint;
    this.backAxelPrismaticJoint;
    this.hipRevoluteJoint;
    this.shoulderDistanceJoint;
    this.motorSpeed = s;
    this.chassisBody;
    this.shapes = [];
    this.person;
    this.axles = [];
    this.id = "Car";
    this.motorState = 0; //-1 is back and 1 is forward
    this.torque = -10;



     // All of the b2Vectors coordinates to shape the car is all from CodeBullet, all credits for the
     // coordinates of vectors involved in shaping the car goes to him
    //*************************************Body of the car************************//

    let carBodyDef = new b2BodyDef();
    carBodyDef.type = b2DynamicBody;
    carBodyDef.position.x = this.x / SCALE;
    carBodyDef.position.y = this.y / SCALE;

    let carBodyFixDef = new b2FixtureDef();
    carBodyFixDef.friction = 0.5;
    carBodyFixDef.restitution = 0.2;
    carBodyFixDef.density = 1;
    carBodyFixDef.shape = new b2PolygonShape();

    let carBodyVectors = [];
    carBodyVectors.push(new b2Vec2(-this.chassisWidth / 2, -this.chassisHeight / 2));
    carBodyVectors.push(new b2Vec2(this.chassisWidth / 4 + 5, -this.chassisHeight / 2));
    carBodyVectors.push(new b2Vec2(this.chassisWidth / 2, (-this.chassisHeight / 2) + 5));
    carBodyVectors.push(new b2Vec2(this.chassisWidth / 2, this.chassisHeight / 2));
    carBodyVectors.push(new b2Vec2(-this.chassisWidth / 2, this.chassisHeight / 2));

    // scale the vectors down to make it suitable for box 2d to use
    for(let i = 0; i < carBodyVectors.length; i++) {
      carBodyVectors[i].x /= SCALE;
      carBodyVectors[i].y /= SCALE;

    }

    carBodyFixDef.shape.SetAsArray(carBodyVectors, carBodyVectors.length);

    // VERY IMPT to ensure suspension works.
    // As long as the group Index of the wheels and the car body is the same, they would never collide
    carBodyFixDef.filter.groupIndex = -1;
    this.shapes.push(carBodyVectors);
    this.chassisBody = world.CreateBody(carBodyDef);
    this.chassisBody.CreateFixture(carBodyFixDef);

   //***********************Wind shield of the car*******************************//
   let carWindShieldDef = new b2FixtureDef();
   carWindShieldDef.friction = 0.5;
   carWindShieldDef.restitution = 0.2;
   carWindShieldDef.density = 1;
   carWindShieldDef.shape = new b2PolygonShape();


    let carWindShieldVectors = [];
    carWindShieldVectors.push(new b2Vec2(this.chassisWidth / 4, -this.chassisHeight / 2));
    carWindShieldVectors.push(new b2Vec2(this.chassisWidth / 4 - 15, (-this.chassisHeight / 2) - 20));
    carWindShieldVectors.push(new b2Vec2(this.chassisWidth / 4 - 10, (-this.chassisHeight / 2) - 20));
    carWindShieldVectors.push(new b2Vec2(this.chassisWidth / 4 + 5, -this.chassisHeight / 2));

    // scale the vectors down to make it suitable for box 2d to use
    for(let i = 0; i < carWindShieldVectors.length; i++) {
      carWindShieldVectors[i].x /= SCALE;
      carWindShieldVectors[i].y /= SCALE;

    }

    carWindShieldDef.shape.SetAsArray(carWindShieldVectors, carWindShieldVectors.length);
    this.shapes.push(carWindShieldVectors);
    this.chassisBody.CreateFixture(carWindShieldDef);


    //***********************Hood of the car*******************************//
    let carHoodDef = new b2FixtureDef();
    carHoodDef.friction = 0.5;
    carHoodDef.restitution = 0.2;
    carHoodDef.density = 1;
    carHoodDef.shape = new b2PolygonShape();


     let carHoodVectors = [];
     carHoodVectors.push(new b2Vec2(this.chassisWidth / 2, (-this.chassisHeight / 2) + 5));
     carHoodVectors.push(new b2Vec2(this.chassisWidth / 2 + 5, (-this.chassisHeight / 2) + 8));
     carHoodVectors.push(new b2Vec2(this.chassisWidth / 2 + 5, (this.chassisHeight / 2) - 5));
     carHoodVectors.push(new b2Vec2(this.chassisWidth / 2, this.chassisHeight / 2));

     // scale the vectors down to make it suitable for box 2d to use
     for(let i = 0; i < carHoodVectors.length; i++) {
       carHoodVectors[i].x /= SCALE;
       carHoodVectors[i].y /= SCALE;

     }

    carHoodDef.shape.SetAsArray(carHoodVectors, carHoodVectors.length);
    this.shapes.push(carHoodVectors);
    this.chassisBody.CreateFixture(carHoodDef);
    this.chassisBody.SetUserData(this);

    this.person = new Person(this.x - BODY_WIDTH, this.y - BODY_HEIGHT / 2, HEAD_WIDTH, HEAD_HEIGHT, BODY_WIDTH, BODY_HEIGHT);

    this.wheels.push(new Wheel(this.x - (this.chassisWidth / 2) + (this.wheelRadius * 1.2), this.y + this.chassisHeight / 2 + this.wheelRadius / 2, this.wheelRadius ));
    this.wheels.push(new Wheel(this.x + (this.chassisWidth / 2) - (this.wheelRadius * 1.2), this.y + this.chassisHeight / 2 + this.wheelRadius / 2, this.wheelRadius ));

    this.axles.push(new Wheel(this.wheels[0].x, this.wheels[0].y, this.wheelRadius / 2));
    this.axles.push(new Wheel(this.wheels[1].x, this.wheels[1].y, this.wheelRadius / 2));

    let frontAxelDistanceJointDef = new b2DistanceJointDef();
    let frontAxelVector = new b2Vec2(this.axles[1].x / SCALE, this.axles[1].y / SCALE);
    let frontAxelToCarVector = new b2Vec2(this.axles[1].x / SCALE, this.y / SCALE);
    frontAxelDistanceJointDef.Initialize(this.axles[1].body, this.chassisBody, frontAxelVector, frontAxelToCarVector);
    frontAxelDistanceJointDef.dampingRatio = 1;
    frontAxelDistanceJointDef.frequencyHz = 4.5;
    this.frontAxleDistanceJoint = world.CreateJoint(frontAxelDistanceJointDef);

    let backAxelDistanceJointDef = new b2DistanceJointDef();
    let backAxelVector = new b2Vec2(this.axles[0].x / SCALE, this.axles[0].y / SCALE);
    let backAxelToCarVector = new b2Vec2(this.axles[0].x / SCALE, this.y / SCALE);
    backAxelDistanceJointDef.Initialize(this.axles[0].body, this.chassisBody, backAxelVector, backAxelToCarVector);
    backAxelDistanceJointDef.dampingRatio = 1;
    backAxelDistanceJointDef.frequencyHz = 4.5;
    this.backAxleDistanceJoint = world.CreateJoint(backAxelDistanceJointDef);

    let frontAxelPrismaticJointDef = new b2PrismaticJointDef();
    let frontAnchorVector = new b2Vec2(this.axles[1].x / SCALE, this.y / SCALE);
    let frontAxelAxisVector = new b2Vec2(0, 1);
    frontAxelPrismaticJointDef.Initialize(this.axles[1].body, this.chassisBody, frontAnchorVector, frontAxelAxisVector);
    this.frontAxlePrismaticJoint = world.CreateJoint(frontAxelPrismaticJointDef);

    let backAxelPrismaticJointDef = new b2PrismaticJointDef();
    let backAnchorVector = new b2Vec2(this.axles[0].x / SCALE, this.y / SCALE);
    let backAxelAxisVector = new b2Vec2(0, 1);
    backAxelPrismaticJointDef.Initialize(this.axles[0].body, this.chassisBody, backAnchorVector, backAxelAxisVector);
    this.backAxlePrismaticJoint = world.CreateJoint(backAxelPrismaticJointDef);


    let frontWheelRevoluteJointDef = new b2RevoluteJointDef();
    frontWheelRevoluteJointDef.Initialize(this.axles[1].body, this.wheels[1].body, this.wheels[1].body.GetWorldCenter());
    this.frontWheelRevoluteJoint = world.CreateJoint(frontWheelRevoluteJointDef);

    let backWheelRevoluteJointDef = new b2RevoluteJointDef();
    backWheelRevoluteJointDef.Initialize(this.axles[0].body, this.wheels[0].body, this.wheels[0].body.GetWorldCenter());
    this.backWheelRevoluteJoint = world.CreateJoint(backWheelRevoluteJointDef);


    let hipJointRevoluteJointDef = new b2RevoluteJointDef();
    let hipVector = new b2Vec2(this.person.x/ SCALE,  (this.person.y +  this.person.bodyHeight / 2)/ SCALE);
    hipJointRevoluteJointDef.Initialize(this.chassisBody, this.person.body.body, hipVector);
    this.hipRevoluteJoint = world.CreateJoint(hipJointRevoluteJointDef);

    let shoulderToCarDistanceJointDef = new b2DistanceJointDef();
    let shouldersVector = new b2Vec2(this.person.x  / SCALE, (this.person.y - this.person.bodyHeight / 2 ) / SCALE);
    let carFrontVector = new b2Vec2( (this.x + this.chassisWidth / 4 + 5) / SCALE, (this.y - this.chassisHeight / 2) / SCALE);
    shoulderToCarDistanceJointDef.Initialize(this.person.body.body, this.chassisBody, shouldersVector, carFrontVector);
    shoulderToCarDistanceJointDef.dampingRatio = 0.1;
    shoulderToCarDistanceJointDef.frequencyHz = 5;
    shoulderToCarDistanceJointDef.length *= 1.1;
    this.shoulderDistanceJoint = world.CreateJoint(shoulderToCarDistanceJointDef);


  }

  draw(img) {

    this.person.draw();


    let x = this.chassisBody.GetPosition().x * SCALE;
    let y = this.chassisBody.GetPosition().y * SCALE;
    let angle = this.chassisBody.GetAngle();
    push();
    translate(x - panX, y);
    // very much needed due to the actual car flipping around like crazy if speed of motor is too high
    rotate(angle);
    //fill(255, 0, 0);
    //noStroke();

    //for(let i = 0; i < this.shapes.length; i++) {
      //beginShape();
      //for(let j = 0; j < this.shapes[i].length; j++) {
        //vertex(this.shapes[i][j].x * SCALE, this.shapes[i][j].y * SCALE);
      //}
      //endShape(CLOSE);
    //}

    image(img, 0 - this.chassisWidth / 2 - 7, 0 - this.chassisHeight / 2 - 37, this.chassisWidth + 20, this.chassisHeight * 2.1);
    pop();



    for(let i = 0; i < this.wheels.length; i++) {
      this.wheels[i].draw(wheelImg);


    }

    panX += this.chassisBody.GetLinearVelocity().x;


  }

  motorOn(direction) {
    this.frontWheelRevoluteJoint.EnableMotor(true);
    this.frontWheelRevoluteJoint.SetMaxMotorTorque(350);
    this.backWheelRevoluteJoint.EnableMotor(true);
    this.backWheelRevoluteJoint.SetMaxMotorTorque(700);
    // if direction is true, then the car should drive forward
    let prevMotorState = this.motorState;
    if(direction) {
      this.motorState = 1;
      this.frontWheelRevoluteJoint.SetMotorSpeed(this.motorSpeed);
      this.backWheelRevoluteJoint.SetMotorSpeed(this.motorSpeed);
      this.chassisBody.ApplyTorque(this.torque);
    } else {
      this.motorState = -1;
      this.frontWheelRevoluteJoint.SetMotorSpeed(-this.motorSpeed);
      this.backWheelRevoluteJoint.SetMotorSpeed(-this.motorSpeed);
    }

    if(prevMotorState + this.motorState == 0) {
      if(prevMotorState == 1) {
        this.chassisBody.ApplyTorque(this.torque * this.motorState);
      }
    }



  }

  motorOff() {
    if(this.motorState == 1) {
      this.chassisBody.ApplyTorque(-this.torque);
    }
    this.motorState = 0;
    this.frontWheelRevoluteJoint.EnableMotor(false);
    this.backWheelRevoluteJoint.EnableMotor(false);


  }
}
