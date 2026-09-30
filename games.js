/* =========================================================
   TEACHER KHEN'S LEARNING HUB
   GAME DATABASE

   TO ADD A NEW GAME:

   1. Upload the game's image to the same folder.
   2. Copy one game object below.
   3. Change the title, description, image, URL,
      category, and grade.
   4. Save games.js.

   YOU DO NOT NEED TO EDIT index.html.
   ========================================================= */


const games = [

    {
        title: "Classroom Cafe",

        description:
            "Interactive classroom food, restaurant, and ordering lesson.",

        image:
            "cafe.gif",

        url:
            "https://class-cafe-khen.base44.app",

        category:
            "Speaking",

        grade:
            "Grades 1–6",

        keywords:
            "classroom cafe food restaurant drink ordering lesson speaking"
    },


    {
        title: "Give or Keep Review Game",

        description:
            "A mystery-box style review game with points and surprises.",

        image:
            "titlepage.gif",

        url:
            "https://teacherkhen.github.io/giveorkeepreviewgame/",

        category:
            "Review",

        grade:
            "Grades 1–6",

        keywords:
            "give or keep review game mystery box points review"
    },


    {
        title: "Spelling Jungle",

        description:
            "Interactive spelling and sentence-building adventure.",

        image:
            "Intro picture.gif",

        url:
            "https://teacherkhen.github.io/connect-the-dots-spelling-sentencethesentence/",

        category:
            "Spelling",

        grade:
            "Grades 2–6",

        keywords:
            "spelling jungle connect dots sentence spelling reading"
    },


    {
        title: "The Great Fishing Challenge",

        description:
            "Catch the correct answers in this fun fishing challenge.",

        image:
            "catch it.gif",

        url:
            "https://teacherkhen.github.io/fishing/",

        category:
            "Vocabulary",

        grade:
            "Grades 1–6",

        keywords:
            "fishing catch it vocabulary game"
    },


    {
        title: "Spelling Warriors",

        description:
            "A fun spelling challenge for classroom practice.",

        image:
            "spelling.gif",

        url:
            "https://teacherkhen.github.io/spelling/",

        category:
            "Spelling",

        grade:
            "Grades 2–6",

        keywords:
            "spelling warriors spelling words"
    },


    {
        title: "Pacman Vocabulary Quest",

        description:
            "Practice vocabulary while navigating a Pacman-style game.",

        image:
            "pacman.gif",

        url:
            "https://teacherkhen.github.io/pacman/",

        category:
            "Vocabulary",

        grade:
            "Grades 2–6",

        keywords:
            "pacman vocabulary quest vocabulary game words"
    },


    {
        title: "Interactive Whiteboard [S & D]",

        description:
            "Interactive digital whiteboard for classroom teaching.",

        image:
            "whiteboard.jpg",

        url:
            "https://teacherkhen.github.io/whiteboard/",

        category:
            "Teaching Tool",

        grade:
            "Grades 1–6",

        keywords:
            "whiteboard single double draw interactive board"
    },


    {
        title: "Whiteboard & Quiz Master",

        description:
            "Combine an interactive whiteboard with classroom quizzes.",

        image:
            "whiteboard+quiz.jpg",

        url:
            "https://teacherkhen.github.io/whiteboard-quiz/",

        category:
            "Teaching Tool",

        grade:
            "Grades 1–6",

        keywords:
            "whiteboard quiz master quiz teaching tool"
    },


    {
        title: "Phonics Reading Lab",

        description:
            "Practice phonics sounds and reading skills.",

        image:
            "phonics reading.jpg",

        url:
            "https://teacherkhen.github.io/phonics-reading-board/",

        category:
            "Phonics",

        grade:
            "Grades 1–4",

        keywords:
            "phonics reading sounds phonics reading board"
    },


    {
        title: "Fashion Mall: Clothing Lesson",

        description:
            "Learn and practice clothing vocabulary through an interactive mall.",

        image:
            "clothing.png",

        url:
            "https://teacherkhen.github.io/clothinglesson/",

        category:
            "Vocabulary",

        grade:
            "Grades 1–6",

        keywords:
            "fashion mall clothing shopping clothes vocabulary"
    },


    {
        title: "Time Traveler: Past Expressions",

        description:
            "Practice past-time expressions and calendar language.",

        image:
            "calendar.gif",

        url:
            "https://teacherkhen.github.io/past-time/",

        category:
            "Grammar",

        grade:
            "Grades 4–6",

        keywords:
            "time traveler past expressions calendar past tense grammar"
    },


    {
        title: "Monster Card Flip Game",

        description:
            "A fun card-flipping game for matching and review.",

        image:
            "monster flip game.png",

        url:
            "https://teacherkhen.github.io/monster-card-flip-game/",

        category:
            "Review",

        grade:
            "Grades 1–6",

        keywords:
            "monster flip card game match memory review"
    },


    {
        title: "Reading Roll Quest [Phonics Game]",

        description:
            "A phonics reading adventure with a fun roll-and-play format.",

        image:
            "reading.png",

        url:
            "https://teacherkhen.github.io/phonicsreading/",

        category:
            "Phonics",

        grade:
            "Grades 1–4",

        keywords:
            "reading roll quest phonics game book children reading"
    },


    {
        title: "Phonics Race",

        description:
            "Teams race to read phonics words correctly.",

        image:
            "Phonics Race.png",

        url:
            "https://teacherkhen.github.io/Phonicsrace1/",

        category:
            "Phonics",

        grade:
            "Grades 1–6",

        keywords:
            "phonics race game learning ABC sounds phonics reading"
    },


    {
        title: "Click It!",

        description:
            "A fast-paced reaction and quiz game for classroom review.",

        image:
            "clickit.png",

        url:
            "https://teacherkhen.github.io/Clickit/",

        category:
            "Review",

        grade:
            "Grades 1–6",

        keywords:
            "click it fast reaction quiz game review"
    },


    {
        title: "Spider Web Reading",

        description:
            "An interactive phonics reading activity for building words.",

        image:
            "background.gif",

        url:
            "https://teacherkhen.github.io/SpiderWebreading/",

        category:
            "Phonics",

        grade:
            "Grades 1–6",

        keywords:
            "spider web reading phonics game learning words english reading"
    }

];


