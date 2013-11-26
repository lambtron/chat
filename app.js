var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app);

var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("Listening on " + port);
});

// Configuration.
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.bodyParser());

// routing
app.get('/', function (req, res) {
  res.render('index.jade');
});