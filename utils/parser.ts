import { ErrorWithStatus } from "../classes";
import { NewUser, NewUserFields, Status, TextFields, TextForTTS } from "../types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is number => {
    return typeof number === 'number' || number instanceof Number;
};

const isStatus = (status: string): status is Status => {
    return ["admin", "user"].includes(status);
};

const parseGenericTextField = (text: unknown, error: string): string => {
    if(!text || !isString(text)) {
        throw new ErrorWithStatus('Missing or invalid ' + error, 400);
    }
    return text;
};


const parseGenericNumberField = (number: unknown, error: string): number => {
    if((!number && number !== 0) || !isNumber(number)) {
        throw new ErrorWithStatus('Missing or invalid ' + error, 400);
    }
    return number;
};

/*
const parseGenericBooleanField = (boolean: unknown, error: string): boolean => {
    if(typeof boolean === 'boolean') {
        return boolean;
    }
    throw new ErrorWithStatus('Missing or invalid ' + error);
};
*/

const parseStatus = (status: unknown): Status => {
    if(!status || !isString(status) || !isStatus(status)) {
        new ErrorWithStatus('Missing or invalid status', 400);
        }
    return status as Status;
};

const parseUsername = (string: unknown, error: string): string => {
    const parsed = parseGenericTextField(string, error);
    if(parsed.length < 3 || parsed.length > 30) {
        new ErrorWithStatus('Password length is not viable', 400);
    }
    return parsed;
};

const parseTextLink = (string: unknown, error: string): string => {
    const parsed = parseGenericTextField(string, error);
    
    const test = (text: string) => {
        const starts = (link:string) => {
            return text.startsWith(link);
        };
        const viable = ["https://www.gutenberg.org/ebooks/"];
        return viable.some(starts);
      };
      
    if(!test(parsed)) {
        throw new ErrorWithStatus("Links from this site are not viable", 400);
    }
    

    return parsed;
    
};

export const toNewUser = (object: NewUserFields): NewUser => {
    const newUser: NewUser = {
        user_name: parseUsername(object.user_name, "username"),
        password: parseGenericTextField(object.password, "password"),
        user_status: parseStatus(object.user_status)
    };
    return newUser;
};

export const toText = (object: TextFields): TextForTTS => {
    const text: TextForTTS = {
        name: parseGenericTextField(object.name, "name"),
        text: parseGenericTextField(object.text, "text"),
        link: parseTextLink(object.link, "link"),
        year: object.year ? parseGenericNumberField(object.year, "year") : null
    };

    return text;
};

