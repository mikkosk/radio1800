import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchState } from '../../reducers/stateReducer';
import { RootState, useAppDispatch } from '../../store';
import { NodeState } from '../../types';
import { showNotification } from '../../utils/helperFunctions';

export const State: React.FC = () => {
    const [loading, setLoading] = useState(true);
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
    }, [dispatch]);

    return(
        <div>
            {loading &&
                <p>loading...</p>
            }
            {!loading &&
                <div>
                    <h1>Current status of MP3 creation: </h1>
                    <p>Characters left this month: {state.chars}</p>
                </div>
            }
        </div>
    );
};