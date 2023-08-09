const selectBox = document.querySelector(".selectionBox");
const selectXbtn = document.querySelector(".champX");
const selectObtn = document.querySelector(".champO");
const playBoard = document.querySelector(".play-board");
const allBox = document.querySelectorAll("section span");
const players = document.querySelector(".players");
const resultBox = document.querySelector(".result-box");
const wonText = document.querySelector(".won-text");
const replayBtn = document.querySelector(".rematchBtn");

// First time when window loaded.
window.onload = () => {
	//Adding onclick event in all sections span block.
	for (let i = 0; i < allBox.length; i++) {
		allBox[i].addEventListener("click", clickedBox);
	}

	selectXbtn.addEventListener("click", () => {
		selectBox.classList.add("hide"); // Hide the selectBox when clicked on champ X.
		playBoard.classList.add("show"); //show the playboard when clicked on champ X button.
	});

	selectObtn.addEventListener("click", () => {
		selectBox.classList.add("hide");
		playBoard.classList.add("show");
		players.classList.add("active", "player"); //adding three class names in player element.
	});
};

let playerXIcon = "fas fa-times"; //class name of font awesome cross icon.
let playerOIcon = "far fa-circle"; //class name of font awesome circle icon.
let playerSign = "X"; //Suppose player will be X.
let runBot = true;

// userClick function
function clickedBox() {
	//if players element contains player.
	if (players.classList.contains("player")) {
		this.innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon in the playboard where user clicked.
		players.classList.add("active");
		// if player selects O, then change the playerSign value to O.
		playerSign = "O";
		this.setAttribute("id", playerSign);
	} else {
		this.innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon in the playboard where user clicked.
		players.classList.add("active");
		this.setAttribute("id", playerSign);
	}
	selectWinner(); //Calling the selectWinner function.
	playBoard.style.pointerEvents = "none"; //once user selects, they can't select any other box until a box is selected by the bot.
	this.style.pointerEvents = "none"; //once the user selects any box, that box can't be selected again.
	let randomDelayTime = (Math.random() * 1000 + 200).toFixed(); //generating random time delay for the bot so that it will delay randomly.
	setTimeout(() => {
		bot(runBot);
	}, randomDelayTime);
}

// botClickedFunction.
function bot(runBot) {
	//if runBot is true, then run the following code. The moment we get the winner,
	//  the game is over.
	if (runBot) {
		//first change the playerSign so if user has X value in id, then bot will have O.
		playerSign = "O";
		let array = []; //We store all the unselected box indexes in this array.
		for (let i = 0; i < allBox.length; i++) {
			if (allBox[i].childElementCount === 0) {
				array.push(i); //inserting unclicked or unselected boxes inside the array.
			}
		}

		// Calculate the best available position for the bot to move.
		let bestPosition = calculateBestPosition();

		if (array.length > 0) {
			if (players.classList.contains("player")) {
				//if players element has .player
				allBox[bestPosition].innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag.
				players.classList.remove("active");
				// if user is O, then the box id value will be "X".
				playerSign = "X";
				allBox[bestPosition].setAttribute("id", playerSign);
			} else {
				allBox[bestPosition].innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon tag.
				players.classList.remove("active");
				allBox[bestPosition].setAttribute("id", playerSign);
			}
			selectWinner(); //Calling the selectWinner function to determine if the bot wins.
		}
		allBox[bestPosition].style.pointerEvents = "none"; // once the bot selects any box, the user can't select or click on that box.
		playBoard.style.pointerEvents = "auto";
		playerSign = "X"; //passing the "X" value.
	}
}

// Function for matching winning combinations & selecting a winner.
function getClass(idname) {
	return document.querySelector(".box" + idname).id; //returning id name.
}

function checkClass(val1, val2, val3, sign) {
	if (
		getClass(val1) === sign &&
		getClass(val2) === sign &&
		getClass(val3) === sign
	) {
		return true;
	}
}

function selectWinner() {
	//writing all possible solutions and if one of them matches, select the winner.
	if (
		checkClass(1, 2, 3, playerSign) ||
		checkClass(4, 5, 6, playerSign) ||
		checkClass(7, 8, 9, playerSign) ||
		checkClass(1, 4, 7, playerSign) ||
		checkClass(2, 5, 8, playerSign) ||
		checkClass(3, 6, 9, playerSign) ||
		checkClass(1, 5, 9, playerSign) ||
		checkClass(3, 5, 7, playerSign)
	) {
		runBot = false;
		bot(runBot);

		//show the result who is the winner.
		setTimeout(() => {
			playBoard.classList.remove("show");
			resultBox.classList.add("show");
		}, 900);

		wonText.innerHTML = `CHAMP <p style="color:green">${playerSign}</p><p>🏆</p> WON THE GAME.`;
	} else {
		// Match result is a draw.
		// First we will check all ids (means all the boxes). If all spans (boxes) have ids, it means no one won the game, and it's a draw.
		if (
			getClass(1) !== "" &&
			getClass(2) !== "" &&
			getClass(3) !== "" &&
			getClass(4) !== "" &&
			getClass(5) !== "" &&
			getClass(6) !== "" &&
			getClass(7) !== "" &&
			getClass(8) !== "" &&
			getClass(9) !== ""
		) {
			runBot = false;
			bot(runBot);
			setTimeout(() => {
				playBoard.classList.remove("show");
				resultBox.classList.add("show");
			}, 900);
			wonText.innerHTML = `MATCH DRAWN <p>⚖️</p>`;
		}
	}
}

// Calculate the best available position for the bot to move
function calculateBestPosition() {
	// Clone the current board state
	let boardState = Array.from(allBox).map((box) =>
		box.getAttribute("id") ? box.getAttribute("id") : ""
	);

	// Check if there is a winning move for the bot
	for (let i = 0; i < boardState.length; i++) {
		if (boardState[i] === "") {
			boardState[i] = playerSign;
			if (isWinningMove(boardState, playerSign)) {
				return i;
			}
			boardState[i] = "";
		}
	}

	// Check if there is a winning move for the player and block it
	playerSign = playerSign === "X" ? "O" : "X";
	for (let i = 0; i < boardState.length; i++) {
		if (boardState[i] === "") {
			boardState[i] = playerSign;
			if (isWinningMove(boardState, playerSign)) {
				playerSign = playerSign === "X" ? "O" : "X";
				return i;
			}
			boardState[i] = "";
		}
	}
	playerSign = playerSign === "X" ? "O" : "X";

	// Choose a random available position
	let emptyBoxes = [];
	for (let i = 0; i < boardState.length; i++) {
		if (boardState[i] === "") {
			emptyBoxes.push(i);
		}
	}
	return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
}

// Check if the current move leads to a winning state.
function isWinningMove(board, sign) {
	if (
		(board[0] === sign && board[1] === sign && board[2] === sign) ||
		(board[3] === sign && board[4] === sign && board[5] === sign) ||
		(board[6] === sign && board[7] === sign && board[8] === sign) ||
		(board[0] === sign && board[3] === sign && board[6] === sign) ||
		(board[1] === sign && board[4] === sign && board[7] === sign) ||
		(board[2] === sign && board[5] === sign && board[8] === sign) ||
		(board[0] === sign && board[4] === sign && board[8] === sign) ||
		(board[2] === sign && board[4] === sign && board[6] === sign)
	) {
		return true;
	}
	return false;
}

//REMATCH button.
replayBtn.addEventListener("click", () => {
	window.location.reload(); //reload the current page.
});
