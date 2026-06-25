const ADJ = [
  "달콤한",
  "매콤한",
  "고소한",
  "짭짤한",
  "새콤한",
  "바삭한",
  "쫄깃한",
  "얼큰한",
  "담백한",
  "끝내주는",
  "용감한",
  "수줍은",
  "엉뚱한",
  "졸린",
  "당당한",
  "느긋한",
  "부지런한",
  "수상한",
  "당황한",
  "신나는",
  "소심한",
  "음침한",
  "발랄한",
  "전설의",
  "무적의",
  "비밀스러운",
  "행복한",
  "귀여운",
  "위대한",
  "빛나는",
  "혼란스러운",
  "가짜",
  "은밀한",
];
const FOOD = [
  "돈까스",
  "라면",
  "초밥",
  "삼겹살",
  "치킨",
  "떡볶이",
  "김밥",
  "파스타",
  "짜장면",
  "냉면",
  "갈비",
  "우동",
  "피자",
  "마라탕",
  "오므라이스",
  "고양이",
  "판다",
  "문어",
  "해파리",
  "강아지",
  "카멜레온",
  "알파카",
  "두더지",
  "너구리",
  "펭귄",
  "바나나",
  "선인장",
  "우산",
  "구름",
  "달팽이",
  "거북이",
  "곰",
  "눈사람",
  "토끼",
  "여우",
  "고슴도치",
  "개미",
  "상추",
  "토마토",
  "당근",
  "배추",
  "귤",
  "오렌지",
  "사과",
  "배",
  "오이",
  "두부",
  "된장찌개",
  "카레",
  "운석",
  "똥",
  "돌멩이",
  "물방울",
  "새싹",
];

const usedNames = new Set();

const randomNickname = () => {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let name;
  let tries = 0;
  do {
    name = `${pick(ADJ)} ${pick(FOOD)}`;
    tries++;
  } while (usedNames.has(name) && tries < 100);
  usedNames.add(name);
  return name;
};

const releaseNickname = (name) => usedNames.delete(name);

const previewNickname = () => {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let name;
  let tries = 0;
  do {
    name = `${pick(ADJ)} ${pick(FOOD)}`;
    tries++;
  } while (usedNames.has(name) && tries < 100);
  return name;
};

module.exports = { randomNickname, releaseNickname, previewNickname };
