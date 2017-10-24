require('dotenv').config();
const http = require('http');
const https = require('https');

const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

let target = 'http://direct.fipradio.fr/live/fip-midfi.mp3';

// figure out 'real' target if the server returns a 302 (redirect)
http.get(target, resp => {
  if(resp.statusCode == 302) {
    target = resp.headers.location;
  }
});

app.use(express.static('dist'));

app.get('/api', (req, res) => {
  http.get(target, audioFile => {
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
