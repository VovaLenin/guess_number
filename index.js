const guessNumber = require("./guessNumber");

(async () => {
  try {
    const result = await guessNumber();
    console.log("Загаданное число:", result);
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
})();
