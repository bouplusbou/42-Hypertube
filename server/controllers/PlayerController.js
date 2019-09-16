// Packages
const torrentStream = require("torrent-stream");
const torrentToMagnet = require("torrent-to-magnet");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("/Users/glavigno/.brew/Cellar/ffmpeg/4.1.4_2/bin/ffmpeg");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const srt2vtt = require("srt-to-vtt");
const openSubs = require("opensubtitles-api");

const mainExtensions = [".mp4", "webm"];
const otherExtensions = [
  ".avi",
  ".divx",
  ".flv",
  ".mpg",
  ".mp2",
  ".mpeg",
  ".mpe",
  ".mpv",
  ".mov",
  ".ogg",
  ".swf",
  ".qt",
  ".wmv"
];

const convertTorrent = async path => {
  ffmpeg(path)
    .audioCodec("libvpx")
    .videoCodec("libvorbis")
    .format("webm")
    .save(path.substr(0, path.lastIndexOf(".")) + ".webm")
  return path.substr(0, path.lastIndexOf(".")) + ".webm";
};

const streamTorrent = async (path, size, res, range) => {
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
    const head = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, head);
    if (typeof path === "object") {
      path.createReadStream({ start, end }).pipe(res);
    } else {
      fs.createReadStream(path, { start, end }).pipe(res);
    }
  }
};

const downloadTorrent = async (movieFile, magnet, options, req, res) => {
  const engine = torrentStream(magnet, options);
  engine.on("ready", () => {
    engine.files.forEach(async file => {
      const extension = path.extname(file.name)
      if (mainExtensions.includes(extension)) {
        file.select();
        movieFile.file = file;
        streamTorrent(file, file.length, res, req.headers.range);
      } else if (mainExtensions.includes(extension)) {
        file.select();
        // movieFile.path = `${options.path}/${file.path}`;
        const newPath = await convertTorrent(path);
        streamTorrent(newPath, res, req.headers.range);
      } else {
        file.deselect();
      }
    });
  });
  engine.on("download", () => {
    console.log("[ DL TRACKER ]");
    console.log(`Filename : ${movieFile.file.name}`);
    console.log(
      `Progress : ${(
        (100 * engine.swarm.downloaded) /
        movieFile.file.length
      ).toPrecision(4)}%`
    );
  });
};

const handleTorrent = async (req, res) => {
  // const { hash, path (if exists) } = req

  const movieFile = { file: {}, path: "" };
  const idIMDB = "tt6945932";
  const options = {
    connections: 1000,
    uploads: 100,
    verify: true,
    dht: true,
    tracker: true,
    tmp: "/tmp",
    path: `/tmp/movies/${idIMDB}`
  };

  const path = ''
  if (fs.existsSync(path)) {
    const size = fs.statSync(path).size
    streamTorrent(path, size, res, req.headers.range);
  } else {
    torrentToMagnet("https://yts.lt/torrent/download/48287A6FA0004BFA7A35C198FE8B4AEC735CCB26", (err, uri) => {
      if (err) res.status(400).json({message: 'Torrent not found'});
      downloadTorrent(movieFile, uri, options, req, res);
    });
  }
};

const handleSubs = async (req, res) => {
  // const { idIMDB } = req
  const arr = [];
  const idIMDB = "tt6945932"; // hash
  let dir = `/tmp/movies/${idIMDB}`;
  const subs = new openSubs("test");
  subs
    .search({
      imdbid: idIMDB
    })
    .then(async subtitles => {
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir + "/subs", { recursive: true });
      const keys = Object.keys(subtitles);
      await Promise.all(
        keys.map(async key => {
          return (async () => {
            if (subtitles[key].url !== undefined) {
              const subs = await axios.get(subtitles[key].url);
              const fullDir = `${dir}/subs/${subtitles[key].langcode}`;
              await fs.writeFile(`${fullDir}.srt`, subs.data, err => { if (err) throw err });
              fs.createReadStream(`${fullDir}.srt`)
                .pipe(srt2vtt())
                .pipe(fs.createWriteStream(`${fullDir}.vtt`));
              fs.unlink(`${fullDir}.srt`, err => { if (err) throw err });
              arr.push({
                lang: subtitles[key].langcode,
                path: `${fullDir}.vtt`
              });
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })();
        })
      );
      res.status(200).send(arr);
    })
    .catch(err => console.log(err));
};

module.exports = { handleTorrent, handleSubs };
