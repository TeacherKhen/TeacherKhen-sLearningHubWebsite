
/* TeacherKhen Community — Automatic Game Loading */
const TKCommunity = (() => {
  const TABLE = 'community_lessons';
  const FAV = 'community_favorites';

  // TeacherKhen game-specific Community connectors.
  // URLs preserve the existing game catalog and
  // three user-confirmed live links.
  // A custom Cloudflare domain does NOT need a
  // matching GitHub URL.
  const base = (
    name, url, access, prefix, valid, preview,
    thumbnail = null
  ) => ({
    name,
    url,
    access_level: access,
    protocol: {
      ready: `TK_${prefix}_READY`,
      load: `TK_${prefix}_LESSON`,
      loaded: `TK_${prefix}_LOADED`,
      error: `TK_${prefix}_ERROR`
    },
    origins: url ? [new URL(url).origin] : [],
    valid,
    preview,
    thumbnail
  });

  const anyWords = d =>
    Array.isArray(d?.words) &&
    d.words.length > 0;

  const textWords = d =>
    d.words.map(x =>
      typeof x === 'string' ? x : x?.text || ''
    );

  const hasObjects = d =>
    Array.isArray(d?.objects) &&
    d.objects.length > 0;

  const objectNames = d =>
    d.objects.map(x => x?.name || 'Clue');

  const hasSets = d =>
    Array.isArray(d?.sets) &&
    d.sets.length > 0 &&
    d.sets.every(s =>
      Array.isArray(s?.items) &&
      s.items.length > 0 &&
      s.items.every(i =>
        typeof i?.word === 'string' &&
        i.word.trim()
      )
    );

const setWords = d => {
  const chosen = d.sets.find(s =>
    s?.id === d.selected &&
    Array.isArray(s.items) &&
    s.items.length
  ) || d.sets.find(s =>
    Array.isArray(s?.items) &&
    s.items.length
  );

  return chosen
    ? chosen.items.map(i => i.word)
    : [];
};

  const hasSpiderweb = d => {
    const state = d?.activityState || d;

    return (
      Array.isArray(state?.columns) &&
      state.columns.length >= 2 &&
      state.columns.length <= 6 &&
      state.columns.every(c =>
        Array.isArray(c) &&
        c.length > 0 &&
        c.every(v => typeof v === 'string')
      )
    );
  };

  const spiderwebWords = d =>
    (d?.activityState || d).columns.flat();

  const hasFlipBoard = d =>
    Array.isArray(d?.words) &&
    d.words.length > 0 &&
    d.words.every(w =>
      typeof w === 'string'
    );

  const hasPremiumBoard = d =>
    Array.isArray(d?.presets) &&
    d.presets.length > 0 &&
    d.presets.every(p =>
      typeof p?.name === 'string' &&
      Array.isArray(p?.words) &&
      p.words.length > 0 &&
      p.words.every(w =>
        typeof w?.text === 'string' &&
        w.text.trim()
      )
    );

  const premiumBoardWords = d =>
    d.presets.flatMap(p =>
      p.words.map(w => w.text)
    );

  const hasGiveKeep = d =>
    Array.isArray(d) &&
    d.length === 26 &&
    d.every(q =>
      q &&
      typeof q.text === 'string' &&
      ['id', 'multiple'].includes(q.type) &&
      Array.isArray(q.options) &&
      q.options.length === 4
    );

  const hasMonsterBingo = d =>
    Array.isArray(d?.cards) &&
    d.cards.length >= 1 &&
    d.cards.length <= 12 &&
    d.cards.every(c =>
      typeof c?.text === 'string' &&
      typeof c?.img === 'string'
    ) &&
    Number.isInteger(Number(d.winScore)) &&
    Number(d.winScore) >= 1;

  // =========================================================
  // GAME REGISTRY — ALL 11 GAMES
  // =========================================================

  const GAMES = {

    'click-it': base(
      'Click It!',
      'https://clickit.teacherkhen.com/',
      'free',
      'CLICKIT',
      anyWords,
      textWords
    ),

    'spot-it': base(
      'Spot It! Detectives Premium',
      'https://spot-it.teacherkhen.com/',
      'premium',
      'SPOTIT',
      hasObjects,
      objectNames,
      'spot-it'
    ),

    'spot-it-free': base(
      'Spot It! Detectives FREE',
      'https://spot-it-free.teacherkhen.com/',
      'free',
      'SPOTITFREE',
      hasObjects,
      objectNames
    ),

    'phonics-race': base(
      'Phonics Race',
      'https://phonicsrace.teacherkhen.com/',
      'free',
      'PHONICSRACE',
      d =>
        Array.isArray(d?.rounds) &&
        d.rounds.length > 0 &&
        d.rounds.every(r =>
          typeof r?.title === 'string' &&
          Array.isArray(r.circles) &&
          r.circles.length >= 2 &&
          r.circles.every(i =>
            typeof i?.text === 'string' &&
            Number.isFinite(i.id) &&
            Number.isFinite(i.x) &&
            Number.isFinite(i.y)
          )
        ),
      d =>
        d.rounds.flatMap(r =>
          r.circles.map(c => c.text)
        ),
      'phonics-race'
    ),

    'balloon-pop-free': base(
      'Balloon Pop FREE',
      'https://balloon-pop-free.teacherkhen.com/',
      'free',
      'BALLOONFREE',
      hasSets,
      setWords
    ),

    'balloon-pop-premium': base(
      'Balloon, Bubble & Star Pop Premium',

      // Original website catalog address.
      // Must use HTTPS before live Premium delivery.
      'https://balloon-bubble-star-pop.teacherkhen.com/',

      'premium',
      'BALLOON',
      hasSets,
      setWords
    ),

    'spiderweb-free': base(
      'Spiderweb Reading FREE',
      'https://spiderwebreading.teacherkhen.com/',
      'free',
      'SPIDERWEBFREE',
      hasSpiderweb,
      spiderwebWords
    ),

    'give-or-keep': base(
      'Give or Keep – Classroom Edition',
      'https://teacherkhen.github.io/giveorkeepreviewgame/',
      'free',
      'GIVEKEEP',
      hasGiveKeep,
      d => d.map(q => q.text)
    ),

    'phonics-board': base(
      'Phonics Board FREE',
      'https://phonicsreading.teacherkhen.com/',
      'free',
      'PHONICSBOARD',
      hasFlipBoard,
      d => d.words
    ),

    'phonics-board-premium': base(
      'Phonics Board Premium',
      'https://phonics-learning.teacherkhen.com/',
      'premium',
      'PHONICSPREMIUM',
      hasPremiumBoard,
      premiumBoardWords
    ),

    'monster-bingo': base(
      'Monster Bingo – Pixel UNO',
      'https://teacherkhen.github.io/monster-card-flip-game/',
      'free',
      'MONSTERBINGO',
      hasMonsterBingo,
      d => d.cards.map(c => c.text)
    )

  };

  const gameFor = slug =>
    GAMES[slug] || null;

  const gameProtocol = slug =>
    gameFor(slug)?.thumbnail || slug;

  const supportedLesson = (slug, data) =>
    !!gameFor(slug)?.valid(data);

  const getPreview = (slug, data) => {
    const game = gameFor(slug);

    return game
      ? game.preview(data)
          .slice(0, 18)
          .map(x => String(x).slice(0, 70))
      : [];
  };

  // =========================================================
  // PUBLIC THUMBNAIL METADATA
  // =========================================================

  const THUMB_PREFIX = 'TK_THUMB_V1:';

  const thumbFrom = items =>
    Array.isArray(items)
      ? items.find(
          v =>
            typeof v === 'string' &&
            v.startsWith(THUMB_PREFIX)
        )?.slice(THUMB_PREFIX.length)
      : null;

  const publicPreview = items =>
    Array.isArray(items)
      ? items.filter(
          v =>
            typeof v === 'string' &&
            !v.startsWith(THUMB_PREFIX)
        )
      : [];

  // =========================================================
  // SPOT IT! THUMBNAIL GENERATION
  // =========================================================

  async function createSpotItThumbnail(data) {
    if (
      !Array.isArray(data?.objects) ||
      !data.objects.length
    ) return null;

    const W = 480;
    const H = 270;

    const canvas =
      document.createElement('canvas');

    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const bg =
      ctx.createLinearGradient(0, 0, W, H);

    bg.addColorStop(0, '#264a45');
    bg.addColorStop(.55, '#1a3338');
    bg.addColorStop(1, '#0b1b22');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle =
      'rgba(197,221,189,.09)';

    ctx.lineWidth = 2;

    for (let i = 0; i < 10; i++) {
      const x = (i * 83 + 19) % W;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 22, H);
      ctx.stroke();
    }

    const glow = ctx.createRadialGradient(
      W * .48, H * .51, 15,
      W * .48, H * .51, 235
    );

    glow.addColorStop(
      0,
      'rgba(250,240,187,.24)'
    );

    glow.addColorStop(
      .52,
      'rgba(231,239,182,.08)'
    );

    glow.addColorStop(
      1,
      'rgba(0,0,0,.43)'
    );

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const items = data.objects.slice(0, 12);

    const imageLoad = value =>
      new Promise(resolve => {
        if (
          typeof value !== 'string' ||
          !/^data:image\/(png|jpe?g|webp|gif);base64,/i
            .test(value)
        ) {
          return resolve(null);
        }

        const img = new Image();
        let ended = false;

        const finish = v => {
          if (ended) return;

          ended = true;
          clearTimeout(timer);
          resolve(v);
        };

        const timer = setTimeout(
          () => finish(null),
          6000
        );

        img.onload = () => finish(img);
        img.onerror = () => finish(null);
        img.src = value;
      });

    const pics = await Promise.all(
      items.map(o => imageLoad(o.image))
    );

    const positions = [
      [.14, .27],
      [.34, .32],
      [.55, .27],
      [.76, .34],
      [.21, .61],
      [.43, .65],
      [.66, .61],
      [.87, .69],
      [.14, .84],
      [.35, .82],
      [.57, .83],
      [.79, .85]
    ];

    items.forEach((o, i) => {
      const saved = o.pos?.[0];

      const px = Number(saved?.x);
      const py = Number(saved?.y);

      const x = (
        Number.isFinite(px)
          ? Math.max(
              .12,
              Math.min(.88, px / 100)
            )
          : positions[i][0]
      ) * W;

      const y = (
        Number.isFinite(py)
          ? Math.max(
              .22,
              Math.min(.82, py / 100)
            )
          : positions[i][1]
      ) * H;

      const img = pics[i];

      if (
        img &&
        img.naturalWidth &&
        img.naturalHeight
      ) {
        const max =
          items.length > 8 ? 66 : 83;

        const ratio = Math.min(
          max / img.naturalWidth,
          max / img.naturalHeight
        );

        const iw =
          img.naturalWidth * ratio;

        const ih =
          img.naturalHeight * ratio;

        ctx.save();

        ctx.shadowColor =
          'rgba(0,0,0,.6)';

        ctx.shadowBlur = 9;

        ctx.drawImage(
          img,
          x - iw / 2,
          y - ih / 2,
          iw,
          ih
        );

        ctx.restore();

      } else {
        const label = String(
          o.name || 'Clue'
        ).slice(0, 18);

        const font = Math.min(
          22,
          Math.max(
            12,
            145 / (
              label.length * .75 + 1
            )
          )
        );

        ctx.font =
          `bold ${font}px 'Comic Neue',sans-serif`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;

        ctx.strokeStyle = '#0a2025';
        ctx.strokeText(
          label,
          x,
          y,
          110
        );

        ctx.fillStyle = '#f9e6a6';
        ctx.fillText(
          label,
          x,
          y,
          110
        );
      }
    });

    const vignette =
      ctx.createRadialGradient(
        W * .49, H * .50, 80,
        W * .49, H * .50, 285
      );

    vignette.addColorStop(
      0,
      'rgba(0,0,0,0)'
    );

    vignette.addColorStop(
      1,
      'rgba(0,0,0,.65)'
    );

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    ctx.font =
      "bold 18px 'Comic Neue',sans-serif";

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffe0a0';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 5;

    ctx.fillText(
      '🔎 SPOT IT! DETECTIVES',
      16,
      25
    );

    ctx.shadowBlur = 0;

    try {
      let image = canvas.toDataURL(
        'image/jpeg',
        .69
      );

      if (image.length > 145000) {
        image = canvas.toDataURL(
          'image/jpeg',
          .48
        );
      }

      return image.length < 180000
        ? image
        : null;

    } catch (err) {
      console.warn(
        'Thumbnail creation failed:',
        err
      );

      return null;
    }
  }

  // =========================================================
  // PREVIEW METADATA
  // =========================================================

 
/* =========================================================
   TEACHER KHEN COMMUNITY
   AUTOMATIC JSON-BASED GAME THUMBNAILS
   ========================================================= */

async function createGameThumbnail(slug, data) {

  // Preserve the existing Spot It Premium thumbnail.
  if (slug === 'spot-it') {
    return createSpotItThumbnail(data);
  }

  const W = 480;
  const H = 270;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isPop = slug.startsWith('balloon-pop');
  const isRace = slug === 'phonics-race';
  const isSpider = slug === 'spiderweb-free';

  const theme = isPop
    ? ['#082c50', '#2066a8']
    : isRace
      ? ['#102c59', '#2048a0']
      : isSpider
        ? ['#17203c', '#484071']
        : ['#12384b', '#326c7b'];

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, theme[0]);
  bg.addColorStop(1, theme[1]);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  let entries = [];

  if (isPop) {

    // Use the selected set, not the first preset.
    const set = data.sets.find(s =>
      s?.id === data.selected && s.items?.length
    ) || data.sets.find(s => s?.items?.length);

    entries = (set?.items || []).map(i => ({
      text: i.word,
      image: i.image
    }));

  } else if (slug === 'spot-it-free') {

    entries = data.objects.map(i => ({
      text: i.name,
      image: i.image
    }));

  } else if (isRace) {

    entries = data.rounds.flatMap(r =>
      r.circles.map(i => ({
        text: i.text
      }))
    );

  } else if (isSpider) {

    entries = (data.activityState || data)
      .columns.flat()
      .map(v => ({ text: v }));

  } else if (slug === 'phonics-board-premium') {

    const set = data.presets.find(p =>
      p.id === data.selected && p.words?.length
    ) || data.presets.find(p => p.words?.length);

    entries = (set?.words || []).map(i => ({
      text: i.text,
      image: i.image
    }));

  } else if (slug === 'phonics-board') {

    entries = data.words.map(w => ({
      text: w
    }));

  } else if (slug === 'monster-bingo') {

    entries = data.cards.map(i => ({
      text: i.text,
      image: i.img
    }));

  } else if (slug === 'give-or-keep') {

    entries = data.map(i => ({
      text: i.text,
      image: i.image
    }));

  } else if (slug === 'click-it') {

    entries = data.words.map(i => ({
      text: typeof i === 'string'
        ? i
        : i?.text || '',
      image: i?.image
    }));

  }

  entries = entries.filter(i =>
    typeof i.text === 'string' &&
    i.text.trim()
  ).slice(0, 6);

  // Embedded pictures can be displayed safely.
  // Relative image paths belong to the game's host
  // and are not loaded from TeacherKhen.com.

  const loadImage = src => new Promise(resolve => {

    if (
      typeof src !== 'string' ||
      !/^data:image\/(png|jpeg|webp|gif);base64,/i.test(src)
    ) {
      resolve(null);
      return;
    }

    const img = new Image();

    const timer = setTimeout(
      () => resolve(null),
      3000
    );

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = src;
  });

  const pictures = await Promise.all(
    entries.map(i => loadImage(i.image))
  );

  // Game heading.
  ctx.fillStyle = 'rgba(255,255,255,.95)';
  ctx.font = "bold 20px 'Comic Neue',sans-serif";
  ctx.textAlign = 'center';

  const gameName = gameFor(slug)?.name ||
    'Classroom Game';

  ctx.fillText(
    gameName.slice(0, 34),
    W / 2,
    31,
    450
  );

  // Draw six vocabulary tiles or bubbles.
  entries.forEach((entry, i) => {

    const x = 22 + (i % 3) * 149;
    const y = 49 + Math.floor(i / 3) * 106;

    const cx = x + 69;
    const cy = y + 46;

    if (isPop) {

      ctx.beginPath();

      ctx.ellipse(
        cx, cy, 56, 44, 0,
        0, Math.PI * 2
      );

      ctx.fillStyle = [
        '#fc95b6',
        '#8ed9ff',
        '#ffe28c',
        '#b9edaa',
        '#cdb5ff',
        '#ffbd9e'
      ][i];

      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255,255,255,.7)';
      ctx.stroke();

    } else {

      ctx.fillStyle = 'rgba(255,255,255,.96)';

      ctx.beginPath();
      ctx.roundRect(x, y, 138, 92, 13);
      ctx.fill();

    }

    const img = pictures[i];

    if (
      img?.naturalWidth &&
      img?.naturalHeight
    ) {

      const scale = Math.min(
        64 / img.naturalWidth,
        55 / img.naturalHeight
      );

      const iw = img.naturalWidth * scale;
      const ih = img.naturalHeight * scale;

      ctx.drawImage(
        img,
        cx - iw / 2,
        y + 8,
        iw,
        ih
      );
    }

    const label = entry.text.trim().slice(0, 35);

    const font = Math.max(
      12,
      Math.min(
        23,
        235 / (label.length * .7 + 2)
      )
    );

    ctx.font =
      `bold ${font}px 'Comic Neue',sans-serif`;

    ctx.fillStyle = '#172b53';
    ctx.textBaseline = 'middle';

    ctx.fillText(
      label,
      cx,
      img ? y + 76 : cy,
      126
    );

    ctx.textBaseline = 'alphabetic';

  });

  if (!entries.length) {

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px sans-serif';

    ctx.fillText(
      'Ready to play',
      W / 2,
      H / 2
    );
  }

  // Compressed thumbnails remain small enough
  // for Community preview metadata.
  try {

    let result = canvas.toDataURL(
      'image/jpeg',
      .66
    );

    if (result.length > 145000) {
      result = canvas.toDataURL(
        'image/jpeg',
        .4
      );
    }

    return result.length < 180000
      ? result
      : null;

  } catch (e) {

    console.warn('Thumbnail failed', e);
    return null;

  }
}

