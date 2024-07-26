"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import useCart from "@/app/hooks/useCart";
import { toast } from "@/components/ui/use-toast";
import { useNotifications } from "@/components/notificationContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "black" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

export default function ConsumerOrders() {
  const searchParams = useSearchParams();
  const orderSuccess = searchParams.get("success");
  const [isLoading, setIsLoading] = useState(true);

  const { clearCart } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [dataLocal, setDataLocal] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const { updateNotifications } = useNotifications();

  useEffect(() => {
    if (orderSuccess === "true") {
      clearCart();
      handleAddNewOrder();
    } else if (orderSuccess === "false") {
      handleAddNewOrder();
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Payment failed. Please try again.",
      });
    }
  }, [orderSuccess]);

  const handleAddNewOrder = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const storedDataLocal = localStorage?.getItem("myData");
    const storedData = storedDataLocal ? JSON.parse(storedDataLocal) : [];

    const storedProductDataLocal = localStorage?.getItem("productData");
    const storedProductData = storedProductDataLocal
      ? JSON.parse(storedProductDataLocal)
      : [];

    if (storedData?.id) {
      try {
        const response = await fetch(`${apiURL}/api/checkoutorder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            storedData: storedData,
            productData: storedProductData,
          }),
        });

        if (!response.ok) {
          console.error(`Error: ${response.statusText}`);
          return;
        }

        localStorage.removeItem("myData");
        localStorage.removeItem("productData");

        getUserOrders().catch((error) => {
          console.error(`Error: ${error}`);
        });

        getNotifications().catch((error) => {
          console.error(`Error: ${error}`);
        });
      } catch (error) {
        console.error(`Error: ${error}`);

        getUserOrders().catch((error) => {
          console.error(`Error: ${error}`);
        });

        getNotifications().catch((error) => {
          console.error(`Error: ${error}`);
        });
      }
    } else {
      console.log("Testing");

      getUserOrders().catch((error) => {
        console.error(`Error: ${error}`);
      });

      getNotifications().catch((error) => {
        console.error(`Error: ${error}`);
      });
    }
  };

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    if (!orderSuccess) {
      getUserOrders().catch((error) => {
        console.error(`Error: ${error}`);
      });

      getNotifications().catch((error) => {
        console.error(`Error: ${error}`);
      });
    }
  }, []);

  const handleLinkClick = (url: string) => () => {
    window.open(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        {/* Example loading spinner */}
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-color"></div>
        <div>
          <p className="text-primary-color mt-4">
            Please wait while we load your data...
          </p>
        </div>
      </div>
    );
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <>
      <div className="flex justify-between my-8">
        <div className="text-2xl font-bold ">Orders</div>
      </div>

      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        sx={{ border: "none" }}
        className="hidden"
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <h2 className="my-4 font-bold text-lg">In Progress</h2>
        </AccordionSummary>

        <AccordionDetails>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">
                    <span className="font-bold text-black">Order No.</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Kterer</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Date</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Amount</span>
                  </TableHead>
                  <TableHead className="w-72">
                    <span className="font-bold text-black">Status</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .filter((order) => order.status === "progress")
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{order.kterer_name}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString("en-US")}
                      </TableCell>
                      <TableCell>${order.total_price}</TableCell>
                      <TableCell className="text-left">
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
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
        sx={{ border: "none" }}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          {/* <h2 className="my-4 font-bold text-lg">Open</h2> */}
          <h2 className="my-4 font-bold text-lg">In Progress</h2>
        </AccordionSummary>

        <AccordionDetails>
          <div className="my-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">
                    <span className="font-bold text-black">Order No.</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Kterer</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Date</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Amount</span>
                  </TableHead>
                  <TableHead className="w-72">
                    <span className="font-bold text-black">Status</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .filter(
                    (order) =>
                      order.status !== "cancelled" &&
                      order.status !== "delivered" &&
                      order.status !== "progress"
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{order.kterer_name}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString("en-US")}
                      </TableCell>
                      <TableCell>${order.total_price}</TableCell>
                      <TableCell className="text-left md:space-x-4">
                        {order.track_url && (
                          <Button
                            variant="link"
                            className="pl-0"
                            onClick={handleLinkClick(order.track_url)}
                          >
                            Track Delivery
                          </Button>
                        )}
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
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
        sx={{ border: "none" }}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <h2 className="my-4 font-bold text-lg">Completed</h2>
        </AccordionSummary>

        <AccordionDetails>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">
                    <span className="font-bold text-black">Order No.</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Kterer</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Date</span>
                  </TableHead>
                  <TableHead>
                    <span className="font-bold text-black">Amount</span>
                  </TableHead>
                  <TableHead className="w-72">
                    <span className="font-bold text-black">Status</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .filter(
                    (order) =>
                      order.status === "cancelled" ||
                      order.status === "delivered"
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{order.kterer_name}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString("en-US")}
                      </TableCell>
                      <TableCell>${order.total_price}</TableCell>
                      <TableCell className="text-left md:space-x-8">
                        {order.track_url && (
                          <Button
                            variant="link"
                            className="pl-0"
                            onClick={handleLinkClick(order.track_url)}
                          >
                            Track Delivery
                          </Button>
                        )}
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
        </AccordionDetails>
      </Accordion>

      {/* <h2 className="my-4 font-bold text-lg">In Progress</h2> */}

      {/* <h2 className="my-4 font-bold text-lg">Open</h2> */}

      {/* <h2 className="my-4 font-bold text-lg">Completed</h2> */}
    </>
  );
}
