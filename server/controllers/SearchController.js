const axios = require("axios");
const keys = require('../config/keys');

const getTMDBResult = async terms => {
    const res = await axios.get('https://api.themoviedb.org/3/discover/movie?api_key=256917e54af5083cae342214e4c314d0&language=en-US&sort_by=popularity.desc&page=1&with_genres=27');
    return res.data
}

const search = async (req, res) => {
    const TMDBRes = await getTMDBResult(req.body);
    res.status(200).json(TMDBRes);
}

module.exports = {
    search
}