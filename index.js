const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

const config = require("./server/config/keys");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/dialogflow", require("./server/routes/dialogflow"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  const proxyMiddleware = createProxyMiddleware({
    target: "http://localhost:5000", // 프록시 대상 주소
    changeOrigin: true, // 필요시 프록시의 속성을 변경합니다.
    pathRewrite: { "^/api": "/" }, // 경로 재작성 설정
  });
  // 이전에 사용되던 옵션들은 더 이상 사용되지 않으므로 제거됩니다.
  app.use("/api", proxyMiddleware);
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
