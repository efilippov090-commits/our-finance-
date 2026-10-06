let operations =
    JSON.parse(
        localStorage.getItem("ourFinanceOperations")
    ) || [];

let goals =
    JSON.parse(
        localStorage.getItem("ourFinanceGoals")
    ) || [];


let currentType = "income";

let selectedPerson = "egor";

let selectedGoalPerson = "egor";

let currentGoalId = null;


// =====================================
// СОХРАНЕНИЕ
// =====================================

function saveData() {

    localStorage.setItem(
        "ourFinanceOperations",
        JSON.stringify(operations)
    );

    localStorage.setItem(
        "ourFinanceGoals",
        JSON.stringify(goals)
    );
}


// =====================================
// ФОРМАТ ДЕНЕГ
// =====================================

function formatMoney(value) {

    return new Intl.NumberFormat("ru-RU")
        .format(Math.round(value)) + " ₽";

}


// =====================================
// МОДАЛЬНОЕ ОКНО ОПЕРАЦИИ
// =====================================

function openModal(type) {

    currentType = type;

    const modal =
        document.getElementById("modal");

    const title =
        document.getElementById("modalTitle");

    const eyebrow =
        document.getElementById("modalEyebrow");

    const category =
        document.getElementById("category");

    const description =
        document.getElementById("description");

    const amount =
        document.getElementById("amount");


    amount.value = "";

    description.value = "";


    modal.classList.add("active");


    if (type === "income") {

        eyebrow.textContent = "ДОХОД";

        title.textContent =
            "Добавить доход";


        category.innerHTML = `

            <option value="Зарплата">
                💼 Зарплата
            </option>

            <option value="Подработка">
                💻 Подработка
            </option>

            <option value="Подарок">
                🎁 Подарок
            </option>

            <option value="Другое">
                💰 Другое
            </option>

        `;


        description.placeholder =
            "Например: зарплата за сентябрь";


    } else {

        eyebrow.textContent = "РАСХОД";

        title.textContent =
            "Добавить расход";


        category.innerHTML = `

            <option value="Еда">
                🍔 Еда
            </option>

            <option value="Продукты">
                🛒 Продукты
            </option>

            <option value="Транспорт">
                🚗 Транспорт
            </option>

            <option value="Жильё">
                🏠 Жильё
            </option>

            <option value="Развлечения">
                🎮 Развлечения
            </option>

            <option value="Одежда">
                👕 Одежда
            </option>

            <option value="Покупки">
                🛍 Покупки
            </option>

            <option value="Здоровье">
                💊 Здоровье
            </option>

            <option value="Другое">
                📦 Другое
            </option>

        `;


        description.placeholder =
            "Например: продукты домой";

    }

}


// =====================================
// ЗАКРЫТЬ ОКНО
// =====================================

function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("active");

}


// =====================================
// ВЫБОР ЧЕЛОВЕКА
// =====================================

function selectPerson(person) {

    selectedPerson = person;


    document
        .querySelectorAll(".person-option")
        .forEach(button => {

            if (
                button.dataset.person
            ) {

                button.classList.remove(
                    "active"
                );

            }

        });


    const button =
        document.querySelector(
            `.person-option[data-person="${person}"]`
        );


    if (button) {

        button.classList.add("active");

    }

}


// =====================================
// СОХРАНЕНИЕ ОПЕРАЦИИ
// =====================================

function saveOperation() {

    const amountInput =
        document.getElementById("amount");

    const category =
        document.getElementById("category");

    const description =
        document.getElementById("description");


    const amount =
        Number(amountInput.value);


    if (!amount || amount <= 0) {

        alert("Введите сумму");

        return;

    }


    const operation = {

        id: Date.now(),

        type: currentType,

        person: selectedPerson,

        amount: amount,

        category: category.value,

        description:
            description.value.trim()
            || category.value,

        date:
            new Date().toISOString()

    };


    operations.unshift(operation);


    saveData();

    closeModal();

    updateUI();

}


// =====================================
// УДАЛЕНИЕ ОПЕРАЦИИ
// =====================================

function deleteOperation(id) {

    operations =
        operations.filter(
            operation =>
                operation.id !== id
        );


    saveData();

    updateUI();

}


// =====================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// =====================================

function updateUI() {

    let totalIncome = 0;

    let totalExpense = 0;


    let egorIncome = 0;

    let egorExpense = 0;


    let girlIncome = 0;

    let girlExpense = 0;


    operations.forEach(operation => {

        if (
            operation.type === "income"
        ) {

            totalIncome +=
                operation.amount;


            if (
                operation.person === "egor"
            ) {

                egorIncome +=
                    operation.amount;

            } else {

                girlIncome +=
                    operation.amount;

            }


        } else {

            totalExpense +=
                operation.amount;


            if (
                operation.person === "egor"
            ) {

                egorExpense +=
                    operation.amount;

            } else {

                girlExpense +=
                    operation.amount;

            }

        }

    });


    const totalBalance =
        totalIncome - totalExpense;


    const egorBalance =
        egorIncome - egorExpense;


    const girlBalance =
        girlIncome - girlExpense;


    document
        .getElementById("totalBalance")
        .textContent =
            formatMoney(totalBalance);


    document
        .getElementById("totalIncome")
        .textContent =
            "Доходы: " +
            formatMoney(totalIncome);


    document
        .getElementById("totalExpense")
        .textContent =
            "Расходы: " +
            formatMoney(totalExpense);


    document
        .getElementById("egorBalance")
        .textContent =
            formatMoney(egorBalance);


    document
        .getElementById("girlBalance")
        .textContent =
            formatMoney(girlBalance);


    updateMonthStats();

    renderGoals();

    renderOperations();

}


