"use client";
import { ReactNode, useEffect, useState } from 'react';
import { StatusContext } from './StatusContext';

export const StatusContextProvider = ({ children }: {
    children: ReactNode
}) => {
    const [globalStatus, setGlobalStatus] = useState({
        is_serving_time: true
    });

    useEffect(() => {
        const getServerTime = async function () {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await fetch(`${apiURL}/api/server_time`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                setGlobalStatus({ ...globalStatus, is_serving_time: data.is_serving_time });

            } catch (error) {
                console.error(`Error: ${error}`);
            }
        }
        getServerTime().catch(err => console.error(err));
    }, []);

    return (
        <StatusContext.Provider value={globalStatus}>
            {children}
        </StatusContext.Provider>
    );
}