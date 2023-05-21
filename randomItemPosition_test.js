function randomItemPosition() {
    let itemPositionY = random(160, 600);
    while (itemPositionY > 360 && itemPositionY < 400) {
        itemPositionY = random(160, 600);
    }
    console.log(itemPositionY);
}

function draw() {
    randomItemPosition();
}