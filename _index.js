import * as mm from '@magenta/music';
import {Piano} from "./piano";

const seed = 123;
const whiteKeys = [...Array(88).keys()];
const tempr = 0.5;
let lowestMidiNote = 21;
const genie = new mm.PianoGenie('./checkpoint');


let midiOut;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const piano = new Piano();

const map = {
  '0': false,
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  '6': false,
  '7': false,
}


async function initGenie() {
  await genie.initialize();
  genie.nextFromKeyList(0, whiteKeys, tempr, seed);
  genie.resetState();
  console.log('genie ready');
}

async function getMidiOut() {
  const e = await navigator.requestMIDIAccess();
  return [...e.outputs.values()][0];
}

function initPiano() {
  piano.render(ctx);
}

const ballColorOff = '#00ccff';
const ballColorOn = '#00ffff';
const boundStyle = {fillStyle: '#000'};
const ballStyle = {fillStyle: ballColorOff}

const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Events = Matter.Events,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies;

const engine = Engine.create(),
  world = engine.world;

function render() {
  Engine.update(engine, 16);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bodies = Composite.allBodies(engine.world);
  ctx.beginPath();
  for (let i = 0; i < bodies.length; i += 1) {
    const vertices = bodies[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.fill();
  ctx.stroke();

  window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);


function runMatters() {
    // create engine


    // create renderer
    // const render = Render.create({
    //   element: document.body,
    //   canvas: canvas,
    //   engine: engine,
    //   options: {
    //     width: 710,
    //     height: 500,
    //     wireframes: false,
    //     showAngleIndicator: true,
    //   }
    // });



    // Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // an example of using collisionStart event on an engine
    Events.on(engine, 'collisionStart', function(event) {
      const pairs = event.pairs;

      // change object colours to show those starting a collision
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        // const keyA = parseInt(pair.bodyA.id) % 8;
        const key =  Math.floor(Math.random() * 8);
        const note = genie.nextFromKeyList(key, whiteKeys, tempr) + 21;
        midiOut.send([144, note, Math.floor(Math.random() * 50) + 50]);
        setTimeout(() => {
          midiOut.send([128, note, 0]);
        }, (Math.random() * 2000) + 1000);

        if(! pair.bodyA.isStatic) pair.bodyA.render.fillStyle = ballColorOn;
        if(! pair.bodyB.isStatic) pair.bodyB.render.fillStyle = ballColorOn;
        setTimeout(() => {
          if(! pair.bodyA.isStatic) pair.bodyA.render.fillStyle = ballColorOff;
          if(! pair.bodyB.isStatic) pair.bodyB.render.fillStyle = ballColorOff;
        }, 100);
      }
    });



    // scene code
    Composite.add(world, [
      Bodies.rectangle(355, 0, 710, 20, { isStatic: true, render: boundStyle }),
      Bodies.rectangle(355, 400, 710, 20, { isStatic: true, render: boundStyle }),
      Bodies.rectangle(710, 200, 20, 400, { isStatic: true, render: boundStyle }),
      Bodies.rectangle(0, 200, 20, 400, { isStatic: true, render: boundStyle })
    ]);
    const stack = Composites.stack(355, 10, 2, 1, 20,  10, function(x, y) {
      return Bodies.circle(x, y, 20, { restitution: 1, render: ballStyle });
    });

    Composite.add(world, stack);

    const shakeScene = function(engine) {
      const bodies = Composite.allBodies(engine.world);

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        if (!body.isStatic && body.position.y >= 300) {
          let forceMagnitude = 0.02 * body.mass;

          Body.applyForce(body, body.position, {
            x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
            y: -forceMagnitude + Common.random() * -forceMagnitude
          });
        }
      }
    };

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // an example of using mouse events on a mouse
    Events.on(mouseConstraint, 'mousedown', function(event) {
      const mousePosition = event.mouse.position;
      shakeScene(engine);
    });

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 710, y: 500 }
    });
}

async function run() {
  await initGenie();
  midiOut = await getMidiOut();
  runMatters();
  initPiano();
}

run().then(e => e);
