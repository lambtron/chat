// Initialize server ===============================================================================
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , mongoose = require('mongoose')
  , database = require('./config/database')
  , io = require('socket.io').listen(server)
  , port = process.env.PORT || 3000;

// Set environmental variables.
require('./config/config');

// Configuration ===================================================================================
mongoose.connect(database.url);

app.set('views', __dirname + 'public/views');
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.bodyParser());

// Routes ==========================================================================================
require('./config/routes.js')(app, io);

// Application route =============================================================================
app.get('*', function(req, res) {
	// Load the single view file (Angular will handle the page changes).
	res.sendfile('index.html', {'root': './public/views/'});
});

// Listen (start app with node server.js) ==========================================================
server.listen(port, function() {
	console.log("App is now listening on port " + port);
	// console.log(app.routes);
});