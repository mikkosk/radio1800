import stateService from "../services/stateService";
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import path from "path";
import {getAudioDurationInSeconds} from 'get-audio-duration';
import { uploadFile } from "./storageServices";
import { ErrorWithStatus } from "../classes";
import { TTSRequest } from "../types";

export const createMP3 = async(text: string, name: string): Promise<{time: string | void, filename: string}> => {
    const textLength = text.length;
    try {

        let state = await stateService.getState();

        //Create state if using first time
        if(!state) {
            state = await stateService.addState(100000, 0);
        }

        //Check that no string is over 250000 characters
        if(textLength > 250000) {
            throw new ErrorWithStatus("Nobody wants to listen something this long. Max length is 250k characters", 400);
        }

        //Check that month limit is not over, if it is not reduce amount of characters
        if(state.chars > textLength) {
            await stateService.updateChars(state.id, state.chars - textLength);
        } else {
            throw new ErrorWithStatus("Whoa, you don't have credits for this! Try again next month!", 400);
        }

    } catch(e) {
        console.log(e);
        throw new ErrorWithStatus("Unsure of status. Check again later!", 500);
    }

    try {
        const client = new textToSpeech.TextToSpeechClient();
        const outputFile = path.join(__dirname, '../files/temporaryTTS.mp3');

        const request: TTSRequest = {
            input: {text: text},
            voice: {languageCode: 'fi-FI', ssmlGender: "FEMALE"},
            audioConfig: {audioEncoding: 'MP3'},
        };

        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(outputFile, response.audioContent as string, 'binary');

        const length = await getAudioDurationInSeconds(outputFile);

        const readyFileName = uploadFile(outputFile, name);

        return {time: new Date(Math.ceil(length) * 1000).toISOString().substr(11, 8), filename: readyFileName};

    } catch (e) {
        console.log(e);
        throw new ErrorWithStatus("Something went wrong with turning the file to audio", 500);
    } 
};