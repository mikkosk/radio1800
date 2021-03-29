import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userService from '../services/userService';
import express from 'express';
import { Token } from '../utils/userManagement';
import { LoggedInUser } from '../types';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const result = await userService.getLoginUser(req.body.username);

        const user = result;

        const rightCredentials = user === null
            ? false
            : await bcrypt.compare(req.body.password, user.user_hash);

        if(!(user && rightCredentials)) {
            res.status(401).send("False credentials");
            return;
        }

        const userToken: Token = {
            user: user.user_name,
            id: String(user.user_id)
        };

        if(!process.env.SECRET) {
            res.status(500).send("Unexplained problem");
            return;
        }

        const token = jwt.sign(userToken, process.env.SECRET);

        const {user_id, user_name, user_hash, user_status} = user;
        const loggedInUser: LoggedInUser = {
            token,
            user_id,
            user_hash,
            user_name,
            user_status
        };
        res.status(200).send(loggedInUser);
        
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e.message);
    }
});


export default router;