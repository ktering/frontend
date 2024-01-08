"use client";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {useSearchParams} from "next/navigation";
import useCart from "@/app/hooks/useCart";
import {toast} from "@/components/ui/use-toast";
import {useNotifications} from "@/components/notificationContext";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

export default function ConsumerOrders() {
    const searchParams = useSearchParams();
    const orderSuccess = searchParams.get("success");

    const {clearCart} = useCart();
    const [orders, setOrders] = useState<any[]>([]);
    const {updateNotifications} = useNotifications();

    useEffect(() => {
        if (orderSuccess === "true") {
            clearCart();
        } else if (orderSuccess === "false") {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Payment failed. Please try again.",
            });
        }
    }, [orderSuccess]);

    useEffect(() => {
        const getUserOrders = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await fetch(`${apiURL}/api/orders`, {
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
                setOrders(data.orders);
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
                    data.map((not: any) => ({
                        id: not.id,
                        message: not.data.message,
                        created_at: new Date(not.created_at),
                        read_at: not.read_at ? new Date(not.read_at) : null,
                    }))
                );
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };

        getUserOrders().catch((error) => {
            console.error(`Error: ${error}`);
        });

        getNotifications().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    const handleLinkClick = (url: string) => () => {
        window.open(url);
    };

    return (
        <>
            <div className="flex justify-between my-8">
                <div className="text-2xl font-bold ">Orders</div>
            </div>

            <h2 className="my-4 font-bold text-lg">In Progress</h2>
            <div className="my-8">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Order No.</TableHead>
                            <TableHead>Kterer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="w-72">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders
                            .filter((order) => order.status === "progress")
                            .map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.kterer_name}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString('en-US')}</TableCell>
                                    <TableCell>${order.total_price}</TableCell>
                                    <TableCell className="text-right">
                                        {order.receipt_url && (
                                            <Button
                                                variant="link"
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
                            <TableHead>Kterer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="w-72">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders
                            .filter((order) =>
                                order.status !== "cancelled" &&
                                order.status !== "delivered" &&
                                order.status !== "progress")
                            .map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.kterer_name}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString('en-US')}</TableCell>
                                    <TableCell>${order.total_price}</TableCell>
                                    <TableCell className="text-right">
                                        {order.track_url && (
                                            <Button
                                                variant="link"
                                                onClick={handleLinkClick(order.track_url)}
                                            >
                                                Track Delivery
                                            </Button>
                                        )}
                                        {order.receipt_url && (
                                            <Button
                                                variant="link"
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
                            <TableHead>Kterer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="w-72">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders
                            .filter((order) =>
                                order.status === "cancelled" || order.status === "delivered")
                            .map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.kterer_name}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString('en-US')}</TableCell>
                                    <TableCell>${order.total_price}</TableCell>
                                    <TableCell className="text-right">
                                        {order.track_url && (
                                            <Button
                                                variant="link"
                                                onClick={handleLinkClick(order.track_url)}
                                            >
                                                Track Delivery
                                            </Button>
                                        )}
                                        {order.receipt_url && (
                                            <Button
                                                variant="link"
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
        </>
    )
        ;
}
