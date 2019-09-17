const UserModel = require('../models/UserModel');
const MovieModel = require('../models/MovieModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
var CronJob = require('cron').CronJob;

const setViewed = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const imdbId = req.body.imdbId;
        const query = { "imdbId" : imdbId };
        const date = Date.now()
        const update = { lastViewed: date }
        await MovieModel.updateOne(query, update)
        await UserModel.updateOne(
            { "_id" : _id},
            { $push: {
                viewedList: {
                    $each: [imdbId],
                    $position : 0
                }}
            })
            let now = new Date();
            now.setSeconds(now.getSeconds() + 10);
        new CronJob(now, () => {
            console.log('You will see this message every secondHOOOOOOOOOOOOOO');
          });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err});
    }
}

module.exports = { setViewed }