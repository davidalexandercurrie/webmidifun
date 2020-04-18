// var output;
var playnote = false;
var mouseYCapped;
var mouseXCapped;
var mouseYOld;
var i = 0;
var currentFill;
let colours = [];
myString = "";
let capture;
let octave = 0;
let output = {};
let midiDeviceConnected = false;

function setup() {
  // put setup code here
  // capture = createCapture(VIDEO);
  // capture.size(320, 240);
  createCanvas(300, 600);
  WebMidi.enable(function (err) {
    if (WebMidi.outputs[0]) {
      output = WebMidi.outputs[0];
      midiDeviceConnected = true;
    } else {
      output = { name: "No midi devices available" };
    }
    // input.addListener("all", "all", function (e) {
    //   console.log("Received message (" + e.note.name + e.note.octave + ").");
    // });
    document.getElementById("selected-midi").innerText = output.name;
    WebMidi.outputs.forEach((e) => {
      const button = createButton(e.name);
      button.style("border-radius: 1em");
      button.parent("select-midi");
      button.mousePressed(() => {
        output = output = WebMidi.getOutputByName(e.name);
        document.getElementById("selected-midi").innerText = output.name;
        console.log(output.name + " is now selected!");
        alert(output.name + " is now selected!");
      });
    });
  });
  document.getElementById("selected-octave").innerText = "\n";
  for (let i = 0; i < 13; i++) {
    colours.push(color(random(255), random(255), random(255)));
  }
  currentFill = colours[0 - octave];
  const octaveUp = createButton("Octave +");
  octaveUp.style("border-radius: 1em 1em 0 0");
  octaveUp.mousePressed(() => {
    if (octave < 12 * 6) {
      octave = octave + 12;
    }
    document.getElementById("selected-octave").innerText =
      octave > 0
        ? "+ " + String(octave / 12)
        : octave < 0
        ? "- " + Math.abs(String(octave / 12))
        : "\n";
  });
  const octaveDown = createButton("Octave -");
  octaveDown.style("border-radius: 0em 0em 1em 1em");
  octaveDown.mousePressed(() => {
    if (octave > 12 * -2) {
      octave = octave - 12;
    }
    document.getElementById("selected-octave").innerText =
      octave > 0
        ? "+ " + String(octave / 12)
        : octave < 0
        ? "- " + Math.abs(String(octave / 12))
        : "\n";
  });
  octaveUp.parent("octave");
  octaveDown.parent("octave");
}

function draw() {
  // put drawing code here

  background("#39ff14");
  for (let j = 0; j < 13; j++) {
    if (i % 8 === 0) {
      stroke(255);
    } else {
      stroke(0);
    }
    line(0, (600 / 12) * j, 600, (600 / 12) * j);
  }
  fill(255);
  rectMode(CORNER);
  rect(0, 600 - (600 / 12) * (mouseYCapped - 35), 600, 600 / 12);
  rectMode(CENTER);
  fill(currentFill);
  ellipse(
    mouseX,
    mouseY,
    ((600 / 12) * mouseX) / 300 + 20,
    ((600 / 12) * mouseX) / 300 + 20
  );
  if (playnote) {
    if (mouseY > 600) {
      mouseYCapped = 600;
    } else if (mouseY < 0) {
      mouseYCapped = 0;
    } else {
      mouseYCapped = mouseY;
    }
    if (mouseX > 300) {
      mouseXCapped = 300;
    } else if (mouseX < 0) {
      mouseXCapped = 0;
    } else {
      mouseXCapped = mouseX;
    }

    let velocity = mouseXCapped / 300;

    mouseYCapped = 600 - mouseYCapped;
    mouseYCapped = Math.floor((mouseYCapped / 600) * 12 + 36);
    fill(colours[mouseYCapped - 36]);
    currentFill = colours[mouseYCapped - 36];
    if (midiDeviceConnected) {
      output.playNote(mouseYCapped + octave, 1, {
        duration: 500,
        velocity: velocity,
      });
      playnote = false;
    }
  }
  i++;
  if (i % 8 === 0) {
    playnote = true;
  }
}

function keyPressed() {
  if (key === "ArrowUp") {
    octaveUp();
  }
  if (key === "ArrowDown") {
    octaveDown();
  }
}

function octaveUp() {
  if (octave < 12 * 6) {
    octave = octave + 12;
  }
  document.getElementById("selected-octave").innerText =
    octave > 0
      ? "+ " + String(octave / 12)
      : octave < 0
      ? "- " + Math.abs(String(octave / 12))
      : "\n";
}

function octaveDown() {
  if (octave > 12 * -2) {
    octave = octave - 12;
  }
  document.getElementById("selected-octave").innerText =
    octave > 0
      ? "+ " + String(octave / 12)
      : octave < 0
      ? "- " + Math.abs(String(octave / 12))
      : "\n";
}
