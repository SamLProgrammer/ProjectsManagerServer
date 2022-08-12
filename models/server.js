const express = require('express');
const cors = require('cors');
const { initController } = require('../controllers/controller')
const PORT = process.env.PORT || 1337;

class Server {
    constructor() {
        this.app = express();
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.port = PORT;
        this.middleware();
        this.routes();
        this.sockets();
    }

    middleware() {
        this.app.use.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Credentials', true)
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
            next()
          });
        //this.app.use(cors());
        this.app.use(express.json());
        initController();
    }

    routes() {
        this.app.use('/', require('../routes/routes'));
    }

    sockets() {
        this.io.on('connection', (socket) => {
            console.log('Client Connected!');
        })
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server Listening on PORT: ' + PORT)
        })
    }
}

module.exports = Server;
