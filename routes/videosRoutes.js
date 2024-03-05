const express = require("express");
const router = express.Router();
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

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

  console.log(selectedVideo.comments);
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

//post video (upload video)
// router.post()

module.exports = router;
