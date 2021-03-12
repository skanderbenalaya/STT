var inputForm = document.querySelector("form");

var inputTxt = document.querySelector(".txt");

var button = document.querySelector(".bubbly-button");

var AudioNode = document.querySelector('audio');

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

Base64=null;

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext

var recordButton = document.getElementById("recordButton");

recordButton.addEventListener("click", startRecording);

function startRecording() {
  if (recording) {
    stopRecording();
    recording=0;
} else {
  recording = 1;
  //console.log("recordButton clicked");
  recordButton.value = '1';
  recordButton.innerHTML = 'Stop';

    var constraints = { audio: true, video:false }

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		//console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		audioContext = new AudioContext({ sampleRate:16000});

		gumStream = stream;
		
		input = audioContext.createMediaStreamSource(stream);

		rec = new Recorder(input,{numChannels:1})

		rec.record()

		//console.log("Recording started");

	}).catch(function(err) {

    	recordButton.disabled = false;
	});
}
}

function stopRecording() {
	//console.log("stop Recording");
  recordButton.value = '0';
  recordButton.innerHTML = 'Record';
	
	rec.stop();

	gumStream.getAudioTracks()[0].stop();

  rec.exportWAV(createDownloadLink);
  //console.log(rec);
}

function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);
  AudioNode.src = url;
  //console.log("url*****************",url)
  var reader = new FileReader();
  reader.readAsDataURL(blob); 
  reader.onloadend = function() {
      Base64 = reader.result;                
      //console.log(Base64);
  }
  button.disabled = false;
}
//---------------------------------- Base64 file selection conversion  ----------------------------------------------------

const toBase64 = f => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(f);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

// ---------------------------------- Send to audio side ----------------------------------------------------
(function localFileAudioPlayer() {
	'use strict'
  var URL = window.URL || window.webkitURL
  var playSelectedFile = function (event) {
    globalThis.file = this.files[0]
    var type = file.type
    var AudioNode = document.querySelector('audio')
    var canPlay = AudioNode.canPlayType(type)
    if (canPlay === '') canPlay = 'no'
    var message = 'File Loaded'
    var isError = canPlay === 'no'
    //console.log("message",message, "Error",isError);

    if (isError) {
      return
    }

    var fileURL = URL.createObjectURL(file)
    AudioNode.src = fileURL
    button.disabled = false;

    async function MainFile() {
  
      Base64=(await toBase64(file));
    }
    MainFile();
  }
  var inputNode = document.querySelector('input')
  inputNode.addEventListener('change', playSelectedFile, false)
})()

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


