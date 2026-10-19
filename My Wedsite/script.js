const introScreen = document.getElementById("introScreen");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
    introScreen.classList.add("open");

    setTimeout(() => {
        introScreen.classList.add("gone");
    }, 1600);
});
const photos = [
    "Images/Lake1.jpeg",
    "Images/Plane1.jpeg",
    "Images/River1.jpeg",
    "Images/Starfish.jpeg",
    "Images/Tree1.jpeg",
];

const rotatingPhoto = document.getElementById("rotatingPhoto");

function changePhoto() {
    const randomIndex = Math.floor(Math.random() * photos.length);
    rotatingPhoto.src = photos[randomIndex];
}

setInterval(changePhoto, 6000);

function updateDateTime() {
    const now = new Date();

    document.getElementById("currentDate").textContent =
        now.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    document.getElementById("currentTime").textContent =
        now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
}

updateDateTime();
setInterval(updateDateTime, 1000);

const nameForm = document.getElementById("nameForm");
const visitorName = document.getElementById("visitorName");
const greetingCard = document.getElementById("greetingCard");

nameForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = visitorName.value.trim();
    sessionStorage.setItem("visitorName", name);

    if (name === "") {
        return;
    }

    greetingCard.innerHTML = `
        <h2>Hey, ${escapeName(name)}! 🎀</h2>
        <p>We're so happy you're here ♡</p>
    `;
});

function escapeName(name) {
    const safeElement = document.createElement("span");
    safeElement.textContent = name;
    return safeElement.innerHTML;
}

const savedName = sessionStorage.getItem("visitorName");

if (savedName) {
    greetingCard.innerHTML = `
        <h2>Hey, ${escapeName(savedName)}! 🎀</h2>
        <p>We're so happy you're here ♡</p>
    `;
}

const gameWindow = document.getElementById("gameWindow");
const gameWindowTitle = document.getElementById("gameWindowTitle");
const gameWindowContent = document.getElementById("gameWindowContent");
const closeGameWindow = document.getElementById("closeGameWindow");


const puzzlePhotos = [
    "Images/Puzzle1.jpeg",
    "Images/Puzzle2.jpeg",
    "Images/Puzzle3.jpeg",
    "Images/Puzzle4.jpeg",
    "Images/Puzzle5.jpeg",
    "Images/Puzzle6.jpeg",
    "Images/Puzzle7.jpeg",
    "Images/Puzzle8.jpeg",
    "Images/Puzzle9.jpeg",
    "Images/Puzzle10.jpeg"
];


document.querySelectorAll(".game-card").forEach(function(card) {
    card.addEventListener("click", function() {
        const heading = card.querySelector("h3");
        const title = heading ? heading.textContent.trim() : "Let's play!";
        const name = title.toLowerCase();

        gameWindowTitle.textContent = title;
        gameWindow.classList.add("open");
        gameWindow.setAttribute("aria-hidden", "false");

        if (name.includes("puzzle")) {
            showPuzzleGallery();
        } else if (name.includes("dress")) {
            showDressUp();
        } else if (name.includes("emoji") ||
           name.includes("memory") ||
           name.includes("guess")) {
    showEmojiGuessing();
        } else if (name.includes("personality") || name.includes("quiz")) {
            showPersonalityQuiz();
        } else {
            gameWindowContent.innerHTML =
                "<p>Your little game is coming soon! ♡</p>";
        }
    });
});


/*PUZZLE*/

function showPuzzleGallery() {
    gameWindowContent.innerHTML = `
        <h3>Choose your picture! 🩷</h3>
        <p>Scroll through the photos and pick your favourite.</p>

        <div class="photo-gallery">
            ${puzzlePhotos.map(function(photo, index) {
                return `
                    <button class="photo-choice"
                            type="button"
                            data-photo-index="${index}">
                        <img src="${photo}" alt="Puzzle photo ${index + 1}">
                        <span>Photo ${index + 1}</span>
                    </button>
                `;
            }).join("")}
        </div>

        <p id="selectedPhotoMessage">No picture selected yet ♡</p>
        <button type="button" id="startPuzzle" disabled>
            Start my puzzle 🎀
        </button>
        <div id="puzzlePlayArea"></div>
    `;

    gameWindowContent.querySelectorAll("[data-photo-index]").forEach(
        function(button) {
            button.addEventListener("click", function() {
                selectedPuzzlePhoto = puzzlePhotos[
                    Number(button.dataset.photoIndex)
                ];

                document.getElementById("selectedPhotoMessage").textContent =
                    "Picture selected! Ready to play? ♡";

                document.getElementById("startPuzzle").disabled = false;
            }
        );
        });

    document.getElementById("startPuzzle").addEventListener(
        "click", startPuzzle
    );

}
let selectedPuzzlePhoto = "";
let selectedPuzzleAspectRatio = 1;
let puzzleTiles = [];
let selectedTile = null;

