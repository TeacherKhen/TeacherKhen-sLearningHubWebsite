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
        categories: ["vocabulary", "classroom"],
        guide: "guides/classroom-cafe.json",
        url: "https://class-cafe-khen.base44.app",
        image: "cafe.gif",
        category: "Speaking",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Give or Keep Review Game",
        categories: ["classroom"],
        guide: "guides/give-or-keep-review-game.json",
        url: "https://teacherkhen.github.io/giveorkeepreviewgame/",
        image: "titlepage.gif",
        category: "Review",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Spelling Jungle",
        categories: ["phonics", "vocabulary", "classroom", "action"],
        guide: "guides/spelling-jungle.json",
        url: "https://teacherkhen.github.io/connect-the-dots-spelling-sentencethesentence/",
        image: "Intro picture.gif",
        category: "Spelling",
        grades: "Grades 2–6",
        access: "free"
    },

    {
        title: "The Great Fishing Challenge",
        categories: ["phonics", "vocabulary", "classroom", "action"],
        guide: "guides/the-great-fishing-challenge.json",
        url: "https://teacherkhen.github.io/fishing/",
        image: "catch it.gif",
        category: "Vocabulary",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Spelling Warriors",
        categories: ["phonics", "action"],
        guide: "guides/spelling-warriors.json",
        url: "https://teacherkhen.github.io/spelling/",
        image: "spelling.gif",
        category: "Spelling",
        grades: "Grades 2–6",
        access: "free"
    },

    {
        title: "Pacman Vocabulary Quest",
        categories: ["vocabulary", "action"],
        guide: "guides/pacman-vocabulary-quest.json",
        url: "https://teacherkhen.github.io/pacman/",
        image: "pacman.gif",
        category: "Vocabulary",
        grades: "Grades 2–6",
        access: "free"
    },

    {
        title: "Interactive Whiteboard [S & D]",
        categories: ["classroom"],
        guide: "guides/interactive-whiteboard-s-d.json",
        url: "https://teacherkhen.github.io/whiteboard/",
        image: "whiteboard.jpg",
        category: "Teaching Tool",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Randomizer",
        categories: ["classroom"],
        guide: "guides/randomizer.json",
        url: "https://randomizer.teacherkhen.com/",
        image: "randomizer.gif",
        category: "Teaching Tool",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Whiteboard & Quiz Master",
        categories: ["classroom"],
        guide: "guides/whiteboard-quiz-master.json",
        url: "https://teacherkhen.github.io/whiteboard-quiz/",
        image: "whiteboard+quiz.jpg",
        category: "Teaching Tool",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Phonics Reading Lab",
        categories: ["phonics"],
        guide: "guides/phonics-reading-lab.json",
        url: "https://teacherkhen.github.io/phonics-reading-board/",
        image: "phonics reading.jpg",
        category: "Phonics",
        grades: "Grades 1–4",
        access: "free"
    },

    {
        title: "Fashion Mall: Clothing Lesson",
        categories: ["vocabulary"],
        guide: "guides/fashion-mall-clothing-lesson.json",
        url: "https://teacherkhen.github.io/clothinglesson/",
        image: "clothing.png",
        category: "Vocabulary",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Time Traveler: Past Expressions",
        categories: ["vocabulary"],
        guide: "guides/time-traveler-past-expressions.json",
        url: "https://teacherkhen.github.io/past-time/",
        image: "calendar.gif",
        category: "Grammar",
        grades: "Grades 4–6",
        access: "free"
    },

    {
        title: "Monster Card Flip Game",
        categories: ["phonics", "vocabulary", "classroom", "action"],
        guide: "guides/monster-card-flip-game.json",
        url: "https://teacherkhen.github.io/monster-card-flip-game/",
        image: "monster flip game.png",
        category: "Review",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Reading Roll Quest [Phonics Game]",
        categories: ["phonics", "classroom"],
        guide: "guides/reading-roll-quest-phonics-game.json",
        url: "https://teacherkhen.github.io/phonicsreading/",
        image: "reading.png",
        category: "Phonics",
        grades: "Grades 1–4",
        access: "free"
    },

    {
        title: "Phonics Race",
        categories: ["phonics", "action"],
        guide: "guides/phonics-race.json",
        url: "https://teacherkhen.github.io/Phonicsrace1/",
        image: "Phonics Race.png",
        category: "Phonics",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Click It!",
        categories: ["phonics", "vocabulary", "classroom", "action"],
        guide: "guides/click-it.json",
        url: "https://teacherkhen.github.io/Clickit/",
        image: "clickit.png",
        category: "Review",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Spider Web Reading",
        categories: ["phonics", "action"],
        guide: "guides/spider-web-reading.json",
        url: "https://spiderwebreading.teacherkhen.com",
        image: "background.gif",
        category: "Phonics",
        grades: "Grades 1–6",
        access: "free"
    },
    
    {
        title: "Balloon Pop",
        categories: ["phonics", "vocabulary", "classroom", "action"],
        guide: "guides/balloon-pop.json",
        url: "https://balloon-pop-free.teacherkhen.com/",
        image: "balloon pop free.png",
        category: "Review",
        grades: "Grades 1–6",
        access: "free"
    },
   
    {
        title: "Spot It! Free!",
        categories: ["vocabulary", "action", "classroom"],
        guide: "guides/spot-it-free.json",
        url: "https://spot-it-free.teacherkhen.com/",
        image: "spot it free.png",
        category: "Classroom",
        grades: "Grades 1–6",
        access: "free"
    },
   
    {
        title: "Random Picker",
        categories: ["phonics", "vocabulary", "classroom", "action"],
        guide: "guides/random-picker-instructions.json",
        url: "http://random-picker.teacherkhen.com/",
        image: "randompicker.png",
        category: "Teaching Tool",
        grades: "Grades 1–6",
        access: "free"
    },

    {
        title: "Halloween Monster Egg",
        categories: ["classroom", "action", "vocabulary"],
        guide: "guides/monster-egg.json",
        url: "https://monsteregg.teacherkhen.com/",
        image: "logo.gif",
        category: "Review",
        grades: "Grades 1–6",
        access: "premium"
    },
   
    {
        title: "Spider Web Reading + Presets",
        categories: ["phonics", "action"],
        guide: "guides/spider-web-reading-premium.json",
        url: "https://spiderwebreadingpremium.teacherkhen.com/",
        image: "spider web reading premium.gif",
        category: "Phonics",
        grades: "Grades 1–6",
        access: "premium"
    }, 
   
    {
        title: "Phonics (Super Starter + Wonder World + Games)",
        categories: ["phonics", "classroom"],
        guide: "guides/phonics-super-starter-wonder-world-games.json",
        url: "https://phonics-learning.teacherkhen.com/",
        image: "Phonics.gif",
        category: "Phonics",
        grades: "Grades 1–6",
        access: "premium"
    },

    {
        title: "Balloon + Bubble + Star Popping Game + Presets + Editable",
        categories: ["phonics", "vocabulary", "classroom", "action"],
        guide: "guides/balloon-bubble-star-popping-game-presets-editable.json",
        url: "http://balloon-bubble-star-pop.teacherkhen.com/",
        image: "balloon pop.png",
        category: "Review",
        grades: "Grades 1–6",
        access: "premium"
   },
   
   {
        title: "Food Express (Wonder World 7.3)",
        categories: ["vocabulary", "action"],
        guide: "guides/food-express-instructions.json",
        url: "http://food-express.teacherkhen.com/",
        image: "food express.png",
        category: "Vocabulary",
        grades: "Grade 6",
        access: "premium",
   },
   
   {
       title: "Spot It, Detectives!",
       categories: ["vocabulary", "action", "classroom"],
       guide: "guides/spot-it-detectives-instructions.json",
       url: "https://spot-it.teacherkhen.com/",
       image: "spot it.gif",
       category: "Vocabulary",
       grades: "Grades 1–6",
       access: "premium",
   },

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


    /* Open the choice panel instead of navigating immediately. */
    card.addEventListener("click", function(event) {
        event.preventDefault();
        openGameChoice(game);
    });
    card.setAttribute("aria-label", "Open options for " + game.title);

    return card;

}


