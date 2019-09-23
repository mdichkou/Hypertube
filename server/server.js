var express = require('express');
var bodyParser = require("body-parser");
var https = require('https');
var cloudscraper = require('cloudscraper');
var torrentStream = require('torrent-stream');
const cors = require('cors');

const port = 4000;

const app = express()
const opts = {
    connections: 100,     // Max amount of peers to be connected to.
    uploads: 10,          // Number of upload slots.
    tmp: './',          // Root folder for the files storage.
    // Defaults to '/tmp' or temp folder specific to your OS.
    // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    path: './storage', // Where to save the files. Overrides `tmp`.
    verify: true,         // Verify previously stored data before starting
    // Defaults to true
    dht: true,            // Whether or not to use DHT to initialize the swarm.
    // Defaults to true
    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
    // Defaults to true
    trackers: [
        'udp://tracker.openbittorrent.com:80',
        'udp://tracker.ccc.de:80'
    ],
}
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.post('/api/torrent', async (req, res) => {
    const {
        name,
        year
    } = req.body;
    cloudscraper.get('https://yts.lt/api/v2/list_movies.json?query_term=' + name).then((res, err) => {
        if (err) console.log(err.message);
        var data = JSON.parse(res);
        var movies = data.data.movies;
        var integer = parseInt(year, 10);
        movies.forEach(element => {
            if (element.title === name && element.year === integer) {
                element.torrents.forEach(element => {
                    if (element.quality === '720p') {
                        var engine = torrentStream('magnet:?xt=urn:btih:' + element.hash, opts);

                        engine.on('ready', function () {
                            engine.files.forEach(function (file) {
                                console.log('filename:', file.name);
                                var stream = file.createReadStream();
                                // stream is readable stream to containing the file content
                            });
                        });
                    }
                });
            }
            else {
                console.log("movie not found");
            }
        });

    });
})

app.listen(port, function () {
    console.log('Serveer started on port ' + port)
})