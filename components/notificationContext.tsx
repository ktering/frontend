"use client";

import React, {createContext, useState, ReactNode} from 'react';

interface NotificationContextType {
    notifications: string[];
    updateNotifications: (newNotifications: string[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const useNotifications = () => {
    const context = React.useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({children}) => {
    const [notifications, setNotifications] = useState<string[]>([]);

    const updateNotifications = (newNotifications: string[]) => {
        setNotifications([...newNotifications]);
    };

    return (
        <NotificationContext.Provider value={{notifications, updateNotifications}}>
            {children}
        </NotificationContext.Provider>
    );
};
