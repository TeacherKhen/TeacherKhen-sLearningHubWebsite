/* =========================================================
   TEACHER KHEN'S LEARNING HUB
   GENERAL WEBSITE FUNCTIONS + SUPABASE AUTHENTICATION
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://onigbrcsfcbuporhylxv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_MMXsHQKzKYn0mAA3MQOlWA_pEdCS-r3";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   CURRENT USER / MEMBERSHIP
   ========================================================= */

let currentUser = null;
let currentMembership = null;


/* =========================================================
   WEBSITE COLORS
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


    titleContainer.innerHTML = "";


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
   AUTH MODAL
   ========================================================= */

function openAuthModal() {

    const modal =
        document.getElementById(
            'auth-modal'
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        'active'
    );


    document.body.classList.add(
        'modal-open'
    );


    showLoginForm();

}


function closeAuthModal() {

    const modal =
        document.getElementById(
            'auth-modal'
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        'active'
    );


    document.body.classList.remove(
        'modal-open'
    );


    clearAuthMessage();

}


function showLoginForm() {

    const loginForm =
        document.getElementById(
            'loginForm'
        );


    const signupForm =
        document.getElementById(
            'signupForm'
        );


    if (loginForm) {

        loginForm.style.display =
            'block';

    }


    if (signupForm) {

        signupForm.style.display =
            'none';

    }


    const title =
        document.getElementById(
            'authTitle'
        );


    const subtitle =
        document.getElementById(
            'authSubtitle'
        );


    if (title) {

        title.textContent =
            'Welcome Back!';

    }


    if (subtitle) {

        subtitle.textContent =
            'Log in to your Teacher Khen account.';

    }


    clearAuthMessage();

}


function showSignupForm() {

    const loginForm =
        document.getElementById(
            'loginForm'
        );


    const signupForm =
        document.getElementById(
            'signupForm'
        );


    if (loginForm) {

        loginForm.style.display =
            'none';

    }


    if (signupForm) {

        signupForm.style.display =
            'block';

    }


    const title =
        document.getElementById(
            'authTitle'
        );


    const subtitle =
        document.getElementById(
            'authSubtitle'
        );


    if (title) {

        title.textContent =
            'Create Your Account';

    }


    if (subtitle) {

        subtitle.textContent =
            'Create an account for Teacher Khen\'s Learning Hub.';

    }


    clearAuthMessage();

}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(
    message,
    type = 'info'
) {

    const messageBox =
        document.getElementById(
            'authMessage'
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        'auth-message ' + type;

}


function clearAuthMessage() {

    const messageBox =
        document.getElementById(
            'authMessage'
        );


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        '';


    messageBox.className =
        'auth-message';

}


/* =========================================================
   SIGN UP
   ========================================================= */

async function signupUser() {

    const email =
        document
            .getElementById(
                'signupEmail'
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                'signupPassword'
            )
            .value;


    const confirmPassword =
        document
            .getElementById(
                'signupPasswordConfirm'
            )
            .value;


    if (!email || !password) {

        showAuthMessage(
            'Please enter your email and password.',
            'error'
        );

        return;

    }


    if (password.length < 6) {

        showAuthMessage(
            'Password must be at least 6 characters.',
            'error'
        );

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        showAuthMessage(
            'Passwords do not match.',
            'error'
        );

        return;

    }


    showAuthMessage(
        'Creating your account...',
        'info'
    );


    const {
        data,
        error
    } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password

        });


    if (error) {

        console.error(
            'Signup error:',
            error
        );


        showAuthMessage(
            error.message,
            'error'
        );


        return;

    }


    console.log(
        'Signup successful:',
        data
    );


    if (
        data.user &&
        !data.session
    ) {

        showAuthMessage(
            'Account created! Please check your email and confirm your account before logging in.',
            'success'
        );

    } else {

        showAuthMessage(
            'Account created successfully!',
            'success'
        );

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

async function loginUser() {

    const email =
        document
            .getElementById(
                'loginEmail'
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                'loginPassword'
            )
            .value;


    if (!email || !password) {

        showAuthMessage(
            'Please enter your email and password.',
            'error'
        );

        return;

    }


    showAuthMessage(
        'Logging in...',
        'info'
    );


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        console.error(
            'Login error:',
            error
        );


        showAuthMessage(
            error.message,
            'error'
        );


        return;

    }


    console.log(
        'Login successful:',
        data
    );


    showAuthMessage(
        'Login successful!',
        'success'
    );


    if (
        data.session &&
        data.session.user
    ) {

        updateAuthUI(
            data.session.user
        );


        await loadMembership(
            data.session.user
        );


        updateMembershipUI();


        generateGames();

    }


    setTimeout(
        function() {

            closeAuthModal();

        },
        700
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logoutUser() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            'Logout error:',
            error
        );

        return;

    }


    currentUser = null;

    currentMembership = null;


    updateAuthUI(null);


    generateGames();

}


