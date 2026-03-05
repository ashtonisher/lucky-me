/** ngrok warning page remove ajax */
const url = window.location.origin; // 현재 호스트 기준으로 요청

fetch(url, {
  method: "GET",
  headers: new Headers({
    "ngrok-skip-browser-warning": "950130",
  }),
})
  .then((response) => response.text())
  .then(() => console.log("ngrok skip header sent"))
  .catch((err) => console.log(err));
