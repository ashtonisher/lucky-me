// 한솥 메뉴 리스트
const menulist = [
  { name: "아보카도 게맛살 명란비빔밥", price: 6500 },
  { name: "아보카도 소고기 명란비빔밥", price: 6500 },
  { name: "핫 치즈 닭갈비덮밥", price: 5900 },
  { name: "오리지널 치즈 닭갈비덮밥", price: 5900 },
  { name: "매화(순살 고등어 간장구이)", price: 10000 },
  { name: "진달래", price: 7500 },
  { name: "개나리(순살 고등어 간장구이)", price: 8000 },
  { name: "돈까스도련님고기고기", price: 6000 },
  { name: "탕수육도련님고기고기", price: 5800 },
  { name: "새치고기고기", price: 6700 },
  { name: "돈치고기고기", price: 5800 },
  { name: "오븐구이 오리도시락", price: 6900 },
  { name: "숯불직화구이", price: 6500 },
  { name: "소불고기", price: 5400 },
  { name: "메가치킨제육", price: 7000 },
  { name: "칠리 찹쌀탕수육도련님", price: 4200 },
  { name: "동백", price: 5800 },
  { name: "치킨제육", price: 4700 },
  { name: "돈까스도련님", price: 4500 },
  { name: "제육볶음", price: 4200 },
  { name: "돈치스팸", price: 4900 },
  { name: "제육 김치찌개 정식", price: 8200 },
  { name: "제육 김치 부대찌개 정식", price: 8500 },
  { name: "돈치스팸 김치 부대찌개 정식", price: 8500 },
  { name: "빅치킨마요 김치 부대찌개 정식", price: 7500 },
  { name: "치킨마요 김치 부대찌개 정식", price: 6900 },
  { name: "빅치킨마요 김치찌개 정식", price: 7000 },
  { name: "치킨마요 김치찌개 정식", price: 6500 },
  { name: "메가스팸마요", price: 5600 },
  { name: "스팸마요", price: 3700 },
  { name: "메가치킨마요", price: 5800 },
  { name: "왕치킨마요", price: 4800 },
  { name: "빅치킨마요", price: 4100 },
  { name: "치킨마요", price: 3500 },
  { name: "참치마요", price: 3200 },
  { name: "돈치마요", price: 3800 },
  { name: "돈까스 카레", price: 4500 },
  { name: "스팸 김치볶음밥", price: 4700 },
  { name: "김치볶음밥", price: 3900 },
  { name: "스팸철판볶음밥", price: 4500 },
  { name: "소불고기 철판볶음밥", price: 4700 },
  { name: "나시고랭", price: 6000 },
  { name: "묵은지 김치찌개", price: 4500 },
  { name: "김치 부대찌개", price: 5800 },
  { name: "숯불직화구이 덮밥", price: 5900 },
  { name: "마파두부 덮밥", price: 5000 },
  { name: "왕카레돈까스덮밥", price: 5900 },
  { name: "새우돈까스 덮밥", price: 4100 },
  { name: "돈까스 덮밥", price: 4000 },
  { name: "열무 감초고추장 비빔밥", price: 4500 },
  { name: "열무 두부강된장 비빔밥", price: 4900 },
  { name: "소불고기 감초고추장 비빔밥", price: 5200 },
  { name: "시골제육 두부강된장 비빔밥", price: 5200 },
  { name: "참치야채 감초고추장", price: 3300 },
  { name: "토네이도 소세지 파스타", price: 5500 },
  { name: "트리플 치즈 파스타", price: 5500 },
  { name: "토마토 미트 파스타", price: 4500 },
];

let hasOpened = false;
// aside 열기/닫기 기능
const asideToggle = (e) => {
  e.target.classList.toggle("open");
  document.getElementById("aside").classList.toggle("open");
  // 메뉴 열린 적 없으면 메뉴 추천 기능 자동 실행
  if (hasOpened) {
    !hasOpened;
    menuSuggestOnRenderAuto();
  }
};
// 메뉴 추천 기능 (재사용)
// let timer;
const menuSuggest = () => { // throttling 적용하기
  document.getElementsByClassName("menu-name")[0].innerText = '메뉴추천중...';
  const menuIndex = Math.floor(Math.random() * menulist.length);
  const suggestion = menulist[menuIndex];
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
