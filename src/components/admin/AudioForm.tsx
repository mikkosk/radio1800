import { unwrapResult } from '@reduxjs/toolkit';
import React, { FormEvent, useState } from 'react';
import { TextForTTS } from '../../../types';
import { fetchState } from '../../reducers/stateReducer';
import textService from '../../services/textService';
import { useAppDispatch } from '../../store';
import { showNotification, test } from '../../utils/helperFunctions';

export const AudioForm: React.FC = () => {
    const [text, setText] = useState("");
    const [link, setLink] = useState("");
    const [name, setName] = useState("");
    const [year, setYear] = useState(-1);
    const [sending, setSending] = useState(false);

    const dispatch = useAppDispatch();
    
    const checkValidity = (): boolean => {
        const validLinks: string[] = ["https://www.gutenberg.org/ebooks/"];
        if(!text || !link || !name || !year ) {
            showNotification("Kaikki kohdat tulee täyttää!", true, dispatch);
            return false;
        }
        if(text.length > 250000) {
            showNotification("Teksti on liian pitkä!", true, dispatch);
            return false;
        }
        if(!test(link, validLinks) || link.length > 250) {
            showNotification("Tekstit tältä sivustolta eivät ole sopivia!", true, dispatch);
            return false;
        }
        if(name.length > 250) {
            showNotification("Tekstin nimen tulee olla lyhyempi!", true, dispatch);
            return false;
        }
        if(year > 2000 || year < 1750) {
            showNotification("Vuoden pitää olla vuosien 1750 ja 2000 välissä", true, dispatch);
            return false;
        }

        return true;
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSending(true);
        if(checkValidity()) {
            try {
                const newText: TextForTTS = {
                    text,
                    link,
                    name,
                    year
                };

                await textService.addText(newText);

                const actionResult = await dispatch(fetchState());
                unwrapResult(actionResult);

                showNotification(`${name} added!`, false, dispatch);
                setLink('');
                setText('');
                setName('');
                setYear(-1);
                (document.getElementById('audio-form-textarea') as HTMLTextAreaElement).value = "";
                (document.getElementById('audio-form-link') as HTMLInputElement).value = "";
                (document.getElementById('audio-form-year') as HTMLInputElement).value = "";
                (document.getElementById('audio-form-name') as HTMLInputElement).value = "";

            } catch(e) {
                setSending(false);
                showNotification(e.response.data, true, dispatch);
            }
        }
        setSending(false);
    };

    return(
        <div>
            <h1>Lisää äänite valikoimaan</h1>
            <form id="audio-form" onSubmit={submit}>
                <div>
                    <h3>Teksti:</h3>
                    <textarea 
                        id="audio-form-textarea" 
                        placeholder="Kopioi teksti tähän" 
                        maxLength={250000}
                        onChange={({target}) => setText(target.value)}>  
                    </textarea>
                    <p>Merkkejä jäljellä: {250000 - text.length}</p>
                </div>
                <div>
                    <h3>Linkki tekstiin:</h3>
                    <input id="audio-form-link" type="text" maxLength={250} onChange={({target}) => setLink(target.value)}></input>
                </div>
                <div>
                    <h3>Tekstin nimi:</h3>
                    <input id="audio-form-name" type="text" maxLength={250} onChange={({target}) => setName(target.value)}></input>
                </div>
                <div>
                    <h3>Tekstin julkaisuvuosi:</h3>
                    <input id="audio-form-year" type="number" min={1750} max={2000} onChange={({target}) => setYear(Number(target.value))}></input>
                </div>
                <div>
                    <button type="submit" disabled={sending}>
                        Luo!
                    </button>
                </div>
            </form>
        </div>
        );
};