import express from "express";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.render("chat");
});

app.post("/api/chat", async (req, res) => {
  console.log(process.env.systemInstruction);
  try {
    const { query, history } = req.body;
    console.log(history, query);

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: process.env.systemInstruction,
      },
      history: history,
    });

    const response1 = await chat.sendMessage({
      message: query,
    });
    res.send({ status: 1, reply: response1.text });
  } catch (err) {
    console.error(err);
    res.send({ status: 0, reply: "Error fetching AI response" });
  }
});

app.listen(3000, () => {
  console.log("server running");
});