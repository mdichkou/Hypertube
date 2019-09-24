var express = require('express');
const parseRange = require('range-parser');
var path = require('path');
var cors = require('cors');
var cloudscraper = require('cloudscraper');
var bodyParser = require("body-parser");
const expressLayouts = require('express-ejs-layouts');
var app = express();
var torrentStream = require('torrent-stream');
var fs = require('fs');
const imdb = require('imdb-api');
app.use(expressLayouts);
app.set('view engine', 'ejs');


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const opts = {
  connections: 100,     // Max amount of peers to be connected to.
  uploads: 10,          // Number of upload slots.
  //tmp: '/tmp',          // Root folder for the files storage.
                        // Defaults to '/tmp' or temp folder specific to your OS.
                        // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
  path: './public', // Where to save the files. Overrides `tmp`.
  verify: true,         // Verify previously stored data before starting
                        // Defaults to true
  dht: true,            // Whether or not to use DHT to initialize the swarm.
                        // Defaults to true
  tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                        // Defaults to true
  trackers: [
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.ccc.de:80',
      'udp://open.demonii.com:1337/announce',
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.coppersurfer.tk:6969',
      'udp://glotorrents.pw:6969/announce',
      'udp://tracker.opentrackr.org:1337/announce',
      'udp://torrent.gresille.org:80/announce',
      'udp://p4p.arenabg.com:1337',
      'udp://tracker.leechers-paradise.org:6969',
  ],
  // Allows to declare additional custom trackers to use
  // Defaults to empty
}

// app.get('/', (req, res) => {
//   res.render("video")
// })
var namemovie , yearmovie;

// app.post("/torrent", (req, res) => {
//   const {
//     name,
//     year
//   } = req.body;
//   namemovie = name;
//   console.log(req.body)
//   yearmovie = year;
// });

app.get('/video/:id', function(req, result) {
    id = req.params.id;
    cloudscraper.get('https://yts.lt/api/v2/list_movies.json?query_term=' + id).then((res, err) => {
      const getTorrentFile = new Promise(function (resolve, reject) { 
      if (err) console.log(err.message);
      var data = JSON.parse(res);
      var movies = data.data.movies;
      var integer = parseInt(yearmovie, 10);
      movies.forEach(element => {
        if (element.imdb_code === id) {
          element.torrents.forEach(element => {
              if (element.quality === '720p' || element.quality === '1080p') {
                  var engine = torrentStream('magnet:?xt=urn:btih:' + element.hash, opts);
                  engine.on('ready', function() {
                    engine.files.forEach(function (file, idx) {
                      const ext = path.extname(file.name).slice(1);
                      if (ext === 'mp4') {
                        file.ext = ext;
                        resolve(file);
                      }
                    });
                  });
              }
          });
        }
        else {
              console.log("Page not found");
          }
      })
    });
      result.setHeader('Accept-Ranges', 'bytes');
      getTorrentFile.then(function(file) {
          result.setHeader('Content-Length', file.length);
          result.setHeader('Content-Type', `video/${file.ext}`);
          if (req.headers.range)
          {
            const ranges = parseRange(file.length, req.headers.range, { combine: true });
            if (ranges === -1) {
                // 416 Requested Range Not Satisfiable
                result.statusCode = 416;
                return result.end();
              } else if (ranges === -2 || ranges.type !== 'bytes' || ranges.length > 1) {
                // 200 OK requested range malformed or multiple ranges requested, stream entire video
                if (req.method !== 'GET') return result.end();
                return file.createReadStream().pipe(result);
              } else {
                // 206 Partial Content valid range requested
                const range = ranges[0];
                result.statusCode = 206;
                result.setHeader('Content-Length', 1 + range.end - range.start);
                result.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
                if (req.method !== 'GET') return result.end();
                return file.createReadStream(range).pipe(result);
              }
          }
          else
          {
            var stream = file.createReadStream();
          }
          }).catch(function (e) {
            console.error(e);
            result.end(e);
      });
  
    });
});

const getMovies = async (input) => {
  try {
      return await cloudscraper.get('https://yts.lt/api/v2/list_movies.json?query_term=' + input);
  } catch (error) {
      console.error(error)
  }
}

app.get('/search', async (req, res) => {
  const data = await getMovies(req.query.input);
  const movies = JSON.parse(data);
  res.send(movies.data)
})

app.post('/search/getimg', function(req, res) {
  imdb.get({id: req.body.imdb_id}, {apiKey: '88736563', timeout: 30000})
  .then(respo => {
    res.send(respo);
  }).catch(console.log);
});

app.post('/getHashes', async (req, res) => {
  const data = await getMovies(req.body.imdb_id);
  const movies = JSON.parse(data);
  console.log(movies.data.movies[0].torrents);
  res.send(movies.data.movies[0].torrents);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(1337);