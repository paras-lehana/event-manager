"use client";

import { ReactNode, createContext, useContext, useState } from "react";
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
import { AIChatPanel } from "@/components/ui/AIChatPanel";

// ============ CHAT CONTEXT ============
interface ChatContextType {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export const ChatContext = createContext<ChatContextType>({
  chatOpen: false,
  setChatOpen: () => {},
});

export function useChat() {
  return useContext(ChatContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <ChatContext.Provider value={{ chatOpen, setChatOpen }}>
      <ToastProvider>
      <VenueProvider>
        <QueueProvider>
          <CartProvider>
            <OrdersProvider>
              <CrewProvider>
                <div className="flex w-full h-[100dvh] overflow-hidden">
                  <div className="flex-1 overflow-y-auto pb-16 relative w-full h-full">
                    {children}
                  </div>
                  
                  {/* Side-by-side Desktop Chat Pane */}
                  <div className={`hidden lg:flex flex-col h-full bg-[#090a0f] border-l border-[var(--color-border)] transition-all duration-300 ${chatOpen ? 'w-[400px]' : 'w-0 border-none'}`}>
                    <div className="w-[400px] h-full overflow-hidden">
                      <AIChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} isSidePane />
                    </div>
                  </div>

                  {/* Mobile Chat Overlay */}
                  <div className="lg:hidden">
                    <AIChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
                  </div>

                  {!chatOpen && (
                    <button
                      onClick={() => setChatOpen(true)}
                      className="fixed bottom-24 right-4 lg:bottom-12 lg:right-12 w-14 h-14 rounded-full bg-gradient-to-br from-[#00f3ff] to-[#db00ff] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,243,255,0.4)] z-[90] hover:scale-110 active:scale-95 transition-transform"
                    >
                      ✨
                    </button>
                  )}
                </div>
                <BottomNav />
                <ToastContainer />
              </CrewProvider>
            </OrdersProvider>
          </CartProvider>
        </QueueProvider>
      </VenueProvider>
    </ToastProvider>
    </ChatContext.Provider>
  );
}
