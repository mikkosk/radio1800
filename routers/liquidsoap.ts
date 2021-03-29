import express from 'express';
import bcrypt from 'bcrypt';
import voiceService from '../services/voiceService';
import { Metadata, MetadataFromLS, MetadataToLS } from '../types';
import { handleNewVoice } from '../utils/playlistManager';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
let metadata: MetadataToLS | undefined;

router.get('/next', async (req, res) => {
    const auth: string | undefined = req.headers.authorization;
    const hash = process.env.LS_HASH || "";

    const rightCredentials = !(auth && hash)
      ? false
      : await bcrypt.compare(auth, hash);

    if(!rightCredentials) {
        res.status(401).send("False credentials");
        return;
    }

    let voice;

    try {
      voice = await voiceService.getRandomVoice();
    } catch(e) {
      console.log(e);
      res.status(500).send();
      return;
    }

    const {voice_id, link, voice_length, from_text, to_text, year} = voice;
    metadata = {voice_id: String(voice_id), voice_length, from_text: from_text || "", to_text: to_text || "", year: String(year)};

    res.status(200).send(link);
});

router.get('/metadata', (_req, res) => {
    res.status(200).send(JSON.stringify(metadata));
});

router.post('/next', (req, res) => {
  const body: MetadataFromLS = req.body as MetadataFromLS;
  const metadataLS: Metadata = JSON.parse(body.unparsed.split("'").join("\"")) as Metadata;
  void handleNewVoice(metadataLS.voice_id);
  res.status(200).send();
});

export default router;