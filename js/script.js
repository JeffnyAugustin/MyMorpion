
// Effets sonores jeu 
const playerSound = new Audio('/assets/audio/decidemp3.mp3');
playerSound.preload = "auto";
// playerSound.play();
const laptopSound = new Audio('/assets/audio/good.mp3');
laptopSound.preload = "auto";
// laptopSound.play();
const startGame = new Audio('/assets/audio/dramatic-flute.mp3');
startGame.preload = "auto";
// startGame.play();
startGame.currentTime -= 30;
const playerWin = new Audio('/assets/audio/winsquare.mp3');
playerWin.preload = "auto";
// playerWin.play();
const player2Win = new Audio('/assets/audio/sucesstrumpets.mp3');
player2Win.preload = "auto";
// player2Win.play();
const tieMusic = new Audio('/assets/audio/start-computer.mp3');
tieMusic.preload = "auto";
// tieMusic.play();




// condition de victoire
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const form = document.querySelector("#myForm");
// bouton nouvelle partie
const newGameBtn = document.querySelector("#restartBtn");
// bouton reset game
const resetGameBtn = document.querySelector("#resetBtn");
const resetMyGame = document.querySelector(".purple");
const sum = document.getElementById("counter");

var Xcounter = 0;
var Ocounter = 0;

const pointPlayer1 = document.getElementById("counterPlayer1");
pointPlayer1.textContent = Xcounter;

const pointPlayer2 = document.getElementById("counterPlayer2");
pointPlayer2.textContent = Ocounter;


// Couper le son

const audioGameBtn = document.querySelector(".blue");
audioGameBtn.addEventListener("click", audiobtn);
let soundMuted = true;

    function audiobtn() {
    if (soundMuted) {
        playerSound.muted = false;
        laptopSound.muted = false;
        startGame.muted = false;
        playerWin.muted = false;
        tieMusic.muted = false;
        soundMuted = false;
        audioGameBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
        console.log(soundMuted);
    } else {
        playerSound.muted = true;
        laptopSound.muted = true;
        startGame.muted = true;
        playerWin.muted = true;
        tieMusic.muted = true;
        soundMuted = true;
        console.log(soundMuted);
        audioGameBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
    }
    }



// Change de fond d'écran autant qu'on veut


const changeimage = document.getElementById("changeImg");
changeimage.addEventListener("click", changeImgBtn);

let changes = document.body;
let images = ['/assets/images/wallpurple.jpg', '/assets/images/wallpapers.jpg', '/assets/images/WallpaperDog.jpg', '/assets/images/img27.jpg', '/assets/images/img35.jpg','/assets/images/img58.jpg', '/assets/images/img51.jpg', '/assets/images/img2.png', '/assets/images/pokemon.png', '/assets/images/img5.jpg', '/assets/images/img8.jpg', '/assets/images/img23.jpg',  '/assets/images/img11.jpg', '/assets/images/wallpurple.jpg'];
let index = 0;

function changeImgBtn() {
  index = (index + 1) % images.length;
  changes.style.backgroundImage = `url("${images[index]}")`;
}

const bgImg = changes.style.backgroundImage = ('url("/assets/images/wallpurple.jpg")');

  changeimage.addEventListener("click", changeImgBtn);


// Nouvelle partie


newGameBtn.addEventListener("click", () => {
  location.reload();
});

form.addEventListener("submit", (event) => {
  //prevent page refresh
    event.preventDefault();

  //Formulaire joueur
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  document.querySelector(".modal-wrapper").setAttribute("hidden", true);
  initializeGame(data);
});

const initializeVariables = (data) => {
    data.choice = +data.choice;
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    data.player1 = "X";
    data.player2 = "O";
    data.round = 0;
    data.currentPlayer = "X";
    data.gameOver = false;
};

// recommencer le jeu
const resetDom = () => {
    document.querySelectorAll(".box").forEach((box) => {
    box.className = "box";
    box.textContent = "";
    });
};

const addEventListenersToGameBoard = (data) => {
    document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", (event) => {
        playMove(event.target, data);
    });
    });
    resetGameBtn.addEventListener("click", () => {
    initializeVariables(data);
    resetDom();
    adjustDom("displayTurn", "C'est au tour de " + `${data.player1Name} ! `);
    });

    resetMyGame.addEventListener("click", () => {
    initializeVariables(data);
    resetDom();
    adjustDom("displayTurn", "C'est au tour de " + `${data.player1Name} ! `);
    });
};

const initializeGame = (data) => {
  //initialize game variables

    adjustDom("displayTurn", "C'est au tour de " + `${data.player1Name} ! `);
    initializeVariables(data);
    console.log(initializeVariables(data));

    addEventListenersToGameBoard(data);
};

const playMove = (box, data) => {
  //is game over? If game over, don't do anything
    if (data.gameOver || data.round > 8) {
    return;
    }
  //check if game box has a letter in it, if so, don't do anything
    if (data.board[box.id] === "X" || data.board[box.id] === "O") {
    return;
    }

  //adjust the DOM for player move, and then check win conditions

    data.board[box.id] = data.currentPlayer;
    box.textContent = data.currentPlayer;
    box.classList.add(data.currentPlayer === "X" ? "player1" : "player2");
  //increase the round #
    data.round++;

  //check end conditions
    if (endConditions(data)) {
    return;
    }

    // jouer contre ordinateur niveau facile

// const easyRobotGame = document.getElementById("#easyrobot");
// easyRobotGame.addEventListener("click", easyRobot);



  //change current player
  //change the dom, and change data.currentplayer
    if (data.choice === 0) {
    changePlayer(data);
    } else if (data.choice === 1) {
    //easy ai
    easyAiMove(data);
    data.currentPlayer = "X";

    //change back to player1
    } else if (data.choice === 2) {
    changePlayer(data);
    impossibleAIMove(data);
    if (endConditions(data)) {
        return;
    }
    changePlayer(data);
    }
};

