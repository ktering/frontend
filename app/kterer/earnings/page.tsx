"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Earnings } from "@/types/pages/earnings/earnings";
import { Button } from "@/components/ui/button";
import { KtererInfo } from "@/types/shared/user";
import { useNotifications } from "@/components/notificationContext";

const orders = [
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
        }
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
          }
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
    window.open(url);
  };

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
        (order) => order.id === data.order.id
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
            read_at: string | number | Date;
          }) => ({
            id: not.id,
            message: not.data.message,
            read_at: not.read_at ? new Date(not.read_at) : null,
          })
        )
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

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!ktererInfo && (
          <Alert className="mt-8">
            <AlertTitle className="text-yellow-500">Heads up!</AlertTitle>
            <AlertDescription className="text-yellow-500">
              Start Stripe onboarding to receive payments from your customers.
              Otherwise, you will not be able to receive payments or post foods.
              Click the button below to start the onboarding process.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-between my-8">
          <div className="text-2xl font-bold ">Earnings</div>
          <button
            className="rounded-full px-4 py-2.5 font-semibold border text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
            onClick={handleOnboarding}
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Stripe Onboarding"}
          </button>
        </div>

        <div className="text-center">
          <p className="font-bold text-xl">${displayEarnings}</p>
          <p>Today's total</p>
        </div>

        <h2 className="my-4 font-bold text-lg">In Progress</h2>

        <div className="my-8">
          {ktererOrders
            .filter((order) => order.status === "progress")
            .map((order, index) => (
              <Alert key={index} className="mt-8">
                <AlertTitle className="font-bold text-lg border-b pb-2">
                  <div className="flex justify-between items-center">
                    <p>{order.buyer_name}</p>

                    <Button
                      variant="link"
                      onClick={handleCreateDelivery(order.id)}
                    >
                      Create Delivery
                    </Button>
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
                          {order.items.map((item: any, index: number) => (
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
          {ktererOrders
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
                    <p>{order.buyer_name}</p>
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
                          {order.items.map((item: any, index: number) => (
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
          {ktererOrders
            .filter(
              (order) =>
                order.status === "cancelled" || order.status === "delivered"
            )
            .map((order, index) => (
              <Alert key={index} className="mt-8">
                <AlertTitle className="font-bold text-lg border-b pb-2">
                  <div className="flex justify-between items-center">
                    <p>{order.buyer_name}</p>
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
                          {order.items.map((item: any, index: number) => (
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
      </div>
    </>
  );
}
