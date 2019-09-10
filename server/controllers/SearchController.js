const axios = require("axios");
const keys = require('../config/keys');

const search = async (req, res) => {
    const {genre, order, sort} = req.body
    const completeResult = [];
    let page = 1;
    console.log("search");
    const pages = await axios.get(`https://tv-v2.api-fetch.website/movies/`);
    console.log(pages.data.length);
    while(page < 265) {
        console.log(page);
        const result = await axios.get(`https://tv-v2.api-fetch.website/movies/${page}`);
        completeResult.push(...result.data);
        page++;
    }
    console.log(completeResult.length);
    res.status(200).send("lol")
}

module.exports = {
    search
}