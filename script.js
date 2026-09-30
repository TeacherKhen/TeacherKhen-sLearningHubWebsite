/* =========================================================
   TEACHER KHEN'S LEARNING HUB
   GENERAL WEBSITE FUNCTIONS
   ========================================================= */


const colors = [
    '#29abe2',
    '#f06eaa',
    '#009245',
    '#fbb03b',
    '#b481f1'
];


const titleText =
    "Teacher Khen's Learning Hub";


/* =========================================================
   GENERATE COLORFUL WEBSITE TITLE
   ========================================================= */

function generateTitle() {

    const titleContainer =
        document.getElementById(
            'main-title'
        );


    if (!titleContainer) {
        return;
    }


    let colorIndex = 0;


    titleText
        .split(' ')
        .forEach(function(word, wIdx) {

            const wordSpan =
                document.createElement(
                    'span'
                );


            wordSpan.style.whiteSpace =
                "nowrap";


            [...word].forEach(function(char) {

                const span =
                    document.createElement(
                        'span'
                    );


                span.className =
                    'letter';


                span.textContent =
                    char;


                span.style.color =
                    colors[
                        colorIndex %
                        colors.length
                    ];


                wordSpan.appendChild(
                    span
                );


                colorIndex++;

            });


            titleContainer.appendChild(
                wordSpan
            );


            if (
                wIdx <
                titleText.split(' ').length - 1
            ) {

                const space =
                    document.createElement(
                        'span'
                    );


                space.innerHTML =
                    "&nbsp;";


                titleContainer.appendChild(
                    space
                );

            }

        });

}


/* =========================================================
   ENTER WEBSITE
   ========================================================= */

function enterSite() {

    const sound =
        document.getElementById(
            'welcome-sound'
        );


    if (sound) {

        sound.play()
            .catch(function() {});

    }


    const welcome =
        document.getElementById(
            'welcome-overlay'
        );


    if (welcome) {

        welcome.style.transform =
            "translateY(-100%)";

    }

}


/* =========================================================
   REMINDER MODAL
   ========================================================= */

function toggleReminder(show) {

    const overlay =
        document.getElementById(
            'reminder-overlay'
        );


    if (!overlay) {
        return;
    }


    if (show) {

        overlay.classList.add(
            'active'
        );

        document.body.classList.add(
            'modal-open'
        );

    } else {

        overlay.classList.remove(
            'active'
        );

        document.body.classList.remove(
            'modal-open'
        );

    }

}


/* =========================================================
   DONATE MODAL
   ========================================================= */

function toggleDonateModal(show) {

    const overlay =
        document.getElementById(
            'donate-modal'
        );


    if (!overlay) {
        return;
    }


    if (show) {

        overlay.classList.add(
            'active'
        );

        document.body.classList.add(
            'modal-open'
        );

    } else {

        overlay.classList.remove(
            'active'
        );

        document.body.classList.remove(
            'modal-open'
        );

    }

}


/* =========================================================
   FOOTER INFORMATION POPUPS
   ========================================================= */

function openFooterInfo(id) {

    const overlay =
        document.getElementById(id);


    if (!overlay) {
        return;
    }


    document
        .querySelectorAll(
            '.footer-info-overlay'
        )
        .forEach(function(item) {

            item.classList.remove(
                'active'
            );

        });


    overlay.classList.add(
        'active'
    );


    document.body.classList.add(
        'modal-open'
    );

}


function closeFooterInfo(event) {

    /*
     * If the click happened inside
     * the popup card, do nothing.
     */

    if (
        event &&
        event.target &&
        event.target.closest &&
        event.target.closest(
            '.footer-info-card'
        )
    ) {

        return;

    }


    document
        .querySelectorAll(
            '.footer-info-overlay'
        )
        .forEach(function(overlay) {

            overlay.classList.remove(
                'active'
            );

        });


    document.body.classList.remove(
        'modal-open'
    );

}


/* =========================================================
   CLOSE MODALS WITH ESCAPE
   ========================================================= */

document.addEventListener(
    'keydown',
    function(event) {

        if (
            event.key === 'Escape'
        ) {

            toggleReminder(false);

            toggleDonateModal(false);

            document
                .querySelectorAll(
                    '.footer-info-overlay'
                )
                .forEach(function(overlay) {

                    overlay.classList.remove(
                        'active'
                    );

                });


            document.body.classList.remove(
                'modal-open'
            );

        }

    }
);


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    'click',
    function(event) {

        if (
            event.target.id ===
            'reminder-overlay'
        ) {

            toggleReminder(false);

        }


        if (
            event.target.id ===
            'donate-modal'
        ) {

            toggleDonateModal(false);

        }

    }
);


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

window.addEventListener(
    'DOMContentLoaded',
    function() {

        generateTitle();

        generateGames();

    }
);