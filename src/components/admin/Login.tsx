import { unwrapResult } from '@reduxjs/toolkit';
import React, { FormEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { login, logout} from '../../reducers/loginReducer';
import { RootState, useAppDispatch } from '../../store';
import { LoggedInUser } from '../../types';
import { showNotification } from '../../utils/helperFunctions';
import loginStorage from '../../utils/loginStorage';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const user: LoggedInUser | null = useSelector((state: RootState) => state.login.user);
    
    const dispatch = useAppDispatch();
    
    const useLogout = () => {
        loginStorage.logoutUser();
        dispatch(logout());
        showNotification("Logged out!", false, dispatch);
    };

    const submitLogin = async (username: string, password: string) => {
        try {
            (document.getElementById('login-username-input') as HTMLInputElement).value = "";
            (document.getElementById('login-password-input') as HTMLInputElement).value = "";
            setUsername('');
            setPassword('');
            const resultAction = await dispatch(login({user_name: username, password}));
            const logUser = unwrapResult(resultAction);
            if(logUser) {
                loginStorage.saveUser(logUser);
            }
            showNotification(`Welcome, ${(logUser).user_name}`, false, dispatch);
        } catch (e) {
            showNotification(e.message, true, dispatch);
            setUsername('');
            setPassword('');
        }
    };

    const submit= async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submitLogin(username, password);
    };

    return(
        <div>
            {!user && 
                <form onSubmit={submit}>
                    <div>
                        <div>
                            <p>You are not logged in </p>
                            <input id="login-username-input" placeholder="Username" value={username} onChange={({target}) => setUsername(target.value)} /> 
                            <input id="login-password-input" placeholder="Password"type='password' value={password} onChange={({target}) => setPassword(target.value)} />
                            <button type='submit'>Log in</button>
                        </div>
                    </div>
                </form>
            }

            {user &&
                <div>
                    <p>You are logged in as {user.user_name}!</p>
                    <button type='button' onClick={useLogout}>Log out</button>
                </div>
            }   

        </div>
    );
};