// 한솥 메뉴 리스트

// 메뉴 담을 배열
// 메뉴 json data: menuBowl, menuBox, menuNewSale, menuPremium, menuSide
let menuList = [];

menuBowl.subdata.forEach((sd) => {
  sd.goodsList.forEach((menu) => {
    menuList.push(menu);
  })
});
menuBox.subdata.forEach((sd) => {
  sd.goodsList.forEach((menu) => {
    menuList.push(menu);
  })
});
menuNewSale.subdata.forEach((sd) => {
  sd.goodsList.forEach((menu) => {
    menuList.push(menu);
  })
});
menuPremium.subdata.forEach((sd) => {
  sd.goodsList.forEach((menu) => {
    menuList.push(menu);
  })
});
menuSide.subdata.forEach((sd) => {
  sd.goodsList.forEach((menu) => {
    menuList.push(menu);
  })
});

let hasOpened = false;
// aside 열기/닫기 기능
const asideToggle = (e) => {
  e.target.classList.toggle("open");
  document.getElementById("aside").classList.toggle("open");
  // 메뉴 열린 적 없으면 메뉴 추천 기능 자동 실행
  if (!hasOpened) {
    !hasOpened;
    menuSuggestOnRenderAuto();
  }
};

// 메뉴 추천 기능 (재사용)
const menuSuggest = () => {
  document.getElementsByClassName("menu-name")[0].innerText = '메뉴추천중...';
  const menuIndex = Math.floor(Math.random() * menuList.length - 1);
  const suggestion = menuList[menuIndex];
  const categoryReg = /\[[ㄱ-ㅎ가-힣$]+\]\s*/g; // 행사, 반찬, 신메뉴 타이틀 제거

  let { title, price } = suggestion;
  
  if (String(price).length > 3) {
    price = String(suggestion.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  document.getElementsByClassName("menu-name")[0].innerText = title.replace(categoryReg, '');
  document.getElementsByClassName("menu-price")[0].innerText = price + "원";
  return suggestion;
};

// 버튼 클릭 시 메뉴 추천
const menuSuggestOnClick = (e) => {
  e.target.animate([{ transform: "rotate(630deg)" }], 200);
  menuSuggest();
};
// 접속 시 자동 메뉴 추천
const menuSuggestOnRenderAuto = () => {
  menuSuggest();
};
// aside 열기 버튼 클릭시 aside 열기/닫기 기능
document.getElementById("aside-toggle-button").addEventListener("click", asideToggle);
// menu reload 버튼 클릭시 메뉴 재추천
document.getElementById("menu-reload-button").addEventListener("click", menuSuggestOnClick);
