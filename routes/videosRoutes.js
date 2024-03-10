const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const random = require("random-name");
const multer = require("multer");
const path = require("path");

// Specify the destination path for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Serve static files (with multer middleware)
router.use(express.static(path.join(__dirname, "../public/")));

//get videos
router.get("/", (req, res) => {
  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //get id, title, channel, image from json file using map function to create videoDetails
  const videoDetails = videos.map((video) => {
    return {
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    };
  });

  //send videoDetails (id, title, channel, image)
  if (videoDetails) {
    res.statusMessage = "Here are the video details! Enjoy ";
    res.status(200).send(videoDetails);
  } else {
    res.statusMessage = "Video not found";
    res.status(404).send("Video not found");
  }
});

//get selected video details in full with id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //get selected video details in videos from json file using find function to create selectedVideo
  const selectedVideo = videos.find((video) => video.id === id);

  if (selectedVideo) {
    res.statusMessage = "Here are the video details! Enjoy ";
    res.status(200).send(selectedVideo);
  } else {
    res.statusMessage = "No video here!";
    res.status(404).send("Video not found");
  }
});

//post comment
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;

  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //get selected video details in videos from json file using find function to create selectedVideo
  const selectedVideo = videos.find((video) => video.id === id);

  //create newComment
  const newComment = {
    id: uuidv4(),
    name,
    comment,
    likes: 0,
    timestamp: Date.now(),
  };

  //push newComment to the comments array in the selected video
  selectedVideo.comments.push(newComment);

  //this will update the json file with the new comment
  const updatedVideoDetail = JSON.stringify(videos);
  fs.writeFileSync("./data/video-details.json", updatedVideoDetail);

  res.statusMessage = "Comment posted";
  res.status(201).send(newComment);
});

//delete comment
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const { videoId, commentId } = req.params;

  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //get selected video details in videos from json file using find function to create selectedVideo
  const selectedVideo = videos.find((video) => video.id === videoId);

  //delete selected comment
  selectedVideo.comments = selectedVideo.comments.filter(
    (comment) => comment.id !== commentId
  );

  //this will update the json file with the new array
  const updatedVideoDetail = JSON.stringify(videos);
  fs.writeFileSync("./data/video-details.json", updatedVideoDetail);

  if (selectedVideo) {
    res.status(201).send("Comment deleted");
  } else {
    res.status(404).send("Comment not found");
  }
});

router.post("/", upload.single("image"), (req, res, next) => {
  const { title, description } = req.body;
  const image = req.file;

  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //create a new video
  const newVideo = {
    id: uuidv4(),
    title: title,
    channel: random.first() + " " + random.last(),
    image: "http://localhost:8080/images/" + image.originalname,
    description: description,
    views: 0,
    likes: 0,
    duration: Math.floor(Math.random() * 10) + ":00",
    video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };

  //push newVideo to the videos array
  videos.push(newVideo);

  //update json file
  const updatedVideoDetail = JSON.stringify(videos);
  fs.writeFileSync("./data/video-details.json", updatedVideoDetail);

  res.statusMessage = "Video posted. Thanks!";
  res.status(200).send("Video posted");

  if (!newVideo) {
    res.statusMessage = "Oh no, try again!";
    res.status(404).send("Upload failed");
  }

  next();
});

//likes put endpoint
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //update likes when button is clicked on put request
  const selectedVideo = videos.find((video) => video.id === id);
  const likesParts = selectedVideo.likes.split(",");
  let integerPart = parseInt(likesParts[0].replace(/,/g, ""), 10);
  let decimalPart = parseInt(likesParts[1] || 0, 10);

  // Increment likes count
  decimalPart++;
  if (decimalPart >= 1000) {
    integerPart += Math.floor(decimalPart / 1000);
    decimalPart %= 1000;
  }
  // Reconstruct likes string
  selectedVideo.likes =
    integerPart.toLocaleString() +
    "," +
    decimalPart.toString().padStart(3, "0");

  //update json file
  const updatedVideoDetail = JSON.stringify(videos);
  fs.writeFileSync("./data/video-details.json", updatedVideoDetail);

  res.statusMessage = "Thank you for the feedback!";
  res.status(200).send("Thank you for the feedback!");
});

//update views endpoint
router.put("/:id/views", (req, res) => {
  const { id } = req.params;

  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //update views when a selected video is clicked
  const selectedVideo = videos.find((video) => video.id === id);

  const viewsParts = selectedVideo.views.split(",");
  let integerPart = parseInt(viewsParts[0].replace(/,/g, ""), 10);
  let decimalPart = parseInt(viewsParts[1] || 0, 10);

  // Increment views count
  decimalPart++;
  if (decimalPart >= 1000) {
    integerPart += Math.floor(decimalPart / 1000);
    decimalPart %= 1000;
  }
  // Reconstruct views string
  selectedVideo.views =
    integerPart.toLocaleString() +
    "," +
    decimalPart.toString().padStart(3, "0");

  //update json file
  const updatedVideoDetail = JSON.stringify(videos);
  fs.writeFileSync("./data/video-details.json", updatedVideoDetail);

  res.statusMessage = "Thank you for watching!";
  res.status(200).send("Thank you for watching!");
});

module.exports = router;
