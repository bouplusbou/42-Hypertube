const axios = require("axios");
const keys = require('../config/keys');

const search = async (req, res) => {
    console.log(req.body);
    const {page, genre, order, sort} = req.body;
    const result = await axios.get(`https://yts.lt/api/v2/list_movies.json?page=${page}&genre=${genre}&order_by=${order}&sort_by=${sort}`);
    res.status(200).json(result.data.data.movies)
}

module.exports = {
    search
}