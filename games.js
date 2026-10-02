/* =========================================================
   TEACHER KHEN'S LEARNING HUB
   GAME DATABASE + GAME DISPLAY
   ========================================================= */


/* =========================================================
   GAME DATABASE
   ========================================================= */

const games = [

    {
        title: "Classroom Cafe",
        url: "https://class-cafe-khen.base44.app",
        image: "cafe.gif",
        category: "Speaking",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Give or Keep Review Game",
        url: "https://teacherkhen.github.io/giveorkeepreviewgame/",
        image: "titlepage.gif",
        category: "Review",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Spelling Jungle",
        url: "https://teacherkhen.github.io/connect-the-dots-spelling-sentencethesentence/",
        image: "Intro picture.gif",
        category: "Spelling",
        grades: "Grades 2–6",
        access: "free"
    },

    {
        title: "The Great Fishing Challenge",
        url: "https://teacherkhen.github.io/fishing/",
        image: "catch it.gif",
        category: "Vocabulary",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Spelling Warriors",
        url: "https://teacherkhen.github.io/spelling/",
        image: "spelling.gif",
        category: "Spelling",
        grades: "Grades 2–6",
        access: "free"
    },

    {
        title: "Pacman Vocabulary Quest",
        url: "https://teacherkhen.github.io/pacman/",
        image: "pacman.gif",
        category: "Vocabulary",
        grades: "Grades 2–6",
        access: "free"
    },

    {
        title: "Interactive Whiteboard [S & D]",
        url: "https://teacherkhen.github.io/whiteboard/",
        image: "whiteboard.jpg",
        category: "Teaching Tool",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Whiteboard & Quiz Master",
        url: "https://teacherkhen.github.io/whiteboard-quiz/",
        image: "whiteboard+quiz.jpg",
        category: "Teaching Tool",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Phonics Reading Lab",
        url: "https://teacherkhen.github.io/phonics-reading-board/",
        image: "phonics reading.jpg",
        category: "Phonics",
        grades: "Grades 1–4",
        access: "free"
    },

    {
        title: "Fashion Mall: Clothing Lesson",
        url: "https://teacherkhen.github.io/clothinglesson/",
        image: "clothing.png",
        category: "Vocabulary",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Time Traveler: Past Expressions",
        url: "https://teacherkhen.github.io/past-time/",
        image: "calendar.gif",
        category: "Grammar",
        grades: "Grades 4–6",
        access: "free"
    },

    {
        title: "Monster Card Flip Game",
        url: "https://teacherkhen.github.io/monster-card-flip-game/",
        image: "monster flip game.png",
        category: "Review",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Reading Roll Quest [Phonics Game]",
        url: "https://teacherkhen.github.io/phonicsreading/",
        image: "reading.png",
        category: "Phonics",
        grades: "Grades 1–4",
        access: "free"
    },

    {
        title: "Phonics Race",
        url: "https://teacherkhen.github.io/Phonicsrace1/",
        image: "Phonics Race.png",
        category: "Phonics",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Click It!",
        url: "https://teacherkhen.github.io/Clickit/",
        image: "clickit.png",
        category: "Review",
        grades: "Grades 1–6",
        access: "premium"
    },

    {
        title: "Spider Web Reading",
        url: "https://spiderwebreading.teacherkhen.com",
        image: "background.gif",
        category: "Phonics",
        grades: "Grades 1–6",
        access: "free"
    }

];


/* =========================================================
   PREMIUM ACCESS CHECK
   ========================================================= */

function hasPremiumAccess() {

    /*
     * currentMembership is created and updated
     * inside script.js.
     */

    if (!currentMembership) {
        return false;
    }


    /*
     * User must have Premium plan.
     */

    if (currentMembership.plan !== "premium") {
        return false;
    }


    /*
     * Membership must be active.
     */

    if (currentMembership.status !== "active") {
        return false;
    }


    /*
     * If there is an expiration date,
     * make sure it has not expired.
     */

    if (currentMembership.expires_at) {

        const expiration =
            new Date(currentMembership.expires_at);

        const now =
            new Date();

        if (expiration <= now) {
            return false;
        }

    }


    return true;
}


/* =========================================================
   CREATE GAME CARD
   ========================================================= */

