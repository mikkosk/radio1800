import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification, removeNotification } from '../../reducers/notificationReducer';
import { setUser } from '../../reducers/userReducer';
import userService from '../../services/userService';
import { NewUser, Status } from '../../types';

export const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [auth, setAuth] = useState('');
    const [status, setStatus] = useState('user');
    const [matching, setMatching] = useState(true);
    const [notEmpty, setNotEmpty] = useState(false);

    useEffect(() => {
        if(password && passwordAgain && password !== passwordAgain) {
            setNotEmpty(true);
            setMatching(false);
        } else if (!password || !passwordAgain) {
            setNotEmpty(false);
            setMatching(false);
        } else {
            setNotEmpty(true);
            setMatching(true);
        }
    }, [passwordAgain, password]);

    const dispatch = useDispatch();

    const showNotification = (message: string, error: boolean) => {
        dispatch(addNotification({message, error}));
        setTimeout(() => dispatch(removeNotification()), 2000);
    };
    
    const submitRegistration = async (newUser: NewUser, auth: string) => {
        const {password} = newUser;
        if(!username || !password) {
            showNotification("All fields must be filled", true);
            return;
        }

        try {
            const result = await userService.addUser(newUser, auth);

            dispatch(setUser(result));

            (document.getElementById('username-input') as HTMLInputElement).value = "";
            (document.getElementById('password-input') as HTMLInputElement).value = "";
            (document.getElementById('password-again-input') as HTMLInputElement).value = "";
            (document.getElementById('auth-input') as HTMLInputElement).value = "";

            setUsername("");
            setPassword("");
            setPasswordAgain("");
            setAuth("");

            showNotification("New user created! Welcome!", false);
        } catch (e) {
            showNotification(e.response.data, true);
        }
    };

    const submit= async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submitRegistration({user_name: username, password, user_status: status as Status}, auth);
    };
    
    
    return(
        <div>
            <form onSubmit={submit}>
                <div>
                    <div>
                        <p>Käyttäjänimi</p>
                    </div>
                    <div>
                        <input id="username-input" value={username} onChange={({target}) => setUsername(target.value)} />
                    </div>
                </div>
                <div className="top-margin">
                    <div>
                        <p>Salasana</p>
                    </div>
                    <div>
                        <input id="password-input" type='password' value={password} onChange={({target}) => setPassword(target.value)} />
                    </div>
                </div>
                <div>
                    <div>
                        <p>Salasana uudestaan</p>
                    </div>
                    <div>
                        <input id="password-again-input" type='password' value={passwordAgain} onChange={({target}) => setPasswordAgain(target.value)} />
                    </div>
                </div>
                <div>
                    <div>
                        <p>Status</p>
                    </div>
                    <div>
                        <select id="status-input" defaultValue="user" onChange={({target}) => setStatus(target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Authorisointi luomista varten</p>
                    </div>
                    <div>
                        <input id="auth-input" type='password' value={auth} onChange={({target}) => setAuth(target.value)} />
                    </div>
                </div>
                <div>
                    {(!matching && notEmpty) && 
                        <div>
                            <p>The passwords do not match!</p>
                        </div>
                    }
                    <div>
                        <button type='submit' disabled={!(matching && notEmpty)}>Luo käyttäjä!</button>
                    </div>
                </div>
            </form>
        </div>
    );
};