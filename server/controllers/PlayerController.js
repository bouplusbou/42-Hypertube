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
const yifysubtitles = require("yifysubtitles");

const mainExtensions = [".mp4", "webm"];
const otherExtensions = [
  ".avi",
  ".divx",
  ".flv",
  ".mkv",
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

const langs = [
  "sq",
  "ar",
  "bn",
  "pb",
  "bg",
  "zh",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "et",
  "fa",
  "fi",
  "fr",
  "de",
  "el",
  "he",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "mk",
  "ms",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sr",
  "sl",
  "es",
  "sv",
  "th",
  "tr",
  "ur",
  "uk",
  "vi"
];

const convertStreamTorrent = async (file, res, path) => {
  // change path
  const stream = file.createReadStream();
  ffmpeg(stream)
    .format("webm")
    .save(
      `${path}/${file.path.substr(0, file.path.lastIndexOf(".")) + ".webm"}`
    )
    .on("end", () => {
      console.log("Finished processing");
      fs.unlinkSync(`${path}/${file.path}`);
    });
  const head = {
    "Content-Length": file.length,
    "Content-Type": "video/webm"
  };
  res.writeHead(200, head);
  stream.pipe(res);
};

const streamTorrent = async (path, size, res, range) => {
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
    const stream =
      typeof path === "object"
        ? path.createReadStream({ start, end })
        : fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, head);
    stream.pipe(res);
  }
};

const downloadTorrent = async (movieFile, magnet, options, req, res) => {
  const engine = torrentStream(magnet, options);
  engine.on("ready", () => {
    engine.files.forEach(async file => {
      const extension = path.extname(file.name);
      if (
        mainExtensions.includes(extension) ||
        otherExtensions.includes(extension)
      ) {
        file.select();
        movieFile.file = file;
        console.log(extension);
        if (mainExtensions.includes(extension))
          streamTorrent(file, file.length, res, req.headers.range);
        else convertStreamTorrent(file, res, options.path);
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
  const idIMDB = "tt0133093";
  const options = {
    connections: 100,
    uploads: 10,
    verify: true,
    dht: true,
    tracker: true,
    tmp: "/tmp",
    path: `/tmp/movies/${idIMDB}`
  };

  if (fs.existsSync(path)) {
    const size = fs.statSync(path).size;
    streamTorrent(path, size, res, req.headers.range);
  } else {
    torrentToMagnet(
      "https://yts.lt/torrent/download/363BC6C534B1430C6758318D196CCD61DB61B647",
      (err, uri) => {
        if (err) res.status(400).json({ message: "Torrent not found" });
        downloadTorrent(movieFile, uri, options, req, res);
      }
    );
  }
};

const handleSubs = async (req, res) => {
  // const { idIMDB } = req
  const arr = [];
  const idIMDB = "tt0133093"; // hash
  let dir = `/tmp/movies/${idIMDB}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir + "/subs", { recursive: true });
  yifysubtitles(idIMDB, {
    path: dir + "/subs",
    langs: langs
  })
    .then(async data => {
      await Promise.all(
        data.map(e => {
          return (async () => {
            arr.push({
              lang: e.langShort,
              path: e.path
            });
            return Promise.resolve();
          })();
        })
      );
      res.status(200).send(arr);
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({message: 'Subtitles not found'});
    });
};

module.exports = { handleTorrent, handleSubs };
