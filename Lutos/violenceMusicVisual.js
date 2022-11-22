let songs = [];
 
let songNum = 0;

let songSelector;
let btnPlay;
let btnStop;

let fft;
let fftBins = 256;
let partsNum = 8;

let spin = 0;
var amp;
let img1,img2;
let imageSize=200;
 






function preload() {
  
    songs = loadSound("jiabao.wav", console.log(4 + ". loaded"));
    img1 = loadImage("images/1.png");
    img2 = loadImage("images/2.png");
    
    
   
}

function setup() {
  getAudioContext().suspend();
  noCursor();
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(0.9, fftBins);

  angleMode(DEGREES);
  amp = new p5.Amplitude();
  
  songs.play(); //why the song will play right after the previous one stop?
   getAudioContext().resume();
   imageMode(CENTER);
   
   bx = width / 2.0;
  by = height / 2.0;
  rectMode(RADIUS);
  strokeWeight(2);
  
  
  textSize(32);
  textAlign(CENTER, CENTER);
  

 
}
let pressFlag=0;


function mousePressed() {
  userStartAudio();
  
  if(pressFlag==0){
    userStartAudio();
  }else{
    if(pressFlag%2==0){
      songs.play();
    }
    if(pressFlag%2==1){
      songs.pause();
    }
  }
  
  pressFlag=pressFlag+1;
}
function draw() {
  textAlign(CENTER);
  text('EFGH', width/10, width/10);
  fill('#ed225d');
  songs.setVolume(map(abs(mouseX-width/2),0,width/2,1,0.01));
  //visualizing song------------------------------------
  let spectrum = fft.analyze();
  let spectChunks = [];
  while (spectrum.length > 0) {
    const chunk = spectrum.splice(0, fftBins / partsNum);
    spectChunks.push(chunk);
  }

  var vol = spectChunks[0][spectChunks[0].length - 2];
  background(222,177,153);
  console.log(vol);
  stroke(0);
  push();
  translate(width/2, height/2);
  spin += 0.05;
  rotate(spin);
  stroke('#422132');
  strokeWeight(1);
  //line(0, 0, -width, 0);
  stroke(0);
  fill(162,34,77,60);

  for (let i = 1; i < partsNum - 1; i++) {
    beginShape();
    let amp_ = spectChunks[i][spectChunks[i].length - 2];
    let angle_ = (fftBins / partsNum / 360) * -1;
    let r_ = map(amp_*10, 0, 255, 20, 1000);
    let x_ = r_ * cos(angle_);
    let y_ = r_ * sin(angle_);
    curveVertex(x_, y_);
    for (let j = 0; j < fftBins / partsNum; j++) {
      let amp = spectChunks[i][j];
      let angle = map(j, 0, fftBins / partsNum - 1, 0, 360);
      let r = map(amp, 0, 255, 1, 250);
      let x = r * cos(angle);
      let y = r * sin(angle);
      curveVertex(x*2, y*2);
    }
    amp_ = spectChunks[i][spectChunks[0]];
    angle_ = fftBins / partsNum / 360;
    curveVertex(x_, y_);

    endShape();
  }
  stroke('#F90A1B');
  pop();
 tint(255,map(abs(mouseX-width/2),0,width/2,0,255));
 image(img1,mouseX,mouseY);
 tint(255,map(abs(mouseX-width/2),0,width/2,255,0));
 image(img2,mouseX,mouseY);
  //line(0, 0, width, 0);
}

function stopSong() {
  for (let song of songs) {
    if (song.isPlaying()) {
      song.stop();
    }
  }
}
