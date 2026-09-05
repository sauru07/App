import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { config } from "./config";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.get("/health", (_req,res)=>res.json({ok:true, service:"chatx"}));
app.use("/api/v1", routes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", ws => {
  ws.send(JSON.stringify({ type:"connected", serverTime:new Date().toISOString() }));
  ws.on("message", raw => {
    // Production: authenticate the socket, authorize chat membership,
    // validate event schema, persist idempotently, then fan out.
    try {
      const event = JSON.parse(raw.toString());
      if (event.type === "ping") ws.send(JSON.stringify({type:"pong"}));
    } catch {}
  });
});

server.listen(config.port, ()=>console.log(`ChatX API listening on :${config.port}`));
