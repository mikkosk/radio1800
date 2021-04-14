import express from 'express';
import cors from 'cors';
import path from 'path';
import schedule from 'node-schedule';

import liquidsoapRouter from './routers/liquidsoap';
import userRouter from './routers/user';
import textRouter from './routers/text';
import stateRouter from './routers/state';
import loginRouter from './routers/login';
import stateService from './services/stateService';
import playlistRouter from './routers/playlist';

import dotenv from 'dotenv';
dotenv.config();

const inProduction = process.env.NODE_ENV === "production";
const dist = inProduction ? '../dist' : './dist';
console.log(inProduction);
console.log(dist);

schedule.scheduleJob('0 0 0 1 * *', async() => {
    try {
        const state = await stateService.getState();
        await stateService.updateChars(state.id, 15000000);
    } catch (e) {
        console.log(e);
    }
});

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, dist)));
app.use('/api/audio', liquidsoapRouter);
app.use('/api/user', userRouter);
app.use('/api/text', textRouter);
app.use('/api/state', stateRouter);
app.use('/api/login', loginRouter);
app.use('/api/playlist', playlistRouter);
app.get('/*', function(_req, res) {
    res.sendFile(path.join(__dirname, dist + '/index.html'), function(err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });


export default app;