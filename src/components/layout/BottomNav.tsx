"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/map", label: "Map", icon: "🗺️" },
  { path: "/order", label: "Order", icon: "🍔" },
  { path: "/crew", label: "Crew", icon: "👥" },
  { path: "/orders", label: "My Orders", icon: "📋" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111424]/90 backdrop-blur-xl border-t border-[var(--color-border)]">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3 min-w-[60px]"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[var(--color-teal-300)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`text-xl ${isActive ? "scale-110" : ""} transition-transform`}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-[var(--color-teal-300)]" : "text-[var(--color-text-secondary)]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
