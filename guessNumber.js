const patchFetch = require("./patchFetch.js");

patchFetch(150000);

async function guessNumber() {
  let min = 0;
  let max = Number.MAX_SAFE_INTEGER; // Максимальное число для угадывания

  for (let i = 0; i < 55; i++) {
    // Вычисляем предполагаемое число
    let guess = Math.floor((min + max) / 2);

    // Отправляем запрос
    const response = await fetch(`https://game.yandex?value=${guess}`);
    const data = await response.json();

    if (data !== null) {
      if (response.status === 200 && data.result === "equal") {
        // Если угадали число, возвращаем его
        return guess;
      } else if (data.result === "more") {
        // Если загаданное число больше, обновляем минимальное значение
        min = guess + 1;
      } else if (data.result === "less") {
        // Если загаданное число меньше, обновляем максимальное значение
        max = guess - 1;
      } else if (
        response.status === 403 &&
        data.error === "You have made too many requests"
      ) {
        // Если сделано слишком много запросов
        throw new Error("Too many requests");
      } else if (response.status === 503) {
        // Если сервер недоступен, повторяем запрос
        console.log("Server is unavailable. Retrying...");
        i--; // Повторный запрос не считается
        continue;
      } else {
        // Обработка других ошибок
        throw new Error("Unexpected error");
      }
    } else {
      // Обработка случая, когда data === null
      console.log("Invalid response data. Retrying...");
      i--; // Повторный запрос не считается
      continue;
    }
  }

  // Если не удалось угадать число после 55 запросов
  throw new Error("Failed to guess the number");
}

module.exports = guessNumber;
