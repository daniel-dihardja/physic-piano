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

// create engine
const engine = Engine.create(),
  world = engine.world;

const canvas = document.getElementById('stage');

// create renderer
const render = Render.create({
  engine: engine,
  canvas: canvas,
  options: {
    width: 800,
    height: 400,
    wireframes: false
  }
});

Render.run(render);

// create runner
const runner = Runner.create();
Runner.run(runner, engine);

const bodyStyle = { fillStyle: '#00ccff' };

// scene code
Composite.add(world, [
  Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: bodyStyle }),
  Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: bodyStyle }),
  Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: bodyStyle }),
  Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: bodyStyle })
]);

const stack = Composites.stack(70, 100, 2, 1, 50, 50, function(x, y) {
  return Bodies.circle(x, y, 15, { restitution: 1, render: bodyStyle });
});

Composite.add(world, stack);

const shakeScene = function(engine) {
  const bodies = Composite.allBodies(engine.world);

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];

    if (!body.isStatic && body.position.y >= 500) {
      const forceMagnitude = 0.02 * body.mass;

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
  shakeScene(engine);
});

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: 800, y: 600 }
});
