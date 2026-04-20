import { QueueTelemetry } from "../src/lib/types";

/**
 * Intelligent Routing Engine Logic
 * This simulates the core USP: redirecting fans to the most efficient node.
 */
function calculateRouteScore(queue: QueueTelemetry, distanceMeters: number): number {
  // Score = Wait Time (translated to seconds) + Travel Time (assuming 1.4m/s walking speed)
  const waitSeconds = queue.estimatedWaitMin * 60;
  const travelSeconds = distanceMeters / 1.4;
  return waitSeconds + travelSeconds;
}

describe("Intelligent Routing Engine", () => {
  const mockQueues: QueueTelemetry[] = [
    { standId: "near", standName: "Near Stand", queueLength: 40, estimatedWaitMin: 15, lastUpdated: Date.now(), type: "food", velocity: 1 },
    { standId: "far", standName: "Far Stand", queueLength: 5, estimatedWaitMin: 2, lastUpdated: Date.now(), type: "food", velocity: 0 },
  ];

  it("should recommend a farther stand if the total time (wait + travel) is lower", () => {
    const distNear = 20; // 20 meters away
    const distFar = 150; // 150 meters away

    const scoreNear = calculateRouteScore(mockQueues[0], distNear);
    const scoreFar = calculateRouteScore(mockQueues[1], distFar);

    // Near: 15*60 + 20/1.4 = 900 + 14 = 914s
    // Far: 2*60 + 150/1.4 = 120 + 107 = 227s
    
    expect(scoreFar).toBeLessThan(scoreNear);
    
    const recommended = scoreNear < scoreFar ? "near" : "far";
    expect(recommended).toBe("far");
  });

  it("should recommend the nearer stand if wait times are comparable", () => {
    const distNear = 20;
    const distFar = 300;
    
    const nearQueue: QueueTelemetry = { ...mockQueues[0], estimatedWaitMin: 5 };
    const farQueue: QueueTelemetry = { ...mockQueues[1], estimatedWaitMin: 4 };

    const scoreNear = calculateRouteScore(nearQueue, distNear);
    const scoreFar = calculateRouteScore(farQueue, distFar);

    // Near: 5*60 + 20/1.4 = 300 + 14 = 314s
    // Far: 4*60 + 300/1.4 = 240 + 214 = 454s

    expect(scoreNear).toBeLessThan(scoreFar);
  });
});
