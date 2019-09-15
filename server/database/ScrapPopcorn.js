const axios = require("axios");
const MovieModel = require('../models/MovieModel');

const Color = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
  
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  }

const log = (text, color = "yellow") => console.log(`${Color[color]}${text}${Color.Reset}`);
  
async function connectMongo() {
    const MONGO_URI = require("../config/keys").MONGO_URI;
    const mongoose = require("mongoose");
    mongoose.set('useFindAndModify', false);
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    // await mongoose.connection.dropCollection("movies")
    log("MongoDB successfully connected");
}

const scrapPopcorn = async () => {
    log("***** Scraping Popcorn Time API *****", 'cyan');
    const pageCount = await axios.get('https://tv-v2.api-fetch.website/movies');
    const rawResults = [];
    for (let i = 1; i < pageCount.data.length - 1; i++) {
        const res = await axios.get(`https://tv-v2.api-fetch.website/movies/${i}`);
        log(`${res.data.length} movie(s) found on page ${i}.`);
        rawResults.push(...res.data)
    }
    const cleanResults = rawResults.map(movie => {
        const torrents = [];
        for (const language in movie.torrents) {
            for (const quality in movie.torrents[language]) {
                const torrent = {
                    magnet: movie.torrents[language][quality].url,
                    quality: quality,
                    language: language,
                    seed: movie.torrents[language][quality].seed,
                    peer: movie.torrents[language][quality].peer,
                    bytes: movie.torrents[language][quality].size,
                    fileSize: movie.torrents[language][quality].filesize,
                    source: 'Popcorn Time'
                }
                torrents.push(torrent);
            }
        }
        const infos = {
            imdbId: movie.imdb_id,
            title: movie.title,
            year: movie.year,
            plot: movie.synopsis,
            runtime: parseInt(movie.runtime),
            trailer: movie.trailer,
            poster: movie.images.poster,
            genres: movie.genres ? movie.genres : null,
            certification: movie.certification,
            rating: movie.rating.percentage / 10,
            torrents: torrents,
        }
        return infos
    })
    log(`${cleanResults.length} movies found in total.`);
    return cleanResults;
}

const scrapYTS = async () => {
    log("***** Scraping YTS API *****", 'cyan');
    const rawResults = [];
    for (let i = 1; i < 300; i++) {
        const res = await axios.get(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`);
            if (!res.data.data.movies) break;
        log(`${res.data.data.movies.length} movie(s) found on page ${i}.`);
        rawResults.push(...res.data.data.movies)
    }
    const cleanResults = rawResults.map(movie => {
        const torrents = [];
        for (const item in movie.torrents) {
            const torrent = {
                magnet: movie.torrents[item].hash,
                quality: movie.torrents[item].quality,
                language: 'en',
                seed: movie.torrents[item].seeds,
                peer: movie.torrents[item].peers,
                bytes: movie.torrents[item].size_bytes,
                fileSize: movie.torrents[item].size,
                source: 'YTS'
            }
            torrents.push(torrent);
        }
        const infos = {
            imdbId: movie.imdb_code,
            title: movie.title,
            year: movie.year,
            plot: movie.synopsis,
            runtime: movie.runtime,
            genres: movie.genres ? movie.genres : null,
            trailer: movie.yt_trailer_code ? `http://youtube.com/watch?v=${movie.yt_trailer_code}` : null,
            poster: movie.large_cover_image,
            certification: movie.mpa_rating,
            rating: movie.rating,
            torrents: torrents
        }
        return infos;
    })
    return cleanResults;
}

const ScrapMoviesDatabases = async () => {
    try {
        log("***** HYPERTUBE DATABASE SCRAPING *****", 'cyan');
        await connectMongo();
        // const popcornRes = await scrapPopcorn();
        const ytsRes = await scrapYTS();
        const completeRawResult = ytsRes.concat(null);
        const filteredResults = [];
        completeRawResult.map(movie => {
            for (i = 0; i < filteredResults.length; i++) {
                if (filteredResults[i].imdbId === movie.imdbId) 
                    return null
            }
            filteredResults.push(movie);
        })
        const movieList = filteredResults.map(movie => {
            const item = new Movie({ ...movie });
            return item;
        })
        await MovieModel.collection.insertMany(movieList);
    }
    catch (error) { log(error, 'red') }
    finally { process.exit(0) }
}

ScrapMoviesDatabases();