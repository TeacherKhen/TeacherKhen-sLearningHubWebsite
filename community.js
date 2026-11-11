
/* =========================================================
   TEACHER KHEN COMMUNITY
   Manage Games + Automatic Spot It! Thumbnails
   ========================================================= */

const TKCommunity = (() => {

  const TABLE = 'community_lessons';
  const FAV = 'community_favorites';
  const REGISTRY = 'community_games';

  let registeredGames = [];

  const gameFor = slug =>
    registeredGames.find(g => g.slug === slug);

  const gameProtocol = slug =>
    gameFor(slug)?.protocol ||
    (slug === 'spot-it' ? 'spot-it' : 'click-it');

  const URLS = {
    'click-it': 'https://clickit.teacherkhen.com/',
    'spot-it': 'https://spot-it.teacherkhen.com/'
  };

  const GAME_ORIGINS = {
    'click-it': new Set([
      'https://clickit.teacherkhen.com',
      'https://teacherkhen.github.io'
    ]),
    'spot-it': new Set([
      'https://spot-it.teacherkhen.com',
      'https://teacherkhen.github.io'
    ])
  };

  const PROTOCOLS = {
    'click-it': {
      ready: 'TK_CLICKIT_READY',
      load: 'TK_CLICKIT_LESSON',
      loaded: 'TK_CLICKIT_LOADED',
      error: 'TK_CLICKIT_ERROR'
    },
    'spot-it': {
      ready: 'TK_SPOTIT_READY',
      load: 'TK_SPOTIT_LESSON',
      loaded: 'TK_SPOTIT_LOADED',
      error: 'TK_SPOTIT_ERROR'
    }
  };

  const supportedLesson = (slug, data) => {
    const protocol = gameProtocol(slug);

    if (protocol === 'click-it') {
      return Array.isArray(data?.words) &&
        data.words.length > 0;
    }

    if (protocol === 'spot-it') {
      return Array.isArray(data?.objects) &&
        data.objects.length > 0;
    }

    return false;
  };

  const getPreview = (slug, data) => {
    const items = gameProtocol(slug) === 'spot-it'
      ? data.objects.map(x => String(x.name || 'Clue'))
      : data.words;

    return items
      .slice(0, 18)
      .map(x => String(x).slice(0, 70));
  };

  /* =====================================================
     AUTOMATIC SPOT IT! THUMBNAILS

     Thumbnails are stored in preview_items metadata.
     Original lesson JSON remains in private Storage.
     No additional CSS file or table is required.
     ===================================================== */

  const THUMB_PREFIX = 'TK_THUMB_V1:';

  const thumbFrom = items => {
    if (!Array.isArray(items)) return null;

    const item = items.find(v =>
      typeof v === 'string' &&
      v.startsWith(THUMB_PREFIX)
    );

    return item
      ? item.slice(THUMB_PREFIX.length)
      : null;
  };

  const publicPreview = items =>
    Array.isArray(items)
      ? items.filter(v =>
          typeof v === 'string' &&
          !v.startsWith(THUMB_PREFIX)
        )
      : [];

  async function createSpotItThumbnail(data) {

    if (
      !Array.isArray(data?.objects) ||
      !data.objects.length
    ) {
      return null;
    }

    const W = 480;
    const H = 270;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    /* Detective background */

    const bg = ctx.createLinearGradient(
      0, 0, W, H
    );

    bg.addColorStop(0, '#264a45');
    bg.addColorStop(0.55, '#1a3338');
    bg.addColorStop(1, '#0b1b22');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Background texture */

    ctx.strokeStyle = 'rgba(197,221,189,.09)';
    ctx.lineWidth = 2;

    for (let i = 0; i < 10; i++) {
      const x = (i * 83 + 19) % W;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 22, H);
      ctx.stroke();
    }

    /* Flashlight glow */

    const glow = ctx.createRadialGradient(
      W * 0.48,
      H * 0.51,
      15,
      W * 0.48,
      H * 0.51,
      235
    );

    glow.addColorStop(
      0,
      'rgba(250,240,187,.24)'
    );

    glow.addColorStop(
      0.52,
      'rgba(231,239,182,.08)'
    );

    glow.addColorStop(
      1,
      'rgba(0,0,0,.43)'
    );

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const items = data.objects.slice(0, 12);

    /* Load embedded images */

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

        const finish = result => {
          if (ended) return;

          ended = true;
          clearTimeout(timer);

          resolve(result);
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
      [0.14, 0.27],
      [0.34, 0.32],
      [0.55, 0.27],
      [0.76, 0.34],
      [0.21, 0.61],
      [0.43, 0.65],
      [0.66, 0.61],
      [0.87, 0.69],
      [0.14, 0.84],
      [0.35, 0.82],
      [0.57, 0.83],
      [0.79, 0.85]
    ];

    /* Draw lesson-specific clues */

    items.forEach((o, i) => {

      const saved = o.pos?.[0];

      const px = Number(saved?.x);
      const py = Number(saved?.y);

      const x = (
        Number.isFinite(px)
          ? Math.max(
              0.12,
              Math.min(0.88, px / 100)
            )
          : positions[i][0]
      ) * W;

      const y = (
        Number.isFinite(py)
          ? Math.max(
              0.22,
              Math.min(0.82, py / 100)
            )
          : positions[i][1]
      ) * H;

      const img = pics[i];

      if (
        img &&
        img.naturalWidth &&
        img.naturalHeight
      ) {

        const max = items.length > 8 ? 66 : 83;

        const ratio = Math.min(
          max / img.naturalWidth,
          max / img.naturalHeight
        );

        const iw = img.naturalWidth * ratio;
        const ih = img.naturalHeight * ratio;

        ctx.save();

        ctx.shadowColor = 'rgba(0,0,0,.6)';
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

        /* Word-only fallback */

        const label = String(
          o.name || 'Clue'
        ).slice(0, 18);

        const font = Math.min(
          22,
          Math.max(
            12,
            145 / (label.length * 0.75 + 1)
          )
        );

        ctx.font =
          `bold ${font}px 'Comic Neue',sans-serif`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0a2025';

        ctx.strokeText(
          label, x, y, 110
        );

        ctx.fillStyle = '#f9e6a6';

        ctx.fillText(
          label, x, y, 110
        );
      }
    });

    /* Dark edges */

    const vignette = ctx.createRadialGradient(
      W * 0.49,
      H * 0.50,
      80,
      W * 0.49,
      H * 0.50,
      285
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

    /* Game heading */

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

    /* Thumbnail only:
       Original lesson pictures remain unchanged. */

    try {

      let image = canvas.toDataURL(
        'image/jpeg',
        0.69
      );

      if (image.length > 145000) {
        image = canvas.toDataURL(
          'image/jpeg',
          0.48
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

  async function previewMetadata(slug, json) {

    const names = getPreview(slug, json);

    if (gameProtocol(slug) !== 'spot-it') {
      return names;
    }

    const thumbnail =
      await createSpotItThumbnail(json);

    return thumbnail
      ? [THUMB_PREFIX + thumbnail, ...names]
      : names;
  }

  /* =====================================================
     COMMUNITY STATE
     ===================================================== */

  let page = 'games';
  let filter = 'all';

  let lessons = [];
  let favorites = new Set();

  let isAdmin = false;
  let lastUserId = null;

  const $ = id => document.getElementById(id);

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
    return typeof isPremiumMember === 'function' &&
      isPremiumMember();
  }

  function visibleLessons() {
    return lessons.filter(
      l => l.is_published || isAdmin
    );
  }

  /* =====================================================
     NAVIGATION
     ===================================================== */

  function navigate(next) {

    if (next === 'premium') {
      openPremiumModal();
      return;
    }

    if (next === 'admin' && !isAdmin) {
      return;
    }

    page = next;

    const show = [
      'community',
      'library',
      'admin'
    ].includes(next);

    const shell = $('tk-community-shell');
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

  /* =====================================================
     LOAD LESSONS AND REGISTERED GAMES
     ===================================================== */

  async function refresh() {

    const sb = client();

    if (!sb) return;

    const id = user()?.id || null;

    if (lastUserId !== id) {
      favorites.clear();
      lastUserId = id;
    }

    const [
      all,
      admins,
      favs,
      gamesResult
    ] = await Promise.all([

      sb.from(TABLE)
        .select(
          'id,title,game_slug,description,grade_level,access_level,preview_items,json_path,is_published,created_at'
        )
        .order('created_at', {
          ascending: false
        }),

      id
        ? sb.from('community_admins')
            .select('user_id')
            .eq('user_id', id)
            .maybeSingle()
        : Promise.resolve({ data: null }),

      id
        ? sb.from(FAV)
            .select('lesson_id')
            .eq('user_id', id)
        : Promise.resolve({ data: [] }),

      sb.from(REGISTRY)
        .select(
          'slug,name,url,protocol,access_level,enabled,created_at'
        )
        .order('name')

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
      (favs.data || []).map(
        x => x.lesson_id
      )
    );

    if (gamesResult.error) {

      console.error(
        'Manage Games registry:',
        gamesResult.error.message
      );

    } else {

      registeredGames =
        gamesResult.data || [];
    }

    renderGameSelector();
    renderManageGames();

    $('tk-admin-nav').hidden = !isAdmin;

    if (page === 'admin' && !isAdmin) {
      navigate('community');
    }

    render();

    if (page === 'admin') {
      renderAdmin();
    }
  }

  /* =====================================================
     WORDWALL-STYLE LESSON CARDS
     ===================================================== */

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
      el('span', 'tk-wall-game-icon', '✦'),
      el('strong', '', gamesLabel(l.game_slug))
    );

    screenshot.append(heading);

    const frame = el(
      'div',
      'tk-wall-player-frame'
    );

    const isSpotIt =
      gameProtocol(l.game_slug) === 'spot-it';

    const thumbnail = isSpotIt
      ? thumbFrom(l.preview_items)
      : null;

    if (isSpotIt) {
      screenshot.classList.add(
        'tk-spotit-screen'
      );
    }

    if (thumbnail) {

      /* Real lesson images inside the thumbnail */

      const picture = el(
        'img',
        'tk-spotit-auto-preview'
      );

      picture.src = thumbnail;
      picture.alt = 'Preview of ' + l.title;

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

      /* Fallback for existing Spot It! lessons */

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

      const positions = [
        [12, 18],
        [40, 25],
        [67, 18],
        [24, 60],
        [58, 63],
        [78, 55],
        [41, 82]
      ];

      publicPreview(l.preview_items)
        .slice(0, 7)
        .forEach((word, i) => {

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

    } else {

      /* Click It! preview */

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

    const badge = el(
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
    );

    panel.append(badge);

    const heart = el(
      'button',
      'tk-heart',
      favorites.has(l.id) ? '♥' : '♡'
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
      el('h4', '', l.title)
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
        : '▶ Play Lesson'
    );

    play.type = 'button';

    play.onclick = () =>
      locked
        ? openPremiumModal()
        : playLesson(l);

    buttons.append(play);
    card.append(buttons);

    return card;
  }

  function gamesLabel(slug) {

    return gameFor(slug)?.name ||
      {
        'click-it': 'Click It!',
        'spot-it': 'Spot It! Detectives Premium'
      }[slug] ||
      slug;
  }

  /* =====================================================
     RENDER COMMUNITY / LIBRARY
     ===================================================== */

  function render() {

    const grid = $('tk-lessons-grid');

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

      all = all.filter(l => {

        const matchesAccess =
          filter === 'all' ||
          l.access_level === filter;

        const matchesSearch =
          !q ||
          [
            l.title,
            l.description,
            l.grade_level,
            l.game_slug
          ].join(' ')
            .toLowerCase()
            .includes(q);

        return matchesAccess &&
          matchesSearch;
      });
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

    all.forEach(
      l => grid.append(card(l))
    );
  }

  function showPreview(l) {

    const b = $('tk-preview-body');
    b.replaceChildren();

    b.append(
      el('h2', '', l.title),
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
          el('span', '', String(v))
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

    $('tk-preview-overlay').hidden = false;
  }

  /* =====================================================
     FAVORITES
     ===================================================== */

  async function toggleFavorite(id) {

    const u = user();

    if (!u) {
      openAuthModal();
      return;
    }

    const sb = client();
    const removing = favorites.has(id);

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
      alert(result.error.message);
      return;
    }

    if (removing) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    render();
  }

  /* =====================================================
     AUTOMATIC JSON LESSON LOADING
     ===================================================== */

  async function playLesson(l) {

    const game = gameFor(l.game_slug);

    const url =
      game?.url || URLS[l.game_slug];

    if (!url) {

      alert(
        'This game has not been linked to Community yet.'
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
      } = await client().functions.invoke(
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
          gamesLabel(l.game_slug) + '.'
        );
      }

      const protocol =
        PROTOCOLS[
          gameProtocol(l.game_slug)
        ];

      if (!protocol) {

        throw new Error(
          'Game connector not supported yet.'
        );
      }

      const trustedOrigins = new Set([
        new URL(url).origin
      ]);

      if (
        ['click-it', 'spot-it']
          .includes(l.game_slug)
      ) {

        for (
          const origin of
          GAME_ORIGINS[l.game_slug]
        ) {

          trustedOrigins.add(origin);
        }
      }

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
        ) {
          return;
        }

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

            const saved = await client()
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

      messageTimer = setTimeout(() => {

        if (!finished) {

          cleanup();

          console.warn(
            gamesLabel(l.game_slug) +
            ' did not acknowledge Community lesson load.'
          );
        }

      }, 300000);

      popup.location.href =
        url + '#tk-community';

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

  /* =====================================================
     UPLOAD JSON LESSON
     Maximum: 10 MiB
     ===================================================== */

  async function upload(e) {

    e.preventDefault();

    if (
      !isAdmin ||
      !user()
    ) {
      return;
    }

    const status = $('tk-upload-status');
    const form = $('tk-upload-form');

    const fd = new FormData(form);

    const file = fd.get('lesson_file');

    if (
      !file?.name?.toLowerCase()
        .endsWith('.json')
    ) {

      status.textContent =
        'Please choose a JSON file.';

      return;
    }

    const submit = form.querySelector(
      '[type=submit]'
    );

    submit.disabled = true;

    status.textContent =
      'Validating and uploading...';

    let path = null;

    try {

      if (
        file.size > 10 * 1024 * 1024
      ) {

        throw new Error(
          'JSON exceeds 10 MB.'
        );
      }

      const json = JSON.parse(
        await file.text()
      );

      const slug = String(
        fd.get('game_slug')
      );

      const game = gameFor(slug);

      if (
        !game ||
        !game.enabled
      ) {

        throw new Error(
          'Please register and enable this game under Manage Games first.'
        );
      }

      if (
        !supportedLesson(
          slug,
          json
        )
      ) {

        throw new Error(
          game.protocol === 'spot-it'
            ? 'This JSON requires a nonempty objects array.'
            : 'This JSON requires a nonempty words array.'
        );
      }

      if (
        game.access_level === 'premium' &&
        String(fd.get('access_level')) !==
          'premium'
      ) {

        throw new Error(
          'This Premium game requires Premium lesson access.'
        );
      }

      path = `${slug}/${crypto.randomUUID()}.json`;

      const sb = client();

      const storage = await sb.storage
        .from('community-json')
        .upload(path, file, {
          contentType: 'application/json',
          upsert: false
        });

      if (storage.error) {
        throw storage.error;
      }

      /* Generate thumbnail automatically */

      status.textContent =
        'Generating thumbnail...';

      const preview_items =
        await previewMetadata(
          slug,
          json
        );

      const row = {

        title: String(
          fd.get('title')
        ).trim(),

        game_slug: slug,

        description: String(
          fd.get('description')
        ).trim(),

        grade_level: String(
          fd.get('grade_level')
        ),

        access_level: String(
          fd.get('access_level')
        ),

        preview_items,

        json_path: path,

        is_published:
          fd.has('is_published'),

        created_by: user().id
      };

      const insert = await sb
        .from(TABLE)
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
        'Upload failed: ' + err.message;

      if (path) {

        await client().storage
          .from('community-json')
          .remove([path]);
      }

    } finally {

      submit.disabled = false;
    }
  }

  /* =====================================================
     MANAGE GAMES SELECTOR
     ===================================================== */

  function renderGameSelector() {

    const select = $('tk-upload-form')
      ?.elements.namedItem('game_slug');

    if (!select) return;

    const previous = select.value;

    select.replaceChildren();

    registeredGames
      .filter(g => g.enabled)
      .forEach(g => {

        const option = el(
          'option',
          '',
          g.name
        );

        option.value = g.slug;

        select.append(option);
      });

    if (
      [...select.options].some(
        o => o.value === previous
      )
    ) {

      select.value = previous;
    }

    if (!select.options.length) {

      const o = el(
        'option',
        '',
        'No games registered — add one below'
      );

      o.value = '';

      select.append(o);
    }

    syncAccessWithGame();
  }

  function syncAccessWithGame() {

    const form = $('tk-upload-form');

    if (!form) return;

    const game = gameFor(
      form.elements
        .namedItem('game_slug')
        ?.value
    );

    const access = form.elements
      .namedItem('access_level');

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

  /* =====================================================
     MANAGE REGISTERED GAMES
     ===================================================== */

  function renderManageGames() {

    const area = $('tk-games-records');

    if (!area) return;

    area.replaceChildren();

    if (!isAdmin) return;

    registeredGames.forEach(g => {

      const r = el(
        'div',
        'tk-admin-record'
      );

      r.append(
        el('strong', '', g.name),
        el(
          'span',
          '',
          `${g.slug} · ${g.protocol} · ${
            g.access_level
          } · ${
            g.enabled
              ? 'Enabled'
              : 'Disabled'
          }`
        )
      );

      const edit = el(
        'button',
        '',
        'Edit'
      );

      edit.type = 'button';

      edit.onclick = () => {

        const f = $('tk-game-form');

        f.elements
          .namedItem('slug')
          .value = g.slug;

        f.elements
          .namedItem('slug')
          .readOnly = true;

        for (
          const field of [
            'name',
            'url',
            'protocol',
            'access_level'
          ]
        ) {

          f.elements
            .namedItem(field)
            .value = g[field];
        }

        f.elements
          .namedItem('enabled')
          .checked = g.enabled;

        $('tk-game-save').textContent =
          'Save game changes';

        $('tk-game-cancel').hidden =
          false;

        f.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      };

      r.append(edit);

      const toggle = el(
        'button',
        '',
        g.enabled
          ? 'Disable'
          : 'Enable'
      );

      toggle.type = 'button';

      toggle.onclick = async () => {

        const { error } = await client()
          .from(REGISTRY)
          .update({
            enabled: !g.enabled
          })
          .eq('slug', g.slug);

        if (error) {

          alert(error.message);

        } else {

          await refresh();
        }
      };

      r.append(toggle);

      area.append(r);
    });
  }

  function resetGameForm() {

    const form = $('tk-game-form');

    if (!form) return;

    form.reset();

    form.elements
      .namedItem('slug')
      .readOnly = false;

    $('tk-game-save').textContent =
      '+ Add Game';

    $('tk-game-cancel').hidden =
      true;
  }

  async function saveGame(e) {

    e.preventDefault();

    if (
      !isAdmin ||
      !user()
    ) {
      return;
    }

    const f = $('tk-game-form');

    const status = $('tk-game-status');
    const submit = $('tk-game-save');

    const slug = String(
      f.elements
        .namedItem('slug')
        .value
    ).trim().toLowerCase();

    const name = String(
      f.elements
        .namedItem('name')
        .value
    ).trim();

    const url = String(
      f.elements
        .namedItem('url')
        .value
    ).trim();

    const protocol = String(
      f.elements
        .namedItem('protocol')
        .value
    );

    const access_level = String(
      f.elements
        .namedItem('access_level')
        .value
    );

    const enabled = f.elements
      .namedItem('enabled')
      .checked;

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/
        .test(slug)
    ) {

      status.textContent =
        'Use a game ID like spider-web.';

      return;
    }

    let parsed;

    try {

      parsed = new URL(url);

      if (
        parsed.protocol !== 'https:'
      ) {

        throw Error('HTTPS only');
      }

    } catch (_) {

      status.textContent =
        'Enter a valid HTTPS game URL.';

      return;
    }

    submit.disabled = true;

    status.textContent =
      'Saving game...';

    const payload = {
      slug,
      name,
      url: parsed.href,
      protocol,
      access_level,
      enabled
    };

    const editing = f.elements
      .namedItem('slug')
      .readOnly;

    const result = editing

      ? await client()
          .from(REGISTRY)
          .update(payload)
          .eq('slug', slug)

      : await client()
          .from(REGISTRY)
          .insert(payload);

    if (result.error) {

      status.textContent =
        'Could not save: ' +
        result.error.message;

    } else {

      status.textContent =
        'Game saved. You can now select it when uploading a lesson.';

      resetGameForm();

      await refresh();
    }

    submit.disabled = false;
  }

  /* =====================================================
     ADMIN LESSON MANAGEMENT
     ===================================================== */

  async function renderAdmin() {

    if (!isAdmin) return;

    const area = $('tk-admin-records');

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

      /* Regenerate Spot It! thumbnails */

      if (
        gameProtocol(l.game_slug) ===
        'spot-it'
      ) {

        const rebuild = el(
          'button',
          '',
          'Regenerate Thumbnail'
        );

        rebuild.type = 'button';

        rebuild.title =
          'Generate a Spot It! thumbnail using the existing JSON file.';

        rebuild.onclick = async () => {

          rebuild.disabled = true;

          rebuild.textContent =
            'Generating...';

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

            if (error) {
              throw error;
            }

            if (
              !Array.isArray(data?.objects)
            ) {

              throw Error(
                'This lesson is not valid Spot It! JSON.'
              );
            }

            const metadata =
              await previewMetadata(
                l.game_slug,
                data
              );

            if (!thumbFrom(metadata)) {

              throw Error(
                'Could not render thumbnail. Check the JSON or try again.'
              );
            }

            const updated =
              await client()
                .from(TABLE)
                .update({
                  preview_items: metadata
                })
                .eq('id', l.id);

            if (updated.error) {
              throw updated.error;
            }

            await refresh();

          } catch (err) {

            alert(
              'Thumbnail update failed: ' +
              (
                err.message ||
                'Unknown error'
              )
            );

            rebuild.disabled = false;

            rebuild.textContent =
              'Regenerate Thumbnail';
          }
        };

        r.append(rebuild);
      }

      /* Publish / Unpublish */

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
        ) {
          return;
        }

        const { error } = await client()
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

      /* Delete lesson */

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
        ) {
          return;
        }

        const { error } = await client()
          .from(TABLE)
          .delete()
          .eq('id', l.id);

        if (error) {

          alert(error.message);

          return;
        }

        const result = await client()
          .storage
          .from('community-json')
          .remove([l.json_path]);

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

  /* =====================================================
     INITIALIZE COMMUNITY
     ===================================================== */

  function init() {

    if (!$('tk-community-shell')) {
      return;
    }

    $('tk-upload-form')
      .addEventListener(
        'submit',
        upload
      );

    $('tk-upload-form')
      .elements
      .namedItem('game_slug')
      .addEventListener(
        'change',
        syncAccessWithGame
      );

    $('tk-game-form')
      ?.addEventListener(
        'submit',
        saveGame
      );

    if ($('tk-game-cancel')) {

      $('tk-game-cancel').onclick =
        resetGameForm;
    }

    $('tk-preview-close').onclick =
      () => {
        $('tk-preview-overlay').hidden =
          true;
      };

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

        filter = b.dataset.filter;

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

    if (location.hash === '#community') {

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
