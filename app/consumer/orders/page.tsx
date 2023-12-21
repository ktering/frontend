"use client";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import useCart from "@/app/hooks/useCart";
import { toast } from "@/components/ui/use-toast";
import { useNotifications } from "@/components/notificationContext";

const temp_orders = [
  {
    buyer_name: "Jane Cooper",
    date: "2021-01-07",
    total_price: "$190.00",
    items: 2,
    items_list: [
      {
        name: "Salmon",
        price: "$90.00",
      },
      {
        name: "Chicken",
        price: "$100.00",
      },
    ],
  },
];

export default function ConsumerOrders() {
  const searchParams = useSearchParams();
  const orderSuccess = searchParams.get("success");

  const { clearCart } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const { updateNotifications } = useNotifications();

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

        updateNotifications(data.map((not) => not.data.message));
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

  const handleLinkClick = (url) => () => {
    window.open(url);
  };

  return (
    <>
      <div className="flex justify-between my-8">
        <div className="text-2xl font-bold ">Orders</div>
      </div>

      <h2 className="my-4 font-bold text-lg">In Progress</h2>

      <div className="my-8">
        {orders
          .filter((order) => order.status === "progress")
          .map((order, index) => (
            <Alert key={index} className="mt-8">
              <AlertTitle className="font-bold text-lg border-b pb-2">
                <div className="flex justify-between items-center">
                  <p>{order.kterer_name}</p>
                </div>
              </AlertTitle>
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="space-x-8 mt-4">
                      <span className="font-bold">Date:</span>{" "}
                      {new Date(order.created_at).getFullYear()}
                      <span className="font-bold">Total:</span>{" "}
                      {order.total_price}
                      <span className="font-bold">Items:</span>{" "}
                      {order.total_items}
                    </div>
                    <div>
                      <div className="flex items-center pt-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="mr-4">
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
                    {order.receipt_url && (
                      <Button
                        variant="link"
                        onClick={handleLinkClick(order.receipt_url)}
                      >
                        View Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
      </div>

      <h2 className="my-4 font-bold text-lg">Open</h2>

      <div className="my-8">
        {orders
          .filter(
            (order) =>
              order.status !== "cancelled" &&
              order.status !== "delivered" &&
              order.status !== "progress"
          )
          .map((order, index) => (
            <Alert key={index} className="mt-8">
              <AlertTitle className="font-bold text-lg border-b pb-2">
                <div className="flex justify-between items-center">
                  <p>{order.kterer_name}</p>
                  {order.track_url && (
                    <Button
                      variant="link"
                      onClick={handleLinkClick(order.track_url)}
                    >
                      Track Delivery
                    </Button>
                  )}
                </div>
              </AlertTitle>
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="space-x-8 mt-4">
                      <span className="font-bold">Date:</span>{" "}
                      {new Date(order.created_at).getFullYear()}
                      <span className="font-bold">Total:</span>{" "}
                      {order.total_price}
                      <span className="font-bold">Items:</span>{" "}
                      {order.total_items}
                    </div>
                    <div>
                      <div className="flex items-center pt-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="mr-4">
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
                    {order.receipt_url && (
                      <Button
                        variant="link"
                        onClick={handleLinkClick(order.receipt_url)}
                      >
                        View Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
      </div>

      <h2 className="my-4 font-bold text-lg">Completed</h2>

      <div className="my-8">
        {orders
          .filter(
            (order) =>
              order.status === "cancelled" || order.status === "delivered"
          )
          .map((order, index) => (
            <Alert key={index} className="mt-8">
              <AlertTitle className="font-bold text-lg border-b pb-2">
                <div className="flex justify-between items-center">
                  <p>{order.kterer_name}</p>
                  {order.track_url && (
                    <Button
                      variant="link"
                      onClick={handleLinkClick(order.track_url)}
                    >
                      Track Delivery
                    </Button>
                  )}
                </div>
              </AlertTitle>
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="space-x-8 mt-4">
                      <span className="font-bold">Date:</span>{" "}
                      {new Date(order.created_at).getFullYear()}
                      <span className="font-bold">Total:</span>{" "}
                      {order.total_price}
                      <span className="font-bold">Items:</span>{" "}
                      {order.total_items}
                    </div>
                    <div>
                      <div className="flex items-center pt-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="mr-4">
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
                    {order.receipt_url && (
                      <Button
                        variant="link"
                        onClick={handleLinkClick(order.receipt_url)}
                      >
                        View Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
      </div>
    </>
  );
}
