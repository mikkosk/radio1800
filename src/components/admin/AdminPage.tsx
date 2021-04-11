import React from 'react';
import { useSelector } from 'react-redux';
import { LoggedInUser } from '../../types';
import { RootState } from '../../store';
import { State } from './State';
import { AudioForm } from './AudioForm';
import { Login } from './Login';
import { Register } from './Register';
import NotificationBar from '../NotificationBar';

export const AdminPage: React.FC = () => {
    
    const user: LoggedInUser | null = useSelector((state: RootState) => state.login.user);

    return(
        <div>
            <NotificationBar />
            {!user && 
                <div>  
                    <h1>Et ole kirjautunut sisään!</h1>
                    <div>
                        <h2>Kirjaudu sisään</h2>
                        <Login />
                    </div>
                    <div>
                        <h2>Luo käyttäjä</h2>
                        <Register />
                    </div>
                </div>
            }

            {user && user.user_status !== "admin" &&
                <div>
                    <Login />
                    <h1>Vain ylläpitäjille!</h1>
                </div>
            }

            {user && user.user_status === "admin" &&
                <div>
                    <Login />
                    <State />
                    <AudioForm />
                </div>
            }
        </div>
    );
};