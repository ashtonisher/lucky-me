var socket = io();

socket.on("hmr:reload", () => location.reload());

// ── 이름 ──────────────────────────────────────────────
const NICKNAME_KEY = "lucky-me-name";
const myNicknameEl = document.getElementById("my-nickname");
const nicknameFloatingEl = document.getElementById("nickname-floating");
const nicknameErrorEl = document.getElementById("nickname-error");
const nicknameConfirmBtn = document.getElementById("nickname-confirm");

let serverDefaultName = "";

const applyNickname = (name) => {
  myNicknameEl.textContent = name;
  nicknameFloatingEl.textContent = `👤 ${name}`;
};

const NICKNAME_HINT = "사용할 이름을 입력하세요";

const closeNicknameModal = () => {
  document.getElementById("nickname-modal").style.display = "none";
  nicknameErrorEl.textContent = NICKNAME_HINT;
  nicknameErrorEl.style.color = "";
  if (!myNicknameEl.textContent) applyNickname(serverDefaultName);
};

const openNicknameModal = () => {
  const current =
    myNicknameEl.textContent || sessionStorage.getItem(NICKNAME_KEY) || "";
  const input = document.getElementById("nickname-input");
  input.value = current;
  nicknameErrorEl.textContent = NICKNAME_HINT;
  nicknameErrorEl.style.color = "";
  nicknameConfirmBtn.disabled = !current.trim();
  document.getElementById("nickname-modal").style.display = "flex";
  input.focus();
};

const confirmNickname = () => {
  const input = document.getElementById("nickname-input").value.trim();
  if (!input) return;
  socket.emit("set:nickname", input, (res) => {
    if (!res.ok) {
      nicknameErrorEl.textContent = res.message;
      nicknameErrorEl.style.color = "#ff2300";
      return;
    }
    sessionStorage.setItem(NICKNAME_KEY, input);
    applyNickname(input);
    closeNicknameModal();
  });
};

const initNickname = () => {
  const saved = sessionStorage.getItem(NICKNAME_KEY);
  if (saved) {
    socket.emit("set:nickname", saved, (res) => {
      if (res.ok) applyNickname(saved);
      else openNicknameModal();
    });
    return;
  }
  applyNickname(serverDefaultName);
  openNicknameModal();
};

nicknameConfirmBtn.addEventListener("click", confirmNickname);
document.getElementById("nickname-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") confirmNickname();
});
document.getElementById("nickname-input").addEventListener("input", (e) => {
  nicknameErrorEl.textContent = NICKNAME_HINT;
  nicknameErrorEl.style.color = "";
  nicknameConfirmBtn.disabled = !e.target.value.trim();
});
document
  .getElementById("nickname-random")
  .addEventListener("click", async () => {
    const { name } = await fetch("/random-nickname").then((r) => r.json());
    const input = document.getElementById("nickname-input");
    input.value = name;
    nicknameConfirmBtn.disabled = false;
    nicknameErrorEl.textContent = NICKNAME_HINT;
    nicknameErrorEl.style.color = "";
  });
document
  .getElementById("nickname-close")
  .addEventListener("click", closeNicknameModal);
document
  .getElementById("nickname-edit-button")
  .addEventListener("click", openNicknameModal);

socket.on("init:nickname", (defaultName) => {
  serverDefaultName = defaultName;
  if (!myNicknameEl.textContent) myNicknameEl.textContent = defaultName;
  initNickname();
});

// ── 접속자 목록 ──────────────────────────────────────────
socket.on("users:update", ({ count, users: nicknames }) => {
  document.getElementById("connected-count").textContent = count;
  const list = document.getElementById("connected-list");
  list.innerHTML = "";
  nicknames.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
});

