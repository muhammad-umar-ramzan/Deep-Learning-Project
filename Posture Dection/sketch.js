let video;
let bodyPose;
let poses = [];
let connections;

function preload() {
  // Load the bodyPose model with a callback
  bodyPose = ml5.bodyPose(modelLoaded);
}

function modelLoaded() {
  console.log('BodyPose model loaded successfully');
  // Now that the model is loaded, start pose detection
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
}

function setup() {
  createCanvas(1000, 700);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(1000, 700);
  video.hide();
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw the skeleton connections
  if (connections && poses.length > 0) {
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i];
      for (let j = 0; j < connections.length; j++) {
        let pointAIndex = connections[j][0];
        let pointBIndex = connections[j][1];
        let pointA = pose.keypoints[pointAIndex];
        let pointB = pose.keypoints[pointBIndex];
        // Only draw a line if both points are confident enough
        if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
          stroke(255, 0, 0);
          strokeWeight(2);
          line(pointA.x, pointA.y, pointB.x, pointB.y);
        }
      }
    }
  }

  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
