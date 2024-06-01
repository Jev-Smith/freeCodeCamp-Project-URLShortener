require('dotenv').config();
const express = require('express');
const validURL = require('valid-url');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlList = [];
// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;
  const isValid = validURL.isWebUri(originalUrl);

  if(isValid === undefined){
    return res.json({error: 'invalid url'});
  }

  const isFound = urlList.includes(originalUrl);

  if (!isFound) {
    urlList.push(originalUrl);
  }

  const index = urlList.indexOf(originalUrl);

  res.json(
    {
      original_url: originalUrl,
      short_url: index
    }
  )
});

app.get('/api/shorturl/:short_url', function (req, res) {
  const indexFromURL = req.params.short_url;
  res.redirect(urlList[indexFromURL]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
