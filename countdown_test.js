let timeLeft = 3;
let secondsCounter = setInterval(countdown, 1000);
function countdown() {
    if (currentScreen === 1) {
        fill(255);
        textSize(40);
        text(timeLeft, 100, 100);
        timeLeft--; // output of current countdown and addition of 1
        if (timeLeft === 0) {
            clearInterval(secondsCounter);
        }
    }
}