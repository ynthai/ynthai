// utils.js
export function handleError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '0';
    errorContainer.style.left = '0';
    errorContainer.style.width = '100%';
    errorContainer.style.backgroundColor = '#f44336';
    errorContainer.style.color = '#fff';
    errorContainer.style.padding = '20px';
    errorContainer.style.textAlign = 'center';
    errorContainer.style.zIndex = '10000';
    errorContainer.textContent = message;
    document.body.appendChild(errorContainer);
}

export function requestVibrationPermission() {
    if ("vibrate" in navigator && !vibrationPermissionRequested) {
        vibrationPermissionRequested = true;
        const vibrationPopup = document.getElementById("vibrationPopup");
        vibrationPopup.classList.remove("hidden");
        document.getElementById("allowVibration").addEventListener("click", () => {
            vibrationPopup.classList.add("hidden");
            localStorage.setItem('vibrationAllowed', 'true');
        });
        document.getElementById("denyVibration").addEventListener("click", () => {
            vibrationPopup.classList.add("hidden");
            localStorage.setItem('vibrationAllowed', 'false');
        });
    }
}

export function vibrateDevice(pattern) {
    if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
    } else {
        console.log("Vibration is not supported on this device.");
    }
}