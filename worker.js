importScripts('./node_modules/@tensorflow/tfjs/dist/tf.min.js');
importScripts('./node_modules/@magenta/music/es6/core.js');
importScripts('./node_modules/@magenta/music/es6/piano_genie.js');

const genie = new piano_genie.PianoGenie('./checkpoint');
const whiteKeys = [...Array(88).keys()];

(async function init() {
  await genie.initialize();
  genie.nextFromKeyWhitelist(0, whiteKeys, 0.5);
  genie.resetState();
  console.log('piano genie is ready');
})();


// Main script asks for work.
self.onmessage = async (e) => {
  const {button} = e.data;
  const note = genie.nextFromKeyList(button, whiteKeys, 0.3);
  postMessage({note});
};
