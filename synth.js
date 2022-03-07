export class Synth {
  constructor(sketch) {
    this.sketch = sketch;
    this.polySynth = new p5.PolySynth();
    this.polySynth.setADSR(0.1, 0.7, 0, 0.8);
    this.filter = new p5.BandPass();
    //this.polySynth.disconnect();
    this.polySynth.connect(this.filter);
    this.filter.freq(500);
    this.filter.res(100);
    this.sketch.outputVolume(0.8);
  }

  play(note) {
    const freq = this.sketch.midiToFreq(note + 21);
    const vel = Math.random() * 50 + 50;
    this.polySynth.play(freq, vel, 0, Math.random() * 0.2);
  }
}
