const axios = require("axios");

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

const scrapYTS = async () => {
    console.log("Scraping YTS API...");
    const rawResults = [];
    for (let i = 1; i < 3; i++) {
        const res = await axios.get(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`);
        if (!res.data.data.movies) break;
        // console.log(`${res.data.data.movies.length} movie(s) found on page ${i}.`);
        rawResults.push(...res.data.data.movies)
    }
    const cleanResults = rawResults.map(movie => {
        const infos = {
            imdbId: movie.imdb_code,
            torrents: movie.torrents
        }
        return infos;
    })
    // console.log(cleanResults[0].torrents);
    return cleanResults;
}

const ScrapMoviesDatabases = async () => {
    console.log("***** HYPERTUBE DATABASE SCRAPING *****");
    const yts = await scrapPopcorn();
    // const popcorn = await scrapPopcorn(1);
    // const results = [...yts, ...popcorn];
    // let tesResults = [];
    // results.map(movie => {
    //     if (tesResults.find(element => {
    //         return element.imdbId === movie.imdbId
    //     })) {
    //         const index = tesResults.findIndex(element => { return element.imdbId === movie.imdbId });
    //         console.log(tesResults[index]);
    //         tesResults[index] = {
    //             imdbId: tesResults[index].imdbId,
    //             torrents: {
    //                 torrents1: tesResults[index].torrents,
    //                 torrents2: movie.torrents
    //             }
    //         }
    //         console.log(tesResults[index]);
    //     } else {
    //         tesResults.push(movie);
    //     }
    // })
    // console.log(tesResults.length);
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