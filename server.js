/**
 * Localhost sample for the all-student English-program directory.
 * Run: node server.js
 * Open: http://127.0.0.1:3477
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 3477;
const SAMPLE_ROOT = __dirname;
const SITE_ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".svg"]);
const encodedCache = new Map();
const CATALOGUE_FILES = [
  path.join(SAMPLE_ROOT, "data", "indexes", "numbeo-2026.json"),
  path.join(SAMPLE_ROOT, "data", "places.json"),
  path.join(SAMPLE_ROOT, "data", "schools.json"),
];
let catalogueCache = null;

function catalogueBundle() {
  const stats = CATALOGUE_FILES.map((file) => fs.statSync(file));
  const stamp = stats.map((stat, i) => `${CATALOGUE_FILES[i]}:${stat.mtimeMs}:${stat.size}`).join("|");
  if (catalogueCache?.stamp === stamp) return catalogueCache;
  const [numbeo, places, schools] = CATALOGUE_FILES.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const body = Buffer.from(JSON.stringify({ numbeo, places, schools }));
  catalogueCache = {
    stamp,
    body,
    mtimeMs: Math.max(...stats.map((stat) => stat.mtimeMs)),
    size: body.length,
  };
  return catalogueCache;
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const relative = decoded === "/"
    ? "/index.html"
    : (decoded === "/painted" ? "/painted.html"
      : (decoded === "/classic" ? "/classic.html" : decoded));

  if (relative === "/styles.css") {
    return path.join(SITE_ROOT, "styles.css");
  }
  if (relative.startsWith("/assets/")) {
    return path.join(SITE_ROOT, relative.slice(1));
  }

  const fromSample = path.normalize(path.join(SAMPLE_ROOT, relative));
  if (fromSample.startsWith(SAMPLE_ROOT)) {
    return fromSample;
  }
  return null;
}

function cacheControlFor(ext) {
  if (ext === ".html") return "public, max-age=120";
  if (ext === ".js" || ext === ".css") return "public, max-age=3600";
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".svg" || ext === ".ico" || ext === ".woff2") {
    return "public, max-age=86400";
  }
  return "public, max-age=300";
}

function negotiateEncoding(header, ext) {
  if (!COMPRESSIBLE.has(ext)) return "";
  const ae = String(header || "").toLowerCase();
  if (/\bbr\b/.test(ae)) return "br";
  if (/\bgzip\b/.test(ae)) return "gzip";
  return "";
}

function encodeBody(filePath, mtimeMs, data, encoding) {
  if (!encoding) return data;
  const key = `${filePath}\0${mtimeMs}\0${encoding}\0${data.length}`;
  const hit = encodedCache.get(key);
  if (hit) return hit;
  const out = encoding === "br"
    ? zlib.brotliCompressSync(data)
    : zlib.gzipSync(data);
  encodedCache.set(key, out);
  if (encodedCache.size > 80) {
    const first = encodedCache.keys().next().value;
    encodedCache.delete(first);
  }
  return out;
}

function send(res, status, headers, body, method) {
  res.writeHead(status, headers);
  if (method === "HEAD" || body == null) {
    res.end();
    return;
  }
  res.end(body);
}

const server = http.createServer((req, res) => {
  const method = req.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end("Method not allowed");
    return;
  }

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/catalogue.json") {
    let bundle;
    try {
      bundle = catalogueBundle();
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Catalogue data missing. Run: node scripts/build-catalogue.js");
      return;
    }
    const encoding = negotiateEncoding(req.headers["accept-encoding"], ".json");
    const etag = `"cat-${bundle.size.toString(16)}-${Math.floor(bundle.mtimeMs).toString(16)}${encoding ? "-" + encoding : ""}"`;
    const headers = {
      "Content-Type": MIME[".json"],
      "Cache-Control": "public, max-age=300",
      ETag: etag,
      "Last-Modified": new Date(bundle.mtimeMs).toUTCString(),
      Vary: "Accept-Encoding",
    };
    if (req.headers["if-none-match"] === etag) {
      send(res, 304, headers, null, method);
      return;
    }
    const body = encodeBody("catalogue.json", bundle.mtimeMs, bundle.body, encoding);
    if (encoding) headers["Content-Encoding"] = encoding;
    headers["Content-Length"] = body.length;
    send(res, 200, headers, body, method);
    return;
  }

  const filePath = resolveFile(req.url);
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const encoding = negotiateEncoding(req.headers["accept-encoding"], ext);
    const etag = `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}${encoding ? "-" + encoding : ""}"`;
    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": cacheControlFor(ext),
      ETag: etag,
      "Last-Modified": stat.mtime.toUTCString(),
    };
    if (COMPRESSIBLE.has(ext)) headers.Vary = "Accept-Encoding";

    if (req.headers["if-none-match"] === etag) {
      send(res, 304, headers, null, method);
      return;
    }
    const since = Date.parse(req.headers["if-modified-since"] || "");
    if (!req.headers["if-none-match"] && Number.isFinite(since) && Math.floor(stat.mtimeMs / 1000) <= Math.floor(since / 1000)) {
      send(res, 304, headers, null, method);
      return;
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const body = encodeBody(filePath, stat.mtimeMs, data, encoding);
      if (encoding) headers["Content-Encoding"] = encoding;
      headers["Content-Length"] = body.length;
      send(res, 200, headers, body, method);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Globaria: http://${HOST}:${PORT}`);
  console.log("Localhost only. Europe, Asia, Middle East, Latin America, Africa, Oceania.");
});
