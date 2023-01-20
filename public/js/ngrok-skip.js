
/** ngrok warning page remove ajax */
fetch(url, {
    method: "GET",
    headers: new Headers({
      "ngrok-skip-browser-warning": "950130",
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));