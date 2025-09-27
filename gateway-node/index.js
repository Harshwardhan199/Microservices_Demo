// gateway/index.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = 8080;

// ✅ Default route (like your nginx / )
app.get("/", (req, res) => {
  res.type("text/plain").send("Express Gateway is running and active!");
});

// ✅ Auth Service routes
app.use(
  "/register",
  createProxyMiddleware({
    target: "http://127.0.0.1:8001",
    changeOrigin: true,
    pathRewrite: { "^/register": "/api/auth/register" },
  })
);

app.use(
  "/login",
  createProxyMiddleware({
    target: "http://127.0.0.1:8001",
    changeOrigin: true,
    pathRewrite: { "^/login": "/api/auth/login" },
  })
);

// ✅ Data Service route
app.use(
  "/getData",
  createProxyMiddleware({
    target: "http://127.0.0.1:8002",
    changeOrigin: true,
    pathRewrite: { "^/getData": "/api/users/getData" },
  })
);

app.listen(PORT, () => {
  console.log(`🚀 Express Gateway running at http://127.0.0.1:${PORT}`);
});