/* =========================================================
   GENERATE GAME CARDS
   ========================================================= */

function generateGames() {

    const gameGrid =
        document.getElementById("gameGrid");

    if (!gameGrid) {
        return;
    }


    gameGrid.innerHTML = "";


    games.forEach(function(game) {

        const card =
            document.createElement("a");


        card.className =
            "game-card";


        card.href =
            game.url;


        card.target =
            "_blank";


        card.rel =
            "noopener noreferrer";


        card.setAttribute(
            "data-name",
            (
                game.title +
                " " +
                game.description +
                " " +
                game.category +
                " " +
                game.grade +
                " " +
                game.keywords
            ).toLowerCase()
        );


        card.innerHTML = `

            <div class="game-img-container">

                <img
                    src="${game.image}"
                    alt="${game.title}"
                    loading="lazy"
                >

            </div>


            <div class="game-title">

                ${game.title}

            </div>

        `;


        gameGrid.appendChild(card);

    });

}


/* =========================================================
   GAME SEARCH
   ========================================================= */

function filterGames() {

    const input =
        document
            .getElementById("gameSearch")
            .value
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(
            ".game-card"
        );


    let visibleCount = 0;


    cards.forEach(function(card) {

        const keywords =
            (
                card.getAttribute(
                    "data-name"
                ) || ""
            ).toLowerCase();


        if (
            keywords.includes(input)
        ) {

            card.classList.remove(
                "hidden"
            );

            visibleCount++;

        } else {

            card.classList.add(
                "hidden"
            );

        }

    });


    const noResults =
        document.getElementById(
            "noResults"
        );


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }

}