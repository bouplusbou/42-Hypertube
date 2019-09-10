const axios = require("axios");

const scrapPopcorn = async () => {
    console.log("Scraping Popcorn Time API");
    const pageCount = await axios.get('https://tv-v2.api-fetch.website/movies');
    console.log(`${pageCount.data.length - 2} pages found.`);
    const moviesList = [];
    for (let i = 1; i < pageCount.data.length - 1; i++) {
        const res = await axios.get(`https://tv-v2.api-fetch.website/movies/${i}`);
        // console.log(`${res.data.length} movie(s) found on page ${i}.`);
        moviesList.push(...res.data)
    }
    const clearResults = moviesList.map(movie => {
        const infos = {
            imdbId: movie.imdb_id,
            torrents: movie.torrents,
        }
        return infos
    })
    console.log(`${clearResults.length} movies found in total.`);
}

const scrapYTS = async () => {
    console.log("Scraping YTS API");
    const moviesList = [];
    for (let i = 1; i < 300; i++) {
        const res = await axios.get(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`);
        console.log(`${res.data.data.movies.length} movie(s) found on page ${i}.`);
        moviesList.push(...res.data.data.movies)
    }
    console.log(moviesList.length);
}
// scrapPopcorn();
scrapYTS();