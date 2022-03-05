import {Piano} from "./piano";

const sketch = (s) => {
  s.setup = async () => {
    s.createCanvas(800, 600);
  }

  s.draw = () => {
    s.background(10);
  }
}
new p5(sketch);
