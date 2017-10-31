require('dotenv').config();
const http = require('http');
const https = require('https');

const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

const targets = {
  electro : 'http://direct.fipradio.fr/live/fip-webradio8.mp3',
  rock : 'http://direct.fipradio.fr/live/fip-webradio1.mp3',
  jazz  : 'http://direct.fipradio.fr/live/fip-webradio2.mp3',
  groove  : 'http://direct.fipradio.fr/live/fip-webradio3.mp3',
  reggae : 'http://direct.fipradio.fr/live/fip-webradio6.mp3',
  main: 'http://direct.fipradio.fr/live/fip-midfi.mp3'
};

// figure out 'real' target if the server returns a 302 (redirect)
Object
  .keys(targets)
  .forEach(k => {
    http.get(targets[k], resp => {
      if(resp.statusCode == 302) {
        targets[k] = resp.headers.location;
      }
    });
  });

app.use(express.static('dist'));

app.get('/api/*', (req, res) => {
  const kind = req.params[0];
  http.get(targets[kind], audioFile => {
    res.set(Object.assign(audioFile.headers));

    audioFile.addListener('data', (chunk) => {
      res.write(chunk);
    });
    audioFile.addListener('end', () => {
      res.end();
    });
  }).on('error', err => {
    console.error(err);
  });
});

app.listen(PORT);
