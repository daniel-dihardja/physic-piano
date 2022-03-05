// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

var canvas = document.createElement('canvas'),
  context = canvas.getContext('2d');

// create a renderer
var render = Render.create({
  element: canvas,
  engine: engine
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 400, 810, 10, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

canvas.width = 800;
canvas.height = 500;

document.body.appendChild(canvas);

(function render() {
  var bodies = Composite.allBodies(engine.world);

  window.requestAnimationFrame(render);

  context.fillStyle = '#555';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.beginPath();

  for (var i = 0; i < bodies.length; i += 1) {
    var vertices = bodies[i].vertices;

    context.moveTo(vertices[0].x, vertices[0].y);

    for (var j = 1; j < vertices.length; j += 1) {
      context.lineTo(vertices[j].x, vertices[j].y);
    }

    context.lineTo(vertices[0].x, vertices[0].y);
  }

  context.lineWidth = 1;
  context.strokeStyle = '#999';
  context.stroke();

  context.fillStyle = '#000';
  context.fillRect(0,400, 20, 100);
})();
