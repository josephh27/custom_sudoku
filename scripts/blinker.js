import { refreshLeaderboard, addBlinkLeaderboard} from './blinking_leaderboard.js'

//Toggling between dark and light mode
document.querySelector('.dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
})


//Initial values
//Screens
const startScreen = document.querySelector(".start-screen");
const inGameScreen = document.querySelector(".in-game-screen");
const pauseScreen = document.querySelector(".pause-screen");
const resultScreen = document.querySelector(".result-screen");

//Others
const nameInput = document.querySelector("#name-input");
const cells = document.querySelectorAll(".grid-cell");

//UI in game at the bottom
const numbersInput = document.querySelectorAll(".number");
const nameDisplay = document.querySelector("#in-game-name");
const levelDisplay = document.querySelector("#in-game-level");
const timeDisplay = document.querySelector("#game-time");

const resultTime = document.querySelector("#result-time");

let levelIndex = 0;
let level = CONSTANT.MODES[levelIndex];

let timer = null;
let pause = false;
let seconds = 0;

let su = undefined;
let su_answer = undefined;

let selectedCell = -1;

const randomInteger = () => {
    return Math.floor(Math.random() * (80 - 0 + 1)) + 0;
}

const blink = () => {
    let randomOne = randomInteger();
    let randomTwo = randomInteger();
    let randomThree = randomInteger();
    let randomFour = randomInteger();
    let randomFive = randomInteger();
    let randomSix = randomInteger();
    let randomSeven = randomInteger();
    let randomEight = randomInteger();
    let randomNine = randomInteger();
    let randomTen = randomInteger();

    cells[randomOne].classList.add('blink');
    cells[randomTwo].classList.add('blink');
    cells[randomThree].classList.add('blink');
    cells[randomFour].classList.add('blink');
    cells[randomFive].classList.add('blink');
    cells[randomSix].classList.add('blink');
    cells[randomSeven].classList.add('blink');
    cells[randomEight].classList.add('blink');
    cells[randomNine].classList.add('blink');
    cells[randomTen].classList.add('blink');

    setTimeout(() => {
        cells[randomOne].classList.remove('blink');
        cells[randomTwo].classList.remove('blink');
        cells[randomThree].classList.remove('blink');
        cells[randomFour].classList.remove('blink');
        cells[randomFive].classList.remove('blink');
        cells[randomSix].classList.remove('blink');
        cells[randomSeven].classList.remove('blink');
        cells[randomEight].classList.remove('blink');
        cells[randomNine].classList.remove('blink');
        cells[randomTen].classList.remove('blink');
    }, 2950);
}


const getGameInfo = () => JSON.parse(localStorage.getItem('blinkingGame'));

const addSpacing = () => {
    let index = 0;
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (row == 2 || row == 5){cells[index].style.marginBottom = '10px';}
        if (col == 2 || col == 5){cells[index].style.marginRight = '10px';}
        index++;
    }
}

const setPlayerName = (name) => localStorage.setItem('blinkerName', name);
const getPlayerName = () => localStorage.getItem('blinkerName');

const showTime = (seconds) => new Date(seconds * 1000).toISOString().slice(11, 19);

const startGame = () => {
    startScreen.classList.remove('active');
    inGameScreen.classList.add('active');
    let pastName = localStorage.getItem('blinkerName');
    nameDisplay.textContent = pastName ? pastName : nameInput.value.trim();
    setPlayerName(nameDisplay.textContent.trim());

    levelDisplay.textContent = CONSTANT.MODE_NAMES[levelIndex];
    refreshLeaderboard();
    showTime(seconds);

    timer = setInterval(() => {
        if (!pause){
            seconds += 1;
            timeDisplay.textContent = showTime(seconds);
            saveGameInfo();
            blink();
        }
    }, 1000);

}

const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        cells[i].textContent = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
        cells[i].classList.remove('err')
    }
}


const returnStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    document.querySelector('#continue-game').style.display = localStorage.getItem('blinkingGame') ? 'grid' : 'none'
    startScreen.classList.add('active');
    inGameScreen.classList.remove('active');
    pauseScreen.classList.remove('active');
    resultScreen.classList.remove('active');
};