function startPuzzle() {
    if (!selectedPuzzlePhoto) return;

    puzzleTiles = Array.from({ length: 32 }, (_, i) => i);

    for (let i = puzzleTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzleTiles[i], puzzleTiles[j]] =
            [puzzleTiles[j], puzzleTiles[i]];
    }

    if (puzzleTiles.every((tile, i) => tile === i)) {
        [puzzleTiles[0], puzzleTiles[1]] =
            [puzzleTiles[1], puzzleTiles[0]];
    }

    selectedTile = null;
    drawPuzzle();
}


function drawPuzzle() {
    const area = document.getElementById("puzzlePlayArea");

    // Four columns and eight rows = 32 pieces.
    // Keep the puzzle board in the same proportions as the photo.
    const tileRatio = selectedPuzzleAspectRatio * 2;

    area.innerHTML = `
        <h3>Your 32-piece puzzle 🩷</h3>

        <p class="puzzle-instructions">
            Tap one piece, then another, to swap them.
            Use the reference photo below to help you!
        </p>

        <div class="puzzle-board"
             style="--tile-ratio: ${tileRatio};">

            ${puzzleTiles.map(function(originalPosition, currentPosition) {
                const column = originalPosition % 4;
                const row = Math.floor(originalPosition / 4);

                const x = column * (100 / 3);
                const y = row * (100 / 7);

                return `
                    <button type="button"
                        class="puzzle-tile ${
                            selectedTile === currentPosition ? "selected" : ""
                        }"
                        data-tile="${currentPosition}"
                        aria-label="Piece ${currentPosition + 1}"
                        style="
                            background-image: url('${selectedPuzzlePhoto}');
                            background-position: ${x}% ${y}%;
                        ">
                    </button>
                `;
            }).join("")}

        </div>

        <p id="puzzleStatus">You've got this! 🎀</p>

        <div class="puzzle-reference">
            <h4>♡ Picture Reference ♡</h4>
            <img src="${selectedPuzzlePhoto}"
                 alt="The completed picture to use as a puzzle reference">
            <p>Keep this picture in mind while you solve! 🩷</p>
        </div>

        <button type="button" id="newPuzzle">
            Choose another photo
        </button>
    `;

    area.querySelectorAll("[data-tile]").forEach(function(button) {
        button.addEventListener("click", function() {
            const index = Number(button.dataset.tile);

            if (selectedTile === null) {
                selectedTile = index;
                drawPuzzle();
                return;
            }

            [puzzleTiles[selectedTile], puzzleTiles[index]] =
                [puzzleTiles[index], puzzleTiles[selectedTile]];

            selectedTile = null;
            drawPuzzle();

            if (puzzleTiles.every((tile, i) => tile === i)) {
    const status = document.getElementById("puzzleStatus");

    status.innerHTML = `
        <div class="puzzle-celebration-area">
            <div class="puzzle-celebration">
                🎀 You did it, Puzzle Princess! 🎀
                <p>You're a little puzzle genius! 💗</p>
            </div>
        </div>
    `;

    const celebrationArea = status.querySelector(
        ".puzzle-celebration-area"
    );

    const confettiColours = [
        "#ff8fc7", "#ffc4e1", "#f8d66d",
        "#c9a7ff", "#ff6fae", "#ffffff"
    ];

    for (let i = 0; i < 65; i++) {
        const confetti = document.createElement("span");

        confetti.className = "puzzle-confetti";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor =
            confettiColours[
                Math.floor(Math.random() * confettiColours.length)
            ];
        confetti.style.animationDelay = Math.random() * 1.2 + "s";
        confetti.style.borderRadius =
            Math.random() > 0.5 ? "50%" : "2px";

        celebrationArea.appendChild(confetti);
    }
}
        });
    });

    document.getElementById("newPuzzle").addEventListener(
        "click", showPuzzleGallery
    );
}



/* 🧠 EMOJI MEMORY CHALLENGE */

