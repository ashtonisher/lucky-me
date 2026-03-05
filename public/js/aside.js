// 한솥 메뉴 리스트
const menuList = [];
const loadMenuList = async () => {
  const menu = await fetch("db/menu.json").then((res) => res.json());
  menu.forEach(({ subdata }) => {
    subdata.forEach(({ goodsList }) => {
      goodsList.forEach((data) => {
        menuList.push(data);
      });
    });
  });
};

let hasOpened = false;
// aside 열기/닫기 기능
const asideToggle = (e) => {
  e.target.classList.toggle("open");
  document.getElementById("aside").classList.toggle("open");
  // 메뉴 열린 적 없으면 메뉴 추천 기능 자동 실행
  if (!hasOpened) {
    hasOpened = true;
    menuSuggest();
  }
};

// 메뉴 추천 기능
const menuSuggest = () => {
  if (!menuList.length) {
    document.getElementsByClassName("menu-name")[0].innerText =
      "메뉴를 불러오지 못했습니다";
    document.getElementsByClassName("menu-price")[0].innerText = "-";
    return null;
  }

  document.getElementsByClassName("menu-name")[0].innerText = "메뉴추천중...";
  const menuIndex = Math.floor(Math.random() * menuList.length - 1);
  const suggestion = menuList[menuIndex];
  const categoryReg = /\[[ㄱ-ㅎ가-힣$]+\]\s*/g; // [행사], [반찬], [신메뉴] 등 카테고리 제거

  let { title, price } = suggestion;

  if (String(price).length > 3) {
    price = String(suggestion.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  document.getElementsByClassName("menu-name")[0].innerText = title.replace(
    categoryReg,
    ""
  );
  document.getElementsByClassName("menu-price")[0].innerText = price + "원";
  return suggestion;
};

// 버튼 클릭 시 메뉴 추천
const menuSuggestOnClick = (e) => {
  e.target.animate([{ transform: "rotate(630deg)" }], 200);
  menuSuggest();
};

// aside 열기 버튼 클릭시 aside 열기/닫기 기능
const initAside = async () => {
  try {
    await loadMenuList();
  } catch (error) {
    console.error("메뉴 데이터 로딩 실패:", error);
  }

  document
    .getElementById("aside-toggle-button")
    .addEventListener("click", asideToggle);
  // menu reload 버튼 클릭시 메뉴 재추천
  document
    .getElementById("menu-reload-button")
    .addEventListener("click", menuSuggestOnClick);
};

initAside();
