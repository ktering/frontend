"use client";
import {useRouter} from 'next/navigation';
import {useClerk, useUser} from '@clerk/nextjs';
import {useEffect} from "react";

export default function Ktering() {
    const {isSignedIn, user} = useUser();
    const {signOut} = useClerk();
    const router = useRouter();

    useEffect(() => {
        const fetchAndUpdateUserInfo = async () => {
            if (isSignedIn && user) {
                const ktererSignUpCompleted = (user.publicMetadata?.ktererSignUpCompleted);
                // Check if the user has been redirected in this session and if not redirect them.
                const hasBeenRedirected = sessionStorage.getItem('hasBeenRedirected');

                if (ktererSignUpCompleted && !hasBeenRedirected) {
                    sessionStorage.setItem('hasBeenRedirected', 'true');
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
                    } catch (error) {
                        console.error('Error updating user info', error);
                    }
                }
            }
        };

        fetchAndUpdateUserInfo();
    }, [isSignedIn]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };


    return (
        <>
            <h1>Ktering Main Page</h1>
            <button onClick={handleSignOut}>
                Sign Out
            </button>
        </>
    )
}
