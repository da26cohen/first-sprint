'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function timer() {
    var startTime = Date.now()
    gTimerInterval = setInterval(() => {
        var elapsedTime = Date.now() - startTime
        document.querySelector('.timer').innerText = (
            elapsedTime / 1000
        ).toFixed(1) + ' s'
        gGame.secsPassed++
    }, 37)
}