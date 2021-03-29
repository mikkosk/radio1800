import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../store";

const NotificationBar: React.FC = () => {
    const notifications = useSelector((state: RootState) => state.notification.notifications);

    return(
        <div>
            {notifications.map((n, index) => {
                console.log(n.message);
                return(
                    <div key={index}>
                        <p style = {{color: 'red'}}>{n.message}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default NotificationBar;