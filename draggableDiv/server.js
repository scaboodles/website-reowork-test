//simple http server which server public folder at port 8000
const http = require('http');
const express = require('express');
const app = express()
const server = http.createServer(app);

app.use(express.static('public')); 

server.listen(8000, () => {
    console.log('listening on *:8000');
  });