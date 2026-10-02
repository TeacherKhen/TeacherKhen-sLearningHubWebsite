/* =========================================================
   TEACHER KHEN'S LEARNING HUB
   GAME DATABASE

   access:
   "free"    = Free game
   "premium" = Premium game
   ========================================================= */


const games = [

    {
        title: "Classroom Cafe",
        description: "Interactive classroom food, restaurant, and ordering lesson.",
        image: "cafe.gif",
        url: "https://class-cafe-khen.base44.app",
        category: "Speaking",
        grade: "Grades 1–6",
        keywords: "classroom cafe food restaurant drink ordering lesson speaking",
        access: "free"
    },

    {
        title: "Give or Keep Review Game",
        description: "A mystery-box style review game with points and surprises.",
        image: "titlepage.gif",
        url: "https://teacherkhen.github.io/giveorkeepreviewgame/",
        category: "Review",
        grade: "Grades 1–6",
        keywords: "give or keep review game mystery box points review",
        access: "free"
    },

    {
        title: "Spelling Jungle",
        description: "Interactive spelling and sentence-building adventure.",
        image: "Intro picture.gif",
        url: "https://teacherkhen.github.io/connect-the-dots-spelling-sentencethesentence/",
        category: "Spelling",
        grade: "Grades 2–6",
        keywords: "spelling jungle connect dots sentence spelling reading",
        access: "free"
    },

    {
        title: "The Great Fishing Challenge",
        description: "Catch the correct answers in this fun fishing challenge.",
        image: "catch it.gif",
        url: "https://teacherkhen.github.io/fishing/",
        category: "Vocabulary",
        grade: "Grades 1–6",
        keywords: "fishing catch it vocabulary game",
        access: "free"
    },

    {
        title: "Spelling Warriors",
        description: "A fun spelling challenge for classroom practice.",
        image: "spelling.gif",
        url: "https://teacherkhen.github.io/spelling/",
        category: "Spelling",
        grade: "Grades 2–6",
        keywords: "spelling warriors spelling words",
        access: "free"
    },

    {
        title: "Pacman Vocabulary Quest",
        description: "Practice vocabulary while navigating a Pacman-style game.",
        image: "pacman.gif",
        url: "https://teacherkhen.github.io/pacman/",
        category: "Vocabulary",
        grade: "Grades 2–6",
        keywords: "pacman vocabulary quest vocabulary game words",
        access: "free"
    },

    {
        title: "Interactive Whiteboard [S & D]",
        description: "Interactive digital whiteboard for classroom teaching.",
        image: "whiteboard.jpg",
        url: "https://teacherkhen.github.io/whiteboard/",
        category: "Teaching Tool",
        grade: "Grades 1–6",
        keywords: "whiteboard single double draw interactive board",
        access: "free"
    },

    {
        title: "Whiteboard & Quiz Master",
        description: "Combine an interactive whiteboard with classroom quizzes.",
        image: "whiteboard+quiz.jpg",
        url: "https://teacherkhen.github.io/whiteboard-quiz/",
        category: "Teaching Tool",
        grade: "Grades 1–6",
        keywords: "whiteboard quiz master quiz teaching tool",
        access: "free"
    },

    {
        title: "Phonics Reading Lab",
        description: "Practice phonics sounds and reading skills.",
        image: "phonics reading.jpg",
        url: "https://teacherkhen.github.io/phonics-reading-board/",
        category: "Phonics",
        grade: "Grades 1–4",
        keywords: "phonics reading sounds phonics reading board",
        access: "free"
    },

    {
        title: "Fashion Mall: Clothing Lesson",
        description: "Learn and practice clothing vocabulary through an interactive mall.",
        image: "clothing.png",
        url: "https://teacherkhen.github.io/clothinglesson/",
        category: "Vocabulary",
        grade: "Grades 1–6",
        keywords: "fashion mall clothing shopping clothes vocabulary",
        access: "free"
    },

    {
        title: "Time Traveler: Past Expressions",
        description: "Practice past-time expressions and calendar language.",
        image: "calendar.gif",
        url: "https://teacherkhen.github.io/past-time/",
        category: "Grammar",
        grade: "Grades 4–6",
        keywords: "time traveler past expressions calendar past tense grammar",
        access: "free"
    },

    {
        title: "Monster Card Flip Game",
        description: "A fun card-flipping game for matching and review.",
        image: "monster flip game.png",
        url: "https://teacherkhen.github.io/monster-card-flip-game/",
        category: "Review",
        grade: "Grades 1–6",
        keywords: "monster flip card game match memory review",
        access: "free"
    },

    {
        title: "Reading Roll Quest [Phonics Game]",
        description: "A phonics reading adventure with a fun roll-and-play format.",
        image: "reading.png",
        url: "https://teacherkhen.github.io/phonicsreading/",
        category: "Phonics",
        grade: "Grades 1–4",
        keywords: "reading roll quest phonics game book children reading",
        access: "free"
    },

    {
        title: "Phonics Race",
        description: "Teams race to read phonics words correctly.",
        image: "Phonics Race.png",
        url: "https://teacherkhen.github.io/Phonicsrace1/",
        category: "Phonics",
        grade: "Grades 1–6",
        keywords: "phonics race game learning ABC sounds phonics reading",
        access: "free"
    },

    {
        title: "Click It!",
        description: "A fast-paced reaction and quiz game for classroom review.",
        image: "clickit.png",
        url: "https://teacherkhen.github.io/Clickit/",
        category: "Review",
        grade: "Grades 1–6",
        keywords: "click it fast reaction quiz game review",
        access: "premium"
    },

    {
        title: "Spider Web Reading",
        description: "An interactive phonics reading activity for building words.",
        image: "background.gif",
        url: "https://spiderwebreading.teacherkhen.com",
        category: "Phonics",
        grade: "Grades 1–6",
        keywords: "spider web reading phonics game learning words english reading",
        access: "free"
    }

];


