import express from 'express';
import userService from '../services/userService';
import { allowedUserType, decodedToken } from '../utils/userManagement';
import stateService from '../services/stateService';
import { NodeState } from '../types';

const router = express.Router();


router.post('/updatechars', async(req, res) => {
    let token;

    try {
        
        token = decodedToken(req.headers.authorization);

        const user = await userService.getUser(Number(token.id));
        if(!user || !allowedUserType("admin", user.user_status)) {
            res.status(401).send("No authorization to post");
            return;
        }

        if(!token.id) {
            throw new Error;
        }
        
        const chars: number = req.body.chars as number;
        const state: NodeState = await stateService.getState();

        if(new Date(state.last_updated).toDateString() === new Date().toDateString()) {
            res.status(400).send("Can't add any more characters today!");
        }

        if(chars > 1000000) {
            res.status(400).send("Can't add so many");
        }

        const result = await stateService.updateChars(state.id, chars);
        res.json(result);

    } catch (e) {
        const status: number = e.status as number || 400;
        res.status(status).send(e.message);
        return;
    }
});

router.get('/', async (req, res) => {
    let token;

    try {
        
        token = decodedToken(req.headers.authorization);

        const user = await userService.getUser(Number(token.id));
        console.log(user);
        if(!user || !allowedUserType("admin", user.user_status)) {
            res.status(401).send("No authorization to post");
            return;
        }

        if(!token.id) {
            throw new Error;
        }
        
        const result = await stateService.getState();
        res.json(result);

    } catch (e) {
        const status: number = e.status as number || 400;
        res.status(status).send(e.message);
        return;
    }
});

export default router;
