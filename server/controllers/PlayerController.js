// Packages
const torrentStream = require("torrent-stream");
const torrentToMagnet = require("torrent-to-magnet");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const srt2vtt = require('srt-to-vtt')
const openSubs = require('opensubtitles-api');

const mainExtensions = ['.mp4', 'webm'];
const otherExtensions = ['.avi', '.divx', '.flv', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mov', '.ogg', '.swf', '.qt', '.wmv'];

const convertTorrent = async (path) => {
  ffmpeg(path)
    .audioCodec('libfaac')
    .videoCodec('libx264')
    .format('mp4');
  return path.substr(0, path.lastIndexOf(".")) + ".mp4"
}

const streamTorrent = async (path, res, range) => {
  if (range) {
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const stream = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': (end - start) + 1,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    stream.pipe(res)
  }
}

const downloadTorrent = async (magnet, options, req, res) => {
  const engine = torrentStream(magnet, options);
  let movieFile;
  engine.on('ready', () => {
    engine.files.forEach(async file => {
      if (mainExtensions.indexOf(path.extname(file.name))) {
        file.select()
        movieFile = file
        const path = `${options.path}/${file.path}`
        if (fs.existsSync(path))
          streamTorrent(path, res, req.headers.range)
      } else if (otherExtensions.indexOf(path.extname(file.name))) {
        const newPath = await convertTorrent(path)
        streamTorrent(newPath, res, req.headers.range)
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
  engine.on('idle', () => console.log('File has been downloaded'))
}

const handleTorrent = async (req, res) => {
  // const { hash } = req

  const hash = '6764B119CD1C9000CC9517E9E24517D17BE04B16' // hash
  const options = {
    connections: 1000,
    uploads: 100,
    verify: true,
    dht: true,
    tracker: true,
    tmp: "/tmp",
    path: `/tmp/movies/${hash}`
  }
  // if movie does not exist on the server
  torrentToMagnet(`https://yts.lt/torrent/download/${hash}`, (err, uri) => {
    if (err) throw err
    downloadTorrent(uri, options, req, res);
  })
  // else stream directly 
  // streamTorrent(path, res, req.headers.range)
};


const handleSubs = async (req, res) => {
  // const { hash, idIMDB } = req
  const arr = []
  const hash = '6764B119CD1C9000CC9517E9E24517D17BE04B16' // hash
  let dir = `/tmp/movies/${hash}`
  const subs = new openSubs('test');
  subs.search({
    imdbid: 'tt6570372', // idIMDB
  }).then(async subtitles => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.mkdirSync(dir + '/subs');
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
  }).catch(err => console.log(err));
}

module.exports = { handleTorrent, handleSubs };