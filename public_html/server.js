var http = require('http'), url = require('url'), fs = require('fs'),
        sio = require('socket.io'), write, pipeIn, pipeOut, socket;

var server = http.createServer(function(req, res) {
    var urlStr = url.parse(req.url).pathname;
    if (urlStr === '/') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(fs.readFileSync('./index.html'));
    } else {
        try {
            res.end(fs.readFileSync("." + urlStr));
        } catch (e) {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('Looks like you\'ve encountered a 404 error.');
        }
    }
}).listen(7501, function() {
    console.log('Server listening at http://localhost:7501/');
});

io = sio.listen(server);

io.sockets.on('connection', function(soc) {
    socket = soc;
    socket.on('output', function(msg) {
        console.log('Output: ', msg.msg);
    });
    socket.on('cameraNumbers', function(msg) {
        socket.emit('loadPreview');
    });
    socket.on('request', function(msg) {
        var message = JSON.stringify(msg);
        console.log(message);
        pipeOut.write(message);
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
    });
    readFile();
});

connectToPipe();

function connectToPipe() {
//    pipeIn = fs.createReadStream('pipeIn');
//    pipeIn.on('error', function (error) {console.log("Caught", error);});
//    pipeIn.on('readable', function () {pipeIn.read();});
//    pipeIn.on('data', function(data) {
//        console.log(data);
//        socket.emit(data);
//    });
    pipeOut = fs.createWriteStream('pipeOut');
}

function readFile() {
    var filename = 'activeCams.txt';
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err)
            throw err;
        console.log('Loaded ' + filename);
        data = data.split(/\D/);
        var obj = {};
        for (var k = 0; k < data.length; k++) {
            obj[data[k]] = true;
        }
        socket.emit('cameras', obj);
    });
}