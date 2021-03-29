import React, { useEffect } from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { AdminPage } from './components/admin/AdminPage';
import {Login} from './components/admin/Login';
import {AudioPlayer} from './components/AudioPlayer';
import NotificationBar from './components/NotificationBar';
import { loadUser } from './reducers/loginReducer';
import { useAppDispatch } from './store';
import loginStorage from './utils/loginStorage';

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const user = loginStorage.loadUser();
        if(user) {
            dispatch(loadUser(user));
        }
    }, []);
    
    return (
        <div className="restrict-width">
            <Router>
                <NotificationBar />
                <Switch>
                    <Route path="/main" render={() => <AudioPlayer />} />
                    <Route path="/login" render={() => <Login />} />
                    <Route path="/admin" render={() => <AdminPage />}/>
                    <Redirect exact from="/" to="/main" />
                </Switch>
            </Router>
        </div>
    );
};

export default App;