import {Block} from './block';
export class Ball extends Block {
  constructor(sketch, world, attrs, options) {
    super(sketch, world, attrs, options);
  }

  addBody() {
    this.body = Matter.Bodies.circle(this.attrs.x, this.attrs.y, this.attrs.r, this.options);
  }
}
