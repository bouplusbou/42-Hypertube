// Packages
const torrentStream = require("torrent-stream");
const ffmpeg = require("ffmpeg");
const axios = require("axios");

// Color utils
const colors = {
  BLUE: "\x1b[34m",
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  PURPLE: "\x1b[35m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  END: "\x1b[0m"
};

// Download torrent function
(async () => {
  try {
    const ret = await axios.get("https://tv-v2.api-fetch.website/random/movie");
    if (ret) console.log(`${colors.GREEN}API call was successful${colors.END}`);
    const torrents = ret.data.torrents;
    const language = { EN: "en", FR: "fr" };
    const resolution = { MEDIUM: "720p", HIGH: "1080p" };
    let length = 0;

    // Select language and resolution
    const magnet = torrents[language.EN][resolution.MEDIUM];

    // Conditional statement to check if object is defined
    if (magnet) console.log(`${colors.GREEN}Magnet exists${colors.END}`);
    if (magnet !== undefined) {
      const engine = torrentStream(magnet.url, {
        connections: 100,
        uploads: 10,
        tmp: "/goinfre/glavigno",
        path: "/goinfre/glavigno/movie"
      });
      engine.on("ready", () => {
        console.log(`${colors.GREEN}Engine is ready${colors.END}`);
        engine.files.forEach(file => {
          file.select();
          const stream = file.createReadStream();

          // Check file extension
          // stream._engine.torrent.files.forEach((e, index) => {
          //   console.log(`FILE ${++index} PATH : ${e.path}`);
          //   const tmp = e.path.split(".");
          //   const extension = tmp[tmp.length - 1];
          //   console.log(`EXTENSION IS ${extension}`)
          // });

          let progress = 0;
          length = stream._engine.torrent.length;
          stream.on("data", chunk => {
            progress += chunk.length;
            console.log(`${colors.YELLOW}Chunk size ${chunk.length}${colors.END} - ${colors.YELLOW}Read progress ${((progress / length) * 100).toFixed(4)}%${colors.END}`)
          });

          const chunkSize = stream._engine.torrent.pieceLength;
          const lastChunckSize = length % chunkSize;
          console.log(`${colors.CYAN}TOTAL SIZE : ${length}, PIECE SIZE : ${chunkSize}, LAST PIECE SIZE : ${lastChunckSize}${colors.END}`);
        });
      });
      engine.on("download", e => {
        console.log(`${colors.BLUE}Chunk index %d${colors.END} - ${colors.BLUE}Download progress %s%${colors.END}`, e, ((engine.swarm.downloaded / length) * 100).toFixed(4));
      });
    } else {
      console.log("Magnet does not exist");
    }
  } catch (e) {
    console.log(e);
  }
})();

// Stream movie function
// (async () => {
//     try {
//         const process = new ffmpeg("/goinfre/glavigno/movie/Stripped\ \(2012\)/Stripped.2012.720p.BluRay.x264.YIFY.mp4");
//         process.then(function (video) {
//             // Video metadata
//             console.log(video.metadata);
//             // FFmpeg configuration
//         }, function (err) {
//             console.log('Error: ' + err);
//         });
//     } catch (e) {
//         console.log(e.code);
//         console.log(e.msg);
//     }
// })();
