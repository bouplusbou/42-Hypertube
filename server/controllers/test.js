const yifysubtitles = require('yifysubtitles');
 
yifysubtitles('tt1300854', {path: '/tmp', langs: ['en', 'fr', 'zh']})
  .then(res => console.log(res))
  .catch(err => console.log(err))