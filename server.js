// Tiny local server, only for testing on this PC (npm start → http://localhost:5173).
// Why a server: browsers block JS modules (import ...) when a page is opened as a file.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT) || 5173;
const ROOT = process.cwd();
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL("http://x" + req.url).pathname);
  const file = normalize(join(ROOT, path === "/" ? "index.html" : path));
  // Never serve files outside the project folder
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(PORT, () => console.log(`Laptop Bishkek: http://localhost:${PORT}`));
