'use strict'

var gBoard
var MINE = '💣'
var elBtnRestart = document.querySelector('.restart')
var firstClick = true

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    life: 3
}


function onInit() {
    // timer()
    // cleanBoard()
    elBtnRestart.innerText = '😃'
    gGame.life = 3
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gBoard = buildBoard(gLevel.size)
    putMines(gBoard, gLevel.mines)
    checkMine()
    renderBoard(gBoard)
    countLife()


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



function putMines(board, number) {
    for (var i = 0; i < number; i++) {
        var emptyCell = getEmptyLocation(gBoard)
        board[emptyCell.i][emptyCell.j].isMine = true
    }
}


function onCellClicked(elCell, i, j) {

    if (gGame.isOn === false) return
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
}

function blowUpNegs(mat, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (i === cellI && j === cellJ) continue
            if (mat[i][j].isMine === false) {

                var elCurrCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                if (elCurrCell.classList.contains('clicked')) continue
                mat[i][j].isShown = true
                gGame.shownCount++
                elCurrCell.classList.add('clicked')


            }

        }
    }
    console.log('mat', mat)
    console.log(gGame);
}




function getEmptyLocation(board) {
    var emptyLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] !== MINE) {
                emptyLocations.push({ i, j })
            }
        }
    }

    if (!emptyLocations.length) return null
    var randIdx = getRandomIntInclusive(0, emptyLocations.length - 1)
    return emptyLocations[randIdx]
}

function checkMine() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            var numOfNeighbors = setMinesNegsCount(i, j, gBoard)
            if (currCell !== MINE) currCell.minesAroundCount = numOfNeighbors
            else (currCell.isMine === true)

        }
    }
}

function renderBoard(mat) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = (cell.isMine === true) ? 'cell mine' : 'cell'
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

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {}
    var parts = strCellId.split('-')

    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord;
}
// clicking on the right
function onCellMarked(elCell, i, j) {

    if (elCell.innerText === MINE) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    }
    document.addEventListener('contextmenu', (event) => { event.preventDefault(); });
    elCell.classList.toggle('clicked')
    elCell.innerText = '🚩'
}

function setMinesNegsCount(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine === true) negsCount++

        }
    }
    return negsCount
}

function level(btn) {

    if (btn.innerText === 'easy') {
        gLevel.size = 4
        gLevel.mines = 2
        gBoard = buildBoard(gLevel.size)
        onInit()
    }
    if (btn.innerText === 'hard') {
        gLevel.size = 8
        gLevel.mines = 14
        gBoard = buildBoard(gLevel.size)
        onInit()
    }
    if (btn.innerText === 'extreme') {
        gLevel.size = 12
        gLevel.mines = 32
        gBoard = buildBoard(gLevel.size)
        onInit()

    }
}

function gameOver() {
    var elBtnRestart = document.querySelector('.restart')
    elBtnRestart.innerText = '🤯'
    elBtnRestart.style.backgroundColor = "red";
    gGame.isOn = false
    showAllMines()
    // alert('the game is over!')
}

function winGame() {
    var elBtnRestart = document.querySelector('.restart')
    elBtnRestart.innerText = '😎'
    elBtnRestart.style.backgroundColor = "blue";
    gGame.isOn = false
}

function countLife() {
    var elH2 = document.querySelector('h2 span')
    elH2.innerText = gGame.life
}


function showAllMines() {
    var elMines = document.querySelectorAll('.mine')
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].classList.add('clicked')
    }
}

function cleanBoard() {
    var elAllCells = document.querySelectorAll('.selected')
    for (var i = 0; i < elAllCells.length; i++) {
        elAllCells[i].classList.remove('clicked', 'mine')

    }
}

// function checkss() {
//     var count = 0
//     var elAllClicked = document.querySelectorAll('.clicked')
//     for (var i = 0; i < elAllClicked.length; i++) {
//         count++
//     }
//     console.log(count);
//     return count
// }