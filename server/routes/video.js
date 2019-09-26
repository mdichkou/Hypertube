const express = require('express')
const router = express.Router()
const parseRange = require('range-parser');
var   path = require('path');
var   torrentStream = require('torrent-stream');
var   fs = require('fs');
var   download = require('download-file')
const imdb = require('imdb-api');
const OS = require('opensubtitles-api');
const auth      = require('../middleware/auth');

const OpenSubtitles = new OS({
  useragent: 'TemporaryUserAgent',
  username: 'mdichkou',
  password: 'mdichkou456852',
  ssl: true
});
OpenSubtitles.login()
  .then(res => {
  })
  .catch(err => {
	console.log(err);
});

const opts = {
	connections: 100,
	uploads: 10,
	path: './public',
	verify: true,
	dht: true,
	tracker: true,
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
  }
  
  
router.get('/:hash', function (req, res) {
	const getTorrentFile = new Promise(function (resolve, reject) {
  
	  var hash = req.params.hash;
	  var engine = torrentStream('magnet:?xt=urn:btih:' + hash + '', opts);
  
	  engine.on('ready', function () {
		engine.files.forEach(function (file, idx) {
		  const ext = path.extname(file.name).slice(1);
		  if (ext === 'mkv' || ext === 'mp4') {
			file.ext = ext;
			resolve(file);
		  }
		});
	  });
  });
	res.setHeader('Accept-Ranges', 'bytes');
	getTorrentFile.then(function (file) {
	  res.setHeader('Content-Length', file.length);
	  res.setHeader('Content-Type', `video/${file.ext}`);
	  if (req.headers.range) {
		const ranges = parseRange(file.length, req.headers.range, { combine: true });
		console.log(ranges);
		if (ranges === -1) {
		  // 416 Requested Range Not Satisfiable
		  res.statusCode = 416;
		  return res.end();
		} else if (ranges === -2 || ranges.type !== 'bytes' || ranges.length > 1) {
		  // 200 OK requested range malformed or multiple ranges requested, stream entire video
		  if (req.method !== 'GET') return res.end();
		  return file.createReadStream().pipe(res);
		} else {
		  // 206 Partial Content valid range requested
		  const range = ranges[0];
		  res.statusCode = 206;
		  res.setHeader('Content-Length', 1 + range.end - range.start);
		  res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${file.length}`);
		  if (req.method !== 'GET') return res.end();
		  return file.createReadStream(range).pipe(res);
		}
	  }
	  else {
		var stream = file.createReadStream();
	  }
	}).catch(function (e) {
	  console.error(e);
	  res.end(e);
	});
});


router.post('/search/getimg', auth, function (req, res) {
	imdb.get({ id: req.body.imdb_id }, { apiKey: '88736563', timeout: 30000 })
	  .then(respo => {
		res.send(respo);
	  }).catch(console.log);
});
  
  
  
router.post('/getSubt', auth, async (req, res) => {
	if (fs.existsSync("./client/public/subtitles/" + req.body.imdb_id)) {
	} else {
	  OpenSubtitles.search({
		imdbid: req.body.imdb_id
	  }).then(async subtitles => {
		const values = Object.values(subtitles)
		values.forEach((subtitle, index) => {
		  var url = subtitle.vtt;
		  var options = {
			directory: "./client/public/subtitles/" + req.body.imdb_id,
			filename: subtitle.lang + ".vtt"
		  }
		  download(url, options, (err) => {
  
		  });
		})
		var transformation = [];
		for (var i = 0; i < values.length; i++) {
		  var options = {
			directory: "./client/public/subtitles/" + req.body.imdb_id + '/',
			filename: values[i].lang + ".vtt"
		  }
		  if (fs.existsSync(options.directory + options.filename)) transformation.push(values[i]);
		}
		res.send(transformation);
	  })
	}
});

module.exports = router