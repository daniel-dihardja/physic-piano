import {Block} from "./block";
import {Mouse} from "./mouse";
import {Ball} from "./ball";

export class WorldWrapper {

  constructor(sketch, onCollisionCallback) {
    this.sketch = sketch;
    this.onCollisionCallback = onCollisionCallback;
    this.iw = window.innerWidth;
    this.ih = window.innerHeight;
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;

    this.balls = [];

    // this.balls.push(
    //   new Ball(this.sketch, this.world, { x: this.iw / 2 + 100, y: 200, r: 40, color: 'white', o: 0 }, {restitution: 1, friction: 0.00001, frictionAir: 0.005, density: 0.0001})
    // );
    this.balls.push(
      new Ball(this.sketch, this.world, { x: this.iw / 2 - 100, y: 50, r: 50, color: 'white', o: 0 }, {restitution: 1, friction: 0.00001, frictionAir: 0.01, density: 0.00001})
    );

    this.wallLeft = new Block(this.sketch, this.world, {x: -50, y: this.ih/2, h: this.ih, w: 100, color: 'grey'}, {isStatic: true});
    this.wallRight = new Block(this.sketch, this.world, {x: this.iw + 50, y: this.ih/2, h: this.ih, w: 100, color: 'grey'}, {isStatic: true});
    this.wallTop = new Block(this.sketch, this.world, {x: this.iw/2, y: -50, h: 100, w: this.iw + 200, color: 'grey'}, {isStatic: true});

    const groundHeight = this.ih * 0.2;
    this.ground = new Block(this.sketch, this.world, { x: this.iw / 2, y: this.ih - groundHeight/2, w: this.iw, h: groundHeight, color: 'grey' }, { isStatic: true});

    const mouse = new Mouse(this.sketch, this.engine, this.sketch.canvas, { stroke: 'magenta', strokeWeight: 2 });
    mouse.on('mousedown', () => {
      shakeScene(this.engine);
    });

    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      const pairs = event.pairs;

      // change object colours to show those starting a collision
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        for (let ball of this.balls) {
          if (ball.body === pair.bodyA || ball.body === pair.bodyB) {
            // worker.postMessage({button: Math.floor(Math.random() * 4) + ball.attrs.o});
            this.onCollisionCallback(ball);
            ball.on();
          }
        }
      }
    });
    Matter.Runner.run(this.engine);
  }

  set(attr, v) {
    const body = this.balls[0].body;
    Matter.Body.set(body, attr, v*1);
  }

  resize() {
    const iw = window.innerWidth;
    const ih = window.innerHeight;

    this.wallLeft.remove();
    this.wallLeft = new Block(this.sketch, this.world, {x: -50, y: ih/2, h: ih, w: 100, color: 'grey'}, {isStatic: true});

    this.wallRight.remove();
    this.wallRight = new Block(this.sketch, this.world, {x: iw + 50, y: ih/2, h: ih, w: 100, color: 'grey'}, {isStatic: true});

    const groundHeight = this.ih * 0.2;
    this.ground.remove();
    this.ground = new Block(this.sketch, this.world, { x: iw / 2, y: ih - groundHeight/2, w: iw, h: groundHeight, color: 'grey' }, { isStatic: true});
  }

  draw() {
    for (let ball of this.balls) {
      ball.draw();
    }
  }
}

function shakeScene(engine) {
  const bodies = Matter.Composite.allBodies(engine.world);

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
    if (!body.isStatic && body.position.y >= 200) {
      const forceMagnitude = 0.02 * body.mass;

      Matter.Body.applyForce(body, body.position, {
        x: (forceMagnitude + Matter.Common.random() * forceMagnitude) * Matter.Common.choose([1, -1]),
        y: -forceMagnitude + Matter.Common.random() * -forceMagnitude
      });
    }
  }
}