/* =========================================================
   GENERATE GAMES
   ========================================================= */

const TK_CATEGORIES = [
 {id:'phonics',icon:'📚',name:'Phonics & Reading',description:'Sounds, spelling and reading'},
 {id:'vocabulary',icon:'🗣️',name:'Vocabulary & English',description:'Words, sentences and topics'},
 {id:'classroom',icon:'🏆',name:'Classroom & Team Games',description:'Quizzes, teaching tools and teamwork'},
 {id:'action',icon:'🎈',name:'Action & Arcade Games',description:'Race, pop, discover and play'}
];
const tkFilters={category:'all',access:'all',grade:'all'};
function tkMatchesGrade(game,grade){
 if(grade==='all')return true;
 const text=String(game.grades||'');
 const range=text.match(/Grades?\s*(\d+)\s*[–-]\s*(\d+)/i);
 if(range)return +grade>=+range[1]&&+grade<=+range[2];
 const single=text.match(/Grade\s*(\d+)/i);
 return single?+grade===+single[1]:false;
}
function tkFilteredGames(){
 const search=(document.getElementById('gameSearch')?.value||'').trim().toLowerCase();
 return games.filter(game=>{
  const cats=game.categories||[];
  const searchable=[game.title,game.category,game.grades,...cats.map(id=>TK_CATEGORIES.find(c=>c.id===id)?.name||'')].join(' ').toLowerCase();
  return (tkFilters.category==='all'||cats.includes(tkFilters.category)) &&
   (tkFilters.access==='all'||game.access===tkFilters.access) &&
   tkMatchesGrade(game,tkFilters.grade)&&(!search||searchable.includes(search));
 });
}
function tkRenderCategories(){
 const host=document.getElementById('tkCategoryGrid');if(!host)return;
 host.replaceChildren();
 TK_CATEGORIES.forEach(cat=>{
  const btn=document.createElement('button');btn.type='button';btn.className='tk-category'+(tkFilters.category===cat.id?' active':'');
  btn.setAttribute('aria-pressed',String(tkFilters.category===cat.id));
  const count=games.filter(g=>(g.categories||[]).includes(cat.id)).length;
  btn.innerHTML='<span class="tk-cat-icon"></span><strong></strong><small></small><em></em>';
  btn.querySelector('.tk-cat-icon').textContent=cat.icon;
  btn.querySelector('strong').textContent=cat.name;
  btn.querySelector('small').textContent=cat.description;
  btn.querySelector('em').textContent=count+' games';
  btn.addEventListener('click',()=>{tkFilters.category=tkFilters.category===cat.id?'all':cat.id;generateGames();});
  host.appendChild(btn);
 });
}
function setGameAccess(access){
 tkFilters.access=access;generateGames();
 document.getElementById('game-explorer')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function generateGames(){
 const host=document.getElementById('gameGrid');if(!host)return;
 const selected=tkFilteredGames();host.replaceChildren();
 const grid=document.createElement('div');grid.className='game-section-grid tk-results-grid';
 selected.forEach(game=>grid.appendChild(createGameCard(game)));
 host.appendChild(grid);
 const empty=document.getElementById('noResults');if(empty)empty.style.display=selected.length?'none':'block';
 const count=document.getElementById('tkGameCount');if(count)count.textContent=`Showing ${selected.length} of ${games.length} games`;
 document.querySelectorAll('[data-access]').forEach(btn=>{
  const active=btn.dataset.access===tkFilters.access;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
 });
 tkRenderCategories();
}
function filterGames(){generateGames();}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-access]').forEach(btn=>btn.addEventListener('click',()=>setGameAccess(btn.dataset.access)));
 document.getElementById('tkGrade')?.addEventListener('change',event=>{tkFilters.grade=event.target.value;generateGames();});
 document.getElementById('tkReset')?.addEventListener('click',()=>{
  tkFilters.category='all';tkFilters.grade='all';tkFilters.access='all';
  const search=document.getElementById('gameSearch');if(search)search.value='';
  const grade=document.getElementById('tkGrade');if(grade)grade.value='all';generateGames();
 });
 generateGames();
});

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