/* =========================================================
   GENERATE THUMBNAIL AUTOMATICALLY ON UPLOAD
   ========================================================= */

async function previewMetadata(slug, json) {

  const names = getPreview(slug, json);

  const thumbnail = await createGameThumbnail(
    slug,
    json
  );

  return thumbnail
    ? [THUMB_PREFIX + thumbnail, ...names]
    : names;
}

/* END AUTOMATIC THUMBNAILS */

  // =========================================================
  // COMMUNITY STATE
  // =========================================================

  let page = 'games';
  let filter = 'all';
  let lessons = [];
  let favorites = new Set();
  let isAdmin = false;
  let lastUserId = null;

  const $ = id =>
    document.getElementById(id);

  const client = () =>
    window.supabaseClient ||
    (
      typeof supabaseClient !== 'undefined'
        ? supabaseClient
        : null
    );

  function el(tag, cls, txt) {
    const e = document.createElement(tag);

    if (cls) e.className = cls;

    if (txt !== undefined) {
      e.textContent = txt;
    }

    return e;
  }

  function user() {
    return typeof currentUser !== 'undefined'
      ? currentUser
      : null;
  }

  function prem() {
    return (
      typeof isPremiumMember === 'function' &&
      isPremiumMember()
    );
  }

  function visibleLessons() {
    return lessons.filter(
      l =>
        isAdmin ||
        (
          l.is_published &&
          !!gameFor(l.game_slug)
        )
    );
  }

  // =========================================================
  // PAGE NAVIGATION
  // =========================================================

  function navigate(next) {
    if (next === 'premium') {
      openPremiumModal();
      return;
    }

    if (
      next === 'admin' &&
      !isAdmin
    ) return;

    page = next;

    const show = [
      'community',
      'library',
      'admin'
    ].includes(next);

    const shell =
      $('tk-community-shell');

    shell.hidden = !show;

    $('tk-community-content').hidden =
      next === 'admin';

    $('tk-community-admin').hidden =
      next !== 'admin';

    [
      'game-explorer',
      'gameGrid',
      'noResults'
    ].forEach(id => {
      const node = $(id);

      if (node) {
        node.hidden = show;
      }
    });

    const donate = document.querySelector(
      '.bottom-donate-container'
    );

    if (donate) {
      donate.hidden = show;
    }

    document.querySelectorAll(
      '[data-tk-page]'
    ).forEach(b => {
      b.classList.toggle(
        'tk-active',
        b.dataset.tkPage === next
      );
    });

    if (next === 'library') {
      $('tk-community-heading').textContent =
        'My Library';

      $('tk-community-subheading').textContent =
        'Your saved lessons — free and premium.';

    } else if (next === 'admin') {
      $('tk-community-heading').textContent =
        'Manage Community';

      $('tk-community-subheading').textContent =
        'Upload, publish, unpublish or delete lessons.';

      renderAdmin();

    } else {
      $('tk-community-heading').textContent =
        'Teacher Khen Community';

      $('tk-community-subheading').textContent =
        'Explore ready-to-play classroom activities.';
    }

    if (next === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    if (show) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      render();
    }
  }

  // =========================================================
  // LOAD COMMUNITY LESSONS
  // =========================================================

  async function refresh() {
    const sb = client();

    if (!sb) return;

    const id = user()?.id || null;

    if (lastUserId !== id) {
      favorites.clear();
      lastUserId = id;
    }

    const [all, admins, favs] =
      await Promise.all([

        sb.from(TABLE)
          .select(
            'id,title,game_slug,description,grade_level,access_level,preview_items,json_path,is_published,created_at'
          )
          .order(
            'created_at',
            { ascending: false }
          ),

        id
          ? sb.from('community_admins')
              .select('user_id')
              .eq('user_id', id)
              .maybeSingle()
          : Promise.resolve({
              data: null
            }),

        id
          ? sb.from(FAV)
              .select('lesson_id')
              .eq('user_id', id)
          : Promise.resolve({
              data: []
            })

      ]);

    if (all.error) {
      console.error(
        'Community loading:',
        all.error.message
      );
    } else {
      lessons = all.data || [];
    }

    isAdmin = !!admins.data;

    favorites = new Set(
      (favs.data || [])
        .map(x => x.lesson_id)
    );

    renderGameSelector();

    $('tk-admin-nav').hidden = !isAdmin;

    if (
      page === 'admin' &&
      !isAdmin
    ) {
      navigate('community');
    }

    render();

    if (page === 'admin') {
      renderAdmin();
    }
  }

  // =========================================================
  // LESSON CARDS
  // =========================================================

  function card(l) {
    const card = el(
      'article',
      'tk-lesson-card tk-wall-card'
    );

    const panel = el(
      'div',
      'tk-lesson-preview tk-wall-image'
    );

    const screenshot = el(
      'div',
      'tk-wall-game-screen'
    );

    const heading = el(
      'div',
      'tk-wall-game-heading'
    );

    heading.append(
      el(
        'span',
        'tk-wall-game-icon',
        '✦'
      ),
      el(
        'strong',
        '',
        gamesLabel(l.game_slug)
      )
    );

    screenshot.append(heading);

    const frame = el(
      'div',
      'tk-wall-player-frame'
    );

    const isSpotIt =
      gameProtocol(l.game_slug) ===
      'spot-it';

    const isRace =
      gameProtocol(l.game_slug) ===
      'phonics-race';

    
const thumbnail = thumbFrom(l.preview_items);


    if (isSpotIt) {
      screenshot.classList.add(
        'tk-spotit-screen'
      );
    }

    if (thumbnail) {
      const picture = el(
        'img',
        'tk-spotit-auto-preview'
      );

      picture.src = thumbnail;

      picture.alt =
        'Preview of ' + l.title;

      picture.loading = 'lazy';
      picture.decoding = 'async';

      Object.assign(frame.style, {
        padding: '0',
        margin: '6px 8px 2px',
        border: '2px solid #bc9851',
        background: '#10272c',
        overflow: 'hidden',
        position: 'relative'
      });

      Object.assign(picture.style, {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        borderRadius: '8px'
      });

      frame.append(picture);

    } else if (isSpotIt) {
      Object.assign(frame.style, {
        position: 'relative',
        background:
          'radial-gradient(circle at 43% 45%,#506a57 0%,#233f3c 41%,#07161b 100%)',
        border: '2px solid #bea45a',
        overflow: 'hidden'
      });

      const clues = el(
        'div',
        'tk-spotit-word-scene'
      );

      Object.assign(clues.style, {
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100px'
      });

      publicPreview(l.preview_items)
        .slice(0, 7)
        .forEach((word, i) => {
          const positions = [
            [12, 18],
            [40, 25],
            [67, 18],
            [24, 60],
            [58, 63],
            [78, 55],
            [41, 82]
          ];

          const clue = el(
            'span',
            '',
            String(word).slice(0, 18)
          );

          Object.assign(clue.style, {
            position: 'absolute',
            left: positions[i][0] + '%',
            top: positions[i][1] + '%',
            transform:
              'translate(-20%,-20%)',
            font:
              'bold clamp(10px,1.5vw,20px) Comic Neue,sans-serif',
            color: '#ffecb5',
            textShadow:
              '0 2px 5px #000,0 0 5px #000',
            maxWidth: '38%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          });

          clues.append(clue);
        });

      const beam = el('div', '');

      Object.assign(beam.style, {
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        background:
          'radial-gradient(circle at 43% 46%,transparent 0%,rgba(0,0,0,.15) 43%,rgba(0,0,0,.70) 100%)'
      });

      clues.append(beam);
      frame.append(clues);

    } else if (isRace) {
      // Phonics Race thumbnail.

      const scene = el(
        'div',
        'tk-race-scene'
      );

      Object.assign(scene.style, {
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '142px',
        background:
          'linear-gradient(145deg,#164e63,#1e3a8a 56%,#0f172a)',
        overflow: 'hidden',
        borderRadius: '10px'
      });

      const line = el('div', '');

      Object.assign(line.style, {
        position: 'absolute',
        left: '9%',
        right: '9%',
        top: '52%',
        height: '3px',
        background:
          'repeating-linear-gradient(90deg,#fef9c3 0 12px,transparent 12px 23px)',
        transform: 'rotate(-7deg)',
        opacity: '.85'
      });

      scene.append(line);

      const oldKeys = new Set([
        'scores',
        'currentRound',
        'rounds',
        'customFontSize',
        'bgmVolume'
      ]);

      const words = publicPreview(
        l.preview_items
      ).filter(
        x => !oldKeys.has(String(x))
      ).slice(0, 8);

      const samples = words.length
        ? words
        : ['Phonics', 'Race'];

      const positions = [
        [9, 21],
        [31, 39],
        [53, 20],
        [73, 40],
        [14, 71],
        [37, 65],
        [61, 72],
        [79, 62]
      ];

      samples.forEach((word, i) => {
        const label = el(
          'span',
          '',
          String(word).slice(0, 16)
        );

        Object.assign(label.style, {
          position: 'absolute',
          left: positions[i][0] + '%',
          top: positions[i][1] + '%',
          maxWidth: '22%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          font:
            'bold clamp(11px,1.3vw,19px) Comic Neue,sans-serif',
          color: '#fff',
          textShadow:
            '-2px -2px #0f172a,2px 2px #0f172a,0 3px 5px #000',
          transform:
            'translate(-10%,-50%)'
        });

        scene.append(label);
      });

      const flag = el(
        'span',
        '',
        '🏁'
      );

      Object.assign(flag.style, {
        position: 'absolute',
        right: '3%',
        top: '3%',
        fontSize: '25px'
      });

      scene.append(flag);
      frame.append(scene);

    } else {
      // Generic vocabulary preview.

      const board = el(
        'div',
        'tk-wall-choices'
      );

      publicPreview(l.preview_items)
        .slice(0, 6)
        .forEach((word, i) => {
          board.append(
            el(
              'span',
              'tk-wall-tile tk-wall-tile-' +
                (i % 6),
              String(word).slice(0, 24)
            )
          );
        });

      if (!board.children.length) {
        board.append(
          el(
            'span',
            'tk-wall-tile',
            'Ready to play'
          )
        );
      }

      frame.append(board);
    }

    screenshot.append(frame);
    panel.append(screenshot);

    // Access badge.

    panel.append(
      el(
        'span',
        'tk-lesson-badge' +
          (
            l.access_level === 'premium'
              ? ' premium'
              : ''
          ),
        l.access_level === 'premium'
          ? '♛ Premium'
          : 'Free'
      )
    );

    // Save favorite.

    const heart = el(
      'button',
      'tk-heart',
      favorites.has(l.id)
        ? '♥'
        : '♡'
    );

    heart.type = 'button';

    heart.title = favorites.has(l.id)
      ? 'Remove from My Library'
      : 'Save to My Library';

    heart.setAttribute(
      'aria-label',
      heart.title
    );

    heart.onclick = event => {
      event.stopPropagation();
      toggleFavorite(l.id);
    };

    panel.append(heart);
    card.append(panel);

    card.append(
      el(
        'h4',
        '',
        l.title
      )
    );

    card.append(
      el(
        'p',
        'tk-lesson-meta',
        `${gamesLabel(l.game_slug)} • ${
          l.grade_level || 'All Grades'
        }`
      )
    );

    if (l.description) {
      card.append(
        el(
          'p',
          'tk-wall-description',
          l.description
        )
      );
    }

    const buttons = el(
      'div',
      'tk-lesson-actions'
    );

    const locked =
      l.access_level === 'premium' &&
      !prem() &&
      !isAdmin;

    const play = el(
      'button',
      'tk-play-button',
      locked
        ? '🔒 Unlock Premium'
        : gameFor(l.game_slug)
          ? '▶ Play Lesson'
          : 'Not Yet Connected'
    );

    play.type = 'button';

    play.disabled =
      !locked && !gameFor(l.game_slug);

    play.title = play.disabled
      ? 'Automatic loading is not connected for this game yet.'
      : '';

    play.onclick = () =>
      locked
        ? openPremiumModal()
        : playLesson(l);

    buttons.append(play);
    card.append(buttons);

    return card;
  }

  // =========================================================
  // GAME LABEL
  // =========================================================

  function gamesLabel(slug) {
    return (
      gameFor(slug)?.name ||
      slug.replace(/-/g, ' ')
        .replace(
          /\b\w/g,
          c => c.toUpperCase()
        )
    );
  }

  // =========================================================
  // RENDER COMMUNITY AND MY LIBRARY
  // =========================================================

  function render() {
    const grid =
      $('tk-lessons-grid');

    if (!grid) return;

    grid.replaceChildren();

    let all = visibleLessons();

    if (page === 'library') {
      if (!user()) {
        grid.append(
          el(
            'div',
            'tk-community-empty',
            'Log in to see your saved lessons.'
          )
        );

        return;
      }

      all = all.filter(
        l => favorites.has(l.id)
      );

    } else if (page === 'community') {
      const q = $('tk-community-search')
        .value.toLowerCase().trim();

      all = all.filter(
        l =>
          (
            filter === 'all' ||
            l.access_level === filter
          ) &&
          (
            !q ||
            [
              l.title,
              l.description,
              l.grade_level,
              l.game_slug
            ].join(' ')
              .toLowerCase()
              .includes(q)
          )
      );
    }

    if (!all.length) {
      grid.append(
        el(
          'div',
          'tk-community-empty',
          page === 'library'
            ? 'No favorites yet. Tap a heart in Community to save lessons.'
            : 'No lessons found yet.'
        )
      );

      return;
    }

    all.forEach(l =>
      grid.append(card(l))
    );
  }

  // =========================================================
  // LESSON CONTENT PREVIEW
  // =========================================================

  function showPreview(l) {
    const b =
      $('tk-preview-body');

    b.replaceChildren();

    b.append(
      el(
        'h2',
        '',
        l.title
      ),
      el(
        'p',
        '',
        `${gamesLabel(l.game_slug)} · ${
          l.grade_level || 'All Grades'
        } · ${l.access_level.toUpperCase()}`
      ),
      el(
        'p',
        '',
        l.description ||
          'Ready-made classroom lesson'
      )
    );

    const chips = el(
      'div',
      'tk-preview-chips'
    );

    publicPreview(l.preview_items)
      .slice(0, 18)
      .forEach(v => {
        chips.append(
          el(
            'span',
            '',
            String(v)
          )
        );
      });

    b.append(chips);

    b.append(
      el(
        'p',
        '',
        'This is a content preview, not a live gameplay screenshot.'
      )
    );

    $('tk-preview-overlay').hidden =
      false;
  }

  // =========================================================
  // SAVE OR REMOVE FAVORITES
  // =========================================================

  async function toggleFavorite(id) {
    const u = user();

    if (!u) {
      openAuthModal();
      return;
    }

    const sb = client();

    const removing =
      favorites.has(id);

    const result = removing
      ? await sb.from(FAV)
          .delete()
          .eq('user_id', u.id)
          .eq('lesson_id', id)
      : await sb.from(FAV)
          .insert({
            user_id: u.id,
            lesson_id: id
          });

    if (result.error) {
      alert(
        result.error.message
      );

      return;
    }

    if (removing) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    render();
  }

  // =========================================================
  // AUTOMATIC GAME LESSON LOADING
  // =========================================================

  async function playLesson(l) {
    const game =
      gameFor(l.game_slug);

    if (!game) {
      alert(
        'Automatic JSON loading is not connected for this game yet.'
      );

      return;
    }

    const url = game.url;

    if (!url) {
      alert(
        'The game link has not been confirmed for ' +
        game.name +
        '. Add its exact deployed URL to community.js before launching.'
      );

      return;
    }

    // Prevent Premium lesson delivery over HTTP.
    if (
      game.access_level === 'premium' &&
      !url.startsWith('https://')
    ) {
      alert(
        'This Premium game requires a secure HTTPS URL before Community lessons can be launched.'
      );

      return;
    }

    const popup = window.open(
      'about:blank',
      '_blank'
    );

    if (!popup) {
      alert(
        'Please allow popups for this site.'
      );

      return;
    }

    popup.document.body.textContent =
      'Loading your classroom lesson…';

    try {
      const {
        data,
        error
      } = await client()
        .functions.invoke(
          'community-lesson',
          {
            body: {
              lesson_id: l.id
            }
          }
        );

      if (error) throw error;

      if (
        !supportedLesson(
          l.game_slug,
          data
        )
      ) {
        throw new Error(
          'The lesson JSON is invalid for ' +
          gamesLabel(l.game_slug) +
          '.'
        );
      }

      const protocol = game.protocol;

      if (!protocol) {
        throw new Error(
          'Game connector not supported yet.'
        );
      }

      const trustedOrigins = new Set([
        new URL(url).origin,
        ...(game.origins || [])
      ]);

      let messageTimer;
      let finished = false;

      const cleanup = () => {
        window.removeEventListener(
          'message',
          onMessage
        );

        clearTimeout(messageTimer);
      };

      const onMessage = async e => {
        if (
          e.source !== popup ||
          !trustedOrigins.has(e.origin)
        ) return;

        // Game tells Community it is ready.

        if (
          e.data?.type === protocol.ready &&
          !finished
        ) {
          popup.postMessage(
            {
              type: protocol.load,
              lesson: data
            },
            e.origin
          );
        }

        // Game confirms lesson loaded.

        if (
          e.data?.type === protocol.loaded &&
          !finished
        ) {
          finished = true;
          cleanup();

          if (
            user() &&
            !favorites.has(l.id)
          ) {
            const saved =
              await client()
                .from(FAV)
                .upsert(
                  {
                    user_id: user().id,
                    lesson_id: l.id
                  },
                  {
                    onConflict:
                      'user_id,lesson_id'
                  }
                );

            if (!saved.error) {
              favorites.add(l.id);
              render();

            } else {
              console.warn(
                'Could not automatically save favorite:',
                saved.error.message
              );
            }
          }
        }

        // Game reports a lesson error.

        if (
          e.data?.type === protocol.error &&
          !finished
        ) {
          finished = true;
          cleanup();

          alert(
            'Game could not load lesson: ' +
            (
              e.data.message ||
              'Unknown error'
            )
          );
        }
      };

      window.addEventListener(
        'message',
        onMessage
      );

      messageTimer = setTimeout(
        () => {
          if (!finished) {
            cleanup();

            console.warn(
              gamesLabel(l.game_slug) +
              ' did not acknowledge Community lesson load. Confirm the corresponding game HTML is deployed.'
            );

            alert(
              'The game did not confirm loading the Community lesson. Check that the updated HTML connector is deployed at the registered game URL.'
            );
          }
        },
        300000
      );

      popup.location.href =
        url.split('#')[0] +
        '#tk-community';

    } catch (err) {
      popup.close();

      alert(
        'Unable to open lesson: ' +
        (
          err.message ||
          'Please sign in or check membership.'
        )
      );
    }
  }

  // =========================================================
  // ADMIN — UPLOAD A COMMUNITY LESSON
  // =========================================================

  async function upload(e) {
    e.preventDefault();

    if (
      !isAdmin ||
      !user()
    ) return;

    const status =
      $('tk-upload-status');

    const form =
      $('tk-upload-form');

    const fd =
      new FormData(form);

    const file =
      fd.get('lesson_file');

    if (
      !file?.name?.toLowerCase()
        .endsWith('.json')
    ) {
      status.textContent =
        'Please choose a JSON file.';

      return;
    }

    const submit =
      form.querySelector(
        '[type=submit]'
      );

    submit.disabled = true;

    status.textContent =
      'Validating and uploading...';

    let path = null;

    try {
      if (
        file.size >
        10 * 1024 * 1024
      ) {
        throw new Error(
          'JSON exceeds 10 MB.'
        );
      }

      let json = JSON.parse(
        await file.text()
      );

      const slug = String(
        fd.get('game_slug')
      );
      
/* TEACHER KHEN - BALLOON POP JSON CLEANUP */

let uploadFile = file;

if (
  slug === 'balloon-pop-free' ||
  slug === 'balloon-pop-premium'
) {
  if (
    json &&
    typeof json === 'object' &&
    !Array.isArray(json) &&
    Array.isArray(json.sets)
  ) {
    const originalCount = json.sets.length;

    const cleanedSets = json.sets.filter(
      set =>
        !set ||
        !Array.isArray(set.items) ||
        set.items.length !== 0
    );

    const removedCount =
      originalCount - cleanedSets.length;

    if (removedCount > 0) {
      json = {
        ...json,
        sets: cleanedSets
      };

      const cleanedText = JSON.stringify(json);

      uploadFile = new File(
        [cleanedText],
        file.name,
        {
          type: 'application/json'
        }
      );

      console.log(
        'TeacherKhen Community: Removed ' +
        removedCount +
        ' empty vocabulary set(s).'
      );
    }
  }
}

if (uploadFile.size > 10 * 1024 * 1024) {
  throw new Error('JSON exceeds 10 MB.');
}

/* END BALLOON POP CLEANUP */


      const game =
        gameFor(slug);

      if (!game) {
        throw new Error(
          'This game is not yet integrated with Community.'
        );
      }

      if (
        !supportedLesson(
          slug,
          json
        )
      ) {
        throw new Error(
          'The JSON is not valid for the selected game.'
        );
      }

      if (
        game.access_level === 'premium' &&
        String(
          fd.get('access_level')
        ) !== 'premium'
      ) {
        throw new Error(
          'This Premium game requires Premium lesson access.'
        );
      }

      path =
        `${slug}/${crypto.randomUUID()}.json`;

      const sb = client();

      const storage =
        await sb.storage
          .from('community-json')          
.upload(
  path,
  uploadFile,
  {
    contentType:
      'application/json',
    upsert: false
  }
);

      if (storage.error) {
        throw storage.error;
      }

      const row = {
        title:
          String(
            fd.get('title')
          ).trim(),

        game_slug: slug,

        description:
          String(
            fd.get('description')
          ).trim(),

        grade_level:
          String(
            fd.get('grade_level')
          ),

        access_level:
          String(
            fd.get('access_level')
          ),

        preview_items:
          await previewMetadata(
            slug,
            json
          ),

        json_path: path,

        is_published:
          fd.has('is_published'),

        created_by:
          user().id
      };

      const insert =
        await sb.from(TABLE)
          .insert(row)
          .select('id')
          .single();

      if (insert.error) {
        throw insert.error;
      }

      status.textContent =
        'Lesson uploaded successfully!';

      form.reset();

      await refresh();

    } catch (err) {
      status.textContent =
        'Upload failed: ' +
        err.message;

      if (path) {
        await client()
          .storage
          .from('community-json')
          .remove([path]);
      }

    } finally {
      submit.disabled = false;
    }
  }

  // =========================================================
  // ADMIN — GAME SELECTOR
  // =========================================================

  function renderGameSelector() {
    const select =
      $('tk-upload-form')
        ?.elements.namedItem(
          'game_slug'
        );

    if (!select) return;

    const previous = select.value;

    select.replaceChildren();

    Object.entries(GAMES)
      .forEach(([slug, game]) => {
        const option = el(
          'option',
          '',
          game.name
        );

        option.value = slug;
        select.append(option);
      });

    if (
      [...select.options].some(
        x => x.value === previous
      )
    ) {
      select.value = previous;
    }

    syncAccessWithGame();
  }

  // =========================================================
  // ADMIN — PREMIUM ACCESS SELECTION
  // =========================================================

  function syncAccessWithGame() {
    const form =
      $('tk-upload-form');

    if (!form) return;

    const game = gameFor(
      form.elements.namedItem(
        'game_slug'
      )?.value
    );

    const access =
      form.elements.namedItem(
        'access_level'
      );

    if (!access) return;

    if (
      game?.access_level === 'premium'
    ) {
      access.value = 'premium';
    }

    access.querySelector(
      'option[value="free"]'
    )?.toggleAttribute(
      'disabled',
      game?.access_level === 'premium'
    );
  }

  // =========================================================
  // ADMIN — MANAGE EXISTING LESSONS
  // =========================================================

  async function renderAdmin() {
    if (!isAdmin) return;

    const area =
      $('tk-admin-records');

    area.replaceChildren();

    lessons.forEach(l => {
      const r = el(
        'div',
        'tk-admin-record'
      );

      r.append(
        el('strong', '', l.title),
        el('span', '', l.access_level)
      );

      const type =
        gameProtocol(l.game_slug);

      
/* =========================================================
   TEACHER KHEN COMMUNITY
   REGENERATE THUMBNAILS FOR ALL GAMES
   ========================================================= */

if (gameFor(l.game_slug)) {

  const rebuild = el(
    'button',
    '',
    'Regenerate Thumbnail'
  );

  rebuild.type = 'button';

  rebuild.title =
    'Generate a thumbnail from the existing lesson JSON.';

  rebuild.onclick = async () => {

    rebuild.disabled = true;
    rebuild.textContent = 'Generating...';

    try {

      const { data, error } =
        await client().functions.invoke(
          'community-lesson',
          {
            body: {
              lesson_id: l.id
            }
          }
        );

      if (error) throw error;

      if (!supportedLesson(l.game_slug, data)) {
        throw new Error(
          'Invalid lesson JSON for ' +
          gamesLabel(l.game_slug)
        );
      }

      const metadata = await previewMetadata(
        l.game_slug,
        data
      );

      if (!thumbFrom(metadata)) {
        throw new Error(
          'Thumbnail could not be generated.'
        );
      }

      const { error: updateError } =
        await client()
          .from(TABLE)
          .update({
            preview_items: metadata
          })
          .eq('id', l.id);

      if (updateError) {
        throw updateError;
      }

      rebuild.textContent = 'Updated!';

      await refresh();

    } catch (err) {

      console.error(
        'Thumbnail regeneration failed:',
        err
      );

      alert(
        'Thumbnail update failed: ' +
        (err.message || 'Unknown error')
      );

      rebuild.disabled = false;

      rebuild.textContent =
        'Regenerate Thumbnail';
    }

  };

  r.append(rebuild);
}

/* END UNIVERSAL THUMBNAIL REGENERATION */


      // Publish or unpublish.

      const toggle = el(
        'button',
        '',
        l.is_published
          ? 'Unpublish'
          : 'Publish'
      );

      toggle.onclick = async () => {
        if (
          !confirm(
            `Change publication status for "${l.title}"?`
          )
        ) return;

        const { error } =
          await client()
            .from(TABLE)
            .update({
              is_published:
                !l.is_published
            })
            .eq('id', l.id);

        if (error) {
          alert(error.message);
        } else {
          refresh();
        }
      };

      r.append(toggle);

      // Delete lesson.

      const del = el(
        'button',
        '',
        'Delete'
      );

      del.onclick = async () => {
        if (
          !confirm(
            `Delete lesson "${l.title}" and its JSON file?`
          )
        ) return;

        const { error } =
          await client()
            .from(TABLE)
            .delete()
            .eq('id', l.id);

        if (error) {
          alert(error.message);
          return;
        }

        const result =
          await client()
            .storage
            .from('community-json')
            .remove([
              l.json_path
            ]);

        if (result.error) {
          alert(
            'Lesson removed; file cleanup failed: ' +
            result.error.message
          );
        }

        refresh();
      };

      r.append(del);
      area.append(r);
    });
  }

  // =========================================================
  // INITIALIZATION
  // =========================================================

  function init() {
    if (
      !$('tk-community-shell')
    ) {
      return;
    }

    $('tk-upload-form')
      .addEventListener(
        'submit',
        upload
      );

    $('tk-upload-form')
      .elements.namedItem(
        'game_slug'
      )
      .addEventListener(
        'change',
        syncAccessWithGame
      );

    // Remove legacy Manage Games panel.
    $('tk-manage-games')?.remove();

    $('tk-preview-close').onclick =
      () =>
        $('tk-preview-overlay').hidden =
          true;

    $('tk-preview-overlay').onclick =
      e => {
        if (
          e.target ===
          $('tk-preview-overlay')
        ) {
          $('tk-preview-overlay').hidden =
            true;
        }
      };

    $('tk-community-search').oninput =
      render;

    document.querySelectorAll(
      '#tk-community-filters [data-filter]'
    ).forEach(b => {
      b.onclick = () => {
        filter =
          b.dataset.filter;

        document.querySelectorAll(
          '#tk-community-filters [data-filter]'
        ).forEach(x => {
          x.classList.toggle(
            'active',
            x === b
          );
        });

        render();
      };
    });

    client()?.auth.onAuthStateChange(
      () => setTimeout(refresh, 0)
    );

    refresh();

    if (
      location.hash === '#community'
    ) {
      navigate('community');

    } else if (
      location.hash === '#library'
    ) {
      navigate('library');
    }
  }

  document.addEventListener(
    'DOMContentLoaded',
    init
  );

  return {
    navigate,
    refresh
  };

})();
