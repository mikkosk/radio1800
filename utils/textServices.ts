import { TextForTTS } from "../types";
import { createMP3 } from "./ttsServices";

export const processNewText = async (origText: TextForTTS) => {
    const {text, name, link, year} = origText;
    const length = await createMP3(text);

};