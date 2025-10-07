function speakText(text) {
  if (!text) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.pitch = 1;
  speech.rate = 1;

  // Pick a female voice
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice =>
    voice.name.toLowerCase().includes("female") || 
    voice.name.toLowerCase().includes("woman") || 
    voice.name.toLowerCase().includes("girl") ||
    voice.name.toLowerCase().includes("samantha") || // Mac's female voice
    voice.name.toLowerCase().includes("zira") ||     // Windows female voice
    voice.name.toLowerCase().includes("linda") || 
    voice.name.toLowerCase().includes("emma")
  );

  if (femaleVoice) {
    speech.voice = femaleVoice;
  }

  setTimeout(() => {
    window.speechSynthesis.speak(speech);
  }, 50); // small delay
}

function greetUser() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = "";

  if (hour < 12) greeting = "Good morning!";
  else if (hour < 18) greeting = "Good afternoon!";
  else greeting = "Good evening!";

  greeting += "I am Honey. How can I help you?";
  document.getElementById("output").textContent = greeting;
  speakText(greeting);
}

function startListening() {
  const output = document.getElementById("output");
  const button = document.getElementById("btn");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.start();
  button.classList.add("scaling");

  recognition.onresult = function(event) {
    const command = event.results[0][0].transcript.toLowerCase();
    output.textContent = `You said: "${command}"`;

    if (command.includes("open youtube")) {
      speakText("Opening YouTube");
    } else if (command.includes("open google")) {
      speakText("Opening Google");
    }else if (command.includes("open wikipedia")) {
      speakText("Opening Wikipedia");
      window.open("https://www.wikipedia.org", "_blank");
    }else if (command.includes("open edge")) {
      speakText("Opening edge");
      window.open("https://www.microsoft.com/edge", "_blank");
    }else if (command.includes("open calculator")) {
      speakText("Opening Calculator");
    }else if (command.includes("open vs code") || command.includes("open visual studio code")) {
      speakText("Opening Visual Studio Code");
      // window.open("https://code.visualstudio.com", "_blank");
    }else if (command.startsWith("search")) {
      const searchTerm = command.replace("search", "").trim();
      speakText(`Searching ${searchTerm}`);
    } else if (command.includes("close browser") || command.includes("close tab")) {
      speakText("Closing browser");
    }else{
      speakText("Sorry, I couldn't recognize the command. Try again!")
    }

    fetch(`http://localhost:8080/command?text=${encodeURIComponent(command)}`)
      .then(res => res.text())
      .then(data => {
        output.textContent += "\nAssistant: " + data;
      });
  };

  recognition.onerror = function(event) {
    output.textContent = "Error occurred in recognition: " + event.error;
  };

  recognition.onend = function() {
    button.classList.remove("scaling");
  };
}

window.addEventListener("click", function onFirstClick() {
  window.speechSynthesis.resume();
  greetUser();
  window.removeEventListener("click", onFirstClick);
});

// On some browsers, voices load asynchronously
window.speechSynthesis.onvoiceschanged = () => {
  console.log("Available voices:", window.speechSynthesis.getVoices());
};
