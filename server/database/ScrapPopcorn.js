const axios = require("axios");
const MovieModel = require('../models/MovieModel');
var throttledQueue = require('throttled-queue');
var throttle = throttledQueue(20, 10000);

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

async function connectMongo() {
    const MONGO_URI = require("../config/keys").MONGO_URI;
    const mongoose = require("mongoose");
    mongoose.set('useFindAndModify', false);
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        console.log("MongoDB successfully connected");
    } catch(err) { console.log(err); }
}

const scrapPopcorn = async () => {
    console.log("Scraping Popcorn Time API...");
    const pageCount = await axios.get('https://tv-v2.api-fetch.website/movies');
    const rawResults = [];
    for (let i = 1; i < pageCount.data.length - 1; i++) {
        const res = await axios.get(`https://tv-v2.api-fetch.website/movies/${i}`);
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
                }
                torrents.push(torrent);
            }
        }
        const infos = {
            imdbId: movie.imdb_id,
            torrents: torrents,
        }
        return infos
    })
    console.log(`${cleanResults.length} movies found in total.`);
    return cleanResults;
}

// const scrapYTS = async () => {
//     console.log("Scraping YTS API...");
//     const rawResults = [];
//     for (let i = 1; i < 3; i++) {
//         const res = await axios.get(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`);
//         if (!res.data.data.movies) break;
//         // console.log(`${res.data.data.movies.length} movie(s) found on page ${i}.`);
//         rawResults.push(...res.data.data.movies)
//     }
//     const cleanResults = rawResults.map(movie => {
//         const infos = {
//             imdbId: movie.imdb_code,
//             torrents: movie.torrents
//         }
//         return infos;
//     })
//     // console.log(cleanResults[0].torrents);
//     return cleanResults;
// }

const ScrapMoviesDatabases = async () => {
    console.log("***** HYPERTUBE DATABASE SCRAPING *****");
    await connectMongo();
    const tmdb = await axios.get(`https://api.themoviedb.org/3/configuration?api_key=256917e54af5083cae342214e4c314d0`);
    const popcorn = await scrapPopcorn();
    const completeResult = [];
    for (i = 0; i < popcorn.length; i++) {
        throttle(function() {
            // const omdbRes = await axios.get(`http://www.omdbapi.com/?apikey=da694061&i=${popcorn[i].imdbId}`);
            console.log(i);
        })
        // const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${popcorn[index].imdbId}?api_key=256917e54af5083cae342214e4c314d0&language=en-US`);
        // const filteredInfos = {
        //     imdbId: popcorn[index].imdbId,
        //     title: tmdbRes.data.original_title,
        //     plot: tmdbRes.data.overview,
        //     language: tmdbRes.data.original_language,
        //     poster: `${tmdb.data.images.base_url}original${tmdbRes.data.poster_path}`,
        //     backdrop: `${tmdb.data.images.base_url}original${tmdbRes.data.backdrop_path}`,
        //     runtime: tmdbRes.data.runtime,
        //     tagline: tmdbRes.data.tagline,
        //     rating: parseInt(omdbRes.data.imdbRating),
        //     torrents: popcorn[index].torrents
        // }
        // completeResult.push(filteredInfos);
        
    }
    process.exit(0);
}

ScrapMoviesDatabases();


/* 
    TORRENT OBJECT TEMPLATE

    { HYPERTUBE
        magnet: ,
        seed: ,
        peer: ,
        bytes: ,
        fileSize: ,
    }
    { POPCORN
        en: {
            '1080p': {
              url: 'magnet:?xt=urn:btih:6268ABCCB049444BEE76813177AA46643A7ADA88&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
              seed: 2040,
              peer: 1081,
              size: 1771674010,
              filesize: '1.65 GB',
              provider: 'YTS'
            },
            '720p': {
              url: 'magnet:?xt=urn:btih:A1D0C3B0FD52A29D2487027E6B50F27EAF4912C5&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
              seed: 3344,
              peer: 1699,
              size: 837382308,
              filesize: '798.59 MB',
              provider: 'YTS'
            }
        }
    }

    [ YTS
        {
            url: 'https://yts.lt/torrent/download/20CC17147F6697953388322C5C728A633E732FC3',
            hash: '20CC17147F6697953388322C5C728A633E732FC3',
            quality: '720p',
            type: 'bluray',
            seeds: 106,
            peers: 164,
            size: '1.24 GB',
            size_bytes: 1331439862,
            date_uploaded: '2019-09-11 08:16:56',
            date_uploaded_unix: 1568182616
        },
        {
            url: 'https://yts.lt/torrent/download/1F6EFADB0B46F556B342655759F5BB53D8E8CEC3',
            hash: '1F6EFADB0B46F556B342655759F5BB53D8E8CEC3',
            quality: '1080p',
            type: 'bluray',
            seeds: 0,
            peers: 0,
            size: '2.23 GB',
            size_bytes: 2394444268,
            date_uploaded: '2019-09-11 11:26:29',
            date_uploaded_unix: 1568193989
        }
    ]
*/