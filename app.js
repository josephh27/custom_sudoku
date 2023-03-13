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

let selected_cell = -1



