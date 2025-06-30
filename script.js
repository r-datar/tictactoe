
const gameBoard = (function () {

    const board = [];
    const rows = 3;
    const cols = 3;
    let numMoves = 0; //counts moves on board (max 9)
    const validSymbols = ['x','o']
    let winningSymbol = NaN;

    // Create the two dimensional array to represent the board in memory
    function makeBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i][j] = NaN;
            }
        }
    
    }

    // Checks if the current spot on the board is available for a move
    function isValidSpot(row, col) {
        return board[row][col] !== 'x' && board[row][col] !== 'o' ? true : false;
           
    }   

    // Checks if game has ended in a tie
    function checkIfTie() {
        // All moves are exhausted and winningSymbol is not set, 
        // then there is a tie 
        if(numMoves == 9  && validSymbols.includes(winningSymbol) == false) {
            return true;
        }
        return false;  
    }

    // Resets the board after game is over or forced reset
    function resetBoard() {
        numMoves = 0;
        winningSymbol = NaN;
        makeBoard();
    }

    // Allows player to make a move
    function makeAMove(row,col,symbol) {

        let success = false;
        //If numMoves is 9 means board is full then reset board and numMoves
        if(numMoves == 9) {
            resetBoard();
            
        }

        if(isValidSpot(row,col)) {
            board[row][col] = symbol;
            numMoves++;
            success = true;
        }
        return success;
    }

    // Assigns the winning symbol
    function setWinningSymbol (symbol) {
        winningSymbol = symbol;
    }

    // Retrieves winning symbol
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
        for(let col=0; col < 3; col++) {
            if (board[0][col] == board[1][col] &&  board[0][col] == board[2][col]) {
                setWinningSymbol(board[0][col]);
                return true;
            }
        }
        return false;
    }

    const checkRightDiagonalWin = () => {
         if(board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
            setWinningSymbol(board[0][0]);
            return true;
         }

         return false;
    }

    const checkLeftDiagonalWin = () => {
        if(board[0][2] == board[1][1] && board[0][2] == board[2][0]) {
            setWinningSymbol(board[0][2]);
            return true;
        }
        return false;
    }

//expose only the required functions    
return {makeBoard, makeAMove, checkIfTie, resetBoard,
    checkVerticalWin, checkHorizontalWin, checkLeftDiagonalWin, checkRightDiagonalWin, getWinningSymbol};
})(); 

const gameController = (function () {

    const gameOver = false;
    var gameCount = 0;
    var maxGames = 3;

    let tiedGames = 0;
    const getTiedGames = () => tiedGames;
    const setTiedGames = () => tiedGames++;
    const resetTiedGames = () => {tiedGames = 0;}

    //function to check win

    const checkWin = () => {

        const res = gameBoard.checkVerticalWin() || gameBoard.checkHorizontalWin() 
                        || gameBoard.checkRightDiagonalWin() || gameBoard.checkLeftDiagonalWin(); 
        return res;
    }
    
    const checkTie = () => {
        return gameBoard.checkIfTie()
    }

    const checkGameOn = () => {
        
        if(checkWin() == true || checkTie() == true) {
           
            return false;
        }
        return true;
    }

    const setGameCount = () => {
        gameCount++;
    }

    const resetGameCount = () => {
        gameCount = 0;
    }

    const getGameCount = () => {
        return gameCount;
    }

    gameBoard.makeBoard()


    return {getTiedGames,setTiedGames, resetTiedGames,checkWin, checkTie, 
        checkGameOn, setGameCount, getGameCount, resetGameCount, maxGames}
})();

function createPlayer(symbol, name) {
    const playerSymbol = symbol;
    let playerName;
    let timesWon = 0;

    const getPlayerName = () => playerName;

    const setPlayerName = (name) => {
        playerName = name;
    }

    const getPlayerTimesWon = () => timesWon;
    const setPlayerTimesWon = () => {
        timesWon++;
        console.log('Set player times won:',timesWon)
    }

    const resetPlayerTimesWon = () => {
        timesWon = 0;
    }

    setPlayerName(name);

    return {playerSymbol , getPlayerTimesWon, setPlayerTimesWon,resetPlayerTimesWon, getPlayerName, setPlayerName}

}

