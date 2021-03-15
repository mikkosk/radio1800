import express from 'express'
import path from 'path';

const router = express.Router()

var state = 1;

router.get('/next', function(_req, res) {
    const testPublic = "http://storage.googleapis.com/radio-1800/Testi.mp3"
    const num = state;
    state += 1;
    if(state == 4) state = 1;
    console.log(num);
    //res.status(200).send(`http://localhost:3001/Media/Spec${num}.mp3`)
    res.status(200).send(testPublic)
});


//remove in the end
router.get('/Media/:id', function(req, res) {
    res.sendFile(path.join(__dirname, `Media/TestTracks/Spectator/${req.params.id}`), function(err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });

export default router;