/* =========================================================
   UPDATE LOGIN / ACCOUNT UI
   ========================================================= */

function updateAuthUI(user) {

    const loginBtn =
        document.getElementById(
            'loginBtn'
        );


    const userAccount =
        document.getElementById(
            'userAccount'
        );


    const userEmail =
        document.getElementById(
            'userEmail'
        );


    if (!loginBtn || !userAccount) {
        return;
    }


    if (user) {

        currentUser =
            user;


        loginBtn.style.display =
            'none';


        userAccount.style.display =
            'flex';


        if (userEmail) {

            userEmail.textContent =
                user.email || 'Account';

        }


        updateMembershipUI();

    } else {

        currentUser =
            null;


        currentMembership =
            null;


        loginBtn.style.display =
            'flex';


        userAccount.style.display =
            'none';


        updateMembershipUI();

    }

}


/* =========================================================
   UPDATE MEMBERSHIP UI
   ========================================================= */

function updateMembershipUI() {

    const userPlan =
        document.getElementById(
            'userPlan'
        );


    const upgradeButton =
        document.getElementById(
            'upgradeAccountBtn'
        );


    if (!userPlan) {
        return;
    }


    console.log(
        "Updating membership UI..."
    );


    console.log(
        "Current user:",
        currentUser
    );


    console.log(
        "Current membership:",
        currentMembership
    );


    if (!currentUser) {

        userPlan.textContent =
            'FREE MEMBER';


        userPlan.classList.remove(
            'premium-member'
        );


        if (upgradeButton) {

            upgradeButton.style.display =
                'none';

        }

        return;

    }


    if (!currentMembership) {

        userPlan.textContent =
            'FREE MEMBER';


        userPlan.classList.remove(
            'premium-member'
        );


        if (upgradeButton) {

            upgradeButton.style.display =
                'flex';

        }

        return;

    }


    const isPremium =
        currentMembership.plan ===
        'premium';


    const isActive =
        currentMembership.status ===
        'active';


    let isExpired =
        false;


    if (
        currentMembership.expires_at
    ) {

        const expiration =
            new Date(
                currentMembership.expires_at
            );


        const now =
            new Date();


        if (
            expiration <= now
        ) {

            isExpired =
                true;

        }

    }


    console.log(
        "Premium check:",
        {
            isPremium: isPremium,
            isActive: isActive,
            isExpired: isExpired,
            plan: currentMembership.plan,
            status: currentMembership.status,
            expires_at: currentMembership.expires_at
        }
    );


    if (
        isPremium &&
        isActive &&
        !isExpired
    ) {

        console.log(
            "⭐ PREMIUM ACCESS CONFIRMED"
        );


        userPlan.textContent =
            '⭐ PREMIUM MEMBER';


        userPlan.classList.add(
            'premium-member'
        );


        if (upgradeButton) {

            upgradeButton.style.display =
                'none';

        }


        return;

    }


    if (isExpired) {

        userPlan.textContent =
            'FREE MEMBER • EXPIRED';

    } else {

        userPlan.textContent =
            'FREE MEMBER';

    }


    userPlan.classList.remove(
        'premium-member'
    );


    if (upgradeButton) {

        upgradeButton.style.display =
            'flex';

    }

}


