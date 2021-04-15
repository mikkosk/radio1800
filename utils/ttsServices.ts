import stateService from "../services/stateService";
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import path from "path";
import {getAudioDurationInSeconds} from 'get-audio-duration';
import { uploadFile } from "./storageServices";
import { ErrorWithStatus } from "../classes";
import { TextForTTS, TTSRequest } from "../types";


interface SplitText {text: string, num: number}
const parseIncomingText = (text: string): SplitText[] => {
    if(text.length < 5000) {
        return [{
            text,
            num: 1
        }];
    }

    const fullTextArray: string[] = text.split(" ");
    let allTexts: SplitText[] = [];
    let currentText = "";
    let currentLength = 0;
    let currentNumber = 1;
    for (let i = 0; i < fullTextArray.length; i++) {
        const newWord = fullTextArray[i];
        currentLength += newWord.length + 1;
        if(currentLength > 5000) {
            allTexts = allTexts.concat({text: currentText, num: currentNumber});
            currentText = newWord;
            currentLength = newWord.length;
            currentNumber += 1;
        } else {
            currentText += " " + newWord;
        }
    }

    allTexts = allTexts = allTexts.concat({text: currentText, num: currentNumber});
    
    return allTexts;
};

export const createMP3 = async(text: string, name: string, metadata: TextForTTS): Promise<{time: string | void, filename: string}> => {
    const textLength = text.length;
    try {

        let state = await stateService.getState();

        //Create state if using first time
        if(!state) {
            state = await stateService.addState(15000000, 0);
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

    const textParts = parseIncomingText(text);
    try {
        let length = 0;
        for(let i = 0; i < textParts.length; i++) {
            length += await createPart(textParts[i]);
        }

        await concatFiles(textParts.length);

        const outputFile = path.join(__dirname, '../files/temporaryTTS.mp3');

        const readyFileName = uploadFile(outputFile, name, metadata);

        return {time: new Date(Math.ceil(length) * 1000).toISOString().substr(11, 8), filename: readyFileName};

    } catch (e) {
        console.log(e);
        throw new ErrorWithStatus("Something went wrong with turning the file to audio", 500);
    } 
};

const createPart = async (text: SplitText): Promise<number> => {
    const client = new textToSpeech.TextToSpeechClient();
    const fileString = '../files/temporaryPart' + String(text.num) + '.mp3';
    const partOutput = path.join(__dirname, fileString);

    const request: TTSRequest = {
        input: {text: text.text},
        voice: {languageCode: 'fi-FI', ssmlGender: "FEMALE"},
        audioConfig: {audioEncoding: 'MP3', pitch: -2.0, speakingRate: 0.8 },
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(partOutput, response.audioContent as string, 'binary');
    return await getAudioDurationInSeconds(partOutput);
};

const concatFiles = async (number: number) => {
    const recursiveStreamWriter = async (inputFiles: string[]) => {
        await new Promise<void>(resolve => {
            const nextFile = inputFiles.shift(); 
            if(!nextFile) {console.log("end"); resolve(); return;}
            const readStream = fs.createReadStream(nextFile);
            readStream.pipe(writeStream, {end: false});
            readStream.on('end', async () => {
                await recursiveStreamWriter(inputFiles);
                resolve();
            });
        });
    };

    const writeStream = fs.createWriteStream(path.join(__dirname, '../files/temporaryTTS.mp3'));

    let inputs: string[] = [];
    for (let i = 1; i <= number; i++) {
        inputs = inputs.concat(path.join(__dirname, `../files/temporaryPart${i}.mp3`));
    }

    await recursiveStreamWriter(inputs);
};