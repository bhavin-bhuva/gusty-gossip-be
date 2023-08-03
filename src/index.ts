/* eslint-disable no-console */
import dotenv from 'dotenv';

if (['local', 'nodemon-local'].includes(process.env.NODE_ENV?.trim())) {
  let path = `${__dirname}/../../.env`;
  if (process.env.NODE_ENV === 'nodemon-local') path = `${__dirname}/../.env`;
  dotenv.config({ path: path });
}

import http, { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import router from './routes';
import { socketJwt } from './middlewares/socketAuth';
import { SocketServer } from './socketService';
import { expressjwt } from 'express-jwt';
import { DBManaager } from './db/db_manager';

export class ApiServer {
  public app: express.Application;
  public server: HttpServer;
  public io: SocketIOServer;
  private PORT;

  constructor() {
    this.PORT = process.env.PORT || 8080;

    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server);

    this.configureJWT();
    this.config();
    this.routes();
  }

  public async config() {
    this.app.use('/services/webhook', express.raw({ type: '*/*' }));
    this.app.use(express.json());
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(express.json({ limit: '30mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '30mb' }));
    this.app.use(express.static('public'));
  }

  public configureJWT() {
    const publicRoutes = [/\/media\/*/, /\/services\/*/, /\/api-doc\/*/];
    this.app.use(
      expressjwt({
        secret: process.env.JWT!,
        algorithms: ['HS256'],
        requestProperty: 'currentUser',
      }).unless({ path: publicRoutes })
    );

    this.io.use(socketJwt);
  }

  public routes() {
    this.app.use('/', router);
  }

  public async start() {
    // connecting db
    await DBManaager.connect({
      db: process.env.DB,
      url: process.env.DB_URL,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      debug: process.env.DB_DEBUG == 'true' ? true : false,
    });

    // Socket.IO connection handling
    SocketServer(this.io);

    this.server.listen(this.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API server started at http://localhost:${this.PORT}`);
    });
  }
}

const apiServer = new ApiServer();
apiServer.start();
