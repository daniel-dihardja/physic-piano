export class Synth {
  constructor(sketch) {
    this.sketch = sketch;
    this.polySynth = new p5.PolySynth();
    this.polySynth.setADSR(0.1, 0.3, 0.1, 0.7);
    this.filter = new p5.BandPass();
    this.polySynth.connect(this.filter);
    this.filter.freq(10000);
    this.filter.res(50);
  }

  play(note) {
    const freq = this.sketch.midiToFreq(note + 24);
    const vel = Math.random() * 50 + 50;
    this.polySynth.play(freq, vel, 0, 0.1);
  }
}
