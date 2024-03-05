const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const random = require("random-name");

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

  // console.log(selectedVideo);
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
  res.send(newComment);
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
    res.status(200).send("Comment deleted");
  } else {
    res.status(404).send("Comment not found");
  }
});

//post request to upload a new video with all details
router.post("/", (req, res) => {
  const { title, description } = req.body;

  const videosJSON = fs.readFileSync("./data/video-details.json");
  const videos = JSON.parse(videosJSON);

  //create a new video
  const newVideo = {
    id: uuidv4(),
    title: title,
    channel: random.first() + " " + random.last(),
    image: "http://localhost:8080/images/image1.jpg ",
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
});

module.exports = router;
