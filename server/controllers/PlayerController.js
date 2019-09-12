// Packages
const torrentStream = require("torrent-stream");
const torrentToMagnet = require("torrent-to-magnet");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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

const movieData = {
  name: "",
  path: "",
  magnet: "",
  stream: {},
  extension: "",
};

const extensions = [".webm", ".mkv", ".flv", ".wmv", "avi"];

// Download torrent function
const downloadVideo = async (req, res) => {
  try {
    torrentToMagnet(
      "https://yts.lt/torrent/download/1692BCC8EE303ECEC5C2A41686CF0E767E19E8CF",
      async (err, uri) => {
        try {
          const engine = torrentStream(uri, {
            connections: 100,
            uploads: 10,
            tmp: "/tmp",
            path: "/tmp/movies"
          });
          engine.on("ready", () => {
            engine.files.forEach(file => {
              if (
                path.extname(file.name) === ".mp4" ||
                extensions.indexOf(path.extname(file.name)) >= 0
              ) {
                movieData.name = file.name;
                movieData.path = `/tmp/movies/${file.path}`;
                if (!fs.existsSync(movieData.path)) {
                  movieData.stream = file.createReadStream();
                  movieData.stream.on('data', () => console.log(`Downloading...`))
                  if (path.extname(file.name) !== ".mp4") {
                    ffmpeg(movieData.stream)
                      .videoCodec("libx264")
                      .audioCodec("libfaac")
                      .videoBitrate(1000)
                      .format("webm")
                      .on("error", err => console.log("Conversion error", err));
                  }
                }
              } 
            });
          });
          engine.on("download", e => {
            console.log(`Package index : ${e}`)
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

// Stream movie function
const streamVideo = async (req, res) => {
  try {
    if (movieData.path !== "") {
      const path = movieData.path;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { downloadVideo, streamVideo };
