import { openrouter } from "./config/openrouter";

async function test() {
  const result = await openrouter.chat.send({
    chatRequest: {
      model: "google/gemini-pro",
      messages: [{ role: "user", content: "Hi" }]
    }
  });
  console.log(result.choices?.[0]?.message?.content);
}
test().catch(console.error);
