// 한솥 메뉴 리스트
const menulist = [
  { name: "1993 왕돈까스 도시락", price: 9300 },
  { name: "나시고랭 콤보", price: 6800 },
  { name: "나시고랭", price: 6000 },
  { name: "한입 족발 도시락", price: 8500 },
  { name: "한입 불족발 도시락", price: 8500 },
  { name: "토네이도 소세지 파스타", price: 5500 },
  { name: "트리플 치즈 파스타", price: 5500 },
  { name: "토마토 미트 파스타", price: 4500 },
  { name: "돈까스도련님고기고기", price: 5800 },
  { name: "탕수육도련님고기고기", price: 5800 },
  { name: "새치고기고기", price: 6200 },
  { name: "돈치고기고기", price: 5400 },
  { name: "숯불직화구이", price: 6500 },
  { name: "소불고기", price: 5000 },
  { name: "메가치킨제육", price: 7000 },
  { name: "칠리 찹쌀탕수육도련님", price: 4200 },
  { name: "동백", price: 5500 },
  { name: "치킨제육", price: 4500 },
  { name: "돈까스도련님", price: 4200 },
  { name: "제육볶음", price: 4100 },
  { name: "돈치스팸", price: 4700 },
  { name: "제육 김치찌개 정식", price: 8200 },
  { name: "제육 김치 부대찌개 정식", price: 8500 },
  { name: "돈치스팸 김치 부대찌개 정식", price: 8500 },
  { name: "빅치킨마요 김치 부대찌개 정식", price: 7400 },
  { name: "치킨마요 김치 부대찌개 정식", price: 6800 },
  { name: "돈치스팸 김치찌개 정식", price: 8200 },
  { name: "빅치킨마요 김치찌개 정식", price: 7000 },
  { name: "치킨마요 김치찌개 정식", price: 6400 },
  { name: "메가스팸마요", price: 5600 },
  { name: "스팸마요", price: 3600 },
  { name: "메가치킨마요", price: 5500 },
  { name: "왕치킨마요", price: 4500 },
  { name: "빅치킨마요", price: 3800 },
  { name: "치킨마요", price: 3200 },
  { name: "참치마요", price: 3000 },
  { name: "돈치마요", price: 3600 },
  { name: "치즈 카레도시락", price: 4100 },
  { name: "돈까스 카레", price: 4200 },
  { name: "3종치즈 김치볶음밥", price: 4800 },
  { name: "스팸 김치볶음밥", price: 4700 },
  { name: "김치볶음밥", price: 3900 },
  { name: "스팸철판볶음밥", price: 4500 },
  { name: "소불고기 철판볶음밥", price: 4500 },
  { name: "묵은지 김치찌개", price: 4500 },
  { name: "김치 부대찌개", price: 5800 },
  { name: "반찬 김치 부대찌개", price: 4500 },
  { name: "숯불직화구이 덮밥", price: 5900 },
  { name: "마파두부 덮밥", price: 5000 },
  { name: "왕카레돈까스덮밥", price: 5700 },
  { name: "새우돈까스 덮밥", price: 3900 },
  { name: "돈까스 덮밥", price: 3800 },
  { name: "소불고기 감초고추장 비빔밥", price: 5000 },
  { name: "시골제육 두부강된장 비빔밥", price: 5000 },
  { name: "참치야채 감초고추장", price: 3200 },
];

let hasOpened = 0;
// aside 열기/닫기 기능
const asideToggle = (e) => {
  e.target.classList.toggle("open");
  document.getElementById("aside").classList.toggle("open");
  // 메뉴 열린 적 없으면 메뉴 추천 기능 자동 실행
  if (hasOpened === 0) {
    hasOpened++;
    menuSuggestOnRenderAuto();
  }
};
// 메뉴 추천 기능 (재사용)
const menuSuggest = () => {
  const menulength = Math.floor(Math.random() * menulist.length) + 1;
  const suggestion = menulist[menulength];
  let { name, price } = suggestion;
  if (String(price).length > 3) {
    price = String(suggestion.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  document.getElementsByClassName("menu-name")[0].innerText = name;
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
