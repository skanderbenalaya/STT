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

// ---------------------------------- New Record Function ----------------------------------------------------
var recording = 0;
var gumStream;
var rec;
var input;

Base64 = null;

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;

var recordButton = document.getElementById("recordButton");

recordButton.addEventListener("click", startRecording);

function startRecording() {
  if (recording) {
    stopRecording();
    recording = 0;
  } else {
    recording = 1;
    recordButton.value = "1";
    recordButton.innerHTML = "Stop";

    var constraints = { audio: true, video: false };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {

        audioContext = new AudioContext({ sampleRate: 16000 });

        gumStream = stream;

        input = audioContext.createMediaStreamSource(stream);

        rec = new Recorder(input, { numChannels: 1 });

        rec.record();

      })
      .catch(function (err) {
        recordButton.disabled = false;
      });
  }
}

function stopRecording() {
  //console.log("stop Recording");
  recordButton.value = "0";
  recordButton.innerHTML = '<img class="upfile" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTI1NiwwYy00OS40NTYsMC04OS42OTMsNDAuMjM3LTg5LjY5Myw4OS42OTN2MTc2LjI3OWMwLDQ5LjQ1LDQwLjIzNyw4OS42ODcsODkuNjkzLDg5LjY4NyAgICBjNDkuNDU2LDAsODkuNjkzLTM5Ljk1Nyw4OS42OTMtODkuMDcxVjg5LjY5M0MzNDUuNjkzLDQwLjIzNywzMDUuNDU2LDAsMjU2LDB6IE0zMDguMzE1LDI2Ni41ODMgICAgYzAsMjguNTAzLTIzLjQ3LDUxLjY5OC01Mi4zMTUsNTEuNjk4cy01Mi4zMjEtMjMuNDY0LTUyLjMyMS01Mi4zMTVWODkuNjkzYzAtMjguODUxLDIzLjQ3LTUyLjMyMSw1Mi4zMjEtNTIuMzIxICAgIHM1Mi4zMjEsMjMuNDcsNTIuMzE1LDUyLjMyMVYyNjYuNTgzeiIgZmlsbD0iIzM1NDQ2MiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cmVjdCB4PSIyMzcuMzE0IiB5PSI0MDkuMjI2IiB3aWR0aD0iMzcuMzcyIiBoZWlnaHQ9Ijg0LjA4OCIgZmlsbD0iIzM1NDQ2MiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9yZWN0PgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMzA1LjIwNyw0NzQuNjI4aC05OC40MTRjLTEwLjMyMSwwLTE4LjY4Niw4LjM2NS0xOC42ODYsMTguNjg2YzAsMTAuMzIxLDguMzY1LDE4LjY4NiwxOC42ODYsMTguNjg2aDk4LjQxNCAgICBjMTAuMzIxLDAsMTguNjg2LTguMzY1LDE4LjY4Ni0xOC42ODZDMzIzLjg5Myw0ODIuOTkzLDMxNS41MjgsNDc0LjYyOCwzMDUuMjA3LDQ3NC42Mjh6IiBmaWxsPSIjMzU0NDYyIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0zOTcuMzkyLDIzNC44MjJjLTEwLjMyMSwwLTE4LjY4Niw4LjM2NS0xOC42ODYsMTguNjg2djE0Ljk0OWMwLDY3LjY1Ni01NS4wNDksMTIyLjcwNi0xMjIuNzA2LDEyMi43MDYgICAgYy02Ny42NjIsMC0xMjIuNzA2LTU1LjA0OS0xMjIuNzA2LTEyMi43MDZ2LTE0Ljk0OWMwLTEwLjMyMS04LjM2NS0xOC42ODYtMTguNjg2LTE4LjY4NnMtMTguNjg2LDguMzY1LTE4LjY4NiwxOC42ODZ2MTQuOTQ5ICAgIGMwLDg4LjI2Nyw3MS44MTEsMTYwLjA3OCwxNjAuMDc4LDE2MC4wNzhzMTYwLjA3OC03MS44MTEsMTYwLjA3OC0xNjAuMDc4di0xNC45NDkgICAgQzQxNi4wNzgsMjQzLjE4OCw0MDcuNzEzLDIzNC44MjIsMzk3LjM5MiwyMzQuODIyeiIgZmlsbD0iIzM1NDQ2MiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" />';

  rec.stop();

  gumStream.getAudioTracks()[0].stop();

  rec.exportWAV(createLink);
}

function createLink(blob) {
  var url = URL.createObjectURL(blob);
  AudioNode.src = url;
  AudioNode.onloadedmetadata = function () {
    console.log(AudioNode.duration);
    if (AudioNode.duration < 301) {
      async function MainFile() {
        Base64 = await toBase64(file);
      }
      button.disabled = false;
      MainFile();
    } else {
      alert("Audio file duration must be 5 minutes or less");
      button.disabled = true;
      AudioNode.src = "";
    }
  };
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

    if (isError) {
      AudioNode.src = "";
      return;
    }

    var fileURL = URL.createObjectURL(file);
    AudioNode.src = fileURL;
    AudioNode.onloadedmetadata = function () {
      console.log(AudioNode.duration);
      if (AudioNode.duration < 5) {
        async function MainFile() {
          Base64 = await toBase64(file);
        }
        button.disabled = false;
        MainFile();
      } else {
        alert("Audio file duration must be 5 minutes or less");
        button.disabled = true;
        AudioNode.src = "";
      }
    };
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
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
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