// =====================================
// СТАТИСТИКА МЕСЯЦА
// =====================================

function updateMonthStats() {

    const now =
        new Date();


    const currentMonth =
        now.getMonth();


    const currentYear =
        now.getFullYear();


    let income = 0;

    let expense = 0;


    operations.forEach(operation => {

        const date =
            new Date(operation.date);


        if (

            date.getMonth()
                === currentMonth

            &&

            date.getFullYear()
                === currentYear

        ) {

            if (
                operation.type === "income"
            ) {

                income +=
                    operation.amount;

            } else {

                expense +=
                    operation.amount;

            }

        }

    });


    const left =
        income - expense;


    document
        .getElementById("monthIncome")
        .textContent =
            formatMoney(income);


    document
        .getElementById("monthExpense")
        .textContent =
            formatMoney(expense);


    document
        .getElementById("monthLeft")
        .textContent =
            formatMoney(left);

}


// =====================================
// ОТКРЫТЬ СОЗДАНИЕ ЦЕЛИ
// =====================================

function openGoalModal() {

    document
        .getElementById("goalModal")
        .classList.add("active");


    document
        .getElementById("goalName")
        .value = "";


    document
        .getElementById("goalTarget")
        .value = "";


    document
        .getElementById("goalSaved")
        .value = "";

}


// =====================================
// ЗАКРЫТЬ СОЗДАНИЕ ЦЕЛИ
// =====================================

function closeGoalModal() {

    document
        .getElementById("goalModal")
        .classList.remove("active");

}


// =====================================
// СОЗДАТЬ ЦЕЛЬ
// =====================================

function saveGoal() {

    const name =
        document
            .getElementById("goalName")
            .value
            .trim();


    const target =
        Number(
            document
                .getElementById("goalTarget")
                .value
        );


    const saved =
        Number(
            document
                .getElementById("goalSaved")
                .value
        ) || 0;


    if (!name) {

        alert(
            "Введите название цели"
        );

        return;

    }


    if (!target || target <= 0) {

        alert(
            "Введите сумму цели"
        );

        return;

    }


    if (saved < 0) {

        alert(
            "Накопленная сумма не может быть отрицательной"
        );

        return;

    }


    if (saved > target) {

        alert(
            "Накоплено не может быть больше цели"
        );

        return;

    }


    const goal = {

        id: Date.now(),

        name: name,

        target: target,

        saved: saved,

        contributions: [],

        createdAt:
            new Date().toISOString()

    };


    goals.unshift(goal);


    saveData();

    closeGoalModal();

    updateUI();

}


// =====================================
// РЕНДЕР ЦЕЛЕЙ
// =====================================

