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

console.log(colours);
function setup() {
  // put setup code here
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  createCanvas(300, 600);
  WebMidi.enable(function (err) {
    output = WebMidi.outputs[0];
    // input.addListener("all", "all", function (e) {
    //   console.log("Received message (" + e.note.name + e.note.octave + ").");
    // });
  });
  for (let i = 0; i < 13; i++) {
    colours.push(color(random(255), random(255), random(255)));
  }
  currentFill = colours[0];
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
  rect(mouseX, mouseY, 600 / 12, 600 / 12);
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
    console.log(mouseYCapped - 36);
    fill(colours[mouseYCapped - 36]);
    currentFill = colours[mouseYCapped - 36];
    output.playNote(mouseYCapped, 1, {
      duration: 500,
      velocity: velocity,
    });
    playnote = false;
  }
  i++;
  if (i % 8 === 0) {
    playnote = true;
  }
}

function mouseClicked() {}