/* =========================================================
   CHECK PREMIUM ACCESS
   ========================================================= */

function hasPremiumAccess() {

    /*
     * currentMembership is created
     * by script.js.
     */

    if (
        typeof currentMembership === "undefined" ||
        !currentMembership
    ) {

        return false;

    }


    if (
        currentMembership.plan !== "premium"
    ) {

        return false;

    }


    if (
        currentMembership.status !== "active"
    ) {

        return false;

    }


    /*
     * If there is an expiration date,
     * make sure it has not passed.
     */

    if (
        currentMembership.expires_at
    ) {

        const expiration =
            new Date(
                currentMembership.expires_at
            );


        if (
            expiration <= new Date()
        ) {

            return false;

        }

    }


    return true;

}


/* =========================================================
   CREATE ONE GAME CARD
   ========================================================= */

function createGameCard(game) {

    const card =
        document.createElement("a");


    card.className =
        "game-card";


    /*
     * FREE games can open normally.
     *
     * PREMIUM games are initially prevented
     * from opening unless the user has access.
     */

    const isPremium =
        game.access === "premium";


    const premiumUnlocked =
        isPremium &&
        hasPremiumAccess();


    if (
        !isPremium ||
        premiumUnlocked
    ) {

        card.href =
            game.url;

        card.target =
            "_blank";

        card.rel =
            "noopener noreferrer";

    } else {

        /*
         * No direct game URL for locked
         * premium users.
         */

        card.href =
            "#";

        card.setAttribute(
            "data-locked",
            "true"
        );

    }


    card.classList.toggle(
        "premium-locked",
        isPremium && !premiumUnlocked
    );


    card.classList.toggle(
        "premium-unlocked",
        isPremium && premiumUnlocked
    );


    card.setAttribute(
        "data-access",
        game.access || "free"
    );


    card.setAttribute(
        "data-name",
        (
            (game.title || "") + " " +
            (game.description || "") + " " +
            (game.category || "") + " " +
            (game.grade || "") + " " +
            (game.keywords || "")
        ).toLowerCase()
    );


    let badge = "";


    if (game.access === "premium") {

        if (premiumUnlocked) {

            badge =
                '<div class="game-badge premium-badge">⭐ PREMIUM</div>';

        } else {

            badge =
                '<div class="game-badge premium-badge">🔒 PREMIUM</div>';

        }

    } else {

        badge =
            '<div class="game-badge free-badge">FREE</div>';

    }


    card.innerHTML = `

        <div class="game-img-container">

            <img
                src="${game.image}"
                alt="${game.title}"
                loading="lazy"
            >

            ${badge}

        </div>

        <div class="game-title">
            ${game.title}
        </div>

    `;


    /*
     * Handle locked Premium games.
     */

    if (
        isPremium &&
        !premiumUnlocked
    ) {

        card.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                /*
                 * If the user is not logged in,
                 * open the login window.
                 */

                if (
                    typeof currentUser === "undefined" ||
                    !currentUser
                ) {

                    if (
                        typeof openAuthModal === "function"
                    ) {

                        openAuthModal();

                    }

                    return;

                }


                /*
                 * Logged-in FREE users receive
                 * a simple premium message.
                 */

                if (
                    typeof showAuthMessage === "function"
                ) {

                    openAuthModal();

                    showAuthMessage(
                        "This is a Premium game. Upgrade your account to unlock it.",
                        "info"
                    );

                }

            }
        );

    }


    return card;

}


