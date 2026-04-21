import { Venue, Stand, QueueTelemetry, Order, MenuItem } from "./types";

// ============ STADION VENUE ============
export const MOCK_VENUE: Venue = {
  id: "sofi-stadium",
  name: "SoFi Stadium",
  capacity: 100000,
  indoorMapId: "sofi-indoor-1",
  location: { lat: 33.9535, lng: -118.3392 },
  sections: [
    { id: "sec-101", name: "Section 101", level: 1, coordinates: { lat: 33.9536, lng: -118.3394 } },
    { id: "sec-102", name: "Section 102", level: 1, coordinates: { lat: 33.9537, lng: -118.3390 } },
    { id: "sec-103", name: "Section 103", level: 1, coordinates: { lat: 33.9534, lng: -118.3388 } },
    { id: "sec-110", name: "Section 110", level: 1, coordinates: { lat: 33.9538, lng: -118.3396 } },
    { id: "sec-112", name: "Section 112", level: 1, coordinates: { lat: 33.9533, lng: -118.3393 } },
    { id: "sec-114", name: "Section 114", level: 1, coordinates: { lat: 33.9539, lng: -118.3389 } },
    { id: "sec-201", name: "Section 201", level: 2, coordinates: { lat: 33.9536, lng: -118.3394 } },
    { id: "sec-202", name: "Section 202", level: 2, coordinates: { lat: 33.9537, lng: -118.3390 } },
  ],
  stands: [],
};

// ============ MENU ITEMS ============
const BEER_MENU: MenuItem[] = [
  { id: "beer-1", name: "Craft IPA", description: "Local craft IPA, 16oz", price: 14.00, category: "beer", available: true },
  { id: "beer-2", name: "Lager", description: "Classic cold lager, 16oz", price: 12.00, category: "beer", available: true },
  { id: "beer-3", name: "Seltzer", description: "Hard seltzer, mango", price: 13.00, category: "seltzer", available: true },
  { id: "beer-4", name: "Premium Stout", description: "Dark stout, 16oz", price: 15.00, category: "beer", available: true },
];

const FOOD_MENU: MenuItem[] = [
  { id: "food-1", name: "Stadium Hot Dog", description: "Classic all-beef frank with toppings", price: 8.50, category: "hot-dog", available: true },
  { id: "food-2", name: "Loaded Nachos", description: "Tortilla chips with cheese, jalapeños, salsa", price: 12.00, category: "nachos", available: true },
  { id: "food-3", name: "Chicken Tenders", description: "Crispy tenders with ranch", price: 11.00, category: "chicken", available: true },
  { id: "food-4", name: "Pretzel Bites", description: "Warm pretzel bites with cheese dip", price: 9.00, category: "pretzel", available: true },
  { id: "food-5", name: "Pulled Pork Sandwich", description: "Slow-smoked pulled pork, brioche bun", price: 14.00, category: "sandwich", available: true },
];

const MERCH_MENU: MenuItem[] = [
  { id: "merch-1", name: "Team Jersey", description: "Official home jersey", price: 120.00, category: "jersey", available: true },
  { id: "merch-2", name: "Rally Towel", description: "Game-day rally towel", price: 15.00, category: "accessory", available: true },
  { id: "merch-3", name: "Team Cap", description: "Fitted team cap", price: 35.00, category: "hat", available: true },
];

// ============ STANDS ============
export const MOCK_STANDS: Stand[] = [
  { id: "stand-1", name: "Craft Brews", type: "beverage", section: "sec-114", level: 1, coordinates: { lat: 33.9540, lng: -118.3390 }, menu: BEER_MENU, isOpen: true },
  { id: "stand-2", name: "Hot Dog Heaven", type: "food", section: "sec-112", level: 1, coordinates: { lat: 33.9534, lng: -118.3394 }, menu: FOOD_MENU, isOpen: true },
  { id: "stand-3", name: "Nacho Station", type: "food", section: "sec-101", level: 1, coordinates: { lat: 33.9537, lng: -118.3395 }, menu: FOOD_MENU.slice(1, 4), isOpen: true },
  { id: "stand-4", name: "Premium Bar", type: "beverage", section: "sec-201", level: 2, coordinates: { lat: 33.9536, lng: -118.3393 }, menu: BEER_MENU, isOpen: true },
  { id: "stand-5", name: "Team Store", type: "merchandise", section: "sec-103", level: 1, coordinates: { lat: 33.9535, lng: -118.3387 }, menu: MERCH_MENU, isOpen: true },
  { id: "stand-6", name: "BBQ Pit", type: "food", section: "sec-110", level: 1, coordinates: { lat: 33.9539, lng: -118.3397 }, menu: [FOOD_MENU[4]], isOpen: true },
  { id: "stand-7", name: "Restroom A", type: "restroom", section: "sec-101", level: 1, coordinates: { lat: 33.9536, lng: -118.3396 }, isOpen: true },
  { id: "stand-8", name: "Restroom B", type: "restroom", section: "sec-103", level: 1, coordinates: { lat: 33.9534, lng: -118.3386 }, isOpen: true },
  { id: "stand-9", name: "Restroom C", type: "restroom", section: "sec-201", level: 2, coordinates: { lat: 33.9537, lng: -118.3391 }, isOpen: true },
  { id: "stand-10", name: "Soda Fountain", type: "beverage", section: "sec-102", level: 1, coordinates: { lat: 33.9538, lng: -118.3391 }, menu: [
    { id: "soda-1", name: "Large Soda", description: "Coca-Cola, Pepsi, Sprite", price: 6.00, category: "soda", available: true },
    { id: "soda-2", name: "Water Bottle", description: "Dasani 20oz", price: 5.00, category: "water", available: true },
  ], isOpen: true },
];

