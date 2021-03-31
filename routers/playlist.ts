import express from 'express';
import playlistService from '../services/playlistService';

const router = express.Router();

router.get('/:year/:month/:date', async (req, res) => {
    try {
        const date = new Date(req.params.year + "-" + req.params.month + "-" + req.params.date);
        const result = await playlistService.getPlaylistByDay(date);
        const playlist = result;
        res.json(playlist);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

export default router;