function showEmojiGuessing() {
    const emojiPool = [
        // Emojis from your Surprise game
        "💝", "💖", "💗", "💓", "💕", "🎨", "🎀",
        "🦄", "🐇", "🦈", "🪽", "🎈", "🎆", "♥️",
        "🩷", "💙", "🩵", "💚", "💛", "🧡", "💜",
        "🤍", "💟", "🖤",

        // Your new emojis
        "🍕", "🥖", "🥯", "🏁", "🌍", "🌆", "🌞",
        "❄️", "🌐", "▶️", "🔴", "🟠", "🟡", "🟢",
        "🔵", "🟣", "🟤", "⚫", "⚪", "🕐",

        // A few extra emojis
        "🍓", "🍒", "🍉", "🍰", "🧸", "🌷",
        "🌈", "⭐", "🌙", "☁️", "🐱", "🐻",
        "🍀", "🦋", "🍄", "🎵"
    ];

    let correctEmojis = [];
    let selectedEmojis = [];

    function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    function generateRound() {
        correctEmojis = shuffle(emojiPool).slice(0, 3);
        selectedEmojis = [];

        gameWindowContent.innerHTML = `
            <div class="emoji-memory-game">
                <h3>Memorise these three! 👀</h3>
                <p>You have 3 seconds. Look carefully!</p>

                <div class="emoji-display">
                    ${correctEmojis.map(emoji =>
                        `<span>${emoji}</span>`
                    ).join("")}
                </div>

                <p class="emoji-countdown">
                    Quick, quick! ⏳
                </p>
            </div>
        `;

        setTimeout(function() {
            showChoices();
        }, 3000);
    }

    function showChoices() {
        const choices = shuffle(emojiPool);

        gameWindowContent.innerHTML = `
            <div class="emoji-memory-game">
                <h3>Which three did you see? 💭</h3>
                <p>Choose exactly 3 emojis from the list!</p>

                <p id="emojiSelectionCount">
                    Selected: 0 / 3
                </p>

                <div class="emoji-options">
                    ${choices.map((emoji, index) => `
                        <button type="button"
                            class="emoji-choice"
                            data-emoji-index="${index}"
                            aria-pressed="false"
                            aria-label="Choose emoji ${emoji}">
                            ${emoji}
                        </button>
                    `).join("")}
                </div>

                <p id="emojiFeedback">
                    Trust your memory! 🎀
                </p>

                <button type="button" id="checkEmojiAnswers"
                    disabled>
                    Check my answers ♡
                </button>
            </div>
        `;

        const chosenButtons = gameWindowContent.querySelectorAll(
            ".emoji-choice"
        );

        chosenButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                const emoji = choices[
                    Number(button.dataset.emojiIndex)
                ];

                if (selectedEmojis.includes(emoji)) {
                    selectedEmojis = selectedEmojis.filter(
                        item => item !== emoji
                    );
                } else {
                    if (selectedEmojis.length >= 3) return;
                    selectedEmojis.push(emoji);
                }

                button.classList.toggle(
                    "emoji-selected",
                    selectedEmojis.includes(emoji)
                );

                button.setAttribute(
                    "aria-pressed",
                    String(selectedEmojis.includes(emoji))
                );

                document.getElementById(
                    "emojiSelectionCount"
                ).textContent =
                    `Selected: ${selectedEmojis.length} / 3`;

                document.getElementById(
                    "checkEmojiAnswers"
                ).disabled = selectedEmojis.length !== 3;
            });
        });

        document.getElementById(
            "checkEmojiAnswers"
        ).addEventListener("click", function() {
            const correct = correctEmojis.every(
                emoji => selectedEmojis.includes(emoji)
            );

            gameWindowContent.innerHTML = `
                <div class="emoji-memory-game">
                    <h3>${correct
                        ? "Amazing memory! 🎉"
                        : "Good try! 💗"}</h3>

                    <p>${correct
                        ? "You remembered all three emojis!"
                        : "Not quite! Keep practising your memory."}</p>

                    <p>The emojis were:</p>

                    <div class="emoji-display">
                        ${correctEmojis.map(emoji =>
                            `<span>${emoji}</span>`
                        ).join("")}
                    </div>

                    <button type="button" id="playEmojiAgain">
                        Play again 🎀
                    </button>
                </div>
            `;

            document.getElementById(
                "playEmojiAgain"
            ).addEventListener("click", generateRound);
        });
    }

    generateRound();
}


/*PERSONALITY TEST*/

