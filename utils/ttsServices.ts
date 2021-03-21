import stateService from "../services/stateService";

export const createMP3 = async(text: string): Promise<string | void> => {
    const textLength = text.length;
    let state = await stateService.getState();

    if(!state) {
        state = await stateService.addState(100000, 0);
    }

    if(state.chars > textLength) {
        await stateService.updateChars(state.id, state.chars - textLength);
        console.log("Here we create the file");
    } else {
        console.log("Whoa, you don't have credits for this! Try again next month!");
    }
    
    console.log(text);
    return "00:00:00";
};