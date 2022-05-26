const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// const port = process.env.PORT;
const port = 8080;

let connectUser = 0;
let resultUser = 6;
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// public 정적 폴더 사용 (css, js적용)
app.use(express.static("public"));

io.on("connection", (socket) => {
  connectUser++;
  console.log("someone connected..", connectUser);


  /* ---- 코드 수정 시작 ---- */

  // 버튼 눌러 수동 추첨
  socket.on("set winner", (chosen) => {
    if (connectUser === resultUser) {
      io.emit("set winner", chosen);
    } else {
      io.emit("message", `접속자가 ${resultUser} 명이 되어야 추첨가능합니다.`);
    }
  });

  // 참여자 모두 접속시 자동 추첨
  socket.on("set winner auto", (chosen) => {
    if (connectUser === resultUser) {
      io.emit("set winner", chosen);
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
  });
});

server.listen(port, () => {
  console.log("listening on port*: " + port);
});