/* =========================================================
   GENERATE FREE + PREMIUM GAME SECTIONS
   ========================================================= */

function generateGames() {

    const gameGrid =
        document.getElementById(
            "gameGrid"
        );


    if (!gameGrid) {

        console.error(
            "Teacher Khen's Learning Hub: #gameGrid was not found."
        );

        return;

    }


    /* Clear existing content */

    gameGrid.innerHTML = "";


    /* =====================================================
       DIVIDE GAMES
       ===================================================== */

    const freeGames =
        games.filter(function(game) {

            return game.access !== "premium";

        });


    const premiumGames =
        games.filter(function(game) {

            return game.access === "premium";

        });


    /* =====================================================
       FREE GAMES SECTION
       ===================================================== */

    const freeSection =
        document.createElement(
            "section"
        );


    freeSection.className =
        "game-section free-section";


    freeSection.innerHTML = `

        <div class="section-heading free-heading">

            <span>🟢</span>

            <h2>FREE GAMES</h2>

            <span>🎮</span>

        </div>

        <div class="game-section-grid free-game-grid"></div>

    `;


    gameGrid.appendChild(
        freeSection
    );


    const freeGrid =
        freeSection.querySelector(
            ".free-game-grid"
        );


    freeGames.forEach(function(game) {

        const card =
            createGameCard(game);

        freeGrid.appendChild(
            card
        );

    });


    /* =====================================================
       PREMIUM GAMES SECTION
       ===================================================== */

    const premiumSection =
        document.createElement(
            "section"
        );


    premiumSection.className =
        "game-section premium-section";


    premiumSection.innerHTML = `

        <div class="section-heading premium-heading">

            <span>⭐</span>

            <h2>PREMIUM GAMES</h2>

            <span>⭐</span>

        </div>

        <div class="game-section-grid premium-game-grid"></div>

    `;


    gameGrid.appendChild(
        premiumSection
    );


    const premiumGrid =
        premiumSection.querySelector(
            ".premium-game-grid"
        );


    premiumGames.forEach(function(game) {

        const card =
            createGameCard(game);

        premiumGrid.appendChild(
            card
        );

    });


    console.log(
        "Teacher Khen's Learning Hub:",
        freeGames.length,
        "free games,",
        premiumGames.length,
        "premium games."
    );

}


/* =========================================================
   GAME SEARCH
   ========================================================= */

function filterGames() {

    const searchInput =
        document.getElementById(
            "gameSearch"
        );


    if (!searchInput) {
        return;
    }


    const input =
        searchInput.value
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


    /* Hide an entire section if it has no visible games */

    document
        .querySelectorAll(
            ".game-section"
        )
        .forEach(function(section) {

            const visibleGames =
                section.querySelectorAll(
                    ".game-card:not(.hidden)"
                );


            section.style.display =
                visibleGames.length > 0
                    ? ""
                    : "none";

        });


    /* Show no-results message */

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
