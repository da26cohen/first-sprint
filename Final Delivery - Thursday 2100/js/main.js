'use strict'

const MINE = '💣'
var gBoard
var elBtnRestart = document.querySelector('.restart')
var elBtnHints = document.querySelector('.hints')
var gFirstClick = true
var gTimerInterval
var gDifficult = 'easy'


var gLevel = {
    size: 4,
    mines: 2,
    hints: 2
}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    life: 3
}


function onInit() {
    resetHints()
    clearInterval(gTimerInterval)
    timer()
    resetGame()
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
    countLife()
    elBtnHints.innerText = '💡'.repeat(gLevel.hints)
}


function buildBoard(size) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board
}

function onCellClicked(elCell, i, j) {
    if (gFirstClick) {
        gBoard[i][j].isShown = true
        elCell.classList.add('clicked')
        putMines(gBoard, gLevel.mines)
        showMinesNugs()
        blowUpNegs(gBoard, i, j)
        renderBoard(gBoard)
        gFirstClick = false
    }

    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
    if (!gGame.isOn) return
    if (elCell.innerText !== MINE) {
        gGame.shownCount++
        elCell.classList.add('clicked')
        gBoard[i][j].isShown = true
        blowUpNegs(gBoard, i, j)
    } else {
        gGame.shownCount++
        gBoard[i][j].isShown = true
        elCell.classList.add('clicked')
        gGame.life--
        countLife()
        if (gGame.life === 0) gameOver()
    }
    if (gGame.markedCount === gLevel.mines &&
        gGame.shownCount === (gLevel.size * gLevel.size - gLevel.mines)) {
        winGame()
    }
    score()
}

function blowUpNegs(mat, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (i === cellI && j === cellJ) continue
            if (!mat[i][j].isMine) {

                var elCurrCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                if (elCurrCell.classList.contains('clicked')) continue
                mat[i][j].isShown = true
                gGame.shownCount++
                elCurrCell.classList.add('clicked')
            }
        }
    }
}

function renderBoard(mat) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            var className = (cell.isMine === true) ? 'cell mine' : 'cell'
            if (mat[i][j].isShown) className = 'cell clicked '
            const countMinesAround = cell.minesAroundCount
            var showenNugs = (countMinesAround === 0) ? ' ' : countMinesAround
            const showCell = (cell.isMine === true) ? MINE : showenNugs



            strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" oncontextmenu="onCellMarked(this,${i},${j})"
            onclick="onCellClicked(this,${i},${j})">${showCell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// clicking on the right
function onCellMarked(elCell, i, j) {

    if (elCell.innerText === MINE) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    }
    document.addEventListener('contextmenu', (event) => { event.preventDefault(); });
    elCell.classList.toggle('clicked')
    elCell.classList.add('marked')
    elCell.innerText = '🚩'
}
// difficults
function level(btn) {

    if (btn.innerText === 'easy') {
        gDifficult = 'easy'
        gLevel.size = 4
        gLevel.mines = 2
        gLevel.hints = 2
        gBoard = buildBoard(gLevel.size)
        resetGame()
        onInit()
    }
    if (btn.innerText === 'hard') {
        gDifficult = 'hard'
        gLevel.size = 8
        gLevel.mines = 14
        gLevel.hints = 3
        gBoard = buildBoard(gLevel.size)
        resetGame()
        onInit()
    }
    if (btn.innerText === 'extreme') {
        gDifficult = 'extreme'
        gLevel.size = 12
        gLevel.mines = 32
        gLevel.hints = 4
        gBoard = buildBoard(gLevel.size)
        resetGame()
        onInit()
    }
}


function gameOver() {
    clearInterval(gTimerInterval)
    gGame.secsPassed = 0
    var elBtnRestart = document.querySelector('.restart')
    elBtnRestart.innerText = '🤯'
    elBtnRestart.style.backgroundColor = "red";
    gGame.isOn = false
    showAllMines()
    playSoundlose()
    // alert('the game is over!')
}

function winGame() {
    clearInterval(gTimerInterval)
    var elBtnRestart = document.querySelector('.restart')
    elBtnRestart.innerText = '😎'
    elBtnRestart.style.backgroundColor = "blue";
    gGame.isOn = false
    playSoundWin()
}

function countLife() {
    var elH2 = document.querySelector('h2 span')
    elH2.innerText = '❤️'.repeat(gGame.life);
}

function dark() {
    var elBody = document.querySelector('body')
    elBody.classList.toggle('dark')
}
function playSoundWin() {
    var soundWin = new Audio('sound/win.wav')
    soundWin.play()
}
function playSoundlose() {
    var soundLose = new Audio('sound/lose.wav')
    soundLose.play()
}
function score() {
    var elH2 = document.querySelector('.modal h2 span')
    elH2.innerText = gGame.shownCount
}
function hint(btn) {
    gLevel.hints--
    if (btn.innerText !== '') {
        showAllMines()
        setTimeout(hideAllMines, 250)
        btn.innerText = '💡'.repeat(gLevel.hints);
    }
}

function resetHints() {
    if (gDifficult === 'easy') {
        gLevel.hints = 2
    }
    if (gDifficult === 'hard') {
        gLevel.hints = 3
    }
    if (gDifficult === 'extreme') {
        gLevel.hints = 4
    }
}


function resetGame() {
    elBtnRestart.style.backgroundColor = "yellow";
    elBtnRestart.innerText = '😃'
    gGame.shownCount = 0
    gGame.life = 3
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gFirstClick = true
    score()
}