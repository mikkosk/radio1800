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

schedule.scheduleJob('0 0 0 1 * *', async() => {
    try {
        const state = await stateService.getState();
        await stateService.updateChars(state.id, 100000);
    } catch (e) {
        console.log(e);
    }
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/files')));
app.use(express.static(path.join(__dirname, '/Media/TestTracks/Spectator')));
app.use('/api/audio', liquidsoapRouter);
app.use('/api/user', userRouter);
app.use('/api/text', textRouter);
app.use('/api/state', stateRouter);
app.use('/api/login', loginRouter);


export default app;