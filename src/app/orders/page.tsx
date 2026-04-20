"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useOrders } from "@/lib/providers";
import { motion } from "framer-motion";
import { OrderStatus } from "@/lib/types";

function getStatusBadge(status: OrderStatus) {
  const styles: Record<OrderStatus, { bg: string; text: string; label: string; icon: string }> = {
    pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Pending", icon: "⏳" },
    preparing: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Preparing", icon: "👨‍🍳" },
    ready: { bg: "bg-green-500/20", text: "text-green-400", label: "Ready!", icon: "✅" },
    collected: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Collected", icon: "📦" },
    cancelled: { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled", icon: "❌" },
  };
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.icon} {s.label}
    </span>
  );
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[#f5f5f5] pb-24">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">My Orders 📋</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">Track your orders in real-time</p>
        </motion.div>

        {orders.length === 0 ? (
          <GlassCard className="text-center py-12">
            <span className="text-5xl mb-4 block">🍽️</span>
            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Head to the Order tab to skip the lines!
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard glow={order.status === "ready"}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">{order.standName}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Ordered at {formatTime(order.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.map((item) => (
                      <div key={item.menuItemId} className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-secondary)]">
                          {item.quantity}× {item.name}
                        </span>
                        <span className="text-[var(--color-text-secondary)]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-[var(--color-teal-300)]">${order.total.toFixed(2)}</span>
                  </div>

                  {order.status === "ready" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
                    >
                      <p className="text-sm font-bold text-green-400">
                        🎉 Your order is ready for pickup!
                      </p>
                      {order.qrCode && (
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                          Show code: <span className="font-mono text-white">{order.qrCode}</span>
                        </p>
                      )}
                    </motion.div>
                  )}

                  {order.status === "preparing" && order.estimatedReadyAt && (
                    <div className="mt-3 text-center">
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Estimated ready at{" "}
                        <span className="text-white font-medium">{formatTime(order.estimatedReadyAt)}</span>
                      </p>
                      {/* Progress bar */}
                      <div className="mt-2 w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-400 rounded-full"
                          initial={{ width: "20%" }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 10, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
