class Ground {
  constructor(distance) {
    this.vectors = [];
    this.distance = distance;
    this.distBtwnPts = 30;

    this.body;
    this.id = "Ground";

    this.xOffset = 0;

    this.makeBody();

    this.computeVectors();

    this.addingVectors();





  }

  // function to make the body
  makeBody() {
    let bodyDef = new b2BodyDef();
    bodyDef.type = b2StaticBody;
    bodyDef.position.x = 0;
    bodyDef.position.y = 0;
    this.body = world.CreateBody(bodyDef);
    this.body.SetUserData(this);

  }

  computeVectors() {


    let originalDistBtwnPts = this.distBtwnPts;

    let minHeight = 10;

    let maxHeight = 450


    // start point
    this.vectors.push(new b2Vec2(0, CANVAS_HEIGHT));

    for(let i = 0; i < this.distance; i += this.distBtwnPts) {

       if(Math.floor(i / SCALE) % (originalDistBtwnPts * 5) == 0 ) {
         if(this.distBtwnPts > 10) {
           this.distBtwnPts -= 1;
         }

      }

      this.vectors.push(new b2Vec2(i, CANVAS_HEIGHT - map(noise(this.xOffset), 0, 1, minHeight, maxHeight)));
      this.xOffset += 0.029;


    }

    // end point
    this.vectors.push(new b2Vec2(this.distance, CANVAS_HEIGHT));


    // scale the vectors down to make it suitable for box 2d to use
    for(let j = 0; j < this.vectors.length; j++) {
      this.vectors[j].x /= SCALE;
      this.vectors[j].y /= SCALE;

    }
  }

  // function for adding the vectors to the world
  addingVectors() {
    for(let i = 1; i < this.vectors.length; i++) {
      this.addEdge(this.vectors[i - 1], this.vectors[i]);

    }
  }

  // impt function since box 2d cannot handle concave shapes, thus contruct the ground using multiple edges
  addEdge(v1, v2) {

    let fixDef = new b2FixtureDef();
    fixDef.friction = 0.9;
    fixDef.restitution = 0.1;
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsEdge(v1, v2);
    this.body.CreateFixture(fixDef);

  }

  draw() {
    fill(88, 35, 0);
    noStroke();
    push();
    beginShape();
    translate(-panX, 0);
    for(let i = 0; i < this.vectors.length; i++) {
      vertex(this.vectors[i].x * SCALE, this.vectors[i].y * SCALE);
    }
    endShape(CLOSE);


    strokeWeight(10);
    stroke(0, 140, 0);

    for(let i = 2; i < this.vectors.length - 1; i++) {
      line(this.vectors[i - 1].x * SCALE, this.vectors[i - 1].y * SCALE, this.vectors[i].x * SCALE, this.vectors[i].y * SCALE);
    }

    pop();
  }

}
