import jwt from 'jsonwebtoken';
import { ErrorWithStatus } from '../classes';
import { Status } from '../types';

export interface Token {
    user: string;
    id: string;
}

export const decodedToken = (token: string | undefined): Token => {
    const secret = process.env.SECRET;

    if(!secret || !token || token.substr(0,7) !== 'bearer ') {
        throw new ErrorWithStatus("False credentials", 401);
    }

    try {
        const decodedToken  = jwt.verify(token.substr(7), secret) as Token;
        return decodedToken;
    } catch (e) {
        console.log(e.message);
        throw new ErrorWithStatus("False credentials", 401);
    }
};

export const allowedUserType = (expected: Status, received: Status): boolean => {
    if(expected === received) {
        return true;
    }
    return false;
};