const personalityQuestions = [
    {
        question: "🎨 Favourite colour?",
        options: [
            ["Pink", "Cute"], ["Blue", "Chill"],
            ["Red", "Fashionista"], ["Green", "Chill"],
            ["Yellow", "Cute"], ["Purple", "Fashionista"],
            ["Orange", "Wildcard"], ["White", "Calm"],
            ["Black", "Calm"], ["Brown", "Wildcard"]
        ]
    },
    {
        question: "👒 Favourite accessory?",
        options: [
            ["Necklace", "Cute"], ["Hat", "Chill"],
            ["Handbag", "Fashionista"], ["Backpack", "Wildcard"],
            ["Bracelet", "Cute"], ["Ring", "Calm"]
        ]
    },
    {
        question: "✨ Choose your aesthetic!",
        options: [
            ["Cottagecore", "Chill"],
            ["Dark Academia", "Wildcard"],
            ["Light Academia", "Calm"],
            ["Clean Girl", "Calm"], ["Punk", "Wildcard"],
            ["Y2K", "Fashionista"], ["Coquette", "Cute"],
            ["Old Money", "Calm"]
        ]
    },
    {
        question: "📱 Pick an emoji!",
        options: [
            ["🩷", "Cute"], ["🎀", "Cute"],
            ["🎨", "Chill"], ["💄", "Fashionista"],
            ["📖", "Calm"], ["📱", "Wildcard"]
        ]
    },
    {
        question: "🐾 Pick an animal!",
        options: [
            ["Cat", "Calm"], ["Dog", "Chill"],
            ["Hamster", "Cute"], ["Fish", "Chill"],
            ["Bird", "Fashionista"], ["Bunny", "Cute"],
            ["Camel", "Wildcard"], ["Deer", "Calm"]
        ]
    }
];

