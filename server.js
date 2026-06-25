require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { users = [] } = require("./public/db/members.json");
const webPush = require("web-push");
const cron = require("node-cron");

const io = new Server(server);
const port = process.env.PORT || 7777;

webPush.setVapidDetails(
  process.env.VAPID_MAILTO,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 구독 정보 { endpoint, subscription } 형태로 저장
const subscriptions = [];
// 현재 접속 중인 소켓별 endpoint 추적
const activeEndpoints = new Set();

app.use(express.json());

let connectUser = 0;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 테스트용 푸시 발송 (dev 모드에서만)
if (process.env.OPEN_BROWSER === "true") {
  app.get("/test-push", (req, res) => {
    const type = req.query.type || "winner";
    let targets, body;
    if (type === "schedule") {
      targets = subscriptions.filter((s) => !activeEndpoints.has(s.endpoint));
      body = "🍽️ 추첨할 시간입니다! 사이트에 접속하세요.";
    } else if (type === "all") {
      targets = subscriptions;
      body = "🍽️ 추첨할 시간입니다! 사이트에 접속하세요.";
    } else {
      targets = subscriptions;
      body = "🎉 당첨: 홍길동 님";
    }
    notify(targets, { title: "Lucky Me [테스트]", body, icon: "/img/lucky-me-icon_120.png", url: "/" });
    res.json({ ok: true, type, sent: targets.length });
  });
}

// VAPID 공개키 전달 (클라이언트에서 구독 시 필요)
app.get("/vapid-public-key", (req, res) => {
  res.json({ key: process.env.VAPID_PUBLIC_KEY });
});

// 브라우저 푸시 구독 등록
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  const exists = subscriptions.some(
    (s) => s.endpoint === subscription.endpoint
  );
  if (!exists) subscriptions.push(subscription);
  res.status(201).json({ ok: true });
});

function notify(targets, payload) {
  targets.forEach((sub) =>
    webPush.sendNotification(sub, JSON.stringify(payload)).catch(() => {})
  );
}

// 당첨자 발표: 접속 중인 구독자에게만 발송
function sendWinnerNotification(winner) {
  const targets = subscriptions.filter((s) => activeEndpoints.has(s.endpoint));
  notify(targets, {
    title: "Lucky Me 추첨 결과",
    body: `🎉 당첨: ${winner} 님`,
    icon: "/img/lucky-me-icon_120.png",
    tag: "lucky-me-winner",
    url: "/",
  });
}

// 평일 오전 11시: 미접속 구독자에게만 발송
cron.schedule("0 11 * * 1-5", () => {
  const targets = subscriptions.filter((s) => !activeEndpoints.has(s.endpoint));
  notify(targets, {
    title: "Lucky Me",
    body: "🍽️ 추첨할 시간입니다! 사이트에 접속하세요.",
    icon: "/img/lucky-me-icon_120.png",
    tag: "lucky-me-schedule",
    url: "/",
  });
}, { timezone: "Asia/Seoul" });

let resultUser = users.length;
let counter = 0;

// public 정적 폴더 사용 (css, js적용)
app.use(express.static("public"));

io.on("connection", (socket) => {
  connectUser++;
  console.log("someone connected..", connectUser);
  const req = socket.request;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  var address = socket.handshake.address;
  console.log(address);
  console.log("클라이언트 연결 : ", ip, socket.id);

  // 클라이언트가 접속 시 자신의 push endpoint를 알려줌
  socket.on("push:online", (endpoint) => {
    if (endpoint) {
      socket.data.pushEndpoint = endpoint;
      activeEndpoints.add(endpoint);
    }
  });

  // 버튼 눌러 수동 추첨
  socket.on("set winner", (chosen) => {
    if (connectUser === resultUser) {
      counter++;
      io.emit("set winner", chosen);
      console.log(`당첨자${counter}: ${chosen}`);
      sendWinnerNotification(chosen);
    } else {
      io.emit("message", `접속자가 ${resultUser} 명이 되어야 추첨가능합니다.`);
    }
  });

  // 참여자 모두 접속시 자동 추첨
  socket.on("set winner auto", (chosen) => {
    if (connectUser === resultUser) {
      io.emit("set winner", chosen);
      sendWinnerNotification(chosen);
    }
  });

  socket.on("connectMsg", (msg) => {
    console.log(`connectMsg: ${msg}`);
    io.emit("message", msg + "_" + connectUser + "접속");
  });

  socket.on("sendMsg", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", (msg) => {
    if (connectUser > 0) connectUser--;
    console.log(`접속종료: ${msg}`);
    io.emit("message", "사용자 나감", msg);
    const endpoint = socket.data.pushEndpoint;
    if (endpoint) activeEndpoints.delete(endpoint);
  });
});

server.listen(port, () => {
  console.log("listening on port*: " + port);
  if (process.env.OPEN_BROWSER === "true") {
    const url = `http://localhost:${port}`;
    const cmd = process.platform === "win32" ? `start ${url}` : process.platform === "darwin" ? `open ${url}` : `xdg-open ${url}`;
    require("child_process").exec(cmd);
  }
});
