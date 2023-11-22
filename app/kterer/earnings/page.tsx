"use client";
import {useState} from 'react';
import {useUser} from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export default function Earnings() {
    const user = useUser();
    if (!user) {
        return <div>Loading user...</div>;
    }
    const [loading, setLoading] = useState(false);

    const handleOnboarding = async () => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            const clientId = user && user.user ? user.user.id : "";
            const params = new URLSearchParams({client_id: clientId}).toString();

            const response = await fetch(`${apiURL}/api/stripe/onboarding?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                console.log(response.statusText);
            }

            const data = await response.json();
            console.log('Checkout response:', data);
            window.location.href = data.url;
        } catch
            (error) {
            console.error('Checkout error:', error);
            alert("There was an error processing your checkout.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Alert>
                {/*<Terminal className="h-4 w-4" />*/}
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can add components and dependencies to your app using the cli.
                </AlertDescription>
            </Alert>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between my-8">
                    <div className="text-2xl font-bold ">Earnings</div>
                    <button
                        className="rounded-full px-4 py-2.5 font-semibold border text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                        onClick={handleOnboarding} disabled={loading}>
                        {loading ? 'Loading...' : 'Start Stripe Onboarding'}
                    </button>
                </div>
            </div>
        </>
    );
}
