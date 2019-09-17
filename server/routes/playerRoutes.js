const express = require("express");
const router = express.Router();
const PlayerController = require("../controllers/PlayerController");

router
  .route("/stream")
  .get(async (req, res) => PlayerController.handleTorrent(req, res));

router
  .route("/subs")
  .get(async (req, res) => PlayerController.handleSubs(req, res));

module.exports = router;
