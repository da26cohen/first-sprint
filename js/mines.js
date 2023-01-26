'use strict'

function putMines(board, number) {
    for (var i = 0; i < number; i++) {
        var emptyCell = getEmptyLocationMines(gBoard)
        board[emptyCell.i][emptyCell.j].isMine = true
    }
}


function getEmptyLocationMines(board) {
    var emptyLocations = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                emptyLocations.push({ i, j })
            }
        }
    }

    if (!emptyLocations.length) return null
    var randIdx = getRandomIntInclusive(0, emptyLocations.length - 1)
    return emptyLocations[randIdx]
}

function showMinesNugs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            var numOfNeighbors = setMinesNegsCount(i, j, gBoard)
            if (!currCell.isMine) currCell.minesAroundCount = numOfNeighbors
            // else (currCell.isMine === true)
        }
    }
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


function showAllMines() {
    var elMines = document.querySelectorAll('.mine')
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].classList.add('clicked')
    }
}
function hideAllMines() {
    var elMines = document.querySelectorAll('.mine')
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].classList.remove('clicked')
    }
}

