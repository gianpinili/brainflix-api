const express = require("express");
const router = express.Router();

//get videos
router.get("/", (req, res) => {
  res.send("HERE ARE THE VIDEOS REQUIRED FOR YOUR PROJECT!");
});

//get video with id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log("Selected ID: ", id);
  res.send("HERE IS THE SELECTED VIDEO: ");
});

//post comment
// router.post("/:id/comments", (req, res) => {
//   const { id } = req.params;
//   const { comment } = req.body;
//   console.log("Selected ID: ", id);
//   console.log("Comment: ", comment);
//   res.send("POST REQUEST FOR SELECTED VIDEO - COMMENT CREATED");
// });

//delete comment
// router.delete("/:videoId/comments/:commentId", (req, res) => {
//   const { videoId, commentId } = req.params;
//   console.log("Selected Video ID: ", videoId);
//   console.log("Selected Comment ID: ", commentId);
//   res.send("DELETE REQUEST FOR SELECTED VIDEO - COMMENT DELETED");
// });

//post video (upload video)
// router.post()

module.exports = router;
