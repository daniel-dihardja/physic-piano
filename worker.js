importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.4.0/dist/tf.min.js");
importScripts('https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1/es6/core.js');
importScripts('https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1/es6/piano_genie.js');

const genie = new piano_genie.PianoGenie('https://storage.googleapis.com/magentadata/js/checkpoints/piano_genie/model/epiano/stp_iq_auto_contour_dt_166006');
const whiteKeys = [...Array(88).keys()];

(async function init() {
  await genie.initialize();
  genie.nextFromKeyList(0, whiteKeys, 0.5);
  genie.resetState();
  postMessage({initPianoGenie: true});
})();


// Main script asks for work.
self.onmessage = (e) => {
  const {button} = e.data;
  const note = genie.nextFromKeyList(button, whiteKeys, 0.3);
  postMessage({note});
};
