"use client";
import {useState} from 'react';
import {useUser} from "@clerk/nextjs";

export default function StripeOnboarding() {
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
            const params = new URLSearchParams({client_id: user?.user.id || ""});

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between my-8">
                    <div className="text-2xl font-bold ">Stripe Account Onboarding</div>
                </div>

                <button onClick={handleOnboarding} disabled={loading}>
                    {loading ? 'Loading...' : 'Start Stripe Onboarding'}
                </button>
            </div>
        </>
    );
}
