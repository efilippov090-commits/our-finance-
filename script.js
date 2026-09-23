let currentLevel = 0;

/* =========================
   УРОВНИ
========================= */

const levels = [

    {
        question: "Готова отправиться в наше маленькое путешествие? 💜",

        description:
            "Выбери правильный вариант, чтобы открыть первый уровень.",

        answers: [
            "Конечно ✨",
            "Я ещё думаю 🤔",
            "net 😎"
        ],

        correct: 0
    },

    {
        question: "Что делает этот день особенным? 🌙",

        description:
            "Тут нет неправильного ответа... почти 😏",

        answers: [
            "Погода",
            "Ты ❤️",
            "Пятница"
        ],

        correct: 1
    },

    {
        question: "Последний вопрос перед финалом ✨",

        description:
            "Что важнее всего в этой маленькой истории?",

        answers: [
            "Дорогие подарки",
            "Красивые фотографии",
            "Моменты вместе 💜"
        ],

        correct: 2
    }

];

/* =========================
   НАЧАЛО ИГРЫ
========================= */

function startGame() {

    const gameScreen =
        document.getElementById("game-screen");

    gameScreen.classList.add("active");

    currentLevel = 0;

    showLevel();
}

/* =========================
   ПОКАЗ УРОВНЯ
========================= */

function showLevel() {

    const level = levels[currentLevel];

    const levelNumber =
        document.getElementById("level-number");

    const question =
        document.getElementById("question");

    const description =
        document.getElementById("description");

    const answers =
        document.getElementById("answers");

    const message =
        document.getElementById("message");

    levelNumber.textContent =
        String(currentLevel + 1).padStart(2, "0");

    question.textContent =
        level.question;

    description.textContent =
        level.description;

    message.textContent = "";

    answers.innerHTML = "";

    level.answers.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className = "answer";

        button.textContent = answer;

        button.onclick = function () {

            checkAnswer(index);

        };

        answers.appendChild(button);

    });

}

/* =========================
   ПРОВЕРКА ОТВЕТА
========================= */

function checkAnswer(index) {

    const level =
        levels[currentLevel];

    const message =
        document.getElementById("message");

    if (index !== level.correct) {

        message.textContent =
            "Хмм... попробуй ещё раз 👀";

        return;
    }

    message.textContent =
        "Правильно! ✨";

    setTimeout(() => {

        currentLevel++;

        if (currentLevel >= levels.length) {

            showFinal();

        } else {

            showLevel();

        }

    }, 900);

}

/* =========================
   ФИНАЛ
========================= */

function showFinal() {

    const levelNumber =
        document.getElementById("level-number");

    const question =
        document.getElementById("question");

    const description =
        document.getElementById("description");

    const answers =
        document.getElementById("answers");

    const message =
        document.getElementById("message");

    levelNumber.textContent =
        "♥";

    question.textContent =
        "Ты дошла до конца 💜";

    description.textContent =
        "Но на самом деле это только начало нашей истории.";

    answers.innerHTML = "";

    const finalButton =
        document.createElement("button");

    finalButton.className =
        "answer";

    finalButton.textContent =
        "ОТКРЫТЬ СЕКРЕТ ✨";

    finalButton.onclick =
        showSecret;

    answers.appendChild(finalButton);

    message.textContent = "";

}

/* =========================
   СЕКРЕТ
========================= */

function showSecret() {

    const question =
        document.getElementById("question");

    const description =
        document.getElementById("description");


const answers =
        document.getElementById("answers");

    const message =
        document.getElementById("message");

    question.textContent =
        "💌 Маленькое сообщение";

    description.innerHTML =
  
  "Я обожаю тебя светланочка власикова. 💜";

    answers.innerHTML = "";

    message.textContent =
        "✦ LOVE QUEST COMPLETE ✦";

}