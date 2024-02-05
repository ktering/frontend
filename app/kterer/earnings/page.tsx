"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Earnings } from "@/types/pages/earnings/earnings";
import { Button } from "@/components/ui/button";
import { KtererInfo } from "@/types/shared/user";
import { useNotifications } from "@/components/notificationContext";
import { toast } from "@/components/ui/use-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon, } from "@heroicons/react/24/outline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Earnings() {
    const user = useUser();
    if (!user) {
        return <div>Loading user...</div>;
    }
    const [loading, setLoading] = useState(false);
    const [earnings, setEarnings] = useState<Earnings>({
        available: [],
        pending: [],
    });
    const [ktererInfo, setKtererInfo] = useState<KtererInfo | null>(null);
    const [ktererOrders, setKtererOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderIdToCancel, setOrderIdToCancel] = useState<number | 0>(0);

    const { updateNotifications } = useNotifications();

    useEffect(() => {
        const getKtererOrders = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await fetch(`${apiURL}/api/kterer/orders`, {
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
                setKtererOrders(data.orders);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };

        getKtererOrders().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    const handleOnboarding = async () => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            const clientId = user && user.user ? user.user.id : "";
            const params = new URLSearchParams({ client_id: clientId }).toString();

            const response = await fetch(
                `${apiURL}/api/stripe/onboarding?${params}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            if (!response.ok) {
                console.log(response.statusText);
            }

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            alert("There was an error processing your checkout.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchEarnings = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            const clientId = user && user.user ? user.user.id : "";
            const params = new URLSearchParams({ client_id: clientId }).toString();

            try {
                const response = await fetch(
                    `${apiURL}/api/stripe/earnings?${params}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch earnings");
                }

                const data = await response.json();
                setEarnings(data.balance);
            } catch (error) {
                console.error("Error fetching earnings:", error);
            }
        };

        fetchEarnings().catch((error) => {
            console.error("Error fetching earnings:", error);
        });
    }, [user.user]);

    useEffect(() => {
        const getKtererAccountInfo = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            setIsLoading(true);

            try {
                const response = await fetch(`${apiURL}/api/user`, {
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
                setKtererInfo(data.user.kterer.stripe_account_id);
            } catch (error) {
                console.error("An error occurred:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getKtererAccountInfo().catch((error) => {
            console.error("An error occurred:", error);
        });
        getNotifications().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    const isEarningsLoaded =
        earnings.available.length > 0 || earnings.pending.length > 0;

    const totalEarnings = isEarningsLoaded
        ? earnings.available.reduce((acc, curr) => acc + curr.amount, 0) +
        earnings.pending.reduce((acc, curr) => acc + curr.amount, 0)
        : 0;
    const displayEarnings = (totalEarnings / 100).toFixed(2);

    const handleLinkClick = (url: string) => () => {
        if (!url) {
            toast({
                description: (
                    <>
                        <div className="flex items-center">
                            <XMarkIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-red-400" />
                            Tracking Url is empty.
                        </div>
                    </>
                ),
                duration: 5000,
            });
        }
        else {
            window.open(url);
        }
    };

    const cancelOrder = async (id: number) => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiURL}/api/orders/${id}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw (new Error('cancelling order error'));
            }

            const data = await response.json();

            if (data) {
                let cancelled_orders = ktererOrders.filter((order) => order.id === data.order_id);
                cancelled_orders.map((order) => ({ ...order, status: 'cancelled' }));
                setKtererOrders([...ktererOrders, ...cancelled_orders]);
            }


        } catch (error) {

            toast({
                description: (
                    <>
                        <div className="flex items-center">
                            <XMarkIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-red-400" />
                            This order cannot be cancelled.
                        </div>
                    </>
                ),
                duration: 5000,
            });
            console.error(`Error: ${error}`);
        }
    }
    const createDelivery = async (id: number) => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiURL}/api/orders/${id}/delivery`, {
                method: "POST",
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

            const index = ktererOrders.findIndex(
                (order) => order.id === data.order.id,
            );

            if (index > -1) {
                ktererOrders[index] = data.order;
                setKtererOrders([...ktererOrders]);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    const getNotifications = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiURL}/api/notifications`, {
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

            updateNotifications(
                data.map(
                    (not: {
                        id: any;
                        data: { message: any };
                        created_at: string | number | Date;
                        read_at: string | number | Date;
                    }) => ({
                        id: not.id,
                        message: not.data.message,
                        created_at: new Date(not.created_at),
                        read_at: not.read_at ? new Date(not.read_at) : null,
                    }),
                ),
            );
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    const handleCreateDelivery = (id: number) => () => {
        createDelivery(id)
            .then(() => {
                getNotifications().catch((error) => {
                    console.error(`Error: ${error}`);
                });
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                getNotifications().catch((error) => {
                    console.error(`Error: ${error}`);
                });
            });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                {/* Example loading spinner */}
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-color"></div>
                <div>
                    <p className="text-primary-color mt-4">Please wait while we load your data...</p>
                </div>
            </div>
        );
    }

    const handleCancelOrder = (id: number) => {
        cancelOrder(id)
            .then(() => {
                getNotifications().catch((error) => {
                    console.error(`Error: ${error}`);
                });
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                getNotifications().catch((error) => {
                    console.error(`Error: ${error}`);
                });
            });
    }

    const openCancelOrderDialog = (id: number) => () => {
        setOrderIdToCancel(id);
        setIsDialogOpen(true);
    }

    return (
        <>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to cancel the delivery?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <button onClick={() => setIsDialogOpen(false)}>Close</button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleCancelOrder(orderIdToCancel)
                                }
                            >
                                Cancel Order
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!ktererInfo && (
                    <Alert className="mt-8 bg-amber-300 flex items-center">
                        <div>
                            <ExclamationTriangleIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                                Complete bank setup to receive payments from your customers.
                                Otherwise, you will not be able to receive payments or post
                                foods. Click the button below to start the onboarding process.
                            </AlertDescription>
                        </div>
                    </Alert>
                )}
                <div className="flex justify-between my-8">
                    <div className="text-2xl font-bold ">Earnings</div>
                    <button
                        className="rounded-full px-4 py-2.5 font-semibold border text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                        onClick={handleOnboarding}
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : ktererInfo
                                ? "Edit Bank Information"
                                : "Complete Bank Setup"}
                    </button>
                </div>

                <div className="text-center">
                    <p className="font-bold text-xl">${displayEarnings}</p>
                    <p>Today's total</p>
                </div>

                <h2 className="my-4 font-bold text-lg">In Progress</h2>
                <div className="my-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Order No.</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-72">Status</TableHead>
                                <TableHead className="w-72">Actions</TableHead>
                                <TableHead className="w-72"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ktererOrders
                                .filter((order) => order.status === "progress")
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.buyer_name}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString('en-US')}</TableCell>
                                        <TableCell>${order.total_price}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell className="text-left md:space-x-8">
                                            <Button
                                                variant="link"
                                                onClick={handleLinkClick(order.track_url)}
                                                className="p-0 text-primary-color underline-offset-auto"
                                            >
                                                Track Order
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-left md:space-x-8">
                                            <Button
                                                variant="link"
                                                onClick={openCancelOrderDialog(order.id)}
                                                className="p-0 text-primary-color underline-offset-auto"
                                            >
                                                Cancel Order
                                            </Button>
                                        </TableCell>

                                        {/* <Button
                                            variant="link"
                                            onClick={handleCreateDelivery(order.id)}
                                        >
                                            Create Delivery
                                        </Button> */}
                                        <TableCell className="text-left md:space-x-8">

                                            {order.receipt_url && (
                                                <Button
                                                    variant="link"
                                                    className="pl-0"
                                                    onClick={handleLinkClick(order.receipt_url)}
                                                >
                                                    View Receipt
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>

                <h2 className="my-4 font-bold text-lg">Open</h2>
                <div className="my-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Order No.</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-72">Status</TableHead>
                                <TableHead className="w-72">Actions</TableHead>
                                <TableHead className="w-72"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ktererOrders
                                .filter((order) =>
                                    order.status !== "cancelled" &&
                                    order.status !== "delivered" &&
                                    order.status !== "progress",
                                )
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.buyer_name}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString('en-US')}</TableCell>
                                        <TableCell>${order.total_price}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell className="text-left md:space-x-8">
                                            <Button
                                                disabled={!order.track_url}
                                                variant="link"
                                                onClick={handleLinkClick(order.track_url)}
                                                className="p-0 text-primary-color underline-offset-auto"
                                            >
                                                Track Order
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-left md:space-x-8">
                                            <Button
                                                variant="link"
                                                onClick={openCancelOrderDialog(order.id)}
                                                className="p-0 text-primary-color underline-offset-auto"
                                            >
                                                Cancel Order
                                            </Button>
                                        </TableCell>

                                        <TableCell className="text-left md:space-x-8">

                                            {order.receipt_url && (
                                                <Button
                                                    variant="link"
                                                    className="pl-0"
                                                    onClick={handleLinkClick(order.receipt_url)}
                                                >
                                                    View Receipt
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>

                <h2 className="my-4 font-bold text-lg">Completed</h2>
                <div className="my-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Order No.</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-72">Status</TableHead>
                                <TableHead className="w-72">Actions</TableHead>
                                <TableHead className="w-72"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ktererOrders
                                .filter((order) =>
                                    order.status === "cancelled" || order.status === "delivered",
                                )
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.buyer_name}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString('en-US')}</TableCell>
                                        <TableCell>${order.total_price}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell className="text-left md:space-x-8">
                                            <Button
                                                disabled={!order.track_url}
                                                variant="link"
                                                onClick={handleLinkClick(order.track_url)}
                                                className="p-0 text-primary-color underline-offset-auto"
                                            >
                                                Track Order
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-left md:space-x-8">
                                            <Button
                                                disabled={true}
                                                variant="link"
                                                onClick={openCancelOrderDialog(order.id)}
                                                className="p-0 text-primary-color underline-offset-auto"
                                            >
                                                Cancel Order
                                            </Button>
                                        </TableCell>

                                        {/* <Button
                                            variant="link"
                                            onClick={handleCreateDelivery(order.id)}
                                        >
                                            Create Delivery
                                        </Button> */}
                                        <TableCell className="text-left md:space-x-8">

                                            {order.receipt_url && (
                                                <Button
                                                    variant="link"
                                                    className="pl-0"
                                                    onClick={handleLinkClick(order.receipt_url)}
                                                >
                                                    View Receipt
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div >
        </>
    );
}
