class Wheel {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.body;
    this.id = "Wheel";

    let bodyDef = new b2BodyDef();
    bodyDef.type = b2DynamicBody;

    bodyDef.position.x = this.x / SCALE;
    bodyDef.position.y = this.y / SCALE;

    let fixDef = new b2FixtureDef();
    fixDef.friction = 0.5;
    fixDef.restitution = 0.3;
    fixDef.density = 0.5;
    fixDef.shape = new b2CircleShape(this.radius / SCALE);
    fixDef.filter.groupIndex = -1;

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
    //fill(100);
    //noStroke();
    //ellipse(0, 0, this.radius * 2);

    //stroke(255);
    //line(0, 0, this.radius, 0);

    image(img, 0 - this.radius, 0 - this.radius, this.radius * 2, this.radius * 2);

    pop();
  }
}
