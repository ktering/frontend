import React from "react";
import type { Metadata } from "next";
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";
import UserNavbar from "@/components/userNavbar";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/components/notificationContext";

export const metadata: Metadata = {
  title: "Kterer Dashboard",
  description: "Kterer Dashboard and Pages",
};

export default async function KtererLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <section>
      <CartProvider>
        <NotificationProvider>
          <UserNavbar />
          <KtererDashboardNavbar />
          {children}
        </NotificationProvider>
      </CartProvider>
    </section>
  );
}
