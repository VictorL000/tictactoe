const gameFac = () => {
    let turn = 0;
    let canPlay = true;
    let board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    let scoreboard = document.querySelectorAll(
        ".x-wins-container h2, .o-wins-container h2"
    );
    scoreboard.forEach((h2) => {
        h2.addEventListener("transitionend", (e) => {
            if (e.propertyName !== "transform") return;
            e.target.classList.remove("playing");
        });
    });
    let init = () => {
        console.log("2");
        document.querySelector(".victory-container").style.opacity = 0;
        board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        turn = 0;
        document.querySelectorAll(".cell img").forEach((c) => {
            c.remove();
        });
        canPlay = true;
        document.querySelector("body").addEventListener(
            "click",
            (e) => {
                if (!canPlay) {
                    e.stopImmediatePropagation();
                    init();
                }
            },
            true //WILL RUN BEFORE PLACE
        );
        document.querySelector(".victory-container").style.transform =
            "scale(0.90)";
    };
    // 1 is for X, -1 is for O
    let getCanPlay = () => {
        return canPlay;
    };
    let place = function (index, cell) {
        console.log(canPlay);
        if (cell.hasChildNodes() || !canPlay) {
            return;
        }
        letter = turn % 2 === 0 ? 1 : -1;
        turn++;
        const char = document.createElement("img");

        if (letter === 1) {
            char.src = "x.svg";
            board[Math.floor(index / 3)][index % 3] = 1;
        } else {
            board[Math.floor(index / 3)][index % 3] = -1;
            char.src = "o.svg";
        }

        char.style.width = "100%";
        char.addEventListener("transitionend", (e) => {
            if (e.propertyName !== "transform") return;
            e.target.classList.remove("playing");
        });
        char.setAttribute("draggable", false);
        char.style.transform = "scale(0.9)";
        cell.appendChild(char);
        setTimeout(() => {
            char.style.transform = "";
        }, 10);
        char.classList.add("playing");
        let winHighlight = checkWin();
        if (checkWin()) {
            gameOver(letter, winHighlight);
            return;
        }
        if (turn === 9) {
            gameOver(0);
        }
        return;
    };
    let incScore = (winner) => {
        if (winner === 1) {
            scoreboard[0].textContent = parseInt(scoreboard[0].textContent) + 1;
            scoreboard[0].classList.add("playing");
        } else {
            scoreboard[1].textContent = parseInt(scoreboard[1].textContent) + 1;
            scoreboard[1].classList.add("playing");
        }
    };
    let gameOver = (winner, winHighlight) => {
        if (winner === 0) {
            document.querySelector(".victory-container h2").textContent =
                "Draw!";
            document.querySelector(".victory-container").style.opacity = 1;
            canPlay = false;
            return;
        }

        document.querySelector(".victory-container h2").textContent =
            winner === 1 ? "X wins!" : "O wins!";
        document.querySelector(".victory-container").style.opacity = 1;
        document.querySelector(".victory-container").style.transform =
            "scale(1)";
        incScore(winner);
        canPlay = false;
    };

    let checkWin = () => {
        for (let i = 0; i < 3; i++) {
            if (Math.abs(board[i][0] + board[i][1] + board[i][2]) === 3) {
                return true;
            }
            if (Math.abs(board[0][i] + board[1][i] + board[2][i]) === 3) {
                return true;
            }
        }
        if (Math.abs(board[0][0] + board[1][1] + board[2][2]) === 3) {
            return true;
        }
        if (Math.abs(board[0][2] + board[1][1] + board[2][0]) === 3) {
            return true;
        }
        return false;
    };
    return { board, init, place, getCanPlay, checkWin };
};

let i = 0;
let game = gameFac();
game.init();
document.querySelectorAll(".cell").forEach((c) => {
    c.dataset.idx = i++;
    c.addEventListener("click", (e) => {
        game.place(c.dataset.idx, c);
    });
});

document.querySelectorAll(".cell").forEach((c) => {
    c.addEventListener("mouseover", (e) => {
        if (!c.hasChildNodes() && game.getCanPlay()) {
            document
                .querySelector(
                    `#shadows :nth-child(${parseInt(c.dataset.idx) + 1})`
                )
                .classList.add("hover");
        }
    });
    c.addEventListener("mouseout", (e) => {
        document
            .querySelector(
                `#shadows :nth-child(${parseInt(c.dataset.idx) + 1})`
            )
            .classList.remove("hover");
    });
});

// document.getElementById('reset-button').addEventListener('click', () => {
//     game.init();
// })
