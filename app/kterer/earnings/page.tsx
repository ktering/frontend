"use client";
import {useEffect, useState} from 'react';
import {useUser} from "@clerk/nextjs";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Earnings} from "@/types/pages/earnings/earnings";
import {Button} from "@/components/ui/button";

const orders = [
    {
        buyer_name: 'Jane Cooper',
        date: '2021-01-07',
        total_price: '$190.00',
        items: 2,
        items_list: [
            {
                name: 'Salmon',
                price: '$90.00'
            },
            {
                name: 'Chicken',
                price: '$100.00'
            }
        ],
    }
]

export default function Earnings() {
    const user = useUser();
    if (!user) {
        return <div>Loading user...</div>;
    }
    const [loading, setLoading] = useState(false);
    const [earnings, setEarnings] = useState<Earnings>({available: [], pending: []});

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
            window.location.href = data.url;
        } catch
            (error) {
            console.error('Checkout error:', error);
            alert("There was an error processing your checkout.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchEarnings = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            const clientId = user && user.user ? user.user.id : "";
            const params = new URLSearchParams({client_id: clientId}).toString();

            try {
                const response = await fetch(`${apiURL}/api/stripe/earnings?${params}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch earnings');
                }

                const data = await response.json();
                setEarnings(data.balance);
            } catch (error) {
                console.error('Error fetching earnings:', error);
            }
        };

        fetchEarnings().catch((error) => {
            console.error('Error fetching earnings:', error);
        });
    }, [user.user]);

    const isEarningsLoaded = earnings.available.length > 0 || earnings.pending.length > 0;

    const totalEarnings = isEarningsLoaded
        ? earnings.available.reduce((acc, curr) => acc + curr.amount, 0) + earnings.pending.reduce((acc, curr) => acc + curr.amount, 0)
        : 0;
    const displayEarnings = (totalEarnings / 100).toFixed(2);

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Alert className="mt-8">
                    <AlertTitle className="text-yellow-500">Heads up!</AlertTitle>
                    <AlertDescription className="text-yellow-500">
                        Start Stripe onboarding to receive payments from your customers. Otherwise, you will not be able
                        to receive payments or post foods. Click the button below to start the onboarding process.
                    </AlertDescription>
                </Alert>
                <div className="flex justify-between my-8">
                    <div className="text-2xl font-bold ">Earnings</div>
                    <button
                        className="rounded-full px-4 py-2.5 font-semibold border text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                        onClick={handleOnboarding} disabled={loading}>
                        {loading ? 'Loading...' : 'Start Stripe Onboarding'}
                    </button>
                </div>

                <div className="text-center">
                    <p className="font-bold text-xl">${displayEarnings}</p>
                    <p>Today's total</p>
                </div>

                <div className="my-8">
                    {orders.map((order, index) => (
                        <Alert className="mt-8">
                            <AlertTitle className="font-bold text-lg border-b pb-2">{order.buyer_name}</AlertTitle>
                            <AlertDescription>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="space-x-8 mt-4">
                                            <span className="font-bold">Date:</span> {order.date}
                                            <span className="font-bold">Total:</span> {order.total_price}
                                            <span className="font-bold">Items:</span> {order.items}
                                        </div>
                                        <div>
                                            <div className="flex items-center pt-4">
                                                {order.items_list.map((item, index) => (
                                                    <div className="mr-4">
                                                        <span className="font-bold">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {/*<Link href="/help">*/}
                                        {/*    <Button variant="link">Help</Button>*/}
                                        {/*</Link>*/}
                                        <Button variant="link">View Receipt</Button>
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ))}
                </div>
            </div>
        </>
    );
}
