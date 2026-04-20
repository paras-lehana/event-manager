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
            className="text-center py-12"
          >
            <GlassCard className="mesh-gradient !border-[#00f3ff]/30 inline-block !p-8">
              <motion.span
                className="text-7xl block mb-6 drop-shadow-[0_0_20px_rgba(50,184,198,0.5)]"
                animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8 }}
              >
                🎉
              </motion.span>
              <h3 className="text-2xl font-black text-white glow-teal">Order Placed!</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2 font-medium">Estimated ready in ~10 minutes</p>
            </GlassCard>
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
              <GlassCard className="flex items-center justify-between !p-0 overflow-hidden group">
                <div className="w-24 h-24 bg-[#111424] border-r border-[var(--color-border)] relative overflow-hidden flex-shrink-0 flex items-center justify-center text-4xl">
                  {/* Cinematic gradient background behind placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00f3ff]/20 to-purple-500/20 group-hover:scale-125 transition-transform duration-700 ease-out" />
                  <span className="relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                    {item.name.toLowerCase().includes("burger") ? "🍔" : 
                     item.name.toLowerCase().includes("beer") ? "🍺" : 
                     item.name.toLowerCase().includes("dog") ? "🌭" : 
                     item.name.toLowerCase().includes("nachos") ? "🧀" : "🍽️"}
                  </span>
                </div>
                <div className="flex-1 p-4">
                  <h4 className="font-semibold text-white group-hover:text-[#00f3ff] transition-colors">{item.name}</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">{item.description}</p>
                  <p className="text-sm font-bold text-[#00f3ff] mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="p-4 flex-shrink-0">
                  <button
                    onClick={() => handleAddItem(item)}
                    disabled={!item.available}
                    className="magnetic-btn w-11 h-11 rounded-full bg-gradient-to-br from-[#db00ff] to-[#9000c7] border border-[#00f3ff]/30 text-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(50,184,198,0.5)] disabled:opacity-30 transition-all hover:scale-110 active:scale-90 text-xl font-bold"
                  >
                    +
                  </button>
                </div>
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

      {/* Checkout panel with heavy blur overlay */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard glow className="shadow-[0_0_50px_rgba(0,0,0,0.5)] !p-6 border-t border-white/20">
              <h3 className="font-bold text-lg text-white mb-4">Your Order</h3>
              <div className="space-y-2 mb-4">
                {items.map((ci) => (
                  <div key={ci.menuItem.id} className="flex justify-between text-sm">
                    <span className="text-white">{ci.quantity}× {ci.menuItem.name}</span>
                    <span className="text-[var(--color-text-secondary)]">${(ci.menuItem.price * ci.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-white border-t border-dashed border-[var(--color-border)] pt-4 mt-2 text-lg">
                <span>Total</span>
                <span className="text-[#00f3ff] drop-shadow-[0_0_8px_rgba(50,184,198,0.5)]">${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { clearCart(); setShowCheckout(false); }}
                  className="flex-1 py-3.5 rounded-xl text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-white/5 transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="magnetic-btn flex-[2] py-3.5 bg-gradient-to-r from-[#db00ff] to-purple-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(50,184,198,0.5)] transition-all active:scale-95"
                >
                  Authorize Checkout 🚀
                </button>
              </div>
            </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
