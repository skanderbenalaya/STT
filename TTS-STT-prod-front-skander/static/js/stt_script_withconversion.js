var inputForm = document.querySelector("form");

var inputTxt = document.querySelector(".txt");

var button = document.querySelector(".bubbly-button");

var AudioNode = document.querySelector("audio");

var saveButton = document.getElementById("saveButton");

var Base64;

// ---------------------------------- Button animation ----------------------------------------------------

var animateButton = function (e) {
  e.preventDefault;
  //reset animation
  e.target.classList.remove("animate");

  e.target.classList.add("animate");
  setTimeout(function () {
    e.target.classList.remove("animate");
  }, 700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener("click", animateButton, false);
}

// ---------------------------------- Buffer to Blob ----------------------------------------------------

// Convert AudioBuffer to a Blob using WAVE representation
function bufferToWave(abuffer, len) {
  var numOfChan = abuffer.numberOfChannels,
    length = len * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [],
    i,
    sample,
    offset = 0,
    pos = 0;

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++; // next source sample
  }

  // create Blob
  return new Blob([buffer], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

// ---------------------------------- Resampler ----------------------------------------------------

function resample(audioChunks) {
  var audioCtx = new (AudioContext || webkitAudioContext)();

  var reader1 = new FileReader();
  reader1.onload = function (ev) {
    // Decode audio
    audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
      // Process Audio
      var offlineAudioCtx = new OfflineAudioContext({
        numberOfChannels: 1,
        length: 16000 * buffer.duration,
        sampleRate: 16000,
      });

      // Audio Buffer Source
      soundSource = offlineAudioCtx.createBufferSource();
      soundSource.buffer = buffer;

      // // Create Compressor Node
      compressor = offlineAudioCtx.createDynamicsCompressor();

      compressor.threshold.setValueAtTime(-20, offlineAudioCtx.currentTime);
      compressor.knee.setValueAtTime(30, offlineAudioCtx.currentTime);
      compressor.ratio.setValueAtTime(5, offlineAudioCtx.currentTime);
      compressor.attack.setValueAtTime(0.05, offlineAudioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, offlineAudioCtx.currentTime);

      // Gain Node
      gainNode = offlineAudioCtx.createGain();
      gainNode.gain.setValueAtTime(1, offlineAudioCtx.currentTime);

      // Connect nodes to destination
      soundSource.connect(compressor);
      compressor.connect(gainNode);
      gainNode.connect(offlineAudioCtx.destination);

      var reader2 = new FileReader();

      console.log("Created Reader2");

      reader2.onload = function (ev) {
        console.log("Reading audio data to buffer...");

        offlineAudioCtx
          .startRendering()
          .then(function (renderedBuffer) {
            // console.log('Rendering completed successfully.');

            var song = offlineAudioCtx.createBufferSource();

            console.log("Rendered buffer:");
            console.log(renderedBuffer);

            console.log("OfflineAudioContext: ");
            console.log(offlineAudioCtx);

            make_download(renderedBuffer, offlineAudioCtx.length);
          })
          .catch(function (err) {
            console.log("Rendering failed: " + err);
          });

        soundSource.loop = false;
      };

      reader2.readAsArrayBuffer(audioChunks);
      soundSource.start(0);
    });
  };
  reader1.readAsArrayBuffer(audioChunks);
}

function make_download(abuffer, total_samples) {
  // set sample length and rate
  var duration = abuffer.duration,
    rate = abuffer.sampleRate,
    offset = 0;

  console.log("abuffer");
  console.log(abuffer);
  var blobi = bufferToWave(abuffer, total_samples);

  console.log("blobi");
  console.log(blobi);
  // Generate audio file and assign URL
  var new_file = URL.createObjectURL(blobi);
  AudioNode.src = new_file;
  async function MainFile() {
    Base64 = await toBase64(blobi);
  }
  MainFile();
}

// ---------------------------------- New Record Function ----------------------------------------------------
var isRecording = 0;
URL = window.URL || window.webkitURL;
var gumStream;
var rec;
var input;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
Base64 = null;

var recordButton = document.getElementById("recordButton");
recordButton.addEventListener("click", toggleRecord);

function toggleRecord() {
  isRecording ? stopRecording() : startRecording();
}

function startRecording() {
  isRecording = 1;
  console.log("recordButton clicked");

  recordButton.innerHTML = "Stop";
  var constraints = { audio: true, video: false };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      console.log(
        "getUserMedia() success, stream created, initializing Recorder.js ..."
      );

      audioContext = new AudioContext();

      gumStream = stream;

      input = audioContext.createMediaStreamSource(stream);

      window.rec = new Recorder(input, { numChannels: 1 });

      rec.record();

      console.log("Recording started");
    })
    .catch(function (err) {
      recordButton.disabled = false;
    });
}

function stopRecording() {
  isRecording = 0;
  console.log("Recording stopped");

  recordButton.innerHTML = "Record";

  rec.stop();

  gumStream.getAudioTracks()[0].stop();

  rec.exportWAV(createLink);
}

function createLink(blob) {
  const audioBlob = blob;
  var buf = resample(audioBlob);
  button.disabled = false;
}

//---------------------------------- Base64 file selection conversion  ----------------------------------------------------

const toBase64 = (f) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// ---------------------------------- Send to audio side ----------------------------------------------------
(function localFileAudioPlayer() {
  "use strict";
  var URL = window.URL || window.webkitURL;
  var playSelectedFile = function (event) {
    globalThis.file = this.files[0];
    var type = file.type;
    if (type != "audio/wav") {
      button.disabled = true;
      type = "";
      alert("You must select a Wav file as audio source");
    }
    var canPlay = AudioNode.canPlayType(type);
    if (canPlay === "") canPlay = "no";
    var message = "File Loaded";
    var isError = canPlay === "no";
    console.log("message", message, "Error", isError);

    if (isError) {
      AudioNode.src = "";
      return;
    }

    const audioBlob = file;
    var buf = resample(audioBlob);
    button.disabled = false;

    
  };
  var inputNode = document.querySelector("input");
  inputNode.addEventListener("change", playSelectedFile, false);
})();

function sendJSON(message) {
  //console.log("User Message:", message);

  // Creating a XHR object
  let xhr = new XMLHttpRequest();

  //let url = "http://localhost:8080/stt";
  let url = "/trans";

  // open a connection
  xhr.open("POST", url, true);

  // Set the request header i.e. which type of content you are sending
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    // Converting JSON data to string
    var data = JSON.stringify({ message: message, sender: "username" });

    // Sending data with the request
    xhr.send(data);

  // Create a state change callback
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Print received data from server
      var output = JSON.parse(this.responseText);
      //console.log("good", output["response"]);
      var data_response = output["transcript"];
      var text_response = new String(data_response);
      var input = document.querySelector('textarea');
      input.value = text_response; 
      //console.log(text_response);
    }
  };


}

inputForm.onsubmit = function (event) {
  event.preventDefault();
  //console.log("sending data", Base64);
  sendJSON(Base64);
};


