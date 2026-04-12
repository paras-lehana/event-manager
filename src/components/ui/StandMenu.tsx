"use client";

import { useCart, useOrders, useQueues, useToast } from "@/lib/providers";
import { Stand, MenuItem } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface StandMenuProps {
  stand: Stand;
  onBack: () => void;
}

export function StandMenu({ stand, onBack }: StandMenuProps) {
  const { addItem, items, total, itemCount, clearCart, activeStandId } = useCart();
  const { placeOrder } = useOrders();
  const { getQueueForStand } = useQueues();
  const { addToast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const queue = getQueueForStand(stand.id);
  const cartForThisStand = items.filter((i) => i.standId === stand.id);

  const handleAddItem = (item: MenuItem) => {
    if (activeStandId && activeStandId !== stand.id && items.length > 0) {
      addToast({ message: "You can only order from one stand at a time. Clear your cart first.", type: "warning" });
      return;
    }
    addItem(item, stand.id, stand.name);
    addToast({ message: `Added ${item.name} to cart`, type: "success", duration: 2000 });
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    placeOrder(items);
    clearCart();
    setShowCheckout(false);
    setOrderPlaced(true);
    addToast({ message: "🎉 Order placed! We'll notify you when it's ready.", type: "success", duration: 6000 });
    setTimeout(() => setOrderPlaced(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{stand.name}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stand.section} • Level {stand.level}
            {queue && (
              <span className="ml-2" style={{ color: queue.estimatedWaitMin > 5 ? "var(--color-error)" : "var(--color-teal-300)" }}>
                • {queue.estimatedWaitMin} min wait
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Order success animation */}
      <AnimatePresence>
        {orderPlaced && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <motion.span
              className="text-6xl block mb-4"
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              🎉
            </motion.span>
            <h3 className="text-xl font-bold text-white">Order Placed!</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Estimated ready in ~10 minutes</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu items */}
      {!orderPlaced && stand.menu && (
        <div className="space-y-3">
          {stand.menu.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="flex items-center justify-between !p-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{item.description}</p>
                  <p className="text-sm font-bold text-[var(--color-teal-300)] mt-1">${item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleAddItem(item)}
                  disabled={!item.available}
                  className="ml-4 w-10 h-10 rounded-full bg-[var(--color-teal-500)] text-white flex items-center justify-center hover:bg-[var(--color-teal-600)] disabled:opacity-30 transition-all hover:scale-110 active:scale-95 text-lg"
                >
                  +
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating cart bar */}
      <AnimatePresence>
        {itemCount > 0 && !showCheckout && !orderPlaced && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-40"
          >
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full flex items-center justify-between bg-[var(--color-teal-500)] text-white rounded-2xl px-6 py-4 shadow-2xl hover:bg-[var(--color-teal-600)] transition-colors"
            >
              <span className="font-bold">{itemCount} item{itemCount > 1 ? "s" : ""} in cart</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout panel */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <GlassCard glow>
              <h3 className="font-bold text-lg text-white mb-4">Your Order</h3>
              <div className="space-y-2 mb-4">
                {items.map((ci) => (
                  <div key={ci.menuItem.id} className="flex justify-between text-sm">
                    <span className="text-white">{ci.quantity}× {ci.menuItem.name}</span>
                    <span className="text-[var(--color-text-secondary)]">${(ci.menuItem.price * ci.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-white border-t border-[var(--color-border)] pt-3">
                <span>Total</span>
                <span className="text-[var(--color-teal-300)]">${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { clearCart(); setShowCheckout(false); }}
                  className="flex-1 py-3 border border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] hover:bg-white/5 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-[var(--color-teal-500)] text-white rounded-xl font-bold hover:bg-[var(--color-teal-600)] transition-colors"
                >
                  Place Order 🚀
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