function showPersonalityQuiz() {
    let questionIndex = 0;
    const answers = [];

    function renderQuestion() {
        const question = personalityQuestions[questionIndex];

        gameWindowContent.innerHTML = `
            <h3>What is your vibe? 🩷</h3>
            <p>Question ${questionIndex + 1} of
               ${personalityQuestions.length}</p>

            <div class="personality-result">
                <h2>${question.question}</h2>

                <div class="game-form">
                    <label for="personalityAnswer">Your answer</label>
                    <select id="personalityAnswer">
                        <option value="">Choose your answer...</option>
                        ${question.options.map(function(option) {
                            return `
                                <option value="${option[1]}"
                                    ${answers[questionIndex] === option[1]
                                        ? "selected" : ""}>
                                    ${option[0]}
                                </option>
                            `;
                        }).join("")}
                    </select>

                    <p id="answerMessage"></p>

                    <div style="display:flex; justify-content:space-between;
                                gap:10px; flex-wrap:wrap;">
                        <button type="button" id="previousQuestion"
                            ${questionIndex === 0 ? "disabled" : ""}>
                            ← Back
                        </button>

                        <button type="button" id="nextQuestion">
                            ${questionIndex === personalityQuestions.length - 1
                                ? "Reveal my vibe! 🎀" : "Next →"}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("previousQuestion").addEventListener(
            "click", function() {
                if (questionIndex > 0) {
                    questionIndex--;
                    renderQuestion();
                }
            }
        );

        document.getElementById("nextQuestion").addEventListener(
            "click", function() {
                const answer =
                    document.getElementById("personalityAnswer").value;

                if (!answer) {
                    document.getElementById("answerMessage").textContent =
                        "Choose an answer first, lovely! ♡";
                    return;
                }

                answers[questionIndex] = answer;

                if (questionIndex < personalityQuestions.length - 1) {
                    questionIndex++;
                    renderQuestion();
                } else {
                    showResult();
                }
            }
        );
    }

    function showResult() {
        const totals = {
            Cute: 0,
            Chill: 0,
            Fashionista: 0,
            Calm: 0,
            Wildcard: 0
        };

        answers.forEach(function(answer) {
            totals[answer]++;
        });

        const types = [
            "Cute", "Chill", "Fashionista", "Calm", "Wildcard"
        ];

        const result = types.reduce(function(best, type) {
            return totals[type] > totals[best] ? type : best;
        }, types[0]);

        const descriptions = {
            Cute: "You're sweet, playful, and full of lovely little details! 🎀",
            Chill: "You bring relaxed, cosy, easygoing energy. 🩵",
            Fashionista: "You love making a statement and showing your style! 💄",
            Calm: "You're thoughtful, balanced, and quietly confident. 📖",
            Wildcard: "You're bold, unpredictable, and wonderfully unique! 🎨"
        };

        gameWindowContent.innerHTML = `
            <div class="personality-result">
                <p>Your Pink Petal personality is...</p>
                <h2>${result}! 🩷</h2>
                <p>${descriptions[result]}</p>
                <button type="button" id="retryQuiz">
                    Take the quiz again ♡
                </button>
            </div>
        `;

        document.getElementById("retryQuiz").addEventListener(
            "click", showPersonalityQuiz
        );
    }

    renderQuestion();
}

closeGameWindow.addEventListener("click", function() {
    gameWindow.classList.remove("open");
    gameWindow.setAttribute("aria-hidden", "true");
});

gameWindow.addEventListener("click", function(event) {
    if (event.target === gameWindow) {
        gameWindow.classList.remove("open");
        gameWindow.setAttribute("aria-hidden", "true");
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        gameWindow.classList.remove("open");
        gameWindow.setAttribute("aria-hidden", "true");
    }
});

/*SURPRISE GIFT*/

const surpriseWindowCard =
    document.querySelector(".game-window-card");

const surpriseQuotes = [
    "You deserve all the little things that make you smile. ♡",
    "You are someone's favourite kind of magic.",
    "Every flower blooms at their own pace.",
    "A tiny reminder: you are enough, exactly as you are.",
    "May your day be filled with soft moments and happy surprises.",
    "You make the world a little more lovely just by being in it.",
    "Good things can grow from the smallest beginnings.",
    "Take a breath. You're doing better than you think.",
    "Your story is still unfolding. Make it a lovely one.",
    "A little kindness goes a long, long way."
];

const surpriseEmojis = [
    "💝", "💖", "💗", "💓", "💕", "🎨", "🎀", "🦄",
    "🐇", "🦈", "🪽", "🎈", "🎆", "♥️", "🩷", "💙",
    "🩵", "💚", "💛", "🧡", "💜", "🤍", "💟", "🖤"
];

function showSurprise() {
    surpriseWindowCard.classList.add("surprise-large");

    gameWindowTitle.textContent = "A little surprise for you! 🎁";

    gameWindowContent.innerHTML = `
        <h3>Your tiny gift is waiting... 🩷</h3>
        <p>Every click gives you a new quote, colour, and emoji!</p>

        <div class="surprise-quote" id="surpriseQuote"></div>

        <h3>Your Colour</h3>
        <div class="surprise-colour" id="surpriseColour"></div>
        <p id="surpriseHex"></p>

        <div class="surprise-emoji" id="surpriseEmoji"></div>

        <button type="button" id="anotherSurprise">
            Give me another surprise! 🎀
        </button>
    `;

    function generateSurprise() {
        const quote = surpriseQuotes[
            Math.floor(Math.random() * surpriseQuotes.length)
        ];

        const emoji = surpriseEmojis[
            Math.floor(Math.random() * surpriseEmojis.length)
        ];

        const hex = "#" + Math.floor(Math.random() * 16777216)
            .toString(16).padStart(6, "0").toUpperCase();

        document.getElementById("surpriseQuote").textContent = quote;
        document.getElementById("surpriseColour").style.backgroundColor = hex;
        document.getElementById("surpriseHex").textContent = hex;
        document.getElementById("surpriseEmoji").textContent = emoji;
    }

    document.getElementById("anotherSurprise").addEventListener(
        "click", generateSurprise
    );

    generateSurprise();
}

const surpriseCard = document.querySelector(".surprise-card");

if (surpriseCard) {
    surpriseCard.addEventListener("click", function() {
        gameWindow.classList.add("open");
        gameWindow.setAttribute("aria-hidden", "false");
        surpriseWindowCard.classList.remove("surprise-large");
        showSurprise();
    });
}


/*ABOUT THE MAKER*/

const aboutMakerCard = document.getElementById("aboutMakerCard");

if (aboutMakerCard) {
    aboutMakerCard.addEventListener("click", function() {
        surpriseWindowCard.classList.remove("surprise-large");

        gameWindowTitle.textContent = "About the Maker 🎀";

        gameWindowContent.innerHTML = `
            <div class="personality-result">
                <h2>Hi, Besties! ♡</h2>
                <p>Welcome to my little corner of the internet!</p>

                <p>
                    Aadrita's Pink World is a cute little world filled with
                    games, colours, creativity, and happy surprises.
                </p>

                <p>
                    <strong>Made by:</strong> Aadrita!
                </p>

                <p>
                    <strong>A little about me:</strong><br>
                    I am in 11th Grade, I loveeee pink and cute things! 
                    I have always loved computers, and creative things!
                    My favourite game here is probably the Puzzle!
                </p>

                <p>
                    Thank you for visiting Aadrita's Pink World! 🩷
                </p>
            </div>
        `;

        gameWindow.classList.add("open");
        gameWindow.setAttribute("aria-hidden", "false");
    });
}