const ffmpeg = require("fluent-ffmpeg");

(async () => {
    ffmpeg('~/Downloads/sample.mp4')
    .videoCodec('libvpx')
    .audioCodec('libvorbis')
    .format('webm')
    .on('error', err => {
        console.log('Cannot process video: ' + err.message);
    })
    .save('~/Downloads/sample.webm');
    // console.log(path.substr(0, path.lastIndexOf(".")) + ".mp4")
    // return path.substr(0, path.lastIndexOf(".")) + ".mp4"
})();