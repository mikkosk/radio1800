import express from 'express';
import userService from '../services/userService';
import { toNewUser } from '../utils/parser';
import { decodedToken } from '../utils/userManagement';
import bcrypt from 'bcrypt';

const router = express.Router();


router.get('/:id', async (req, res) => {
    try {
        const result = await userService.getUser(Number(req.params.id));
        const user = result;
        res.json(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/', async (req, res) => {
    const auth: string | undefined = req.body.password as string | undefined;
    const hash = process.env.ADMIN_CREATE_HASH || "";
    try {

        const rightCredentials = !(auth && hash)
        ? false
        : await bcrypt.compare(auth, hash);

        if(!rightCredentials) {
            res.status(401).send("False credentials");
            return;
        }

    } catch(e) {
        console.log(e);
        res.status(401).send("False credentials");
    }

    try {
        const newUser = toNewUser(req.body.user);
        const result = await userService.addUser(newUser);
        const addedUser = result;
        res.json(addedUser);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const token = decodedToken(req.headers.authorization);

        if(req.params.id !== token.id) {
            res.status(401).send("No authorization to delete the user");
            return;
        }

        await userService.deleteUser(Number(req.params.id));
    } catch(e) {
        res.status(400).send(e.message);
    }

    res.status(204).end();
});


export default router;