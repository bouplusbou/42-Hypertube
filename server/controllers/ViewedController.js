const ViewedModel = require('../models/CommentModel');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const SetViewed = async (req, res) => {
    try {
        const { authToken, imdbId } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        await UserModel.findById(_id);
        const query = { "user" : _id, "imdbId" : imdbId}
        const options = { upsert: true };
        const update = { viewDate: new Date() }
        await ViewedModel.findOneAndUpdate(query, update, options)
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err});
    }
}

module.export = {
    SetViewed
}