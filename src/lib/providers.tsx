"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { QueueTelemetry, CartItem, MenuItem, Order, ChatMessage, CrewMember } from "@/lib/types";
import { generateMockQueues, simulateQueueUpdate, MOCK_STANDS, createMockOrders, MOCK_VENUE, MOCK_VENUES } from "@/lib/mock-data";

// ============ QUEUE CONTEXT ============
interface QueueContextType {
  queues: QueueTelemetry[];
  getQueueForStand: (standId: string) => QueueTelemetry | undefined;
}

const QueueContext = createContext<QueueContextType>({
  queues: [],
  getQueueForStand: () => undefined,
});

export function QueueProvider({ children }: { children: ReactNode }) {
  const [queues, setQueues] = useState<QueueTelemetry[]>([]);

  // Initialize on client only to prevent hydration mismatch from Math.random()
  useEffect(() => {
    setQueues(generateMockQueues());
    const interval = setInterval(() => {
      setQueues((prev) => simulateQueueUpdate(prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getQueueForStand = useCallback(
    (standId: string) => queues.find((q) => q.standId === standId),
    [queues]
  );

  return (
    <QueueContext.Provider value={{ queues, getQueueForStand }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueues() {
  return useContext(QueueContext);
}

// ============ CART CONTEXT ============
interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, standId: string, standName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  activeStandId: string | null;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
  activeStandId: null,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [activeStandId, setActiveStandId] = useState<string | null>(null);

  const addItem = useCallback((item: MenuItem, standId: string, standName: string) => {
    setActiveStandId(standId);
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, standId, standName, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.menuItem.id !== menuItemId);
      if (newItems.length === 0) setActiveStandId(null);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setActiveStandId(null);
  }, []);

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, activeStandId }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

// ============ ORDERS CONTEXT ============
interface OrdersContextType {
  orders: Order[];
  placeOrder: (items: CartItem[]) => Order;
}

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  placeOrder: () => ({} as Order),
});

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize with mock orders on client only to avoid hydration mismatch
  useEffect(() => {
    setOrders(createMockOrders());
  }, []);

  const placeOrder = useCallback((cartItems: CartItem[]): Order => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: "anon-user",
      standId: cartItems[0]?.standId || "",
      standName: cartItems[0]?.standName || "",
      items: cartItems.map((ci) => ({
        menuItemId: ci.menuItem.id,
        name: ci.menuItem.name,
        quantity: ci.quantity,
        price: ci.menuItem.price,
      })),
      status: "pending",
      total: cartItems.reduce((s, ci) => s + ci.menuItem.price * ci.quantity, 0),
      createdAt: Date.now(),
      estimatedReadyAt: Date.now() + 600000,
      qrCode: `QR-${Date.now()}`,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Simulate status progression
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrder.id ? { ...o, status: "preparing" } : o))
      );
    }, 3000);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === newOrder.id ? { ...o, status: "ready" } : o))
      );
    }, 10000);

    return newOrder;
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}

// ============ TOAST CONTEXT ============
export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// ============ CREW CONTEXT ============
interface CrewContextType {
  crewId: string | null;
  members: CrewMember[];
  createCrew: (name: string) => void;
  joinCrew: (crewId: string) => void;
  leaveCrew: () => void;
}

const CrewContext = createContext<CrewContextType>({
  crewId: null,
  members: [],
  createCrew: () => {},
  joinCrew: () => {},
  leaveCrew: () => {},
});

function createMockCrewMembers(): CrewMember[] {
  return [
    { uid: "u1", displayName: "AJ", avatar: "AJ", coordinates: { lat: 33.9537, lng: -118.3393 }, lastSeen: Date.now() },
    { uid: "u2", displayName: "MK", avatar: "MK", coordinates: { lat: 33.9536, lng: -118.3390 }, lastSeen: Date.now() },
    { uid: "u3", displayName: "DS", avatar: "DS", coordinates: { lat: 33.9538, lng: -118.3395 }, lastSeen: Date.now() },
  ];
}

export function CrewProvider({ children }: { children: ReactNode }) {
  const [crewId, setCrewId] = useState<string | null>("crew-alpha");
  const [members, setMembers] = useState<CrewMember[]>([]);

  // Initialize on client only to prevent Date.now() hydration mismatch
  useEffect(() => {
    setMembers(createMockCrewMembers());
  }, []);

  const createCrew = useCallback((name: string) => {
    setCrewId(`crew-${Date.now()}`);
    setMembers([{ uid: "self", displayName: "You", avatar: "YO", coordinates: { lat: 33.9535, lng: -118.3392 }, lastSeen: Date.now() }]);
  }, []);

  const joinCrew = useCallback((id: string) => {
    setCrewId(id);
    setMembers(createMockCrewMembers());
  }, []);

  const leaveCrew = useCallback(() => {
    setCrewId(null);
    setMembers([]);
  }, []);

  return (
    <CrewContext.Provider value={{ crewId, members, createCrew, joinCrew, leaveCrew }}>
      {children}
    </CrewContext.Provider>
  );
}

export function useCrew() {
  return useContext(CrewContext);
}

// ============ VENUE CONTEXT (static) ============
interface VenueContextType {
  venue: typeof MOCK_VENUE;
  stands: typeof MOCK_STANDS;
  getStand: (id: string) => typeof MOCK_STANDS[0] | undefined;
  activeVenueId: string;
  setActiveVenueId: (id: string) => void;
  venues: typeof MOCK_VENUES;
}

const VenueContext = createContext<VenueContextType>({
  venue: MOCK_VENUE,
  stands: MOCK_STANDS,
  getStand: () => undefined,
  activeVenueId: "sofi-stadium",
  setActiveVenueId: () => {},
  venues: MOCK_VENUES,
});

export function VenueProvider({ children }: { children: ReactNode }) {
  const [activeVenueId, setActiveVenueId] = useState("sofi-stadium");
  
  const getStand = useCallback((id: string) => MOCK_STANDS.find((s) => s.id === id), []);
  const activeVenue = MOCK_VENUES.find(v => v.id === activeVenueId) || MOCK_VENUE;

  return (
    <VenueContext.Provider value={{ venue: activeVenue, stands: MOCK_STANDS, getStand, activeVenueId, setActiveVenueId, venues: MOCK_VENUES }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenue() {
  return useContext(VenueContext);
}
