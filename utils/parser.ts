import { NewUser, Status, TextForTTS } from "../types";

const isString = (text: any): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: any): number is number => {
    return typeof number === 'number' || number instanceof Number;
};

const isStatus = (status: any): status is Status => {
    return ["admin", "user"].includes(status)
}

const parseGenericTextField = (text: any, error: string): string => {
    if(!text || !isString(text)) {
        throw new Error('Missing or invalid ' + error);
    }
    return text;
};


const parseGenericNumberField = (number: any, error: string): number => {
    if((!number && number !== 0) || !isNumber(number)) {
        throw new Error('Missing or invalid ' + error);
    }
    return number;
};

const parseGenericBooleanField = (boolean: any, error: string): boolean => {
    if(typeof boolean === 'boolean') {
        return boolean;
    }
    throw new Error('Missing or invalid ' + error)
}

const parseStatus = (status: any): Status => {
    if(!status || !isString(status) || !isStatus(status)) {
        throw new Error('Missing or invalid status')
        }
    return status;
}

const parseUsername = (string: any, error: string): string => {
    parseGenericTextField(string, error)
    if(string.length < 3 || string.length > 30) {
        throw new Error('Password length is not viable')
    }
    return string;
}

const parseTextLink = (string: any, error: string): string => {
    parseGenericTextField(string, error)

    const test = (text: string) => {
        const starts = (link:string) => {
          return link.startsWith(text)
        }
        const viable = [""]
        return viable.some(starts)
      }
      
    if(!test(string)) {
        throw new Error("Links from this site are not viable")
    }


    return string;
    
}

export const toNewUser = (object: any): NewUser => {
    const newUser: NewUser = {
        user_name: parseUsername(object.user_name, "username"),
        password: parseGenericTextField(object.password, "password"),
        user_status: parseStatus(object.user_status)
    }
    return newUser
}

export const toText = (object: any): TextForTTS => {
    const text: TextForTTS = {
        name: parseGenericTextField(object.name, "name"),
        text: parseGenericTextField(object.text, "text"),
        link: parseTextLink(object.link, "link"),
        year: object.year ? parseGenericNumberField(object.year, "year") : null
    }

    return text
}