import {Block} from './block';
export class Ball extends Block {
  constructor(sketch, world, attrs, options) {
    super(sketch, world, attrs, options);
  }

  on() {
    this.attrs.color = this.sketch.color('cyan');
    setTimeout(() => {
      this.attrs.color = this.sketch.color(255);
    }, 100);
  }

  addBody() {
    this.body = Matter.Bodies.circle(this.attrs.x, this.attrs.y, this.attrs.r, this.options);
  }
}
