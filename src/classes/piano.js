class Key {
  constructor(sketch, x, y, w, h, color) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.defaultColor = color;
    this.color = color;
  }

  draw() {
    this.sketch.fill(this.color);
    this.sketch.rect(this.x, this.y, this.w, this.h);
  }

  on() {
    this.color = this.sketch.color('grey');
    setTimeout(() => {
      this.color = this.defaultColor;
    }, 200);
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
    this.py = this.sketch.height - this.sketch.height * 0.2;
    this.height = this.sketch.height * 0.2;
    this.setupKeys();
  }

  on(note) {
    const key = this.keys[note];
    if (key) {
      key.on();
    }
  }

  setupKeys() {
    for (let o=0; o<this.octaves; o++) {
      for (let i=0; i<whiteKeys.length; i++) {
        const px = i * this.keyWidth + 1 + o * (7 * this.keyWidth);
        const key = new Key(this.sketch, px, this.py, this.keyWidth-1, this.height, 255);
        const id = whiteKeys[i] + o * 12;
        this.whiteKeys.push(key);
        this.keys[id] = key;
      }
      for (let i=0; i<blackKeys.length; i++) {
        const offsetX = i < 2 ? this.keyWidth * 0.75 : this.keyWidth * 0.75 + this.keyWidth;
        const px = i * this.keyWidth + offsetX + 1 + o * (7*this.keyWidth);
        const key = new Key(this.sketch, px, this.py, this.keyWidth / 2, this.height * 0.7, 0);
        const id = blackKeys[i] + o * 12;
        this.blackKeys.push(key);
        this.keys[id] = key;
      }
    }
  }

  draw() {
    for (let i=0; i<this.whiteKeys.length; i++) {
      const key = this.whiteKeys[i];
      key.draw();
    }
    for (let i=0; i<this.blackKeys.length; i++) {
      const key = this.blackKeys[i];
      key.draw();
    }
  }
}
