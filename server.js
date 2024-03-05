const express = require("express");
const app = express();
const PORT = 8080;
const videosRoutes = require("./routes/videosRoutes");
const cors = require("cors");

app.use(cors()); //allows anyone to access
app.use(express.json()); //allows us to parse JSON
app.use(express.static("public")); //allows us to serve static files

//get videos from "/videos"
app.use("/videos", videosRoutes);

app.listen(PORT, () => {
  console.log("Welcome to my server. Running on port", PORT);
});
