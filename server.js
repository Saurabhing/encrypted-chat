const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const CryptoJS = require('crypto-js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const secretKey = 'your-secret-key';

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    const message = bytes.toString(CryptoJS.enc.Utf8);
    console.log('Decrypted message:', message);

    // Broadcast the encrypted message to all connected clients
    socket.broadcast.emit('message', encryptedMessage);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
