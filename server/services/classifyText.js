import { config } from "dotenv";
import axios from "axios";

config();

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
// Classify and define what the following text is about and
const classifyText = async (text) => {
  const prompt = `
    Classify the following text into up to 3 topics, also extract any popular noun and keywords and if # exists include it as it is.
    DON'T return "Popular Nouns" and "Topics" or "keywords", just the result don't explain 
    Return the result ONLY a comma-separated list of elements(1 or 2 words maximum), nothing else.
    Text: ${text}
  `;

  try {
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-tiny", // or 'mistral-small'
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.choices[0].message.content;
    const topics = result.split(", ").slice(0, 3);
    console.log(topics);
    return topics;
  } catch (error) {
    console.error("Mistral API error:", error.response?.data || error.message);
    return ["uncategorized"];
  }
};
export default classifyText;
