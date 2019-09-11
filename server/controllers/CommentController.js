const CommentModel = require('../models/CommentModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const ObjectID = require('mongodb').ObjectID;

const createComment = async (req, res) => {
    try {
        const { authToken } = req.query;
        jwt.verify(authToken, keys.JWT_SECRET, async (err, decoded) => {
            const _id = decoded.mongoId;
            const newComment = new Comment({
                userId: _id,
                imdbId: req.body.imdbId,
                comment: req.body.comment,
            });
            await CommentModel.collection.insertOne(newComment)
            res.status(200).json({ message: 'Comment created' });
        });
    } catch(err) { console.log(err) }
};

module.exports = {
    createComment,
};
