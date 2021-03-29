import { ErrorWithStatus } from "../classes";
import voiceService from "../services/voiceService";
import { NewVoice, TextForTTS, Voice } from "../types";
import { createMP3 } from "./ttsServices";

export const processNewText = async (origText: TextForTTS): Promise<Voice> => {
    const {text, name, link, year} = origText;
    const {time, filename} = await createMP3(text, name);

    try {
        const newVoice: NewVoice = {
            link: filename,
            voice_length: time || "0",
            year: year || 0,
            voice_name: name,
            to_text: link,
            from_text: name
        };
        const result = await voiceService.addVoice(newVoice);
        return result;
    } catch(e) {
        console.log(e);
        throw new ErrorWithStatus("Something went wrong with processing the text", 400); 
    }
};
