/* TeacherKhen Community extension. Does not replace payment or auth logic. */
const TKCommunity = (() => {
  const TABLE='community_lessons', FAV='community_favorites';
  const URLS={'click-it':'https://clickit.teacherkhen.com/'};
  const GAME_ORIGINS={'click-it':new Set(['https://clickit.teacherkhen.com','https://teacherkhen.github.io'])};
  let page='games', filter='all', lessons=[], favorites=new Set(), isAdmin=false, lastUserId=null;
  const $=id=>document.getElementById(id);
  const client=()=>window.supabaseClient || (typeof supabaseClient!=='undefined'?supabaseClient:null);
  function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
  function user(){return typeof currentUser!=='undefined'?currentUser:null;}
  function prem(){return typeof isPremiumMember==='function' && isPremiumMember();}
  function visibleLessons(){return lessons.filter(l=>l.is_published || isAdmin);}
  function navigate(next){
    if(next==='premium'){openPremiumModal();return;}
    if(next==='admin'&&!isAdmin)return;
    page=next; const show=['community','library','admin'].includes(next);
    const shell=$('tk-community-shell');shell.hidden=!show;
    $('tk-community-content').hidden=next==='admin';$('tk-community-admin').hidden=next!=='admin';
    ['game-explorer','gameGrid','noResults'].forEach(id=>{const node=$(id);if(node)node.hidden=show;});
    const donate=document.querySelector('.bottom-donate-container');if(donate)donate.hidden=show;
    document.querySelectorAll('[data-tk-page]').forEach(b=>b.classList.toggle('tk-active',b.dataset.tkPage===next));
    if(next==='library'){$('tk-community-heading').textContent='My Library';$('tk-community-subheading').textContent='Your saved lessons — free and premium.';}
    else if(next==='admin'){$('tk-community-heading').textContent='Manage Community';$('tk-community-subheading').textContent='Upload, publish, unpublish or delete lessons.';renderAdmin();}
    else {$('tk-community-heading').textContent='Teacher Khen Community';$('tk-community-subheading').textContent='Explore ready-to-play classroom activities.';}
    if(next==='home')window.scrollTo({top:0,behavior:'smooth'});
    if(show){window.scrollTo({top:0,behavior:'smooth'});render();}
  }
  async function refresh(){
    const sb=client();if(!sb)return;
    const id=user()?.id||null;
    if(lastUserId!==id){favorites.clear();lastUserId=id;}
    const [all,admins,favs]=await Promise.all([
      sb.from(TABLE).select('id,title,game_slug,description,grade_level,access_level,preview_items,json_path,is_published,created_at').order('created_at',{ascending:false}),
      id?sb.from('community_admins').select('user_id').eq('user_id',id).maybeSingle():Promise.resolve({data:null}),
      id?sb.from(FAV).select('lesson_id').eq('user_id',id):Promise.resolve({data:[]})
    ]);
    if(all.error)console.error('Community loading:',all.error.message);
    else lessons=all.data||[];
    isAdmin=!!admins.data;favorites=new Set((favs.data||[]).map(x=>x.lesson_id));
    $('tk-admin-nav').hidden=!isAdmin;
    if(page==='admin'&&!isAdmin)navigate('community');
    render();if(page==='admin')renderAdmin();
  }
  // A lesson-specific, game-style visual preview (not a screenshot).
  // It is created from preview_items, which are safe public metadata.
  function card(l){
    const card=el('article','tk-lesson-card tk-wall-card');
    const panel=el('div','tk-lesson-preview tk-wall-image');
    const screenshot=el('div','tk-wall-game-screen');
    const heading=el('div','tk-wall-game-heading');
    heading.append(el('span','tk-wall-game-icon','✦'),el('strong','',gamesLabel(l.game_slug)));
    screenshot.append(heading);
    const frame=el('div','tk-wall-player-frame');
    const board=el('div','tk-wall-choices');
    (Array.isArray(l.preview_items)?l.preview_items:[]).slice(0,6).forEach((word,i)=>{
      const tile=el('span','tk-wall-tile tk-wall-tile-'+(i%6),String(word).slice(0,24));
      board.append(tile);
    });
    if(!board.children.length)board.append(el('span','tk-wall-tile','Ready to play'));
    frame.append(board);
    screenshot.append(frame);
    panel.append(screenshot);
    panel.append(el('span','tk-lesson-badge'+(l.access_level==='premium'?' premium':''),l.access_level==='premium'?'♛ Premium':'Free'));
    const heart=el('button','tk-heart',favorites.has(l.id)?'♥':'♡');
    heart.type='button';heart.title=favorites.has(l.id)?'Remove from My Library':'Save to My Library';
    heart.setAttribute('aria-label',heart.title);
    heart.onclick=(event)=>{event.stopPropagation();toggleFavorite(l.id);};
    panel.append(heart);
    card.append(panel);
    card.append(el('h4','',l.title));
    card.append(el('p','tk-lesson-meta',`${gamesLabel(l.game_slug)} • ${l.grade_level||'All Grades'}`));
    if(l.description)card.append(el('p','tk-wall-description',l.description));
    const buttons=el('div','tk-lesson-actions');
    const locked=l.access_level==='premium'&&!prem()&&!isAdmin;
    const play=el('button','tk-play-button',locked?'🔒 Unlock Premium':'▶ Play Lesson');
    play.type='button';
    play.onclick=()=>locked?openPremiumModal():playLesson(l);
    buttons.append(play);card.append(buttons);
    return card;
  }
  function gamesLabel(slug){return {'click-it':'Click It!'}[slug]||slug;}
  function render(){
    const grid=$('tk-lessons-grid');if(!grid)return;grid.replaceChildren();
    let all=visibleLessons();if(page==='library'){
      if(!user()){grid.append(el('div','tk-community-empty','Log in to see your saved lessons.'));return;}
      all=all.filter(l=>favorites.has(l.id));
    } else if(page==='community') {
      const q=$('tk-community-search').value.toLowerCase().trim();
      all=all.filter(l=>(filter==='all'||l.access_level===filter)&&(!q||[l.title,l.description,l.grade_level,l.game_slug].join(' ').toLowerCase().includes(q)));
    }
    if(!all.length){grid.append(el('div','tk-community-empty',page==='library'?'No favorites yet. Tap a heart in Community to save lessons.':'No lessons found yet.'));return;}
    all.forEach(l=>grid.append(card(l)));
  }
  function showPreview(l){const b=$('tk-preview-body');b.replaceChildren();b.append(el('h2','',l.title),el('p','',`${gamesLabel(l.game_slug)} · ${l.grade_level||'All Grades'} · ${l.access_level.toUpperCase()}`),el('p','',l.description||'Ready-made classroom lesson'));
    const chips=el('div','tk-preview-chips');(l.preview_items||[]).slice(0,18).forEach(v=>chips.append(el('span','',String(v))));b.append(chips);
    b.append(el('p','', 'This is a content preview, not a live gameplay screenshot.'));
    $('tk-preview-overlay').hidden=false;
  }
  async function toggleFavorite(id){const u=user();if(!u){openAuthModal();return;}const sb=client();
    const removing=favorites.has(id);const result=removing?await sb.from(FAV).delete().eq('user_id',u.id).eq('lesson_id',id):await sb.from(FAV).insert({user_id:u.id,lesson_id:id});
    if(result.error){alert(result.error.message);return;}if(removing)favorites.delete(id);else favorites.add(id);render();}
  async function playLesson(l){
    const url=URLS[l.game_slug];
    if(!url){alert('This game has not been linked to Community yet.');return;}
    // Open immediately during the click so popup blockers do not suppress the game.
    const popup=window.open('about:blank','_blank');
    if(!popup){alert('Please allow popups for this site.');return;}
    popup.document.body.textContent='Loading your classroom lesson…';
    try{
      const {data,error}=await client().functions.invoke('community-lesson',{body:{lesson_id:l.id}});
      if(error)throw error;
      if(!data||!Array.isArray(data.words)||!data.words.length)throw new Error('The lesson JSON is invalid for Click It!.');
      const trustedOrigins=GAME_ORIGINS[l.game_slug] || new Set([new URL(url).origin]);
      let messageTimer;
      let finished=false;
      const cleanup=()=>{window.removeEventListener('message',onMessage);clearTimeout(messageTimer);};
      const onMessage=async e=>{
        if(e.source!==popup||!trustedOrigins.has(e.origin))return;
        if(e.data?.type==='TK_CLICKIT_READY'&&!finished){
          popup.postMessage({type:'TK_CLICKIT_LESSON',lesson:data},e.origin);
        }
        if(e.data?.type==='TK_CLICKIT_LOADED'&&!finished){
          finished=true;cleanup();
          if(user()&&!favorites.has(l.id)){
            const saved=await client().from(FAV).upsert({user_id:user().id,lesson_id:l.id},{onConflict:'user_id,lesson_id'});
            if(!saved.error){favorites.add(l.id);render();}
            else console.warn('Could not automatically save favorite:',saved.error.message);
          }
        }
        if(e.data?.type==='TK_CLICKIT_ERROR'&&!finished){
          finished=true;cleanup();alert('Game could not load lesson: '+(e.data.message||'Unknown error'));
        }
      };
      window.addEventListener('message',onMessage);
      messageTimer=setTimeout(()=>{
        if(!finished){cleanup();console.warn('Click It! did not acknowledge Community lesson load. Confirm the updated Click It! HTML is deployed.');}
      },30000);
      popup.location.href=url+'#tk-community';
    }catch(err){popup.close();alert('Unable to open lesson: '+(err.message||'Please sign in or check membership.'));}
  }
  async function upload(e){e.preventDefault();if(!isAdmin||!user())return;
    const status=$('tk-upload-status'),form=$('tk-upload-form'),fd=new FormData(form),file=fd.get('lesson_file');
    if(!file?.name?.toLowerCase().endsWith('.json')){status.textContent='Please choose a JSON file.';return;}
    const submit=form.querySelector('[type=submit]');submit.disabled=true;status.textContent='Validating and uploading...';let path=null;
    try{
      if(file.size>10*1024*1024)throw new Error('JSON exceeds 10 MB.');
      const json=JSON.parse(await file.text());if(!Array.isArray(json.words)||!json.words.length)throw new Error('Click It! JSON must contain a nonempty words array.');
      const slug=String(fd.get('game_slug'));if(slug!=='click-it')throw new Error('Unsupported game type.');
      path=`${slug}/${crypto.randomUUID()}.json`;
      const sb=client();const storage=await sb.storage.from('community-json').upload(path,file,{contentType:'application/json',upsert:false});if(storage.error)throw storage.error;
      const row={title:String(fd.get('title')).trim(),game_slug:slug,description:String(fd.get('description')).trim(),grade_level:String(fd.get('grade_level')),access_level:String(fd.get('access_level')),preview_items:json.words.slice(0,18).map(x=>String(x).slice(0,70)),json_path:path,is_published:fd.has('is_published'),created_by:user().id};
      const insert=await sb.from(TABLE).insert(row).select('id').single();if(insert.error)throw insert.error;
      status.textContent='Lesson uploaded successfully!';form.reset();await refresh();
    }catch(err){status.textContent='Upload failed: '+err.message;
      if(path){await client().storage.from('community-json').remove([path]);}
    }finally{submit.disabled=false;}
  }
  async function renderAdmin(){if(!isAdmin)return;const area=$('tk-admin-records');area.replaceChildren();
    lessons.forEach(l=>{const r=el('div','tk-admin-record');r.append(el('strong','',l.title),el('span','',l.access_level));
      const toggle=el('button','',l.is_published?'Unpublish':'Publish');toggle.onclick=async()=>{if(!confirm(`Change publication status for "${l.title}"?`))return;const {error}=await client().from(TABLE).update({is_published:!l.is_published}).eq('id',l.id);if(error)alert(error.message);else refresh();};r.append(toggle);
      const del=el('button','','Delete');del.onclick=async()=>{if(!confirm(`Delete lesson "${l.title}" and its JSON file?`))return;
        // Remove database record first. A failed storage deletion can be cleaned up separately.
        const {error}=await client().from(TABLE).delete().eq('id',l.id);if(error){alert(error.message);return;}
        const result=await client().storage.from('community-json').remove([l.json_path]);if(result.error)alert('Lesson removed; file cleanup failed: '+result.error.message);refresh();};r.append(del);area.append(r);});
  }
  function init(){if(!$('tk-community-shell'))return;
    $('tk-upload-form').addEventListener('submit',upload);
    $('tk-preview-close').onclick=()=>$('tk-preview-overlay').hidden=true;
    $('tk-preview-overlay').onclick=e=>{if(e.target===$('tk-preview-overlay'))$('tk-preview-overlay').hidden=true;};
    $('tk-community-search').oninput=render;
    document.querySelectorAll('#tk-community-filters [data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('#tk-community-filters [data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();});
    client()?.auth.onAuthStateChange(()=>setTimeout(refresh,0));
    refresh();
    if(location.hash==='#community')navigate('community');else if(location.hash==='#library')navigate('library');
  }
  document.addEventListener('DOMContentLoaded',init);
  return {navigate,refresh};
})();
