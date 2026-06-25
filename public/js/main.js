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

// 서비스워커 등록 및 푸시 구독
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/serviceWorker.js').then(async (swReg) => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    let subscription = await swReg.pushManager.getSubscription();
    if (!subscription) {
      const { key } = await fetch('/vapid-public-key').then((r) => r.json());
      subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });
    }

    // 서버 재시작 시 구독 목록이 초기화되므로 접속마다 전달
    await fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    // 현재 접속 중임을 서버에 알림
    socket.emit('push:online', subscription.endpoint);
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

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
