const axios = require("axios");
const keys = require('../config/keys');
const MovieModel = require('../models/MovieModel');

const search = async (req, res) => {
    console.log(req.body);
    const {genre, order, sort, ratings, years} = req.body;
    let movieList = await MovieModel.find();
    movieList = movieList.filter(movie => movie.year >= years[0] && movie.year <= years[1]);
    movieList = movieList.filter(movie => movie.rating >= ratings[0] && movie.rating <= ratings[1]);
    res.status(200).json(movieList);
}

module.exports = {
    search
}