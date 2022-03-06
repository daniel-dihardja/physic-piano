import {Piano} from "./piano";
import {Block, Mouse} from './classes';

let blockA;
let blockB;
let ball;
let ground;
let mouse;

const sketch = (s) => {
  s.setup = async () => {
    const canvas = s.createCanvas(800, 600);

    // create an engine
    let engine = Matter.Engine.create();
    let world = engine.world;

    // create two boxes and a ground
    blockA = new Block(s, world, { x: 200, y: 200, w: 80, h: 80, color: 'white' });
    blockB = new Block(s, world, { x: 270, y: 50, w: 160, h: 80, color: 'white' });
    ground = new Block(s, world, { x: 400, y: 500, w: 810, h: 15, color: 'grey' }, { isStatic: true, angle: s.PI/36 });

    // add a mouse to manipulate Matter objects
    mouse = new Mouse(s, engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

    // run the engine
    Matter.Runner.run(engine);
  }

  s.draw = () => {
    s.background('black');
    blockA.draw();
    blockB.draw();
    ground.draw();
  }
}
new p5(sketch);
