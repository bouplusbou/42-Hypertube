const axios = require("axios");
const keys = require('../config/keys');
const MovieModel = require('../models/MovieModel');

const search = async (req, res) => {
    console.log(req.body);
    const {genre, order, sort, ratings, years} = req.body;
    const sorting = {};
    sorting[sort] = parseInt(order);
    if (genre !== 'All') movieList = await MovieModel.aggregate([
        {$match : {genres: genre}},
        {$sort : sorting},
        {$limit : 50}
    ]);
    else movieList = await MovieModel.aggregate([{$limit: 50}]);
    movieList = movieList.filter(movie => movie.year >= years[0] && movie.year <= years[1]);
    movieList = movieList.filter(movie => movie.rating >= ratings[0] && movie.rating <= ratings[1]);
    res.status(200).json(movieList);
}

module.exports = {
    search
}