"use client";
import {useRouter} from 'next/navigation';
import {useUser} from '@clerk/nextjs';
import {useEffect} from "react";

export default function FetchUser() {
    const {isSignedIn, user} = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (isSignedIn && user) {
                const ktererSignUpCompleted = (user.publicMetadata?.ktererSignUpCompleted === true);

                // TODO: add accessToken localStorage for kterer - call the endpoint below

                if (ktererSignUpCompleted) {
                    let userInfo = {
                        client_id: user.id,
                        first_name: user.firstName,
                        last_name: user.lastName,
                        user_type: "kterer",
                        email: user.primaryEmailAddress?.emailAddress,
                        phone: user.phoneNumbers[0]?.phoneNumber,
                    };

                    const apiURL = process.env.NEXT_PUBLIC_API_URL;
                    const response = await fetch(`${apiURL}/api/register`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userInfo),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }

                    const registerData = await response.json();
                    localStorage.setItem('accessToken', registerData.token);
                    // sessionStorage.setItem('hasBeenRedirected', 'true');
                    router.push("/kterer/dashboard");
                } else {
                    let userInfo = {
                        client_id: user.id,
                        first_name: user.firstName,
                        last_name: user.lastName,
                        user_type: "user",
                        email: user.primaryEmailAddress?.emailAddress,
                        phone: user.phoneNumbers[0]?.phoneNumber,
                    };

                    try {
                        const apiURL = process.env.NEXT_PUBLIC_API_URL;
                        const response = await fetch(`${apiURL}/api/register`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(userInfo),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }

                        const registerData = await response.json();
                        localStorage.setItem('accessToken', registerData.token);
                        router.push("/kterings");
                    } catch (error) {
                        console.error('Error updating user info', error);
                    }
                }
            }
        };

        fetchUserInfo();
    }, [isSignedIn]);
}