//Add button events

document.querySelector('#start-new-game').addEventListener('click', () => {
    if (nameInput.value.trim().length > 0){
        localStorage.removeItem('blinkerName');
        initSudoku();
        startGame();
    } else {
        nameInput.classList.add('input-err');
        setTimeout(() => {
            nameInput.classList.remove('input-err');
            nameInput.focus();
        }, 500);
    }
});

document.querySelector('#continue-game').addEventListener('click', () => {
    loadSudoku();
    startGame();
})

document.querySelector('#mode-switch').addEventListener('click', (e) => {
    levelIndex = levelIndex + 1 > CONSTANT.MODE_NAMES.length - 1 ? 0 : levelIndex + 1;
    level = CONSTANT.MODES[levelIndex];
    document.querySelector(".mode").textContent = CONSTANT.MODE_NAMES[levelIndex];
});

document.querySelector("#pause-button").addEventListener('click', () => {
    pauseScreen.classList.add('active');
    window.scrollTo(0, 0);
    pause = true;
})

document.querySelector("#resume-button").addEventListener('click', () => {
    pauseScreen.classList.remove('active');
    pause = false;
})

document.querySelectorAll('.another-new-game').forEach(e => {
    e.addEventListener('click', () => {
    returnStartScreen();
    })
});

document.querySelector('#delete-button').addEventListener('click', () => {
    cells[selectedCell].textContent = '';
    cells[selectedCell].setAttribute('data-value', 0);

    let row = Math.floor(selectedCell/CONSTANT.GRID_SIZE);
    let col = selectedCell % CONSTANT.GRID_SIZE;
    su_answer[row][col] = 0;
    removeErrorIndex();
})



const initSudoku = () => {
    //Clear sudoku
    clearSudoku();
    removeBackground();

    //Generate the 2d array for the sudoku puzzle and question
    su = sudokuGen(level);
    su_answer = JSON.parse(JSON.stringify(su.question));

    seconds = 0;

    saveGameInfo();

    //Displaying of numbers to the div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        cells[i].setAttribute('data-value', su.question[row][col]);
        
        if (su.question[row][col] !== 0){
            cells[i].classList.add('filled');
            cells[i].textContent = su.question[row][col];

        }
    }
}

const loadSudoku = () =>{
    let game = getGameInfo();

    levelDisplay.textContent = CONSTANT.MODE_NAMES[game.level];

    //Retrieval of past game information
    su = game.su;
    su_answer = su.answer;
    seconds = game.seconds;
    timeDisplay.textContent = showTime(seconds);
    levelIndex = game.level;

    
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        cells[i].setAttribute('data-value', su.question[row][col]);
        cells[i].textContent = su_answer[row][col] !== 0 ? su_answer[row][col] : '';
        
        if (su.question[row][col] !== 0){
            cells[i].classList.add('filled');
        }
    }

}

const saveGameInfo = () => {
    let game = {
        level: levelIndex,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: su_answer
        }
    }
    localStorage.setItem('blinkingGame', JSON.stringify(game))
}

const removeBackground = () => {
    cells.forEach(e => {
        e.classList.remove('hover');
    })
}

const removeErrorIndex = () => {
    cells.forEach(e => {
        e.classList.remove('err')
    })
}