/* =========================================================
   GAME GUIDE + MAGIC CHOICE POPUP
   The game URLs and premium rules above are unchanged.
   ========================================================= */
let tkSelectedGame = null;
let tkGuideRequest = 0;
function tkModal() {
    let modal = document.getElementById('tk-game-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'tk-game-modal';
    modal.className = 'tk-modal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-label','Game options and instructions');
    modal.innerHTML = '<div class="tk-modal-backdrop"></div><section class="tk-modal-panel"><button type="button" class="tk-modal-close" aria-label="Close">×</button><div id="tk-modal-content"></div></section>';
    document.body.appendChild(modal);
    modal.querySelector('.tk-modal-backdrop').addEventListener('click', closeGameGuide);
    modal.querySelector('.tk-modal-close').addEventListener('click', closeGameGuide);
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('tk-visible')) closeGameGuide(); });
    return modal;
}
function tkEl(tag,cls,text) {
    const el = document.createElement(tag);
    if(cls) el.className=cls;
    if(text !== undefined) el.textContent=text;
    return el;
}
function tkButton(label,fn,secondary=false) {
    const btn=tkEl('button','tk-choice-button'+(secondary?' tk-secondary':''),label);
    btn.type='button';btn.addEventListener('click',fn);return btn;
}
function tkRenderBase(game) {
    const content=document.getElementById('tk-modal-content');content.replaceChildren();
    const h=tkEl('h2','tk-modal-title',game.title);content.appendChild(h);return content;
}
function openGameChoice(game) {
    tkSelectedGame=game; ++tkGuideRequest;
    const modal=tkModal();modal.classList.add('tk-visible');
    const content=tkRenderBase(game);
    content.appendChild(tkEl('p','tk-modal-subtitle','✨ Choose what you want to do'));
    const actions=tkEl('div','tk-choice-actions');
    actions.append(tkButton('📖 How to Play',()=>openGameGuide(game),true),tkButton('🎮 Play Game',()=>tkPlayGame(game)));
    content.appendChild(actions);
    const note=tkEl('p','tk-modal-note',game.access==='premium'?'⭐ Premium game — the guide is free to view.':'🎉 Free classroom game');content.appendChild(note);
}
function tkPlayGame(game) {
    if(game.access==='premium' && !hasPremiumAccess()) {
        closeGameGuide();
        if(!currentUser && typeof openAuthModal==='function') openAuthModal();
        else if(typeof openPremiumModal==='function') openPremiumModal();
        else alert('This game is available to Premium members.');
        return;
    }
    window.open(game.url,'_blank','noopener,noreferrer');
}
function closeGameGuide() {
    ++tkGuideRequest;
    const modal=document.getElementById('tk-game-modal');
    if(!modal)return;
    const iframe=modal.querySelector('iframe');if(iframe)iframe.src='about:blank';
    modal.classList.remove('tk-visible');
}
function tkVideoId(url) {
    if(typeof url!=='string')return null;
    const m=url.match(/^https:\/\/(?:www\.)?youtube\.com\/(?:shorts\/|watch\?v=)([A-Za-z0-9_-]{11})(?:[?&#].*)?$/);
    return m?m[1]:null;
}
async function openGameGuide(game) {
    const request=++tkGuideRequest;
    const content=tkRenderBase(game);
    content.appendChild(tkButton('← Back to options',()=>openGameChoice(game),true));
    content.appendChild(tkEl('p','tk-modal-subtitle','Loading easy instructions…'));
    try {
        if(!game.guide)throw new Error('Guide not configured');
        // Resolve relative to the website entry page, not a nested game URL.
        const guideUrl = new URL(game.guide, document.baseURI);
        if (location.protocol === 'file:') {
            throw new Error('Local file preview cannot fetch JSON. Open the published website or use a local web server.');
        }
        const response=await fetch(guideUrl.href,{cache:'no-cache'});
        if(!response.ok)throw new Error('HTTP '+response.status+' at '+guideUrl.href);
        const guide=await response.json();
        if(request!==tkGuideRequest)return;
        content.replaceChildren();
        content.appendChild(tkEl('h2','tk-modal-title',guide.title||game.title));
        content.appendChild(tkEl('p','tk-modal-subtitle',guide.description||''));
        const steps=tkEl('section','tk-guide-section');steps.appendChild(tkEl('h3','','🎮 How to Play'));
        const list=tkEl('ol','tk-guide-steps');
        (guide.steps||[]).forEach(step=>list.appendChild(tkEl('li','',step)));
        steps.appendChild(list);content.appendChild(steps);
        if(Array.isArray(guide.buttons)&&guide.buttons.length) {
            const section=tkEl('section','tk-guide-section');section.appendChild(tkEl('h3','','🔘 What do the buttons do?'));
            guide.buttons.forEach(b=>{const row=tkEl('p','tk-button-explanation');const strong=tkEl('strong','',b.name+': ');row.append(strong,document.createTextNode(b.meaning));section.appendChild(row);});content.appendChild(section);
        }
        if(guide.jsonHelp) {
            const section=tkEl('section','tk-guide-section');section.appendChild(tkEl('h3','','💾 Saving and opening JSON files'));
            const ol=tkEl('ol','tk-guide-steps');
            ['Create or edit your game questions or word sets.','Find Export JSON or Export Data inside the game and save the file on your device.','On another computer, open the same game and choose Load JSON or Import JSON.','Select your saved .json file and check that your content loaded correctly.'].forEach(s=>ol.appendChild(tkEl('li','',s)));
            section.appendChild(ol);section.appendChild(tkEl('p','tk-modal-note','Tip: The exact button names and available export features depend on the game. Keep a backup of your file.'));content.appendChild(section);
        }
        // Optional detailed sections. All text is rendered safely as text, not HTML.
        if(Array.isArray(guide.sections)) {
            guide.sections.forEach(part=>{
                if(!part || !Array.isArray(part.steps)) return;
                const section=tkEl('section','tk-guide-section');
                section.appendChild(tkEl('h3','',part.heading||'More instructions'));
                const ol=tkEl('ol','tk-guide-steps');
                part.steps.forEach(step=>ol.appendChild(tkEl('li','',String(step))));
                section.appendChild(ol);content.appendChild(section);
            });
        }
        if(Array.isArray(guide.tips) && guide.tips.length) {
            const section=tkEl('section','tk-guide-section');
            section.appendChild(tkEl('h3','','💡 Helpful reminders'));
            guide.tips.forEach(tip=>section.appendChild(tkEl('p','tk-modal-note',String(tip))));
            content.appendChild(section);
        }
        const id=tkVideoId(guide.video);
        if(id) {
            const section=tkEl('section','tk-guide-section');section.appendChild(tkEl('h3','','▶️ Watch the video tutorial'));
            const frame=tkEl('iframe','tk-guide-video');frame.src='https://www.youtube-nocookie.com/embed/'+id;frame.title=(guide.title||game.title)+' video tutorial';frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;
            section.appendChild(frame);const a=tkEl('a','tk-video-link','Open on YouTube');a.href=guide.video;a.target='_blank';a.rel='noopener noreferrer';section.appendChild(a);content.appendChild(section);
        } else if(guide.videoChannel) {
            const section=tkEl('section','tk-guide-section');section.appendChild(tkEl('h3','','▶️ Video tutorials'));
            const a=tkEl('a','tk-video-link','Browse Teacher Khen’s YouTube Shorts');a.href=guide.videoChannel;a.target='_blank';a.rel='noopener noreferrer';section.appendChild(a);content.appendChild(section);
        }
        const actions=tkEl('div','tk-guide-footer');actions.append(tkButton('← Back',()=>openGameChoice(game),true),tkButton('🎮 Play Game',()=>tkPlayGame(game)));content.appendChild(actions);
    } catch(error) {
        if(request!==tkGuideRequest)return;
        const expectedUrl = game.guide ? new URL(game.guide, document.baseURI).href : '(not configured)';
        content.replaceChildren(tkEl('h2','tk-modal-title',game.title),tkEl('p','tk-modal-subtitle','The instructions could not be loaded.'));
        content.appendChild(tkEl('p','tk-modal-note','Reason: '+(error && error.message ? error.message : 'Unknown error')));
        const link=tkEl('a','tk-video-link','Test instruction file');
        link.href=expectedUrl;link.target='_blank';link.rel='noopener noreferrer';
        content.appendChild(link);
        content.appendChild(tkButton('← Back',()=>openGameChoice(game),true));
        console.error('Teacher Khen guide load failed:',expectedUrl,error);
    }
}
