var socket = io();

if('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/serviceWorker.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
var isNotificationSupported = 'Notification' in window;

if (isNotificationSupported)
{
    Notification.requestPermission().then(function (result)
    {
        if (result === 'granted')
        {
            console.log('[Notification] 허용: ', result);
        }
        else
        {
            console.log('[Notification] 차단: ', result);
        }
    });
}

// 멤버 리스트 배열
// const lunchMate = [
//   { name: "강경일", id: 1, isLunch: true },
//   { name: "강영서", id: 2, isLunch: true },
//   { name: "이승재", id: 3, isLunch: true },
//   { name: "이진희", id: 4, isLunch: true },
//   { name: "임준수", id: 5, isLunch: true },
//   { name: "장민우", id: 6, isLunch: true },
//   { name: "최경환", id: 7, isLunch: true }
// ];
let lunchMate = JSON.parse(JSON.stringify(members)).users;

// 팀 내 호칭
const callSign = '매니저';
//날짜 표시 기능
const todayStatic = new Date();
const month = todayStatic.getMonth();
const date = todayStatic.getDate();
let dayOfWeek = '토요일';

// 요일 변환
const day = () => {
  switch (todayStatic.getDay()) {
    case 1: dayOfWeek = "월요일"; break;
    case 2: dayOfWeek = "화요일"; break;
    case 3: dayOfWeek = "수요일"; break;
    case 4: dayOfWeek = "목요일"; break;
    case 5: dayOfWeek = "금요일"; break;
    default: dayOfWeek = "주말"; break;
  }
};
document.getElementById("today").innerText = `${month + 1}월 ${date}일 ${dayOfWeek}`;

// notification
// const sendNotification = () => {
//   let weekDayNum = todayStatic.getDay()
//   if (weekDayNum > 2 && weekDayNum < 6) {
//     const noti = new Notification('Lucky Me (추첨기)', {
//       body: '식사 추첨 시간입니다!',
//       icon: 'img/lucky-me-icon_120.png',
//       data: { link: 'https://lucky-me.fly.dev/' },
//     });
//     noti.onclick = (e) => {
//       e.preventDefault();
//       window.open(noti.data.link)
//     };
//   }
// }

/** socket */
socket.emit("socket");
socket.emit("connectMsg", "사용자");

// 랜덤 당첨자 뽑기 기능 (재사용함수)
const roulette = () => {
  // 랜덤 번호와 id 비교
  const chosenNum = Math.floor(Math.random() * lunchMate.length) + 1;
  const winner = lunchMate.filter((user) => user.id === chosenNum);

  const chosen = winner[0].name;
  // 소켓: 클라이언트 객체
  // 소켓이 set winner 이벤트를 보냄
  return chosen;
};

// 클릭 시 roulette 실행
const rouletteOnClick = () => {
  const chosen = roulette();
  // 클릭 시 발생하는 이벤트 명 set winner
  socket.emit("set winner", chosen);
};

// 참여자 모두 접속 시 roulette 자동 실행
const rouletteOnRenderAuto = () => {
  const chosen = roulette();
  // 참여자 접속 시 발생하는 이벤트 명 set winner auto
  socket.emit("set winner auto", chosen);
};

// 버튼 클릭시 추첨 진행
document.getElementById("roulette-button").addEventListener("click", rouletteOnClick);

// 참여자 모두 접속 시(렌더링) 자동 추첨 진행
window.onload = rouletteOnRenderAuto;

// set winner 이벤트 받으면 실행
socket.on("set winner", (chosen) => {
    const todayLog = new Date();
    const hour = todayLog.getHours() < 10 ? `0${todayLog.getHours()}` : todayLog.getHours();
    const minutes = todayLog.getMinutes() < 10 ? `0${todayLog.getMinutes()}` : todayLog.getMinutes();
    // 당첨자 표시 및 로그 기록 추가
    document.getElementById("winner").innerText = `🎉당첨: ${chosen} ${callSign}님`;
    var newLog = document.createElement("li");
    newLog.className = "log";
    newLog.innerHTML = `당첨자: ${chosen}M <span>(${hour}:${minutes})</span>`;
    document.getElementById("log-list").appendChild(newLog);    
});

// message 이벤트 받으면 실행
socket.on("message", (msg) => {
  console.log(msg);
  const todayLog = new Date();
  const hour = todayLog.getHours() < 10 ? `0${todayLog.getHours()}` : todayLog.getHours();
  const minutes = todayLog.getMinutes() < 10 ? `0${todayLog.getMinutes()}` : todayLog.getMinutes();

  var newLog = document.createElement("li");
  newLog.className = "log";
  newLog.innerHTML = `${msg} <span>(${hour}:${minutes})</span>`;
  document.getElementById("log-list").appendChild(newLog);
});
