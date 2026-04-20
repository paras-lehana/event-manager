const GEMINI_API_KEY = "sk-6163fb1504c643db87f6b9c504ec0c5f";
const GEMINI_ENDPOINT = "https://antigravity.lehana.in/v1/chat/completions";

async function test() {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GEMINI_API_KEY}` },
    body: JSON.stringify({
      model: "gemini-3-flash",
      messages: [{ role: "user", content: "Tell me a highly enthusiastic 1 sentence joke about stadium hotdogs." }],
      tools: [{ type: "function", function: { name: "test", description: "test", parameters: {type:"object", properties: {}} } }]
    })
  });
  console.log(await response.json());
}
test();
