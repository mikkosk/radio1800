import express from 'express'
import path from 'path';

const router = express.Router()

var state = 1;
var num = state;

router.get('/next', function(_req, res) {
    //const testPublic = "http://storage.googleapis.com/radio-1800/Testi.mp3"
    num = state;
    state += 1;
    if(state == 4) state = 1;
    console.log(num);
    res.status(200).send(`http://localhost:3001/api/audio/Media/Spec${num}.mp3`)
    //res.status(200).send(testPublic)
});

router.get('/metadata', function(_req, res) {
    res.status(200).send(String(num))
});

//remove in the end
router.get('/Media/:id', function(req, res) {
    console.log("API")
    res.sendFile(path.join(__dirname, `../Media/TestTracks/Spectator/${req.params.id}`), function(err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });

export default router;