function createGameCard(game) {

    const card =
        document.createElement("a");


    /*
     * Determine whether this game is Premium.
     */

    const isPremium =
        game.access === "premium";


    /*
     * Determine whether the current user
     * can access the Premium game.
     */

    const premiumUnlocked =
        isPremium && hasPremiumAccess();


    /*
     * A game is locked only when:
     *
     * 1. It is Premium
     * 2. The user does not have Premium access
     */

    const isLocked =
        isPremium && !premiumUnlocked;


    /*
     * Normal game URL.
     *
     * Locked Premium games do NOT receive
     * their real URL. This prevents the normal
     * card click from opening the game.
     */

    if (isLocked) {

        card.href = "#";

    } else {

        card.href = game.url;

    }


    /*
     * Open games in a new tab.
     */

    card.target = "_blank";

    card.rel = "noopener noreferrer";


    /*
     * Main card class.
     */

    card.className = "game-card";


    /*
     * Add Premium class when applicable.
     */

    if (isPremium) {

        card.classList.add("premium-game");

    }


    /*
     * Add locked class when applicable.
     */

    if (isLocked) {

        card.classList.add("premium-locked");

    }


    /*
     * Store locked state.
     */

    if (isLocked) {

        card.dataset.locked = "true";

    }


    /*
     * Create game image.
     */

    const image =
        document.createElement("img");

    image.src = game.image;

    image.alt = game.title;

    image.className = "game-image";


    /*
     * Prevent broken images from making
     * the card look broken.
     */

    image.onerror = function() {

        this.style.display = "none";

    };


    /*
     * Game information container.
     */

    const info =
        document.createElement("div");

    info.className = "game-info";


    /*
     * Game title.
     */

    const title =
        document.createElement("h3");

    title.textContent =
        game.title;


    /*
     * Category.
     */

    const category =
        document.createElement("div");

    category.className =
        "game-category";

    category.textContent =
        game.category;


    /*
     * Grades.
     */

    const grades =
        document.createElement("div");

    grades.className =
        "game-grades";

    grades.textContent =
        game.grades;


    /*
     * Access badge.
     */

    const badge =
        document.createElement("div");

    badge.className =
        "game-access-badge";


    if (isPremium) {

        if (premiumUnlocked) {

            badge.textContent =
                "⭐ PREMIUM";

            badge.classList.add(
                "premium-unlocked"
            );

        } else {

            badge.textContent =
                "🔒 PREMIUM";

            badge.classList.add(
                "premium-locked-badge"
            );

        }

    } else {

        badge.textContent =
            "FREE";

        badge.classList.add(
            "free-badge"
        );

    }


    /*
     * Put game information together.
     */

    info.appendChild(title);

    info.appendChild(category);

    info.appendChild(grades);

    info.appendChild(badge);


    /*
     * Put image and information into card.
     */

    card.appendChild(image);

    card.appendChild(info);


    /* =====================================================
       PREMIUM LOCK CLICK BEHAVIOR
       ===================================================== */

    card.addEventListener(
        "click",
        function(event) {

            /*
             * Only intercept locked Premium games.
             */

            if (
                game.access === "premium" &&
                !hasPremiumAccess()
            ) {

                /*
                 * Prevent the "#" link from opening.
                 */

                event.preventDefault();


                /*
                 * USER IS NOT LOGGED IN
                 *
                 * Send them to the Login / Sign Up
                 * interface first.
                 */

                if (!currentUser) {

                    openAuthModal();

                    return;

                }


                /*
                 * USER IS LOGGED IN BUT IS FREE
                 *
                 * Show Premium upgrade interface.
                 */

                if (
                    typeof openPremiumModal ===
                    "function"
                ) {

                    openPremiumModal();

                } else {

                    /*
                     * Safety fallback in case the
                     * Premium modal has not loaded.
                     */

                    alert(
                        "This game is available to Premium members."
                    );

                }

            }

        }
    );


    return card;

}


/* =========================================================
   GENERATE GAMES
   ========================================================= */

function generateGames(
    gameList = games
) {

    const gameGrid =
        document.getElementById(
            "gameGrid"
        );


    if (!gameGrid) {
        return;
    }


    /*
     * Clear current games.
     */

    gameGrid.innerHTML = "";


    /*
     * Separate Free and Premium games.
     */

    const freeGames =
        gameList.filter(
            game =>
                game.access !== "premium"
        );


    const premiumGames =
        gameList.filter(
            game =>
                game.access === "premium"
        );


    /* =====================================================
       FREE GAMES SECTION
       ===================================================== */

    if (freeGames.length > 0) {

        const freeHeading =
            document.createElement("div");

        freeHeading.className =
            "game-section-title";

        freeHeading.innerHTML =
            "🎮 FREE GAMES";

        gameGrid.appendChild(
            freeHeading
        );


        freeGames.forEach(
            game => {

                gameGrid.appendChild(
                    createGameCard(game)
                );

            }
        );

    }


    /* =====================================================
       PREMIUM GAMES SECTION
       ===================================================== */

    if (premiumGames.length > 0) {

        const premiumHeading =
            document.createElement("div");

        premiumHeading.className =
            "game-section-title premium-section-title";

        premiumHeading.innerHTML =
            "⭐ PREMIUM GAMES";

        gameGrid.appendChild(
            premiumHeading
        );


        premiumGames.forEach(
            game => {

                gameGrid.appendChild(
                    createGameCard(game)
                );

            }
        );

    }


    /*
     * Update "No Results" message.
     */

    const noResults =
        document.getElementById(
            "noResults"
        );


    if (noResults) {

        if (gameList.length === 0) {

            noResults.style.display =
                "block";

        } else {

            noResults.style.display =
                "none";

        }

    }

}


/* =========================================================
   SEARCH / FILTER GAMES
   ========================================================= */

function filterGames() {

    const searchInput =
        document.getElementById(
            "gameSearch"
        );


    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    /*
     * If search box is empty,
     * display everything.
     */

    if (!searchTerm) {

        generateGames(games);

        return;

    }


    /*
     * Search by:
     *
     * - title
     * - category
     * - grade level
     */

    const filteredGames =
        games.filter(
            game => {

                const title =
                    game.title
                        .toLowerCase();

                const category =
                    game.category
                        .toLowerCase();

                const grades =
                    game.grades
                        .toLowerCase();


                return (
                    title.includes(searchTerm) ||
                    category.includes(searchTerm) ||
                    grades.includes(searchTerm)
                );

            }
        );


    generateGames(
        filteredGames
    );

}


/* =========================================================
   INITIAL GAME DISPLAY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        generateGames();

    }
);
