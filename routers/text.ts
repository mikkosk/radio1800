import userService from '../services/userService';
import express from 'express';
import { allowedUserType, decodedToken } from '../utils/userManagement';
import { toText } from '../utils/parser';
import { processNewText } from '../utils/textServices';

const router = express.Router();

router.post('/', async (req, res) => {
    let token;

    console.log(1);
    try {
        
        token = decodedToken(req.headers.authorization);
        console.log(2);
        const user = await userService.getUser(Number(token.id));
        console.log(3);
        if(!user || !allowedUserType("admin", user.user_status)) {
            res.status(401).send("No authorization to post");
            return;
        }
        console.log(4);
        if(!token.id) {
            res.status(401).send("No authorization to post");
            return;
        }
        
        const text = toText(req.body);
        const result = await processNewText(text);
        res.json(result);

    } catch (e) {
        const status: number = e.status as number || 400;
        res.status(status).send(e.message);
        return;
    }
});


export default router;