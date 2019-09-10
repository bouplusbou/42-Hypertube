const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');

router.route('/genre')
    .post(async (req, res) => SearchController.search(req, res));

module.exports = router;