const UserModel = require('../models/UserModel');
const MovieModel = require('../models/MovieModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const setViewed = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const query = { "imdbId" : req.body.imdbId};
        const date = Date.now()
        const update = { lastViewed: date }
        await MovieModel.updateOne(query, update)
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err});
    }
}

module.exports = { setViewed }