const displayController = (function () {
    
    //Change player names
    const playerNameDiv = document.querySelector("div.menu-right");
    playerNameDiv.addEventListener("click",() => {
        let player = prompt('Enter name for Player 1 (x)', playerOne.getPlayerName());
        if(player !== null) playerOne.setPlayerName(player);

        player = prompt('Enter name for Player 2 (o)',playerTwo.getPlayerName());
        if(player !== null) playerTwo.setPlayerName(player);

        showPlayerNames();
    })
   
    //force reset the game 
    const resetGameDiv = document.querySelector("div.menu-left");
    resetGameDiv.addEventListener("click",() => {
        resetTheGame(true);
    })

    // Game box
    const mainbox = document.querySelector("div.main-box");
    mainbox.addEventListener("click",(event) => {
        
        // Game is over, so then reset the board
        if (gameController.checkGameOn() == false) {
            resetTheGame(false)
            return;
        }

        //Game is ON so process the click
        var sqr = event.target.id;
        spot = sqr.split("^")
        
        // Is the move valid?
        if(gameBoard.makeAMove(spot[0],spot[1],curPlayer.playerSymbol)) {
            event.target.innerHTML = curPlayer.playerSymbol;   
        
        // Noone has won yet & there isnt a tie
        if(gameController.checkWin() == false && gameController.checkTie() == false) {
               
                 // Alternate the player for the next move
                curPlayer = curPlayer === playerOne ? playerTwo : playerOne;
                highlightPlayer()
        }
        else {
            // Game is won or tied
            console.log('Game On - setting game count')
            gameController.setGameCount();      
            // is there a tie??
            if(gameController.checkTie()) {
             
                gameController.setTiedGames()

            }
            else if(gameController.checkWin())  
            {
                gameBoard.getWinningSymbol() === 'x' ? playerOne.setPlayerTimesWon() : playerTwo.setPlayerTimesWon()
                
            }
            // Display score starts
            removeHighlightPlayer()
            let result_div = document.querySelector("#s-p1")
            result_div.textContent = playerOne.getPlayerTimesWon();
            result_div = document.querySelector("#s-tie")
            result_div.textContent = gameController.getTiedGames();
            result_div = document.querySelector("#s-p2")
            result_div.textContent = playerTwo.getPlayerTimesWon();

            console.log('gameCount',gameController.getGameCount());
            if (gameController.getGameCount() == gameController.maxGames) {
                let final_winner = "It is a tie !!";
                if (playerOne.getPlayerTimesWon() > playerTwo.getPlayerTimesWon()) {
                    final_winner = playerOne.getPlayerName(); 
                }
                else if (playerOne.getPlayerTimesWon() < playerTwo.getPlayerTimesWon()) {
                    final_winner =  playerTwo.getPlayerName();  
                }
                
                result_div = document.querySelector(".final-score")
                result_div.textContent = "Final Winner:" + final_winner;
            }
            // Display score ends

            
        }
    }

     
    }); // mainbox click event listener ends

    // forcedReset is user initiated 
    function resetTheGame(forcedReset) {
        // Reset the board on screen and in memory
            const directChildren = mainbox.querySelectorAll(':scope > div');
            for (const child of directChildren) {
                    child.innerHTML = ' ';
            }

            //maxgames done or reset is forced
            if (gameController.getGameCount() == gameController.maxGames || forcedReset == true) {
                gameController.resetGameCount();
                gameController.resetTiedGames();
                playerOne.resetPlayerTimesWon();
                playerTwo.resetPlayerTimesWon();
                let result_div = document.querySelector(".final-score");
                result_div.textContent = '';

                result_div = document.querySelector("#s-p1")
                result_div.textContent = '';
                result_div = document.querySelector("#s-tie")
                result_div.textContent = '';
                result_div = document.querySelector("#s-p2")
                result_div.textContent = '';
                
            }

            gameBoard.resetBoard();
            //Next game starts with the other player
            curPlayer = curPlayer === playerOne ? playerTwo : playerOne;
            highlightPlayer();
         }

         function showPlayerNames() {
            let pName = document.querySelector('#h-p1');    
            pName.textContent = playerOne.getPlayerName() + ' (x)';
            pName = document.querySelector('#h-p2');    
            pName.textContent = playerTwo.getPlayerName() + ' (o)';

         }

         function highlightPlayer() {
        // Highlight which player is playing before the move
                curHighLight = curPlayer === playerOne ? '1' : '2';
                curLowLight = curPlayer === playerOne ? '2' : '1';
                let heading_div = document.querySelector(`#h-p${curHighLight}`);
                heading_div.style.cssText += `text-decoration : underline`;
                heading_div = document.querySelector(`#h-p${curLowLight}`);
                heading_div.style.cssText += `text-decoration : none`;

        }

         function removeHighlightPlayer() {
        // Highlight which player is playing before the move
                curHighLight = curPlayer === playerOne ? '1' : '2';
                let heading_div = document.querySelector(`#h-p${curHighLight}`);
                heading_div.style.cssText += `text-decoration: none`;

        }

return {showPlayerNames, highlightPlayer}
})();    

const playerOne = createPlayer('x', "Player1");
const playerTwo = createPlayer('o',"Player2");

let curPlayer = playerOne;

window.addEventListener("load",() => {
            displayController.showPlayerNames()
            displayController.highlightPlayer()
    
}) 
