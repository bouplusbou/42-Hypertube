const axios = require("axios");
const keys = require('../config/keys');
const MovieModel = require('../models/MovieModel');

const search = async (req, res) => {
    // console.log(req.body);
    const {genre, order, sort, ratings, years, page, limit, keywords} = req.body;
    const sorting = {};
    const skip = limit * (page - 1);
    const count = limit * page;
    sorting[sort] = parseInt(order);
    sorting["title"] = 1;
    const queryTerms = [
        {$sort: sorting},
        {$limit: count},
        {$skip: skip},
    ]
    if (keywords !== '') queryTerms.unshift({$match: {title: {$regex: keywords.toLowerCase()}}});
    if (genre !== 'All') queryTerms.unshift({$match: {...queryTerms.$match, genres: genre.toLowerCase()}});
    movieList = await MovieModel.aggregate(queryTerms);
    movieList = movieList.filter(movie => movie.year >= years[0] && movie.year <= years[1]);
    movieList = movieList.filter(movie => movie.rating >= ratings[0] && movie.rating <= ratings[1]);
    res.status(200).json(movieList);
}

module.exports = {
    search
}