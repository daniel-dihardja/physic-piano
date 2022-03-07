import {Piano} from "./piano";
import {Block, Mouse, Ball} from './classes';
import {Synth} from './synth';

let blockA;
let blockB;
let ball;
let ground;
let mouse;
let wallLeft;
let wallRight;
let wallTop;
let piano;
let synth;

const balls = [];

const worker = new Worker('worker.js');

worker.onmessage = (event) => {
  const {note} = event.data;
  piano.on(note);
  if(note) {
    synth.play(note);
  }

}

const sketch = (s) => {
  s.setup = async () => {
    const canvas = s.createCanvas(800, 600);
    piano = new Piano(s, 6);
    synth = new Synth(s);

    // create an engine
    let engine = Matter.Engine.create();
    let world = engine.world;

    // create two boxes and a ground
    blockA = new Ball(s, world, { x: 200, y: 200, r: 30, color: 'white' }, {restitution: 1, density: 0.05});
    blockB = new Ball(s, world, { x: 270, y: 50, r: 30, color: 'white' }, {restitution: 1});
    ground = new Block(s, world, { x: 400, y: 500, w: 810, h: 15, color: 'grey' }, { isStatic: true});

    balls.push(blockA);
    balls.push(blockB);

    wallLeft = new Block(s, world, {x: -50, y: 300, h: 600, w: 100, color: 'grey'}, {isStatic: true});
    wallRight = new Block(s, world, {x: 850, y: 300, h: 600, w: 100, color: 'grey'}, {isStatic: true});
    wallTop = new Block(s, world, {x: 400, y: -50, h: 100, w: 1000, color: 'grey'}, {isStatic: true});

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
          worker.postMessage({button: Math.floor(Math.random() * 7)});
          ball.on();
        }
      }

    }
  },

  s.draw = () => {
    s.background('black');
    blockA.draw();
    blockB.draw();
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
