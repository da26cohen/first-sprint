'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function timer() {
    // set var gTimerInterval and html element (div or span) with timer class to start
    var timer = document.querySelector('.timer')
    var start = Date.now()
    gTimerInterval = setInterval(function () {
        var currTs = Date.now()
        var secs = parseInt((currTs - start) / 1000)
        var ms = (currTs - start) - secs * 1000
        ms = '000' + ms
        // mlSeconds length
        ms = ms.substring(ms.length , ms.length)
        //Rendering 
        timer.innerText = `\n timer :${secs}${ms}`
    }, 100)
}   

// elCell.classList.contains('mine')


function timer() {
    // set var gTimerInterval and html element (div or span) with timer class to start
    var timer = document.querySelector('.timer')
    var start = Date.now()
    gTimerInterval = setInterval(function () {
        var currTs = Date.now()
        var secs = parseInt((currTs - start) / 1000)
        var ms = (currTs - start) - secs * 1000
        ms = '000' + ms
        // mlSeconds length
        ms = ms.substring(ms.length - 1, ms.length)
        //Rendering 
        timer.innerText = `\n ${secs}:${ms}`
    }, 100)
}