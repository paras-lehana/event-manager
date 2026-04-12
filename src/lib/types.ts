// ============ USER ============
export interface AppUser {
  uid: string;
  displayName?: string;
  activeCrewId?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  favoriteStands?: string[];
  dietaryRestrictions?: string[];
  seatSection?: string;
}

// ============ VENUE ============
export interface Venue {
  id: string;
  name: string;
  capacity: number;
  indoorMapId?: string;
  location: LatLng;
  stands: Stand[];
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  level: number;
  coordinates: LatLng;
}

export interface Stand {
  id: string;
  name: string;
  type: "food" | "beverage" | "merchandise" | "restroom";
  section: string;
  level: number;
  coordinates: LatLng;
  menu?: MenuItem[];
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

// ============ ORDERS ============
export interface Order {
  id: string;
  userId: string;
  standId: string;
  standName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: number;
  estimatedReadyAt?: number;
  qrCode?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "collected" | "cancelled";

// ============ QUEUE TELEMETRY ============
export interface QueueTelemetry {
  standId: string;
  standName: string;
  type: Stand["type"];
  queueLength: number;
  estimatedWaitMin: number;
  velocity: number; // people per minute
  lastUpdated: number;
}

// ============ CREW / PRESENCE ============
export interface CrewMember {
  uid: string;
  displayName: string;
  avatar: string;
  coordinates: LatLng;
  lastSeen: number;
}

export interface Crew {
  id: string;
  name: string;
  members: Record<string, CrewMember>;
}

// ============ COORDINATES ============
export interface LatLng {
  lat: number;
  lng: number;
}

// ============ AI / GEMINI ============
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  functionCall?: FunctionCall;
}

export interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

// ============ CART ============
export interface CartItem {
  menuItem: MenuItem;
  standId: string;
  standName: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  standId: string | null;
  total: number;
}
