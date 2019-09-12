const axios = require("axios");
const keys = require('../config/keys');

const search = async (req, res) => {
    console.log(req.body);
    const {genre, order, sort, ratings, limit, years} = req.body;
    let page = req.body.page;
    let queryResult = []
    while (queryResult.length !== 50) {
        const result = await axios.get(`https://yts.lt/api/v2/list_movies.json?limit=${limit}&page=${page}&genre=${genre}&order_by=${order}&sort_by=${sort}&minimum_rating=${ratings[0]}`);
        const filteredMovies = result.data.data.movies.map(movie => {
            // console.log(movie);
            if (movie.year >= years[0] && movie.year <= years[1]) return movie;
            return null;
        })
        queryResult = filteredMovies.filter((movie) => movie );
        page++;
    }
    res.status(200).json(queryResult)
}

module.exports = {
    search
}