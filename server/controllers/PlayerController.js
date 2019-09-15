// Packages
const torrentStream = require("torrent-stream");
const torrentToMagnet = require("torrent-to-magnet");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const srt2vtt = require('srt-to-vtt')
const openSubs = require('opensubtitles-api');

const streamTorrent = async (file, res, range) => {
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1
    const head = {
      'Content-Range': `bytes ${start}-${end}/${file.length}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': (end - start) + 1,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.createReadStream({ start, end }).pipe(res)
  }
}

const downloadTorrent = async (magnet, options, req, res) => {
  const engine = torrentStream(magnet, options);
  let movieFile;
  engine.on('ready', () => {
    engine.files.forEach(file => {
      if (path.extname(file.name) === ".mp4") {
        file.select()
        movieFile = file
        streamTorrent(file, res, req.headers.range)
      } else {
        file.deselect()
      }
    });
  });
  engine.on('download', () => {
    console.log('[ DL TRACKER ]')
    console.log(`Filename : ${movieFile.name}`)
    console.log(`Progress : ${(100 * engine.swarm.downloaded / movieFile.length).toPrecision(4)}%`)
  })
}

const handleTorrent = async (req, res) => {
  // const { hash } = req

  const hash = '94B8794BF25722023C7C24B9D80F425B7B86C708' // hash
  const options = {
    connections: 100,
    uploads: 10,
    verify: true,
    dht: true,
    tracker: true,
    tmp: "/tmp",
    path: `/tmp/movies/${hash}`
  }
  torrentToMagnet(`https://yts.lt/torrent/download/${hash}`, (err, uri) => {
    if (err) throw err
    // if (fs.existsSync(`/tmp/movies/${hash}`))
    //   console.log('file or dir already exists')
    downloadTorrent(uri, options, req, res);
  })
};


const handleSubs = async (req, res) => {
  // const { hash, idIMDB } = req
  const arr = []
  const hash = '94B8794BF25722023C7C24B9D80F425B7B86C708' // hash
  let dir = `/tmp/movies/${hash}`
  const subs = new openSubs('test');
  subs.search({
    imdbid: 'tt6446550', // idIMDB
  }).then(async subtitles => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.mkdirSync(dir + '/subs');
    }
    const keys = Object.keys(subtitles);
    await Promise.all(keys.map(async key => {
      return (async () => {
        if (subtitles[key].url !== undefined) {
          const subs = await axios.get(subtitles[key].url)
          const fullDir = `${dir}/subs/${subtitles[key].langcode}`
          fs.writeFileSync(`${fullDir}.srt`, subs.data, 'utf8')
          fs.createReadStream(`${fullDir}.srt`)
            .pipe(srt2vtt())
            .pipe(fs.createWriteStream(`${fullDir}.vtt`))
          fs.unlinkSync(`${fullDir}.srt`)
          arr.push({ lang: subtitles[key].langcode, path: `${fullDir}.vtt` })
          return Promise.resolve();
        } else {
        return Promise.reject();
      }
    })();
  }));
  res.status(200).send(arr)
}).catch (err => console.log(err));
}

module.exports = { handleTorrent, handleSubs };