// Complete venue with stands
MOCK_VENUE.stands = MOCK_STANDS;

export const MOCK_VENUES: Venue[] = [
  MOCK_VENUE,
  {
    id: "allegiant-stadium",
    name: "Allegiant Stadium",
    capacity: 65000,
    location: { lat: 36.0909, lng: -115.1833 },
    sections: [],
    stands: []
  }
];

// ============ INITIAL QUEUE DATA ============
/**
 * Generates an initial state of queue telemetries across all configured stands.
 * Utilizes pseudo-random baselines combined with stand-specific velocity profiles
 * to seed the simulation engine.
 * 
 * @returns {QueueTelemetry[]} Array of active queue data telemetry readings.
 */
export function generateMockQueues(): QueueTelemetry[] {
  return MOCK_STANDS.map((stand) => {
    const baseQueue = stand.type === "restroom" ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 15) + 2;
    const velocity = stand.type === "restroom" ? 3 : 1.5;
    return {
      standId: stand.id,
      standName: stand.name,
      type: stand.type,
      queueLength: baseQueue,
      estimatedWaitMin: Math.round((baseQueue / velocity) * 10) / 10,
      velocity,
      lastUpdated: Date.now(),
    };
  });
}

// ============ MOCK ORDERS ============
/**
 * Generates a mock dataset of active transaction orders for the primary user.
 * 
 * @returns {Order[]} Array of historical and current processing digital orders.
 */
export function createMockOrders(): Order[] {
  return [
    {
      id: "order-1",
      userId: "user-1",
      standId: "stand-1",
      standName: "Craft Brews",
      items: [{ menuItemId: "beer-1", name: "Craft IPA", quantity: 2, price: 14.00 }],
      status: "ready",
      total: 28.00,
      createdAt: Date.now() - 300000,
      estimatedReadyAt: Date.now() - 60000,
      qrCode: "ORDER-1-QR",
    },
    {
      id: "order-2",
      userId: "user-1",
      standId: "stand-2",
      standName: "Hot Dog Heaven",
      items: [
        { menuItemId: "food-1", name: "Stadium Hot Dog", quantity: 1, price: 8.50 },
        { menuItemId: "food-4", name: "Pretzel Bites", quantity: 1, price: 9.00 },
      ],
      status: "preparing",
      total: 17.50,
      createdAt: Date.now() - 120000,
      estimatedReadyAt: Date.now() + 180000,
    },
  ];
}

// ============ SIMULATE QUEUE UPDATES ============
/**
 * Progresses the time-series simulation by mutating passing metrics logic.
 * Modulates length sizes stochastically and recalculates wait estimations 
 * continuously to fuel real-time dashboard UI bindings.
 * 
 * @param {QueueTelemetry[]} queues - The current architectural state of queues.
 * @returns {QueueTelemetry[]} A newly mutated array representing the T+1 state.
 */
export function simulateQueueUpdate(queues: QueueTelemetry[]): QueueTelemetry[] {
  return queues.map((q) => {
    const delta = Math.random() > 0.5 ? 1 : -1;
    const newLength = Math.max(0, q.queueLength + delta * Math.floor(Math.random() * 3));
    return {
      ...q,
      queueLength: newLength,
      estimatedWaitMin: Math.round((newLength / q.velocity) * 10) / 10,
      lastUpdated: Date.now(),
    };
  });
}