// ── 날짜 표시 ────────────────────────────────────────────
const now = new Date();
const dayNames = [
  "주말",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "주말",
];
const todayStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${dayNames[now.getDay()]}`;
document.getElementById("today").innerText = todayStr;

const dateLi = document.createElement("li");
dateLi.className = "log log-date";
dateLi.textContent = todayStr;
document.getElementById("log-list").appendChild(dateLi);

// ── 참여자 수 조절 ───────────────────────────────────────
let currentResultUser = 5;
const participantCountEl = document.getElementById("participant-count");
const updateParticipantDisplay = () => {
  participantCountEl.textContent = `참여: ${currentResultUser}명`;
};
updateParticipantDisplay();

document.getElementById("participant-minus").addEventListener("click", () => {
  if (currentResultUser > 1) {
    currentResultUser--;
    updateParticipantDisplay();
    socket.emit("set:resultUser", currentResultUser);
  }
});
document.getElementById("participant-plus").addEventListener("click", () => {
  currentResultUser++;
  updateParticipantDisplay();
  socket.emit("set:resultUser", currentResultUser);
});

socket.on("resultUser:updated", (count) => {
  currentResultUser = count;
  updateParticipantDisplay();
});

// ── 추첨 ─────────────────────────────────────────────────
const roulette = () => Math.floor(Math.random() * currentResultUser) + 1;

document.getElementById("roulette-button").addEventListener("click", () => {
  socket.emit("set winner", roulette());
});

window.onload = () => socket.emit("set winner auto", roulette());

socket.emit("connectMsg", "사용자");

socket.on("set winner", (chosen) => {
  const t = new Date();
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  document.getElementById("winner").innerText = `🎉 당첨: ${chosen}번`;
  const li = document.createElement("li");
  li.className = "log";
  li.innerHTML = `당첨: ${chosen}번 <span>${hh}:${mm}</span>`;
  document.getElementById("log-list").appendChild(li);
});

socket.on("message", (msg) => {
  const t = new Date();
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  const li = document.createElement("li");
  li.className = "log";
  li.innerHTML = `${msg} <span>${hh}:${mm}</span>`;
  document.getElementById("log-list").appendChild(li);
});

// ── 채팅 ─────────────────────────────────────────────────
const logList = document.getElementById("log-list");

const appendChatMessage = ({ name, text, from }) => {
  const t = new Date();
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  const li = document.createElement("li");
  const isMine = from === socket.id;
  li.className = `log chat-message ${isMine ? "chat-mine" : "chat-other"}`;
  const displayName = isMine ? "나" : name;
  li.innerHTML = `<span class="chat-name">${displayName}</span><span class="chat-text">${text}</span><span class="chat-time">${hh}:${mm}</span>`;
  logList.appendChild(li);
  logList.scrollTop = logList.scrollHeight;
};

socket.on("chat:message", appendChatMessage);

const sendChat = () => {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;
  socket.emit("chat:send", text);
  input.value = "";
};

document.getElementById("chat-send").addEventListener("click", sendChat);
document.getElementById("chat-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendChat();
});

// ── 서비스워커 / 푸시 구독 ────────────────────────────────
const notifyToggleBtn = document.getElementById("notify-toggle");
const notifyLabel = document.getElementById("notify-label");

let toastTimer = null;
const showToast = (msg) => {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
};

const setNotifyUI = (on, pending = false) => {
  notifyToggleBtn.classList.toggle("on", on);
  notifyToggleBtn.style.opacity = pending ? "0.5" : "";
  notifyLabel.textContent = pending ? "처리 중..." : on ? "켜짐" : "꺼짐";
};

let swReg = null;
let isSubscribed = false;
let notifyPending = false;

const initServiceWorker = async () => {
  if (!("serviceWorker" in navigator && "PushManager" in window)) return;
  swReg = await navigator.serviceWorker.register("/serviceWorker.js");
  const sub = await swReg.pushManager.getSubscription();
  if (sub) {
    isSubscribed = true;
    setNotifyUI(true);
    socket.emit("push:online", sub.endpoint);
  }
};

const enableNotify = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") { setNotifyUI(false); isSubscribed = false; return; }
  let sub = await swReg.pushManager.getSubscription();
  if (!sub) {
    const { key } = await fetch("/vapid-public-key").then((r) => r.json());
    sub = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    });
  }
  await fetch("/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });
  socket.emit("push:online", sub.endpoint);
  isSubscribed = true;
};

const disableNotify = async () => {
  const sub = await swReg.pushManager.getSubscription();
  if (sub) await sub.unsubscribe();
  isSubscribed = false;
};

notifyToggleBtn.addEventListener("click", async () => {
  if (!swReg || notifyPending) return;
  if (Notification.permission === "denied") {
    alert("알림이 차단되어 있습니다.\n브라우저 설정에서 이 사이트의 알림을 허용해주세요.");
    return;
  }
  notifyPending = true;
  const wasSubscribed = isSubscribed;
  setNotifyUI(!wasSubscribed, true);
  if (wasSubscribed) {
    await disableNotify();
    setNotifyUI(false);
    showToast("알림이 꺼졌습니다");
  } else {
    await enableNotify();
    setNotifyUI(isSubscribed);
    showToast(isSubscribed ? "알림이 켜졌습니다" : "알림 설정에 실패했습니다");
  }
  notifyPending = false;
});

initServiceWorker();

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
