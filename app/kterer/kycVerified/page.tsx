"use client";
import {useEffect} from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter, useSearchParams} from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const {user} = useUser();
    if (!user) {
        return null
    }
    const userId = user.id;
    const searchParams = useSearchParams();
    const kycStatus = searchParams.get('status');

    useEffect(() => {
        const updateMetadata = async () => {
            if (kycStatus === 'completed' && user.publicMetadata.ktererSignUpCompleted === false) {
                const response = await fetch('/api/kterer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId, ktererSignUpCompleted: true}),
                });

                const accessToken = localStorage.getItem('accessToken');
                const apiURL = process.env.NEXT_PUBLIC_API_URL;
                const localResponse = await fetch(`${apiURL}/api/kterer`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        is_verified: true
                    }),
                });
                if (!localResponse.ok) {
                    console.log(localResponse.statusText);
                }
                if (response.ok && localResponse.ok) {
                    const responseJson = await response.json();
                    const userInfo = responseJson.user;

                    if (userInfo.publicMetadata.ktererSignUpCompleted === true) {
                        router.push("/kterer/dashboard");
                    } else {
                        console.log('Metadata updated not updated to false');
                    }
                }
            }
            ;
        }
        updateMetadata();
    }, [user]);
}
