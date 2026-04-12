import { ChatMessage, FunctionCall } from "./types";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const GEMINI_ENDPOINT = "https://antigravity.aidhunik.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are the AI Stadium Concierge for SoFi Stadium. You help attendees navigate the venue, find food and drinks, check queue times, and coordinate with their crew.

Current game: Rams vs 49ers at SoFi Stadium
Score: Rams 24 - 49ers 17 (Q3, 8:42 remaining)
Key stats: QB 18/25, 245 yds, 2 TD | Rush: 98 yds | Possession: 18:32

You have access to these functions:
- navigateTo(destination: string): Navigate to a specific location in the stadium
- orderFood(standId: string, items: {name: string, quantity: number}[]): Place a food order
- checkQueue(standId: string): Check wait time for a specific stand
- findNearest(type: "food"|"beverage"|"restroom"|"merchandise"): Find the nearest stand of a type
- shareLocation(): Share your location with your crew

Always be concise, helpful, and enthusiastic about the game! Keep responses short (2-3 sentences max). Use emojis.`;

// Tools for OpenAI-compatible API
const TOOLS = [
  {
    type: "function",
    function: {
      name: "navigateTo",
      description: "Navigate user to a specific location in the stadium",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string", description: "The destination to navigate to (e.g. 'Section 114', 'Craft Brews stand', 'Restroom A')" },
        },
        required: ["destination"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "orderFood",
      description: "Place a food or drink order at a concession stand",
      parameters: {
        type: "object",
        properties: {
          standId: { type: "string", description: "The stand ID to order from" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                quantity: { type: "number" },
              },
            },
          },
        },
        required: ["standId", "items"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "checkQueue",
      description: "Check the current wait time for a concession stand or restroom",
      parameters: {
        type: "object",
        properties: {
          standId: { type: "string", description: "The stand ID to check" },
        },
        required: ["standId"],
      },
    }
  },
  {
    type: "function",
    function: {
      name: "findNearest",
      description: "Find the nearest food stand, drink stand, restroom, or merchandise shop",
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["food", "beverage", "restroom", "merchandise"], description: "Type of venue point" },
        },
        required: ["type"],
      },
    }
  },
];

// ============ LOCAL FALLBACK (when no API key) ============
function generateLocalResponse(userMessage: string): { content: string; functionCall?: FunctionCall } {
  const msg = userMessage.toLowerCase();

  if (msg.includes("restroom") || msg.includes("bathroom") || msg.includes("toilet")) {
    return {
      content: "🚻 I found the nearest restroom for you! **Restroom A** in Section 101 has the shortest wait right now — about 3 minutes. I'll pull up directions on the map for you.",
      functionCall: { name: "findNearest", args: { type: "restroom" } },
    };
  }
  if (msg.includes("beer") || msg.includes("drink") || msg.includes("beverage")) {
    return {
      content: "🍺 Great choice! **Craft Brews** in Section 114 is your closest option. They have a killer IPA on tap. Current wait: about 8 minutes. Want me to navigate you there, or would you prefer a shorter line?",
      functionCall: { name: "findNearest", args: { type: "beverage" } },
    };
  }
  if (msg.includes("food") || msg.includes("eat") || msg.includes("hungry") || msg.includes("hot dog") || msg.includes("nachos")) {
    return {
      content: "🌭 Hungry? **Hot Dog Heaven** in Section 112 has a 2-minute wait — that's the fastest right now! They've got classic dogs, loaded nachos, and pretzel bites. Want me to place an order ahead?",
      functionCall: { name: "findNearest", args: { type: "food" } },
    };
  }
  if (msg.includes("navigate") || msg.includes("find") || msg.includes("where") || msg.includes("directions")) {
    return {
      content: "📍 I can help you find your way! What are you looking for? I can guide you to your seat, the nearest food stand, restrooms, or the team store.",
    };
  }
  if (msg.includes("order") || msg.includes("buy")) {
    return {
      content: "🛒 I can place an order for you! Which stand would you like to order from? Here are the closest options:\n\n1. **Craft Brews** — Beers & seltzers\n2. **Hot Dog Heaven** — Hot dogs, nachos, tenders\n3. **Soda Fountain** — Soft drinks & water\n\nJust tell me what you'd like!",
    };
  }
  if (msg.includes("queue") || msg.includes("wait") || msg.includes("line") || msg.includes("busy")) {
    return {
      content: "📊 Here are the current wait times:\n\n• **Craft Brews** — 8 min\n• **Hot Dog Heaven** — 2 min ⚡\n• **Nacho Station** — 5 min\n• **Premium Bar** — 12 min\n• **Restroom A** — 3 min\n• **Restroom B** — 7 min\n\nWant me to alert you when any of these drop below 2 minutes?",
    };
  }
  if (msg.includes("crew") || msg.includes("friend") || msg.includes("group")) {
    return {
      content: "👥 Your crew is nearby! Here's where everyone is:\n\n• **AJ** — Section 102, Level 1\n• **MK** — Near Nacho Station\n• **DS** — Section 110\n\nWant me to share your location with them?",
      functionCall: { name: "shareLocation", args: {} },
    };
  }
  if (msg.includes("score") || msg.includes("game") || msg.includes("play")) {
    return {
      content: "🏟️ What a game! The home team is leading 24-17 in the 3rd quarter. Key stats:\n\n• QB: 18/25, 245 yds, 2 TD\n• Rush yards: 98\n• Time of possession: 18:32\n\nNeed anything else while you enjoy the action?",
    };
  }

  return {
    content: "👋 Hey there! I'm your AI Stadium Concierge. I can help you with:\n\n• 🗺️ **Navigation** — Find your way around\n• 🍔 **Food & Drinks** — Order ahead, check wait times\n• 🚻 **Restrooms** — Find the nearest one\n• 👥 **Crew** — See where your friends are\n• 📊 **Queue Times** — Real-time wait info\n\nWhat can I help with?",
  };
}

// ============ API CALL (with fallback) ============
export async function sendMessageToGemini(
  messages: ChatMessage[]
): Promise<{ content: string; functionCall?: FunctionCall }> {
  const lastMessage = messages[messages.length - 1];

  // If no API key, use local fallback for demo
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
    // Small delay to simulate network
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    return generateLocalResponse(lastMessage.content);
  }

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-3-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          }))
        ],
        tools: TOOLS,
      }),
    });

    const data = await response.json();
    const candidate = data.choices?.[0]?.message;

    if (candidate?.tool_calls?.length > 0) {
      const toolCall = candidate.tool_calls[0].function;
      
      let parsedArgs = toolCall.arguments;
      if (typeof parsedArgs === "string") {
        try {
          parsedArgs = JSON.parse(parsedArgs);
        } catch {
          parsedArgs = {};
        }
      }

      const functionCall = { name: toolCall.name, args: parsedArgs };

      // Simulate executing the function and get a natural language follow-up
      const toolResult = simulateToolExecution(functionCall);
      
      try {
        // Make a follow-up API call with the tool result so the model
        // generates a natural language response incorporating the data
        const followUp = await fetch(GEMINI_ENDPOINT, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gemini-3-flash",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "assistant", content: null, tool_calls: candidate.tool_calls },
              { role: "tool", tool_call_id: candidate.tool_calls[0].id, content: JSON.stringify(toolResult) },
            ],
          }),
        });
        const followUpData = await followUp.json();
        const followUpContent = followUpData.choices?.[0]?.message?.content;
        if (followUpContent) {
          return { content: followUpContent, functionCall };
        }
      } catch {
        // If follow-up fails, use local fallback with the function call badge
      }

      // Fallback: use local response generation with the function call badge
      const localResp = generateLocalResponse(lastMessage.content);
      return { content: localResp.content, functionCall };
    }

    return { content: candidate?.content || "I'm sorry, I couldn't process that. Could you try again?" };
  } catch (error) {
    console.error("LLM Error:", error);
    return generateLocalResponse(lastMessage.content);
  }
}

// Simulate tool execution to provide results back to the model
function simulateToolExecution(fc: FunctionCall): Record<string, unknown> {
  switch (fc.name) {
    case "findNearest":
      if (fc.args.type === "restroom") {
        return { found: "Restroom C", location: "Section 103, Level 1", waitTime: "2 min", distance: "30m" };
      }
      if (fc.args.type === "beverage") {
        return { found: "Premium Bar", location: "Section 201, Level 2", waitTime: "2 min", distance: "45m" };
      }
      if (fc.args.type === "food") {
        return { found: "Hot Dog Heaven", location: "Section 112, Level 1", waitTime: "3 min", distance: "25m" };
      }
      return { found: "Team Store", location: "Section 103, Level 1", waitTime: "5 min", distance: "60m" };

    case "checkQueue":
      return { standId: fc.args.standId, currentWait: "4 min", peopleInLine: 8, trend: "decreasing" };

    case "navigateTo":
      return { destination: fc.args.destination, estimatedWalkTime: "2 min", route: "Turn right at Section 110, continue 50m" };

    case "orderFood":
      return { orderId: `ORD-${Date.now()}`, status: "confirmed", estimatedReady: "5 min", pickupLocation: fc.args.standId };

    default:
      return { status: "ok" };
  }
}
