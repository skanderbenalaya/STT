var inputForm = document.querySelector("form");

var inputTxt = document.querySelector(".txt");


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

// ---------------------------------- Send to audio side ----------------------------------------------------

function sendJSON(message) {
  //console.log("User Message:", message);

  // Creating a XHR object
  let xhr = new XMLHttpRequest();

  //let url = "http://localhost:8080/tts";
  let url = "/synt";

  // open a connection
  xhr.open("POST", url, true);
  xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');


  // Set the request header i.e. which type of content you are sending
  xhr.setRequestHeader("Content-Type", "application/json");

  // Create a state change callback
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var audio = document.querySelector("audio"); 
      // Print received data from server
      var output = JSON.parse(this.responseText);
      //console.log("good", output["response"]);
      var base64_response = output["output_audio_base64"];
      //console.log("good", output["output_audio_base64"]);
    
      new_duration=new Audio("data:audio/wav;base64," + base64_response).duration;
      audio.src = "data:audio/wav;base64," + base64_response; 
      //console.log(audio.src);
      audio.duration=new_duration
      audio.currentTime = 0;
      audio.load();
      //setTimeout(sound_response.play(), 3000);
    }
  };

  // Converting JSON data to string
  var data = JSON.stringify({ message: message, sender: "username" });

  // Sending data with the request
  xhr.send(data);
}

inputForm.onsubmit = function (event) {
  event.preventDefault();

  inputTxt.blur();
  sendJSON(inputTxt.value);
};

