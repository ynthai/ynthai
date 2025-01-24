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

        // Случайное начальное положение в пикселях
        const initialX = Math.random() * window.innerWidth; // Случайное положение по X
        const initialY = Math.random() * window.innerHeight; // Случайное положение по Y
        star.style.left = `${initialX}px`;
        star.style.top = `${initialY}px`;

        // Сохраняем начальное положение для использования при наклоне
        star.dataset.initialX = initialX;

        // Случайная скорость анимации
        const animationDuration = `${Math.random() * 3 + 1}s`; // От 1 до 4 секунд
        star.style.animationDuration = animationDuration;

        // Случайная задержка анимации
        star.style.animationDelay = `${Math.random() * 5}s`;

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

// Функция для обработки наклона телефона
function handleDeviceOrientation(event) {
    const stars = document.querySelectorAll(".star");
    const gamma = event.gamma; // Наклон влево-вправо (-90 до 90)

    // Определяем смещение в зависимости от наклона
    let offset = gamma * 2; // Смещение в пикселях

    stars.forEach(star => {
        const initialX = parseFloat(star.dataset.initialX); // Начальное положение по X
        const newX = initialX + offset; // Новое положение с учётом наклона

        // Применяем новое положение
        star.style.left = `${newX}px`;
    });
}

// Запуск анимаций
createStars();
animateText();

// Добавляем обработчик для наклона телефона (если поддерживается)
if (window.DeviceOrientationEvent) {
    // Запрашиваем разрешение на доступ к данным датчиков (для iOS)
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // Показываем кнопку для запроса разрешения
        const permissionButton = document.createElement("button");
        permissionButton.innerText = "Разрешить доступ к датчикам";
        permissionButton.style.position = "absolute";
        permissionButton.style.top = "10px";
        permissionButton.style.left = "50%";
        permissionButton.style.transform = "translateX(-50%)";
        permissionButton.style.padding = "10px 20px";
        permissionButton.style.backgroundColor = "white";
        permissionButton.style.color = "black";
        permissionButton.style.border = "none";
        permissionButton.style.borderRadius = "5px";
        permissionButton.style.cursor = "pointer";
        permissionButton.style.zIndex = "1000";

        permissionButton.addEventListener("click", () => {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === "granted") {
                        window.addEventListener("deviceorientation", handleDeviceOrientation);
                        permissionButton.remove(); // Убираем кнопку после получения разрешения
                    } else {
                        console.log("Доступ к датчикам отклонён.");
                    }
                })
                .catch(console.error);
        });

        document.body.appendChild(permissionButton);
    } else {
        // Для Android и других устройств
        window.addEventListener("deviceorientation", handleDeviceOrientation);
    }
} else {
    console.log("Ваше устройство не поддерживает наклон.");
}