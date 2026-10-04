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
        access: "free"
    },

    {
        title: "Spider Web Reading",
        url: "https://spiderwebreading.teacherkhen.com",
        image: "background.gif",
        category: "Phonics",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Halloween Monster Egg",
        url: "https://monsteregg.teacherkhen.com/",
        image: "logo.gif",
        category: "Review",
        grades: "Grades 1–6",
        access: "premium"
    }

];


/* =========================================================
   PREMIUM ACCESS CHECK
   ========================================================= */

function hasPremiumAccess() {

    /*
     * Use the main Premium membership checker
     * from script.js when it is available.
     *
     * This keeps the membership rules in one place.
     */

    if (
        typeof isPremiumMember === "function"
    ) {

        return isPremiumMember();

    }


    /*
     * Fallback check.
     *
     * Supports:
     * - monthly
     * - yearly
     * - premium
     */

    if (!currentUser || !currentMembership) {

        return false;

    }


    const validPremiumPlans = [
        "monthly",
        "yearly",
        "premium"
    ];


    const membershipPlan =
        String(
            currentMembership.plan || ""
        )
            .trim()
            .toLowerCase();


    const membershipStatus =
        String(
            currentMembership.status || ""
        )
            .trim()
            .toLowerCase();


    if (
        !validPremiumPlans.includes(
            membershipPlan
        )
    ) {

        return false;

    }


    if (
        membershipStatus !== "active"
    ) {

        return false;

    }


    if (
        currentMembership.expires_at
    ) {

        const expiration =
            new Date(
                currentMembership.expires_at
            );


        if (
            Number.isNaN(
                expiration.getTime()
            )
        ) {

            return false;

        }


        const now =
            new Date();


        if (
            expiration <= now
        ) {

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


    /* =====================================================
       PREMIUM STATUS
       ===================================================== */

    const isPremium =
        game.access === "premium";


    const premiumUnlocked =
        isPremium &&
        hasPremiumAccess();


    const isLocked =
        isPremium &&
        !premiumUnlocked;


    /* =====================================================
       CARD LINK
       ===================================================== */

    if (isLocked) {

        card.href = "#";

    } else {

        card.href =
            game.url;

    }


    card.target =
        "_blank";


    card.rel =
        "noopener noreferrer";


    card.className =
        "game-card";


    /* =====================================================
       PREMIUM CLASS
       ===================================================== */

    if (isPremium) {

        card.classList.add(
            "premium-game"
        );

    }


    if (isLocked) {

        card.classList.add(
            "premium-locked"
        );

        card.dataset.locked =
            "true";

    }


    /* =====================================================
       IMAGE CONTAINER
       ===================================================== */

    const imageContainer =
        document.createElement(
            "div"
        );


    imageContainer.className =
        "game-img-container";


    /* =====================================================
       GAME IMAGE
       ===================================================== */

    const image =
        document.createElement(
            "img"
        );


    image.src =
        game.image;


    image.alt =
        game.title;


    image.className =
        "game-image";


    image.onerror =
        function() {

            this.style.display =
                "none";

        };


    /* =====================================================
       PREMIUM BADGE
       ===================================================== */

    const badge =
        document.createElement(
            "div"
        );


    badge.className =
        "game-badge";


    if (isPremium) {

        if (premiumUnlocked) {

            badge.textContent =
                "⭐ PREMIUM";

            badge.classList.add(
                "premium-badge"
            );

        } else {

            badge.textContent =
                "🔒 PREMIUM";

            badge.classList.add(
                "premium-badge"
            );

        }

    } else {

        badge.textContent =
            "FREE";

        badge.classList.add(
            "free-badge"
        );

    }


    /* =====================================================
       PUT IMAGE + BADGE TOGETHER
       ===================================================== */

    imageContainer.appendChild(
        image
    );

    imageContainer.appendChild(
        badge
    );


    /* =====================================================
       GAME TITLE
       ===================================================== */

    const title =
        document.createElement(
            "div"
        );


    title.className =
        "game-title";


    title.textContent =
        game.title;


    /* =====================================================
       PUT EVERYTHING INTO CARD
       ===================================================== */

    card.appendChild(
        imageContainer
    );


    card.appendChild(
        title
    );


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

                event.preventDefault();


                /*
                 * Not logged in:
                 * show Login / Sign Up.
                 */

                if (!currentUser) {

                    if (
                        typeof openAuthModal ===
                        "function"
                    ) {

                        openAuthModal();

                    }

                    return;

                }


                /*
                 * Logged in but Free:
                 * show Premium upgrade modal.
                 */

                if (
                    typeof openPremiumModal ===
                    "function"
                ) {

                    openPremiumModal();

                } else {

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
     * Clear existing games.
     */

    gameGrid.innerHTML =
        "";


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
       FREE GAMES
       ===================================================== */

    if (
        freeGames.length > 0
    ) {

        const freeSection =
            document.createElement(
                "section"
            );


        freeSection.className =
            "game-section";


        const freeHeading =
            document.createElement(
                "div"
            );


        freeHeading.className =
            "section-heading free-heading";


        freeHeading.innerHTML =
            "<span>🎮</span><h2>FREE GAMES</h2>";


        const freeGrid =
            document.createElement(
                "div"
            );


        freeGrid.className =
            "game-section-grid";


        freeGames.forEach(
            function(game) {

                freeGrid.appendChild(
                    createGameCard(game)
                );

            }
        );


        freeSection.appendChild(
            freeHeading
        );


        freeSection.appendChild(
            freeGrid
        );


        gameGrid.appendChild(
            freeSection
        );

    }


    /* =====================================================
       PREMIUM GAMES
       ===================================================== */

    if (
        premiumGames.length > 0
    ) {

        const premiumSection =
            document.createElement(
                "section"
            );


        premiumSection.className =
            "game-section premium-section";


        const premiumHeading =
            document.createElement(
                "div"
            );


        premiumHeading.className =
            "section-heading premium-heading";


        premiumHeading.innerHTML =
            "<span>⭐</span><h2>PREMIUM GAMES</h2>";


        const premiumGrid =
            document.createElement(
                "div"
            );


        premiumGrid.className =
            "game-section-grid";


        premiumGames.forEach(
            function(game) {

                premiumGrid.appendChild(
                    createGameCard(game)
                );

            }
        );


        premiumSection.appendChild(
            premiumHeading
        );


        premiumSection.appendChild(
            premiumGrid
        );


        gameGrid.appendChild(
            premiumSection
        );

    }


    /* =====================================================
       NO RESULTS
       ===================================================== */

    const noResults =
        document.getElementById(
            "noResults"
        );


    if (noResults) {

        if (
            gameList.length === 0
        ) {

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


    if (!searchTerm) {

        generateGames(
            games
        );

        return;

    }


    const filteredGames =
        games.filter(
            function(game) {

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
                    title.includes(
                        searchTerm
                    ) ||

                    category.includes(
                        searchTerm
                    ) ||

                    grades.includes(
                        searchTerm
                    )
                );

            }
        );


    generateGames(
        filteredGames
    );

}


/* =========================================================
   NOTE
   =========================================================

   We intentionally do NOT add another
   DOMContentLoaded listener here.

   script.js already initializes the website
   and calls generateGames().

   This prevents the game grid from being
   generated twice.
   ========================================================= */
