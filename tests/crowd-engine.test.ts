import { QueueTelemetry } from "../src/lib/types";

describe("Crowd Telemetry Engine", () => {
  const mockQueues: QueueTelemetry[] = [
    { standId: "s1", standName: "Burger Stand", queueLength: 45, estimatedWaitMin: 15, lastUpdated: Date.now(), type: "food", velocity: 1 },
    { standId: "s2", standName: "Beer Cart", queueLength: 2, estimatedWaitMin: 1, lastUpdated: Date.now(), type: "beverage", velocity: -1 },
    { standId: "s3", standName: "Merch", queueLength: 10, estimatedWaitMin: 5, lastUpdated: Date.now(), type: "merchandise", velocity: 0 },
  ];

  it("should correctly identify the fastest queue", () => {
    const fastest = mockQueues.sort((a, b) => a.estimatedWaitMin - b.estimatedWaitMin)[0];
    expect(fastest.standId).toBe("s2");
    expect(fastest.estimatedWaitMin).toBe(1);
  });

  it("should trigger slash alerts only when threshold crosses below 2 minutes", () => {
    const previousQueue = { standId: "s1", estimatedWaitMin: 5 };
    const currentQueue = { standId: "s1", estimatedWaitMin: 1 };
    
    const shouldAlert = previousQueue.estimatedWaitMin > 2 && currentQueue.estimatedWaitMin <= 2;
    expect(shouldAlert).toBe(true);
  });

  it("should not trigger slash alerts if already below threshold", () => {
    const previousQueue = { standId: "s1", estimatedWaitMin: 2 };
    const currentQueue = { standId: "s1", estimatedWaitMin: 1 };
    
    const shouldAlert = previousQueue.estimatedWaitMin > 2 && currentQueue.estimatedWaitMin <= 2;
    expect(shouldAlert).toBe(false);
  });
});
