
const gameBoard = (function () {

    const board = [];
    const rows = 3;
    const cols = 3;
    const validSymbols = ['x','o']
    let winningSymbol = NaN;

    function makeBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i][j] = NaN;
            }
        }
    
    }

    function isValidSpot(row, col) {
        return board[row][col] !== 'x' || board[row][col] !== 'o' ? true : false;
           
    }   


    function makeAMove(row,col,symbol) {
        if(isValidSpot(row,col)) {
            board[row][col] = symbol;
        }
    }

    function setWinningSymbol (symbol) {
        console.log('Winning symbol set as',symbol)
        winningSymbol = symbol;
    }

    function getWinningSymbol () {
        return winningSymbol;
    }

    const checkHorizontalWin = () => {
        for(let row=0; row < 3; row++) {
                if (board[row][0] == board[row][1] && board[row][0] == board[row][2]) {
                    setWinningSymbol(board[row][0]);
                    return true;
                }
                    
        }
        return false;
    }


    const checkVerticalWin = () => {
        for(let col=1; col < 3; col++) {
            if (board[0][col] == board[1][col] &&  board[0][col] == board[2][col]) {
                setWinningSymbol(board[0][col]);
                return true;
            }
        }
        return false;
    }

    const checkRightDiagonalWin = (symbol) => {
         if(board[0][0] ==  symbol && board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
            setWinningSymbol(board[0][0]);
            return true;
         }

         return false;
    }

    const checkLeftDiagonalWin = (symbol) => {
        if(board[0][2] == symbol && board[0][2] == board[1][1] && board[0][2] == board[2][0]) {
            setWinningSymbol(board[0][2]);
            return true;
        }
        return false;
    }

     console.log(board)  
//expose only the required functions    
return {makeBoard, makeAMove, checkVerticalWin, checkHorizontalWin, checkLeftDiagonalWin, checkRightDiagonalWin, getWinningSymbol};
})(); 

const gameController = (function () {

    const gameCount = 0;

    //const returnGameState = () => { return state === 0 ? 'Done' : 'In Progress' ;}

    //function to check win

    const checkWin = () => {

        //console.log(gameBoard.checkVerticalWin() , gameBoard.checkHorizontalWin())
        const res = gameBoard.checkVerticalWin() || gameBoard.checkHorizontalWin() 
                        || gameBoard.checkRightDiagonalWin() || gameBoard.checkLeftDiagonalWin(); 
        return res;
    }
    
    

    // Moves
    

    gameBoard.makeBoard()


    return {checkWin}
})();

//console.log('Win Status',gameController.checkWin())
const playerOne = createPlayer('x');
const playerTwo = createPlayer('o');

let curPlayer = playerOne;

do {
    console.log('first',curPlayer.playerSymbol)
    
    let playing_row = Math.floor(Math.random() * (2 - 0 + 1) + 0);
    let playing_col = Math.floor(Math.random() * (2 - 0 + 1) + 0);
    console.log(playing_row,playing_col,curPlayer.playerSymbol)
    gameBoard.makeAMove(playing_row,playing_col,curPlayer.playerSymbol)
    
    curPlayer = curPlayer === playerOne ? playerTwo : playerOne;

} while(gameController.checkWin() == false)

console.log(gameBoard.getWinningSymbol())

gameBoard.getWinningSymbol() === 'x' ? playerOne.setTimesWon() : playerTwo.setTimesWon()


console.log('Winner is',playerOne.getTimesWon(), playerTwo.getTimesWon())




function createPlayer(symbol) {
    const playerSymbol = symbol;
    
    let timesWon = 0

    const getTimesWon = () => timesWon;
    const setTimesWon = () => timesWon++;
    


    return {playerSymbol , getTimesWon, setTimesWon}

} 



//const randomNumber = Math.floor(Math.random() * (2 - 0 + 1) + 0);