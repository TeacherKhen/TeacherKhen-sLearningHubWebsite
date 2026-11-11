
/* TeacherKhen Community — Automatic Game Loading */
const TKCommunity = (() => {
  const TABLE = 'community_lessons';
  const FAV = 'community_favorites';

  // Registered games with automatic Community connections.
  const GAMES = {
    'click-it': {
      name: 'Click It!',
      url: 'https://clickit.teacherkhen.com/',
      access_level: 'free',
      protocol: {
        ready: 'TK_CLICKIT_READY',
        load: 'TK_CLICKIT_LESSON',
        loaded: 'TK_CLICKIT_LOADED',
        error: 'TK_CLICKIT_ERROR'
      },
      origins: [
        'https://clickit.teacherkhen.com',
        'https://teacherkhen.github.io'
      ],
      valid: data =>
        Array.isArray(data?.words) &&
        data.words.length > 0,
      preview: data => data.words
    },

    'spot-it': {
      name: 'Spot It! Detectives Premium',
      url: 'https://spot-it.teacherkhen.com/',
      access_level: 'premium',
      protocol: {
        ready: 'TK_SPOTIT_READY',
        load: 'TK_SPOTIT_LESSON',
        loaded: 'TK_SPOTIT_LOADED',
        error: 'TK_SPOTIT_ERROR'
      },
      origins: [
        'https://spot-it.teacherkhen.com',
        'https://teacherkhen.github.io'
      ],
      valid: data =>
        Array.isArray(data?.objects) &&
        data.objects.length > 0,
      preview: data =>
        data.objects.map(x => String(x.name || 'Clue')),
      thumbnail: 'spot-it'
    },

    'phonics-race': {
      name: 'Phonics Race',
      url: 'https://teacherkhen.github.io/Phonicsrace1/',
      access_level: 'free',
      protocol: {
        ready: 'TK_PHONICSRACE_READY',
        load: 'TK_PHONICSRACE_LESSON',
        loaded: 'TK_PHONICSRACE_LOADED',
        error: 'TK_PHONICSRACE_ERROR'
      },
      origins: [
        'https://teacherkhen.github.io'
      ],
      valid: data =>
        Array.isArray(data?.rounds) &&
        data.rounds.length > 0 &&
        data.rounds.every(r =>
          Array.isArray(r.circles) &&
          r.circles.length >= 2 &&
          r.circles.every(c =>
            typeof c.text === 'string' &&
            Number.isFinite(c.x) &&
            Number.isFinite(c.y) &&
            Number.isFinite(c.id)
          )
        ),
      preview: data =>
        data.rounds
          .flatMap(r => r.circles.map(c => c.text.trim()))
          .filter(Boolean),
      thumbnail: 'phonics-race'
    }
  };

  const gameFor = slug => GAMES[slug] || null;

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

  // Public thumbnail metadata.
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

  // Spot It! thumbnail generation.
  async function createSpotItThumbnail(data) {
    if (
      !Array.isArray(data?.objects) ||
      !data.objects.length
    ) return null;

    const W = 480;
    const H = 270;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#264a45');
    bg.addColorStop(.55, '#1a3338');
    bg.addColorStop(1, '#0b1b22');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(197,221,189,.09)';
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

    glow.addColorStop(0, 'rgba(250,240,187,.24)');
    glow.addColorStop(.52, 'rgba(231,239,182,.08)');
    glow.addColorStop(1, 'rgba(0,0,0,.43)');

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const items = data.objects.slice(0, 12);

    const imageLoad = value => new Promise(resolve => {
      if (
        typeof value !== 'string' ||
        !/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)
      ) return resolve(null);

      const img = new Image();
      let ended = false;

      const finish = v => {
        if (ended) return;
        ended = true;
        clearTimeout(timer);
        resolve(v);
      };

      const timer = setTimeout(
        () => finish(null), 6000
      );

      img.onload = () => finish(img);
      img.onerror = () => finish(null);
      img.src = value;
    });

    const pics = await Promise.all(
      items.map(o => imageLoad(o.image))
    );

    const positions = [
      [.14, .27], [.34, .32], [.55, .27],
      [.76, .34], [.21, .61], [.43, .65],
      [.66, .61], [.87, .69], [.14, .84],
      [.35, .82], [.57, .83], [.79, .85]
    ];

    items.forEach((o, i) => {
      const saved = o.pos?.[0];
      const px = Number(saved?.x);
      const py = Number(saved?.y);

      const x = (
        Number.isFinite(px)
          ? Math.max(.12, Math.min(.88, px / 100))
          : positions[i][0]
      ) * W;

      const y = (
        Number.isFinite(py)
          ? Math.max(.22, Math.min(.82, py / 100))
          : positions[i][1]
      ) * H;

      const img = pics[i];

      if (img && img.naturalWidth && img.naturalHeight) {
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
          img, x - iw / 2, y - ih / 2, iw, ih
        );
        ctx.restore();
      } else {
        const label = String(
          o.name || 'Clue'
        ).slice(0, 18);

        const font = Math.min(
          22,
          Math.max(12, 145 / (label.length * .75 + 1))
        );

        ctx.font =
          `bold ${font}px 'Comic Neue',sans-serif`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0a2025';
        ctx.strokeText(label, x, y, 110);
        ctx.fillStyle = '#f9e6a6';
        ctx.fillText(label, x, y, 110);
      }
    });

    const vignette = ctx.createRadialGradient(
      W * .49, H * .50, 80,
      W * .49, H * .50, 285
    );

    vignette.addColorStop(
      0, 'rgba(0,0,0,0)'
    );
    vignette.addColorStop(
      1, 'rgba(0,0,0,.65)'
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
      '🔎 SPOT IT! DETECTIVES', 16, 25
    );
    ctx.shadowBlur = 0;

    try {
      let image = canvas.toDataURL(
        'image/jpeg', .69
      );

      if (image.length > 145000) {
        image = canvas.toDataURL(
          'image/jpeg', .48
        );
      }

      return image.length < 180000
        ? image
        : null;
    } catch (err) {
      console.warn(
        'Thumbnail creation failed:', err
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

  let page = 'games';
  let filter = 'all';
  let lessons = [];
  let favorites = new Set();
  let isAdmin = false;
  let lastUserId = null;

  const $ = id => document.getElementById(id);

  const client = () =>
    window.supabaseClient ||
    (typeof supabaseClient !== 'undefined'
      ? supabaseClient
      : null);

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
      l =>
        isAdmin ||
        (l.is_published && !!gameFor(l.game_slug))
    );
  }

  function navigate(next) {
    if (next === 'premium') {
      openPremiumModal();
      return;
    }

    if (next === 'admin' && !isAdmin) return;

    page = next;

    const show = [
      'community', 'library', 'admin'
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
      if (node) node.hidden = show;
    });

    const donate = document.querySelector(
      '.bottom-donate-container'
    );

    if (donate) donate.hidden = show;

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
          : Promise.resolve({ data: [] })
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
      (favs.data || []).map(x => x.lesson_id)
    );

    renderGameSelector();

    $('tk-admin-nav').hidden = !isAdmin;

    if (page === 'admin' && !isAdmin) {
      navigate('community');
    }

    render();

    if (page === 'admin') renderAdmin();
  }

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

    const isRace =
      gameProtocol(l.game_slug) === 'phonics-race';

    const thumbnail = isSpotIt
      ? thumbFrom(l.preview_items)
      : null;

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
            [12, 18], [40, 25], [67, 18],
            [24, 60], [58, 63],
            [78, 55], [41, 82]
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
            transform: 'translate(-20%,-20%)',
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
      // Phonics Race thumbnail using actual phonics words.
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

      // Exclude old JSON keys from previous generic previews.
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
        [9, 21], [31, 39],
        [53, 20], [73, 40],
        [14, 71], [37, 65],
        [61, 72], [79, 62]
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
          transform: 'translate(-10%,-50%)'
        });

        scene.append(label);
      });

      const flag = el('span', '', '🏁');

      Object.assign(flag.style, {
        position: 'absolute',
        right: '3%',
        top: '3%',
        fontSize: '25px'
      });

      scene.append(flag);
      frame.append(scene);

    } else {
      // Click It! thumbnail.
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
              'tk-wall-tile tk-wall-tile-' + (i % 6),
              String(word).slice(0, 24)
            )
          );
        });

      if (!board.children.length) {
        board.append(
          el('span', 'tk-wall-tile', 'Ready to play')
        );
      }

      frame.append(board);
    }

    screenshot.append(frame);
    panel.append(screenshot);

    panel.append(
      el(
        'span',
        'tk-lesson-badge' +
          (l.access_level === 'premium'
            ? ' premium'
            : ''),
        l.access_level === 'premium'
          ? '♛ Premium'
          : 'Free'
      )
    );

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

  function gamesLabel(slug) {
    return (
      gameFor(slug)?.name ||
      slug.replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
    );
  }

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

      all = all.filter(
        l =>
          (filter === 'all' ||
            l.access_level === filter) &&
          (
            !q ||
            [
              l.title,
              l.description,
              l.grade_level,
              l.game_slug
            ].join(' ').toLowerCase().includes(q)
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

    all.forEach(l => grid.append(card(l)));
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

  async function playLesson(l) {
    const game = gameFor(l.game_slug);

    if (!game) {
      alert(
        'Automatic JSON loading is not connected for this game yet.'
      );
      return;
    }

    const url = game.url;

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

      if (!supportedLesson(
        l.game_slug,
        data
      )) {
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
            const saved =
              await client().from(FAV)
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
            (e.data.message ||
              'Unknown error')
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
          }
        },
        300000
      );

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

  async function upload(e) {
    e.preventDefault();

    if (!isAdmin || !user()) return;

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
      if (file.size > 10 * 1024 * 1024) {
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

      if (!game) {
        throw new Error(
          'This game is not yet integrated with Community.'
        );
      }

      if (!supportedLesson(
        slug,
        json
      )) {
        throw new Error(
          'The JSON is not valid for the selected game.'
        );
      }

      if (
        game.access_level === 'premium' &&
        String(fd.get('access_level')) !== 'premium'
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
            file,
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
          String(fd.get('title')).trim(),

        game_slug: slug,

        description:
          String(fd.get('description')).trim(),

        grade_level:
          String(fd.get('grade_level')),

        access_level:
          String(fd.get('access_level')),

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
        await client().storage
          .from('community-json')
          .remove([path]);
      }
    } finally {
      submit.disabled = false;
    }
  }

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

  function syncAccessWithGame() {
    const form = $('tk-upload-form');
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

      const type =
        gameProtocol(l.game_slug);

      if (
        type === 'spot-it' ||
        type === 'phonics-race'
      ) {
        const isRace =
          type === 'phonics-race';

        const rebuild = el(
          'button',
          '',
          isRace
            ? 'Refresh Phonics Preview'
            : 'Regenerate Thumbnail'
        );

        rebuild.type = 'button';

        rebuild.title = isRace
          ? 'Updates the preview with actual phonics words from the existing JSON.'
          : 'Generates a Spot It! image from the existing JSON.';

        rebuild.onclick = async () => {
          rebuild.disabled = true;
          rebuild.textContent =
            'Generating...';

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

            if (
              !supportedLesson(
                l.game_slug,
                data
              )
            ) {
              throw Error(
                'The lesson JSON is invalid for this game.'
              );
            }

            const metadata =
              await previewMetadata(
                l.game_slug,
                data
              );

            if (
              !isRace &&
              !thumbFrom(metadata)
            ) {
              throw Error(
                'Could not render embedded pictures. Check the JSON or try again.'
              );
            }

            const updated =
              await client().from(TABLE)
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

            rebuild.textContent = isRace
              ? 'Refresh Phonics Preview'
              : 'Regenerate Thumbnail';
          }
        };

        r.append(rebuild);
      }

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
          await client().from(TABLE)
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
          await client().from(TABLE)
            .delete()
            .eq('id', l.id);

        if (error) {
          alert(error.message);
          return;
        }

        const result =
          await client().storage
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
      .elements.namedItem('game_slug')
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
