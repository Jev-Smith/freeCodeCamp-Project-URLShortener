require('dotenv').config();
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlList = [];
//middleware
const createShortUrl = (req, res, next) => {
  const url = req.body.url;
  const domainName = url.substring(12);

  dns.lookup(domainName, (err, value) => {
    if(err || domainName.length === 0){
      return res.status(404).json({error: 'invalid url'})
    }

    const isFound = urlList.includes(url);

    if (!isFound) {
      urlList.push(url);
    }

    const urlIndex = urlList.indexOf(url);

    const urlObj = {
      original_url: url,
      short_url: urlIndex
    }

    req.urlObj = urlObj;
    next();
  })
  
}

// Your first API endpoint
app.post('/api/shorturl', createShortUrl, function(req, res) {
  res.json(req.urlObj);
});

app.get('/api/shorturl/:index', function (req, res) {
  const index = req.params.index;
  res.redirect(urlList[index]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
