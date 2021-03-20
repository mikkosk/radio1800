import userService from '../services/userService';
import express from 'express';
import { allowedUserType, decodedToken } from '../utils/userManagement';
import { toText } from '../utils/parser';
import { processNewText } from '../utils/textServices';
const router = express.Router();

router.post('/', async (req, res) => {
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

        const text = toText(req.body);
        processNewText(text);

    } catch (e) {
        res.status(401).send("No authorization to post");
        return;
    }
});


export default router;