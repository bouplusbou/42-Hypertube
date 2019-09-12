const express = require("express");
const router = express.Router();
const PlayerController = require("../controllers/PlayerController");

router
  .route("/download")
  .get(async (req, res) => PlayerController.downloadVideo(req, res));

router
  .route("/stream")
  .get(async (req, res) => PlayerController.streamVideo(req, res));

module.exports = router;
