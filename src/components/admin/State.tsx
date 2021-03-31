import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchState } from '../../reducers/stateReducer';
import stateService from '../../services/stateService';
import { RootState, useAppDispatch } from '../../store';
import { NodeState } from '../../types';
import { showNotification } from '../../utils/helperFunctions';

export const State: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [number, setNumber] = useState(0);
    const state: NodeState = useSelector((state: RootState) => state.state);

    const dispatch = useAppDispatch();

    const tryFetchState = async() => {
        try {
            const actionRes = await dispatch(fetchState());
            unwrapResult(actionRes);
        } catch (e) {
            showNotification(e.message, true, dispatch);
        }
        setLoading(false);
    };
 
    useEffect(() => {
        void tryFetchState();
    }, []);

    const updateCharacters = async() => {
        try {
            await stateService.updateChars(number);
            await tryFetchState();
            showNotification("Characters updated", false, dispatch);
        } catch (e) {
            showNotification(e.response.data, true, dispatch);
        }
        
    };

    return(
        <div>
            {loading &&
                <p>loading...</p>
            }
            {!loading &&
                <div>
                    <h1>Current status of MP3 creation: </h1>
                    <p>Characters left this month: {state.chars}</p>
                    <input type="number" min="0" max="1000000" onChange={({target}) => setNumber(Number(target.value))}></input>
                    <button onClick={() => updateCharacters()}>Add characters</button>
                </div>
            }
        </div>
    );
};