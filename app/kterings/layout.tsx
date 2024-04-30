
import React from "react";
import type { Metadata } from "next";
import UserNavbar from "@/components/userNavbar";
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";
import { currentUser } from "@clerk/nextjs";
import { SearchProvider } from "@/contexts/SearchProvider";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/components/notificationContext";
import { StatusContextProvider } from "@/contexts/StatusProvider";

export const metadata: Metadata = {
  title: "Kterings",
  description: "Kterings Homepage",
};

export default async function KteringsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  console.log('Mother kterings');
  if (!user) {
    return null;
  }
  const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;
  return (
    <section>
      <CartProvider>
        <StatusContextProvider>
          <NotificationProvider>
            <SearchProvider>
              <div>
                <UserNavbar />
                {isKterer ? <KtererDashboardNavbar /> : null}
                {children}
              </div>
            </SearchProvider>
          </NotificationProvider>
        </StatusContextProvider>
      </CartProvider>
    </section>
  );
}
