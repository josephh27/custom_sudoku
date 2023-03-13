//Create a new grid and fill the empty spaces with value of zero
const newGrid = (size) => {
    let arr = new Array(size);
    
    for (let i = 0; i < size; i++){
        arr[i] = new Array(size);
    }

    for (let i = 0; i < Math.pow(size, 2); i++){
        arr[Math.floor(i/size)][i%size] = CONSTANT.UNASSIGNED;
    }
}

const rowSafe = (grid, row, value) => {
    for (let col = 0; i < CONSTANT.GRID_SIZE; col++){
        if (grid[row][col] === value){
            return false;
        }
    }
    return true;
}


const colSafe = (grid, col, value) => {
    for (let i = 0; i < CONSTANT.GRID_SIZE; i++){
        if (grid[i][col] === value) {
            return false;
        }
    } 
    return true;  
}

const boxSafe = (grid, row, col, value) => {
    for (let row_add = 0; row_add < CONSTANT.BOX_SIZE; row_add++){
        for (let col_add = 0; col_add < CONSTANT.BOX_SIZE; col_add++)
        if (grid[row + row_add][col + col_add] === value){
            return false;
        }
    }
    return true;
}

const isSafe = (grid, row, col, value) => {
    return rowSafe(grid, row, value) && colSafe(grid, col, value) && boxSafe(grid, row, col, value) && value !== CONSTANT.UNASSIGNED;
}

const findEmptyPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++){
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++){
            if (grid[row][col] === CONSTANT.UNASSIGNED){
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
}

const shuffleNumbers = (arr) =>{
    for (let i = 0; i < arr.length; i++){
        let randomIndex = Math.floor(Math.random() * arr.length-1);
        let origValue = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = origValue;
    }
    return arr;
}

const isFullGrid = (grid) => {
    return grid.every((row) => {
        return row.every((cell) => {
            return cell !== CONSTANT.UNASSIGNED;
        });
    });
}

const sudokuCreate = (grid) => {
    let emptyPos = {
        row: -1,
        col: -1
    };
    if (!findEmptyPos(grid, emptyPos)) {return true}
    
    let numberList = shuffleArray([...CONSTANT.NUMBERS]);
    
    let row = emptyPos.row;
    let col = emptyPos.col;
    numberList.forEach((num) => {
        if (isSafe(grid, row, col, num)){
            grid[row][col] = num;

            if (isFullGrid(grid)){
                return true;
            } else {
                if (sudokuCreate(grid)){
                    return true;
                }
            }
            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    })
    return isFullGrid(grid);
}

const sudokuCheck = (grid) => {

}

const createRandomIndex = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = grid;
    let cellReduce = level
    while (cellReduce > 0){
        let row = createRandomIndex();
        let col = createRandomIndex();
        while (res[row][col] === 0){
            row = createRandomIndex();
            col = createRandomIndex();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        cellReduce--;
    }
    return res
}

const findNextEmpty = (grid) => {
    for (let i = 0; i < CONSTANT.GRID_SIZE; i++){
        for (let j = 0; j < CONSTANT.GRID_SIZE; j++){
            if (grid[i][j] === 0){
                return i, j;
            }
        }
    }

    return null, null;
}

const isValid = (grid, guess, row, col) => {
    let rowVals = grid[row];
    if (rowVals.includes(guess)){
        return false;
    }

    let colVals = []
    for (let i = 0; i < CONSTANT.GRID_SIZE; i++){
        colVals.push(grid[i][col]);
    }
    if (colVals.includes(guess)){
        return false;
    }

    let rowStart = Math.floor(row/CONSTANT.BOX_SIZE) * 3;
    let colStart = Math.floor(col/CONSTANT.GRID_SIZE) * 3;
    for (let i = rowStart; i < rowStart + CONSTANT.BOX_SIZE; i++){
        for (let j = colStart; j < colStart + CONSTANT.BOX_SIZE; j++){
            if (grid[i][j] === guess){
                return false;
            }
        }
    }

    return true;

}

const checkMultipleSolutions = (grid, sols) => {
    let row, col;
    [row, col] = findNextEmpty(grid);
    if (row === null){
        sols.push("a solution");
        return true;
    }
    for (let guess = 1; guess < CONSTANT.GRID_SIZE+1; i++){
        if (isValid(grid, guess, row, col)){
            grid[row][col] = guess;
        }

        if (checkMultipleSolutions(grid)){
            return true;
        }
        grid[row][col] = 0;
    }
    return false
}

const sudokuGen = (level) => {
    let gridLayout = newGrid(CONSTANT.GRID_SIZE);
    let sudoku = sudokuCreate(gridLayout);
    let solutions = [];
    if (sudoku){
        let question = removeCells(sudoku, level);
        checkMultipleSolutions(question);
        while (solutions.length > 1){
            question = removeCells(sudoku, level);
            checkMultipleSolutions(question);
            solutions = [];
        }

        return {
            original: sudoku,
            question: question
        };
    }
    return undefined;
}