import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import {config} from "./config";
import {SocketConnection} from './socket';
import {Server} from "socket.io"
import {createServer} from "http";

function bootstrap() {
  const app = express();
  const server = createServer(app)
  app.use(cors());
  app.set("PORT", process.env.PORT || 3000);

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.get("/", function (req, res) {
    res.sendFile(path.join(config.templates, "index.html"));
  });

  const io = new Server(server, {
    path: ''
  });

  io.on('connection', socket => {
    const connection = new SocketConnection(socket)
  });

  server.listen(app.get("PORT"), () => {
    console.log(`You are listening at http://localhost:${app.get("PORT")}`);
  })
}

bootstrap();
