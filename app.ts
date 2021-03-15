import express from 'express';
import cors from 'cors';
import path from 'path';

import liquidsoapRouter from './routers/liquidsoap'

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/audio', liquidsoapRouter)
//app.use(express.static(path.join(__dirname, 'Media/TestTracks/Spectator')));

export default app;