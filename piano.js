class Key {
  constructor(sketch, x, y, w, h) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    this.sketch.rect(this.x, this.y, this.w, this.h);
  }
}

const blackKeys = [2,4,7,9,11];
const whiteKeys = [1,3,5,6,8,10,12];

export class Piano {
  constructor(sketch, octaves) {
    this.sketch = sketch;
    this.octaves = octaves;
    this.keyWidth = (this.sketch.width - 1)/ (this.octaves * 7);
    this.keys = {};
    this.whiteKeys = [];
    this.blackKeys = [];
    this.setupKeys();
  }

  setupKeys() {
    for (let o=0; o<this.octaves; o++) {
      for (let i=0; i<whiteKeys.length; i++) {
        const px = i * this.keyWidth + 1 + o * (7 * this.keyWidth);
        const key = new Key(this.sketch, px, 500, this.keyWidth-1, 99);
        const id = whiteKeys[i] + o * 12;
        this.whiteKeys.push(key);
        this.keys[id] = key;
      }
      for (let i=0; i<blackKeys.length; i++) {
        const offsetX = i < 2 ? this.keyWidth * 0.75 : this.keyWidth * 0.75 + this.keyWidth;
        const px = i * this.keyWidth + offsetX + 1 + o * (7*this.keyWidth);
        const key = new Key(this.sketch, px, 500, this.keyWidth / 2, 70);
        const id = blackKeys[i] + o * 12;
        this.blackKeys.push(key);
        this.keys[id] = key;
      }
    }
  }

  draw() {
    this.sketch.fill(255);
    for (let i=0; i<this.whiteKeys.length; i++) {
      const key = this.whiteKeys[i];
      key.draw();
    }
    this.sketch.fill(0);
    for (let i=0; i<this.blackKeys.length; i++) {
      const key = this.blackKeys[i];
      key.draw();
    }
  }
}
