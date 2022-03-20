import {Piano, Player, DomElement, WorldWrapper} from './classes';

let piano;
let player;
let initPianoGenie = false;
let worldWrapper;

const worker = new Worker('worker.js');

worker.onmessage = (event) => {
  if (event.data.initPianoGenie) {
    initPianoGenie = event.data.initPianoGenie;
    return;
  }
  if (event.data.note) {
    const {note} = event.data;
    piano.on(note);
    player.play(note);
  }
}

const sketch = (s) => {
  s.setup = async () => {
    worldWrapper = new WorldWrapper(s, (ball) => {
      worker.postMessage({button: Math.floor(Math.random() * 4) + ball.attrs.o});
    });

    let iw = window.innerWidth;
    let ih = window.innerHeight;
    s.createCanvas(iw, ih);

    window.addEventListener('resize', (event) => {
      const iw = window.innerWidth;
      const ih = window.innerHeight;
      s.createCanvas(iw, ih);
      worldWrapper.resize();
      piano = new Piano(s, 7);
    });

    piano = new Piano(s, 7);
  }

  s.draw = () => {
    s.background('black');
    worldWrapper.draw();
    piano.draw();
  }
}

async function waitForPianoGenie() {
  return new Promise(resolve => {
    const i = setInterval(() => {
      if (initPianoGenie) {
        clearInterval(i);
        resolve();
      }
    }, 100);
  });
}


(async function run() {
  const titleLoading =  new DomElement('#loading');
  const btnStart = new DomElement('#start').hide();
  player = new Player();
  await player.init();
  await waitForPianoGenie();
  titleLoading.hide();
  btnStart.element.addEventListener('click', (evt) => {
    btnStart.hide();
    new p5(sketch);
  })
  btnStart.show();
}());
