"use client";
import {useRouter} from 'next/navigation';
import {useClerk} from '@clerk/nextjs';

export default function Ktering() {
    const {signOut} = useClerk();
    const router = useRouter();

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