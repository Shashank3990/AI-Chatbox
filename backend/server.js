import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "API key missing" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: userMessage }]
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ reply: "AI error (OpenAI)" });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server crashed" });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