const endConditions = (data) => {
  //3 potential options,
  //winner
  //tie
  //game not over yet
    if (checkWinner(data, data.currentPlayer)) {
        
    //adjust the dom to reflect win
    let winnerName =
        data.currentPlayer === "X" ? data.player1Name : data.player2Name;
    adjustDom("displayTurn", " Le jeu est terminé : " + winnerName + " a gagné la partie ! ");
    playerWin.play();
   
    

    if(data.currentPlayer === "X" ) {
      Xcounter++
      console.log(Xcounter);
      const pointPlayer1 = document.getElementById("counterPlayer1");
      pointPlayer1.textContent = data.player1Name + "  " + ":" +  " " + Xcounter + " " + "point(s)" + "     ";      
      pointPlayer2.textContent = "      " + "  -  " + "     " + data.player2Name + "   " + ":" + "  " + Ocounter +  "   " + "point(s)";     



    }else if (data.currentPlayer === "O") {
      Ocounter++
      console.log(Ocounter);
      const pointPlayer2 = document.getElementById("counterPlayer2");
      pointPlayer2.textContent = data.player2Name + "  " + ":" +  " " + Ocounter + " " + "point(s)" + "     "; 
      pointPlayer1.textContent = "      " + "  -  " + "     " + data.player1Name + "   " + ":" + "  " + Xcounter  +  "   " + "point(s)"; 

    }

    


    return true;
    } else if (data.round === 9) {
    adjustDom("displayTurn", "Match Nul !");
    data.gameOver = true;
    //adjust the dom to reflect tie
    tieMusic.play();
    
    return true;
    }
    return false;
};

const checkWinner = (data, player) => {
    let result = false;
    winningConditions.forEach((condition) => {
    if (
        data.board[condition[0]] === player &&
        data.board[condition[1]] === player &&
        data.board[condition[2]] === player
    ) {
        result = true;
    }
    });
    return result;
};

const adjustDom = (className, textContent) => {
    const elem = document.querySelector(`.${className}`);
    elem.textContent = textContent;
};

const changePlayer = (data) => {
    data.currentPlayer = data.currentPlayer === "X" ? "O" : "X";
    if (data.currentPlayer === "X" ) {
    playerSound.play();
    }else {
    laptopSound.play();  
    }

    console.log(data.currentPlayer);
  //adjust the dom
    let displayTurnText =
    data.currentPlayer === "X" ? data.player1Name : data.player2Name;
    adjustDom("displayTurn", " C'est au tour de " + `${displayTurnText} ! `);
};





const easyAiMove = (data) =>  {
  changePlayer(data);

  data.round++;
  let availableSpaces = data.board.filter(
    (space) => space !== "X" && space !== "O"
  );
  let move =
    availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  data.board[move] = data.player2;
  setTimeout(() => {
    let box = document.getElementById(`${move}`);
    box.textContent = data.player2;
    box.classList.add("player2");
  }, 200);

  if (endConditions(data)) {
    return;
  }
  changePlayer(data);
};

const impossibleAIMove = (data) => {
  data.round++;
  //get best possible move from minimax algorithm
  const move = minimax(data, "O").index;
  data.board[move] = data.player2;
  let box = document.getElementById(`${move}`);
  box.textContent = data.player2;
  box.classList.add("player2");

  console.log(data);
};

const minimax = (data, player) => {
  let availableSpaces = data.board.filter(
    (space) => space !== "X" && space !== "O"
  );
  if (checkWinner(data, data.player1)) {
    return {
      score: -100,
    };
  } else if (checkWinner(data, data.player2)) {
    return {
      score: 100,
    };
  } else if (availableSpaces.length === 0) {
    return {
      score: 0,
    };
  }
  //check if winner, if player1 wins set score to -100
  //if tie, set score to 0
  //if win set score to 100
  const potentialMoves = [];
  //loop over available spaces to get list of all potential moves and check if wins
  for (let i = 0; i < availableSpaces.length; i++) {
    let move = {};
    move.index = data.board[availableSpaces[i]];
    data.board[availableSpaces[i]] = player;
    if (player === data.player2) {
      move.score = minimax(data, data.player1).score;
    } else {
      move.score = minimax(data, data.player2).score;
    }
    //reset the move on the board
    data.board[availableSpaces[i]] = move.index;
    //push the potential move to the array
    potentialMoves.push(move);
  }
  let bestMove = 0;
  if (player === data.player2) {
    let bestScore = -10000;
    for (let i = 0; i < potentialMoves.length; i++) {
      if (potentialMoves[i].score > bestScore) {
        bestScore = potentialMoves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < potentialMoves.length; i++) {
      if (potentialMoves[i].score < bestScore) {
        bestScore = potentialMoves[i].score;
        bestMove = i;
      }
    }
  }
  return potentialMoves[bestMove];
};

