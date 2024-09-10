import {onRequest} from "firebase-functions/v2/https";
import * as express from "express";
import {join} from "path";
import {readFileSync} from "fs";
import {createServer} from "http";

const app = express();
const server = createServer(app);

app.use(express.static(join(__dirname, "browser")));
app.get("/*", (req, res) => {
  const indexHtml = readFileSync(join(__dirname, "browser", "index.html")).toString();
  res.send(indexHtml);
});

export const ssr = onRequest({
  region: "us-central1",
  cors: true,
}, (req, res) => {
  server.emit("request", req, res);
});
