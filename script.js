const starsContainer = document.getElementById("stars-container");
const textContainer = document.getElementById("text-container");
const text = "привет мир";
const starsCount = 50; // Количество звёздочек

// Функция для создания звёздочек
function createStars() {
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.innerText = "✧"; // Символ звёздочки

        // Случайный размер звёздочки
        const size = `${Math.random() * 1.5 + 0.5}rem`; // От 0.5rem до 2rem
        star.style.fontSize = size;

        // Случайный цвет звёздочки
        const colors = ["gold", "silver", "white", "yellow", "orange"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        star.style.color = color;

        // Случайное начальное положение
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Случайная скорость анимации
        const animationDuration = `${Math.random() * 3 + 1}s`; // От 1 до 4 секунд
        star.style.animationDuration = animationDuration;

        // Случайная задержка анимации
        star.style.animationDelay = `${Math.random() * 5}s`;

        // Добавляем обработчик для движения звёздочек при нажатии
        star.addEventListener("click", () => {
            moveStar(star);
        });

        starsContainer.appendChild(star);
    }
}

// Функция для анимации текста
function animateText() {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            textContainer.innerText = text.slice(0, index + 1);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 200); // Скорость появления текста (в миллисекундах)
}

// Функция для движения звёздочек при нажатии
function moveStar(star) {
    const newX = Math.random() * 100;
    const newY = Math.random() * 100;
    star.style.transition = "left 0.5s, top 0.5s";
    star.style.left = `${newX}%`;
    star.style.top = `${newY}%`;

    // Убираем transition после завершения анимации
    setTimeout(() => {
        star.style.transition = "none";
    }, 500);
}

// Функция для движения звёздочек при наклоне телефона
function handleDeviceOrientation(event) {
    const stars = document.querySelectorAll(".star");
    const gamma = event.gamma; // Наклон влево-вправо (-90 до 90)
    const beta = event.beta; // Наклон вперёд-назад (-180 до 180)

    // Определяем, в какую часть экрана собирать звёздочки
    let targetX = 50; // По умолчанию центр по горизонтали
    let targetY = 50; // По умолчанию центр по вертикали

    if (gamma < -10) {
        targetX = 10; // Наклон влево — собираем звёздочки слева
    } else if (gamma > 10) {
        targetX = 90; // Наклон вправо — собираем звёздочки справа
    }

    if (beta < -10) {
        targetY = 10; // Наклон вперёд — собираем звёздочки вверху
    } else if (beta > 10) {
        targetY = 90; // Наклон назад — собираем звёздочки внизу
    }

    stars.forEach(star => {
        const currentX = parseFloat(star.style.left);
        const currentY = parseFloat(star.style.top);

        // Плавное движение к целевой точке
        const newX = currentX + (targetX - currentX) * 0.1;
        const newY = currentY + (targetY - currentY) * 0.1;

        star.style.left = `${newX}%`;
        star.style.top = `${newY}%`;
    });
}

// Запуск анимаций
createStars();
animateText();

// Добавляем обработчик для наклона телефона (если поддерживается)
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", handleDeviceOrientation);
} else {
    console.log("Ваше устройство не поддерживает наклон.");
}