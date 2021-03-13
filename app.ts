import express from 'express';
import cors from 'cors';
import path from 'path';

var state = 1;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'Media/TestTracks/Spectator')));

app.get('/next', function(_req, res) {
    const num = state;
    state += 1;
    if(state == 4) state = 1;
    console.log(num);
    res.status(200).send(`http://localhost:3001/Media/Spec${num}.mp3`)
});

app.get('/Media/:id', function(req, res) {
    res.sendFile(path.join(__dirname, `Media/TestTracks/Spectator/${req.params.id}`), function(err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });

export default app;