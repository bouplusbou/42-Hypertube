const express = require('express');
const router = express.Router();
const getChunks = require('../../torrent/index')

router.route('/').get(async (req, res) => {
    await getChunks(req, res);
});

module.exports = router;
