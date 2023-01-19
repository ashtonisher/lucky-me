var socket = io();

// if('serviceWorker' in navigator && 'PushManager' in window) {
//   navigator.serviceWorker.register('/serviceWorker.js')
//   .then(function(swReg) {
//     console.log('Service Worker is registered', swReg);

//   })
//   .catch(function(error) {
//     console.error('Service Worker Error', error);
//   });
// } else {
//   console.warn('Push messaging is not supported');
//   pushButton.textContent = 'Push Not Supported';
// }
// var isNotificationSupported = 'Notification' in window;

// if (isNotificationSupported)
// {
//     Notification.requestPermission().then(function (result)
//     {
//         if (result === 'granted')
//         {
//             console.log('[Notification] 허용: ', result);
//         }
//         else
//         {
//             console.log('[Notification] 차단: ', result);
//         }
//     });
// }


let lunchMate = JSON.parse(JSON.stringify(members)).users;
const userLength = lunchMate.filter((user) => {return user.isLunch}).length;

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json; text/plain; charset=UTF-8',
  },
};


async() => {
  try {
    return await axios.get('/',{
      params: {
        users: lunchMate,
      },
    }, config);
  } catch(e) { console.log(e); }
}

// 배열 원소 무작위 정렬
let randomize = [...lunchMate].sort(() => Math.random() - 0.5);
// console.log(randomize);
 
// 팀 내 호칭
const callSign = '매니저';
//날짜 표시 기능
const todayDate = new Date();
const month = todayDate.getMonth();
const date = todayDate.getDate();
let dayOfWeek = '토요일';

// 요일 변환
switch (todayDate.getDay()) {
  case 1: dayOfWeek = "월요일"; break;
  case 2: dayOfWeek = "화요일"; break;
  case 3: dayOfWeek = "수요일"; break;
  case 4: dayOfWeek = "목요일"; break;
  case 5: dayOfWeek = "금요일"; break;
  default: dayOfWeek = "주말"; break;
}

document.getElementById("today").innerText = `${month + 1}월 ${date}일 ${dayOfWeek}`;

// notification
// const sendNotification = () => {
//   let weekDayNum = todayDate.getDay()
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
  const chosenNum = Math.floor(Math.random() * userLength);
  const winner = lunchMate.filter((user, idx) => idx === chosenNum);
  console.log(chosenNum)
  console.log(winner)
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
  const todayLog = new Date();
  const hour = todayLog.getHours() < 10 ? `0${todayLog.getHours()}` : todayLog.getHours();
  const minutes = todayLog.getMinutes() < 10 ? `0${todayLog.getMinutes()}` : todayLog.getMinutes();

  var newLog = document.createElement("li");
  newLog.className = "log";
  newLog.innerHTML = `${msg} <span>(${hour}:${minutes})</span>`;
  document.getElementById("log-list").appendChild(newLog);
});
