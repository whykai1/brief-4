let video;
let detections = {};
let frameRateVideo = 30;
let videoReady = false;
let jsonReady = false;
let confidenceThreshold = 0.5;

function setup() {
  createCanvas(640, 360);

  // Create video
  video = createVideo("video.mp4", () => {
    console.log("Video loaded");
    video.hide();
    video.loop();
  });

  video.elt.onloadedmetadata = () => {
    console.log("Video size:", video.elt.videoWidth, video.elt.videoHeight);
    videoReady = true;
  };

  // Load JSON via fetch inside setup (not preload)
  fetch("./data/detections.json")
    .then(response => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.json();
    })
    .then(json => {
      detections = json;
      console.log("JSON loaded!", Object.keys(detections).slice(0,5));
      jsonReady = true;
    })
    .catch(err => console.error("Failed to load JSON:", err));
}

function mousePressed(){
  video.loop();
}

// function draw() {
//   background(0);

//   if (video) image(video, 0, 0, width, height);

//   if (!videoReady || !jsonReady) return;

//   const frameIndex = Math.round(video.time() * frameRateVideo);
//   const frameKey = `frame${String(frameIndex).padStart(4, "0")}.jpg`;
//   const preds = detections[frameKey] || [];

//   let scaleX = width / video.elt.videoWidth;
//   let scaleY = height / video.elt.videoHeight;

//   preds.forEach(p => {
//     if (p.confidence < confidenceThreshold) return;

//     stroke(255, 0, 0);
//     strokeWeight(3);
//     noFill();
//     rect(
//       (p.x - p.width / 2) * scaleX,
//       (p.y - p.height / 2) * scaleY,
//       p.width * scaleX,
//       p.height * scaleY
//     );

//     fill(255);
//     noStroke();
//     textSize(14);
//     text(p.class, p.x * scaleX, p.y * scaleY - 5);
//   });
// }

function draw() {
  background(0);

  if (video) image(video, 0, 0, width, height);

  if (!videoReady || !jsonReady) return;

  const frameIndex = Math.round(video.time() * frameRateVideo);
  const frameKey = `frame${String(frameIndex).padStart(4, "0")}.jpg`;
  const preds = detections[frameKey] || [];

  let scaleX = width / video.elt.videoWidth;
  let scaleY = height / video.elt.videoHeight;

  // Count the number of high-confidence detections
  let highConfCount = 0;

  preds.forEach(p => {
    if (p.confidence < confidenceThreshold) return;

    highConfCount++;

    // Draw bounding box
    stroke(255, 0, 0);
    strokeWeight(3);
    noFill();
    rect(
      (p.x - p.width / 2) * scaleX,
      (p.y - p.height / 2) * scaleY,
      p.width * scaleX,
      p.height * scaleY
    );

    fill(255);
    noStroke();
    textSize(14);
    text(p.class, p.x * scaleX, p.y * scaleY - 5);
  });

  // Display warning if more than 2 detections
  if (highConfCount >= 2) {
    fill(255, 60, 60);
    noStroke();
    textSize(24);
    textAlign(CENTER, TOP);
    text("POTENTIAL SACRIFICE ZONE!!", width / 2, 10);
  }
}