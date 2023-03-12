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
    
}


const sudokuGen = (level) => {
    let gridLayout = newGrid(CONSTANT.GRID_SIZE);
    let sudoku = sudokuCreate(gridLayout);
    if (sudoku){
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        };
    }
    return undefined;
}