/* =========================================================
   LOAD MEMBERSHIP
   DIAGNOSTIC VERSION
   ========================================================= */

async function loadMembership(user) {

    if (!user) {

        console.log(
            "No user supplied to loadMembership()."
        );


        currentMembership =
            null;


        updateMembershipUI();


        return null;

    }


    console.log(
        "================================="
    );


    console.log(
        "LOADING MEMBERSHIP"
    );


    console.log(
        "User email:",
        user.email
    );


    console.log(
        "User ID:",
        user.id
    );


    console.log(
        "================================="
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "learning_hub_memberships"
            )
            .select(
                "id, user_id, plan, status, expires_at, created_at"
            )
            .eq(
                "user_id",
                user.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "❌ MEMBERSHIP ERROR:",
            error
        );


        currentMembership =
            null;


        updateMembershipUI();


        return null;

    }


    console.log(
        "✅ MEMBERSHIP DATA:",
        data
    );


    currentMembership =
        data || null;


    updateMembershipUI();


    return currentMembership;

}


/* =========================================================
   CHECK CURRENT SESSION
   ========================================================= */

async function checkAuthSession() {

    console.log(
        "Checking current Supabase session..."
    );


    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            'Session error:',
            error
        );


        updateAuthUI(null);

        generateGames();

        return;

    }


    const session =
        data.session;


    if (session) {

        console.log(
            "Existing session found:",
            session.user.email
        );


        updateAuthUI(
            session.user
        );


        await loadMembership(
            session.user
        );


        generateGames();

    } else {

        console.log(
            "No active session."
        );


        updateAuthUI(
            null
        );


        generateGames();

    }

}


/* =========================================================
   LISTEN FOR LOGIN / LOGOUT CHANGES
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
    function(event, session) {

        console.log(
            'Auth event:',
            event
        );


        updateAuthUI(
            session
                ? session.user
                : null
        );


        if (
            session &&
            session.user
        ) {

            setTimeout(
                async function() {

                    await loadMembership(
                        session.user
                    );


                    updateMembershipUI();


                    generateGames();

                },
                0
            );

        } else {

            currentMembership =
                null;


            updateMembershipUI();


            generateGames();

        }

    }
);


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

            closeAuthModal();

            closePremiumModal();


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


        if (
            event.target.id ===
            'auth-modal'
        ) {

            closeAuthModal();

        }


        if (
            event.target.id ===
            'premium-modal'
        ) {

            closePremiumModal();

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

        checkAuthSession();

    }
);


/* =========================================================
   PREMIUM UPGRADE MODAL
   ========================================================= */

function openPremiumModal() {

    const modal =
        document.getElementById(
            "premium-modal"
        );


    if (!modal) {
        return;
    }


    if (
        currentMembership &&
        currentMembership.plan === "premium" &&
        currentMembership.status === "active"
    ) {

        console.log(
            "Premium user already has access."
        );


        return;

    }


    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE PREMIUM MODAL
   ========================================================= */

function closePremiumModal() {

    const modal =
        document.getElementById(
            "premium-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   OPEN UPGRADE PAGE
   ========================================================= */

function openUpgradePage() {

    /*
     * Payment system will be connected here later.
     */

    showPremiumComingSoon();

}


/* =========================================================
   PREMIUM COMING SOON
   ========================================================= */

function showPremiumComingSoon() {

    const modal =
        document.getElementById(
            "premium-modal"
        );


    if (!modal) {
        return;
    }


    const subtitle =
        modal.querySelector(
            ".premium-subtitle"
        );


    const comingSoon =
        modal.querySelector(
            ".premium-coming-soon"
        );


    if (subtitle) {

        subtitle.textContent =
            "Premium membership and payment options are currently being prepared. Please check back soon!";

    }


    if (comingSoon) {

        comingSoon.innerHTML =
            '<i class="fas fa-clock"></i> Premium access will be available soon.';

    }

}
