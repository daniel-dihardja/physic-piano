export class Piano {
  constructor() {
  }

  render(ctx) {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 400, 710, 500);
    console.log('render piano');
  }
}
