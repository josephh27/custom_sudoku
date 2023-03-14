/*Fixes: 
- Need to fix the completion test case
- Unnecessary use of ids
- When you input a wrong answer and then reload, the error highlights vanish
*/


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
const numbersInput = document.querySelectorAll(".numbers");
const nameDisplay = document.querySelector("#in-game-name");
const levelDisplay = document.querySelector("#in-game-level");
const timeDisplay = document.querySelector("#game-time");

let levelIndex = 0;
let level = CONSTANT.MODES[levelIndex];

let timer = null;
let pause = false;
let seconds = 0;

let su = undefined;
let su_answer = undefined;

let selected_cell = -1;

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const addSpacing = () => {
    let index = 0;
    for (let i = 0; i < Math.power(CONSTANT.BOX_SIZE, 2); i++){
        row = Math.floor(i / CONSTANT.GRID_SIZE);
        col = i % CONSTANT.GRID_SIZE;
        if (row == 2 || row == 5){cells[index].style.marginBottom = '10px';}
        if (col == 2 || col == 5){cells[index].style.marginRight = '10px';}
        index++;
    }
}

const setPlayerName = (name) => localStorage.setItem('player_name', name);
const getPlayerName = () => localStorage.getItem('player_name');

const showTime = (seconds) => {new Date(seconds * 1000).toISOString.slice(11, 19)};

const startGame = () => {
    startScreen.classList.remove('active');
    inGameScreen.classList.add('active');

    nameDisplay.innerHTML = nameInput.value.trim();
    setPlayerName(nameInput.value.trim());

    levelDisplay.innerHTML = CONSTANT.MODE_NAMES[levelIndex];

    showTime(seconds);

    timer = setInterval(() => {
        if (!pause){
            seconds += 1;
            showTime(seconds);
        }
    }, 1000)

}

const cellClick = (){
    cells.forEach(e)
}

const init = () => {
    const darkMode = JSON.parse(localStorage.getItem('darkmode'));
    if (darkmode) {document.body.classList.toggle('dark')}
    document.querySelector('meta[name="theme-color"').setAttribute('content', darkmode ? "#1a1a2e" : '#fff');

    const game = getGameInfo();
    document.querySelector('#continue-game').style.display = game ? 'grid' : 'none';

    addSpacing();

}