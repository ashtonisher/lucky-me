const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
// logger
const logger = require("./public/winston");

const io = new Server(server);
const port = process.env.PORT;
// const uuidv4 = require("uuid/v4");

// logger.info(`당첨자${counter}: ${chosen}`);
// logger.error('Get index error');


/** postgres connect */
// const { Client } = require("pg");
// const client = new Client({
//   // connectionString: 'postgres://lucky_me:oCeMhu3aoTIffeA@top2.nearest.of.lucky-me-users.internal:5432/lucky_me?sslmode=disable'
//   user: 'postgres',
//   host: 'lucky-me-users.internal',
//   database: 'lucky_me',
//   password: 'oCeMhu3aoTIffeA',
//   port: 5432,
//   idleTimeoutMillis: 0,
//   connectionTimeoutMillis: 0,
// });
// client.connect();
// console.log(client.host)
// const credentials = {
//   user: "postgres",
//   host: "localhost",
//   password: "E6ktFxVejqrIyfM",
//   database: "lucky-me",
//   port: 5432,
// };
// async function poolDemo() {
//   const pool = new Pool(credentials);
//   const now = await pool.query("SELECT NOW()");
//   await pool.end();

//   return now;
// }
// async function clientDemo() {
//   const client = new Client(credentials);
//   await client.connect(err => {
//     if (err) {
//       console.error('connection error', err.stack)
//     } else {
//       console.log('success!')
//     }
//   });
//   const now = await client.query("SELECT NOW()");
//   await client.end();

//   return now;
// }

// Use a self-calling function so we can use async / await.

// (async () => {
//   const poolResult = await poolDemo();
//   console.log("Time with pool: " + poolResult.rows[0]["now"]);

//   const clientResult = await clientDemo();
//   console.log("Time with client: " + clientResult.rows[0]["now"]);
// })();

  // client.connect();

  // console.log(client.connect())

// async () => {
//   console.log(client)

//   await client.connect();
//   // client.query("SELECT NOW()", (err, res) => {
//   //   console.log(err, res);
//   //   client.end();
//   // });
//   const res = await client.query('SELECT $1::text as message', ['Hello world!']);
//   console.log(res.rows[0].message); // Hello world!
  
//   await client.end();
// }


let users;
let connectUser = 0;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  if(!!req.query.users) {
    // console.log(req.query.users);
    users = req.query.users;
  }
});

// let resultUser;
let resultUser = 5;
let counter = 0;

// public 정적 폴더 사용 (css, js적용)
app.use(express.static("public"));

io.on("connection", (socket) => {

  connectUser++;
  console.log("someone connected..", connectUser);
  const req = socket.request;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  var address = socket.handshake.address;
  console.log(address);
  console.log('클라이언트 연결 : ', ip, socket.id);

  // 버튼 눌러 수동 추첨
  socket.on("set winner", (chosen) => {
    if (connectUser === resultUser) {
      counter++;
      io.emit("set winner", chosen);
      console.log(`당첨자${counter}: ${chosen}`);
      logger.info(`당첨자${counter}: ${chosen}`);
      
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
  });}
);

server.listen(port, () => {
  console.log("listening on port*: " + port);
});
