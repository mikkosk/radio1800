import express from 'express';
import cors from 'cors';
import path from 'path';

import liquidsoapRouter from './routers/liquidsoap'
import userRouter from './routers/user'
import textRouter from './routers/text'

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/Media/TestTracks/Spectator')));
app.use('/api/audio', liquidsoapRouter)
app.use('/api/user', userRouter)
app.use('/api/text', textRouter)


export default app;