const checkError = (value) => {
    const highlightError = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value){
            cell.classList.add('err');
            cell.classList.add('cell-err');
            setTimeout(() => {
                cell.classList.remove('cell-err');
            }, 500);
        }
    }

    let index = selectedCell;
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let rowStart = row - row % CONSTANT.BOX_SIZE;
    let colStart = col - col % CONSTANT.BOX_SIZE;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++){
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++){
            let cell = cells[9 * (rowStart + i) + (colStart + j)]
            if (!cell.classList.contains('selected')) highlightError(cell)
        }
    }

    let step = 9;
    while (index - step >= 0){
        highlightError(cells[index-step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81){
        highlightError(cells[index+step]);
        step += 9;
    }

    step = 1;
    while (index - step >= row*9){
        highlightError(cells[index-step]);
        step += 1;
    }

    step = 1;
    while (index + step < (row+1)*9){
        highlightError(cells[index+step]);
        step += 1;
    }

}

const hoverHighlight = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    
    let rowStart = row - row % CONSTANT.BOX_SIZE;
    let colStart = col - col % CONSTANT.BOX_SIZE;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++){
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++){
            let cell = cells[9 * (rowStart + i) + (colStart + j)]
            cell.classList.add('hover');
        }
    }
    let step = 9;
    while (index - step >= 0){
        cells[index - step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while (index + step < 81){
        cells[index + step].classList.add('hover');
        step += 9;
    }

    step = 1;
    while (index - step >= 9*row){
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
    while (index + step < 9*(row+1)){
        cells[index + step].classList.add('hover');
        step += 1;
    }

}

const cellClick = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!(e.classList.contains('filled'))){
                cells.forEach(e => e.classList.remove('selected'));
                selectedCell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                removeBackground();
                hoverHighlight(index);
            }
        });
        e.addEventListener('keydown', (event) => {
            if (!(e.classList.contains('filled'))){
                let validKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                let answer = parseInt(event.key)
                if (validKeys.includes(answer)){
                    cells[selectedCell].textContent = answer;
                    cells[selectedCell].setAttribute('data-value', answer);

                    //Filling sudoku questionnaire with the number input
                    let row = Math.floor(selectedCell / CONSTANT.GRID_SIZE);
                    let col = selectedCell % 9;
                    su_answer[row][col] = answer;

                    //Save game
                    saveGameInfo();
                    
                    //Removing error tags
                    removeErrorIndex();
                    checkError(answer);
                    
                    cells[selectedCell].classList.add('zoom-in');
                    setTimeout(() => {
                        cells[selectedCell].classList.remove('zoom-in');
                    }, 1000);

                    if (sudokuCheck(su_answer)){
                        removeGameInfo();
                        showResult();
                    };
                }
            }
            
        })
    })
}


const removeGameInfo = () => {
    localStorage.removeItem('blinkingGame');
    document.querySelector('#continue-game').style.display = 'none';
}

const showResult = () => {
    clearInterval(timer);
    let newRecord = {
        "name": nameDisplay.textContent,
        "time": showTime(seconds).slice(3)
    }
    addBlinkLeaderboard(newRecord);
    refreshLeaderboard();
    resultScreen.classList.add('active');
    resultTime.textContent = showTime(seconds);
}

const numberInputClick = () => {
    numbersInput.forEach((e, index) => {
        e.addEventListener('click', () => {
            cells[selectedCell].textContent = index + 1;
            cells[selectedCell].setAttribute('data-value', index + 1);

            //Filling sudoku questionnaire with the number input
            let row = Math.floor(selectedCell / CONSTANT.GRID_SIZE);
            let col = selectedCell % 9;
            su_answer[row][col] = index + 1;

            //Save game
            saveGameInfo();
            
            //Removing error tags
            removeErrorIndex();
            checkError(index + 1);
            
            cells[selectedCell].classList.add('zoom-in');
            setTimeout(() => {
                cells[selectedCell].classList.remove('zoom-in');
            }, 1000);

            if (sudokuCheck(su_answer)){
                removeGameInfo();
                showResult();
            };
        })
    })
}


const init = () => {
    const darkMode = JSON.parse(localStorage.getItem('darkmode'));
    if (darkMode) {document.body.classList.toggle('dark')}
    document.querySelector('meta[name="theme-color"').setAttribute('content', darkMode ? "#1a1a2e" : '#fff');

    const game = getGameInfo();
    document.querySelector('#continue-game').style.display = game ? 'grid' : 'none';

    addSpacing();
    cellClick();
    numberInputClick();

    if (getPlayerName()){
        nameInput.value = getPlayerName();
    } else {
        nameInput.focus();
    }


}
console.log('what');
init();

