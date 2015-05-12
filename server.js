var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(1337);
app.use(express.static(__dirname + "/build" ));

io.on("connection", function(socket) {

    console.log("a user connected", socket.id);
    io.to(socket.id).emit("userid", socket.id);

    socket.on("disconnect", function(){
        console.log("user disconnected", socket.id);
    });

});