function renderGoals() {

    const container =
        document.getElementById("goals");


    if (goals.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div>🎯</div>

                <p>Пока нет целей</p>

                <small>
                    Создайте первую цель, на которую хотите накопить
                </small>

            </div>

        `;

        return;

    }


    container.innerHTML =
        goals.map(goal => {

            const percent =
                Math.min(
                    100,
                    (goal.saved / goal.target) * 100
                );


            const remaining =
                Math.max(
                    0,
                    goal.target - goal.saved
                );


            const completed =
                goal.saved >= goal.target;


            return `

                <div class="goal-card">

                    <div class="goal-top">

                        <div>

                            <div class="goal-name">
                                🎯 ${escapeHTML(goal.name)}
                            </div>

                            <div class="goal-target">
                                Цель:
                                ${formatMoney(goal.target)}
                            </div>

                        </div>


                        <div class="goal-percent">
                            ${Math.round(percent)}%
                        </div>

                    </div>


                    <div class="goal-numbers">

                        <span class="goal-saved">
                            ${formatMoney(goal.saved)}
                        </span>

                        <span class="goal-left">
                            ${
                                completed
                                ? "Цель достигнута 🎉"
                                : "Осталось " +
                                  formatMoney(remaining)
                            }
                        </span>

                    </div>


                    <div class="progress">

                        <div
                            class="progress-fill"
                            style="width: ${percent}%"
                        ></div>

                    </div>


                    ${
                        completed
                        ? `
                            <div class="goal-complete">
                                ✓ Вы накопили необходимую сумму
                            </div>
                        `
                        : ""
                    }


                    <div class="goal-actions">

                        ${
                            completed
                            ? ""
                            : `
                                <button
                                    class="goal-add-btn"
                                    onclick="openAddGoalMoneyModal(${goal.id})"
                                >
                                    + Добавить деньги
                                </button>
                            `
                        }


                        <button
                            class="goal-delete-btn"
                            onclick="deleteGoal(${goal.id})"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


// =====================================
// ОТКРЫТЬ ДОБАВЛЕНИЕ ДЕНЕГ
// =====================================

function openAddGoalMoneyModal(goalId) {

    currentGoalId = goalId;


    document
        .getElementById("goalAmount")
        .value = "";


    document
        .getElementById("addGoalMoneyModal")
        .classList.add("active");

}


// =====================================
// ЗАКРЫТЬ ДОБАВЛЕНИЕ
// =====================================

function closeAddGoalMoneyModal() {

    document
        .getElementById("addGoalMoneyModal")
        .classList.remove("active");

}


// =====================================
// КТО ДОБАВИЛ ДЕНЬГИ
// =====================================

function selectGoalPerson(person) {

    selectedGoalPerson = person;


    document
        .querySelectorAll(
            "[data-goal-person]"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const selected =
        document.querySelector(
            `[data-goal-person="${person}"]`
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }

}


// =====================================
// ДОБАВИТЬ ДЕНЬГИ К ЦЕЛИ
// =====================================

function addMoneyToGoal() {

    const amount =
        Number(
            document
                .getElementById("goalAmount")
                .value
        );


    if (!amount || amount <= 0) {

        alert(
            "Введите сумму"
        );

        return;

    }


    const goal =
        goals.find(
            item =>
                item.id === currentGoalId
        );


    if (!goal) {

        return;

    }


    const remaining =
        goal.target - goal.saved;


    if (amount > remaining) {

        alert(
            "Сумма больше, чем осталось до цели"
        );

        return;

    }


    goal.saved += amount;


    if (!goal.contributions) {

        goal.contributions = [];

    }


    goal.contributions.push({

        person:
            selectedGoalPerson,

        amount:
            amount,

        date:
            new Date().toISOString()

    });


    saveData();

    closeAddGoalMoneyModal();

    updateUI();

}


// =====================================
// УДАЛИТЬ ЦЕЛЬ
// =====================================

function deleteGoal(id) {

    const confirmed =
        confirm(
            "Удалить эту цель?"
        );


    if (!confirmed) {

        return;

    }


    goals =
        goals.filter(
            goal =>
                goal.id !== id
        );


    saveData();

    updateUI();

}


// =====================================
// ИСТОРИЯ ОПЕРАЦИЙ
// =====================================

function renderOperations() {

    const container =
        document.getElementById("operations");


    const count =
        document.getElementById("operationCount");


    count.textContent =
        operations.length;


    if (operations.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div>💸</div>

                <p>Пока нет операций</p>

                <small>
                    Добавьте первую зарплату или расход
                </small>

            </div>

        `;

        return;

    }


    container.innerHTML =
        operations
            .slice(0, 30)
            .map(operation => {

                const isIncome =
                    operation.type === "income";


                const personName =
                    operation.person === "egor"
                        ? "Егор"
                        : "Девушка";


                const icon =
                    isIncome
                        ? "↗"
                        : "↘";


                const sign =
                    isIncome
                        ? "+"
                        : "−";


                const date =
                    new Date(
                        operation.date
                    )
                    .toLocaleDateString(
                        "ru-RU",
                        {
                            day: "numeric",
                            month: "short"
                        }
                    );


                return `

                    <div class="operation">

                        <div
                            class="
                                operation-icon
                                ${
                                    isIncome
                                    ? "income"
                                    : "expense"
                                }
                            "
                        >
                            ${icon}
                        </div>


                        <div class="operation-main">

                            <div class="operation-description">
                                ${
                                    escapeHTML(
                                        operation.description
                                    )
                                }
                            </div>


                            <div class="operation-meta">

                                ${personName}

                                •
                                ${operation.category}

                                •
                                ${date}

                            </div>

                        </div>


                        <div
                            class="
                                operation-amount
                                ${
                                    isIncome
                                    ? "income"
                                    : "expense"
                                }
                            "
                        >
                            ${sign}${formatMoney(operation.amount)}
                        </div>


                        <button
                            class="delete-operation"
                            onclick="
                                deleteOperation(
                                    ${operation.id}
                                )
                            "
                        >
                            ×
                        </button>

                    </div>

                `;

            })
            .join("");

}


// =====================================
// ЗАЩИТА HTML
// =====================================

function escapeHTML(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =====================================
// СБРОС
// =====================================

function resetAllData() {

    const confirmed =
        confirm(
            "Удалить ВСЮ финансовую историю и все цели?"
        );


    if (!confirmed) {

        return;

    }


    operations = [];

    goals = [];


    saveData();

    updateUI();

}


// =====================================
// ЗАКРЫТИЕ ПО КЛИКУ ВНЕ ОКНА
// =====================================

document
    .getElementById("modal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeModal();

            }

        }
    );


document
    .getElementById("goalModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeGoalModal();

            }

        }
    );


document
    .getElementById("addGoalMoneyModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeAddGoalMoneyModal();

            }

        }
    );


// =====================================
// ЗАПУСК
// =====================================

updateUI();