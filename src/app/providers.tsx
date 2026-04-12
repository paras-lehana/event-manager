"use client";

import { ReactNode } from "react";
import {
  QueueProvider,
  CartProvider,
  OrdersProvider,
  ToastProvider,
  CrewProvider,
  VenueProvider,
} from "@/lib/providers";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastContainer } from "@/components/ui/ToastContainer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <VenueProvider>
        <QueueProvider>
          <CartProvider>
            <OrdersProvider>
              <CrewProvider>
                <div className="flex-1 pb-16">{children}</div>
                <BottomNav />
                <ToastContainer />
              </CrewProvider>
            </OrdersProvider>
          </CartProvider>
        </QueueProvider>
      </VenueProvider>
    </ToastProvider>
  );
}
