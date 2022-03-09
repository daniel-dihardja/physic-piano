import {Block, Mouse, Ball, Piano, Player} from './classes';

let blockA;
let blockB;
let ground;
let mouse;
let wallLeft;
let wallRight;
let wallTop;
let piano;

const balls = [];

const worker = new Worker('worker.js');
const player = new Player();

worker.onmessage = (event) => {
  const {note} = event.data;
  piano.on(note);
  player.play(note);
}

const sketch = (s) => {
  s.setup = async () => {
    // create an engine
    let engine = Matter.Engine.create();
    let world = engine.world;
    let iw = window.innerWidth;
    let ih = window.innerHeight;
    let canvas = s.createCanvas(iw, ih);

    window.addEventListener('resize', (event) => {
      iw = window.innerWidth;
      ih = window.innerHeight;
      canvas = s.createCanvas(iw, ih);
      piano = new Piano(s, 7);

      wallLeft.remove();
      wallLeft = new Block(s, world, {x: -50, y: ih/2, h: ih, w: 100, color: 'grey'}, {isStatic: true});

      wallRight.remove();
      wallRight = new Block(s, world, {x: iw + 50, y: ih/2, h: ih, w: 100, color: 'grey'}, {isStatic: true});

      const groundHeight = ih * 0.2;
      ground.remove();
      ground = new Block(s, world, { x: iw / 2, y: ih - groundHeight/2, w: iw, h: groundHeight, color: 'grey' }, { isStatic: true});
    });

    piano = new Piano(s, 7);
    
    // create two boxes and a ground
    blockA = new Ball(s, world, { x: 200, y: 200, r: 40, color: 'white', o: 0 }, {restitution: 1});
    blockB = new Ball(s, world, { x: 270, y: 50, r: 20, color: 'white', o: 4 }, {restitution: 1});

    balls.push(blockA);
    balls.push(blockB);

    wallLeft = new Block(s, world, {x: -50, y: ih/2, h: ih, w: 100, color: 'grey'}, {isStatic: true});
    wallRight = new Block(s, world, {x: iw + 50, y: ih/2, h: ih, w: 100, color: 'grey'}, {isStatic: true});
    wallTop = new Block(s, world, {x: iw/2, y: -50, h: 100, w: iw + 200, color: 'grey'}, {isStatic: true});
    const groundHeight = ih * 0.2;
    ground = new Block(s, world, { x: iw / 2, y: ih - groundHeight/2, w: iw, h: groundHeight, color: 'grey' }, { isStatic: true});

    // add a mouse to manipulate Matter objects
    mouse = new Mouse(s, engine, canvas, { stroke: 'magenta', strokeWeight: 2 });
    mouse.on('mousedown', () => {
      shakeScene(engine);
    });

    Matter.Events.on(engine, 'collisionStart', s.onCollisionStart);

    // run the engine
    Matter.Runner.run(engine);
  }

  s.onCollisionStart = (event) => {
    const pairs = event.pairs;

    // change object colours to show those starting a collision
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      for (let ball of balls) {
        if (ball.body === pair.bodyA || ball.body === pair.bodyB) {
          worker.postMessage({button: Math.floor(Math.random() * 4) + ball.attrs.o});
          ball.on();
        }
      }

    }
  },

  s.draw = () => {
    s.background('black');
    blockA.draw();
    blockB.draw();
    ground.draw();
    wallTop.draw();
    piano.draw();
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

new p5(sketch);