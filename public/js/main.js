const { users } = await fetch("db/members.json").then((res) => res.json());

var socket = io();

// 점심 추첨 대상자만 별도로 관리
const lunchMate = users.filter((user) => user.isLunch);
const userLength = lunchMate.length;

// aside의 멤버 체크리스트를 members.json 기준으로 렌더링
const renderMemberList = () => {
  const memberList = document.querySelector(".member-list");
  if (!memberList) return;

  memberList.innerHTML = "";
  users.forEach((user, idx) => {
    const memberId = `member${String(idx + 1).padStart(2, "0")}`;
    const li = document.createElement("li");
    const input = document.createElement("input");
    const label = document.createElement("label");

    input.id = memberId;
    input.type = "checkbox";
    input.checked = Boolean(user.isLunch);
    label.setAttribute("for", memberId);
    label.innerText = user.name;

    li.appendChild(input);
    li.appendChild(label);
    memberList.appendChild(li);
  });
};

// 당첨 문구에 붙는 팀 내 호칭
const callSign = "님";
// 화면 상단 날짜 표시용 값
const month = new Date().getMonth();
const date = new Date().getDate();
const dayIdx = new Date().getDay();
let dayOfWeek = "~Yo~";

// 요일 변환
switch (dayIdx) {
  case 1:
    dayOfWeek = "월요일";
    break;
  case 2:
    dayOfWeek = "화요일";
    break;
  case 3:
    dayOfWeek = "수요일";
    break;
  case 4:
    dayOfWeek = "목요일";
    break;
  case 5:
    dayOfWeek = "금요일";
    break;
  default:
    dayOfWeek = "주말";
    break;
}

document.getElementById("today").innerText = `${
  month + 1
}월 ${date}일 ${dayOfWeek}`;
// 멤버 목록 렌더링
renderMemberList();

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

// 접속 시 서버에 사용자 입장 메시지 전송
socket.emit("socket");
socket.emit("connectMsg", "사용자");

// 랜덤 당첨자 뽑기 기능 (재사용함수)
const roulette = () => {
  // 0 ~ (userLength - 1) 사이 인덱스 생성
  const chosenNum = Math.floor(Math.random() * userLength);
  const winner = lunchMate.filter((user, idx) => idx === chosenNum);
  const chosen = winner[0].name;
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
document
  .getElementById("roulette-button")
  .addEventListener("click", rouletteOnClick);

// 참여자 모두 접속 시(렌더링) 자동 추첨 진행
window.onload = rouletteOnRenderAuto;

// set winner 이벤트 받으면 실행
socket.on("set winner", (chosen) => {
  // 로그 표기 시간을 HH:mm 형식으로 생성
  const todayLog = new Date();
  const hour =
    todayLog.getHours() < 10 ? `0${todayLog.getHours()}` : todayLog.getHours();
  const minutes =
    todayLog.getMinutes() < 10
      ? `0${todayLog.getMinutes()}`
      : todayLog.getMinutes();
  // 당첨자 표시 및 로그 기록 추가
  document.getElementById("winner").innerText = `🎉당첨: ${chosen} ${callSign}`;
  var newLog = document.createElement("li");
  newLog.className = "log";
  newLog.innerHTML = `당첨자: ${chosen}M <span>(${hour}:${minutes})</span>`;
  document.getElementById("log-list").appendChild(newLog);
});

// message 이벤트 받으면 실행
socket.on("message", (msg) => {
  // 서버 메시지를 같은 로그 영역에 시간과 함께 누적
  const todayLog = new Date();
  const hour =
    todayLog.getHours() < 10 ? `0${todayLog.getHours()}` : todayLog.getHours();
  const minutes =
    todayLog.getMinutes() < 10
      ? `0${todayLog.getMinutes()}`
      : todayLog.getMinutes();

  var newLog = document.createElement("li");
  newLog.className = "log";
  newLog.innerHTML = `${msg} <span>(${hour}:${minutes})</span>`;
  document.getElementById("log-list").appendChild(newLog);
});
