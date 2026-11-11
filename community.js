/* TeacherKhen Community extension. Does not replace payment or auth logic. */
const TKCommunity = (() => {
  const TABLE='community_lessons', FAV='community_favorites';
  const URLS={'click-it':'https://teacherkhen.github.io/Clickit/'};
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
  function card(l){
    const card=el('article','tk-lesson-card');
    const panel=el('div','tk-lesson-preview');
    const badge=el('span','tk-lesson-badge'+(l.access_level==='premium'?' premium':''),l.access_level==='premium'?'👑 Premium':'Free');
    panel.append(badge);
    const heart=el('button','tk-heart',favorites.has(l.id)?'♥':'♡');heart.type='button';heart.title='Save to My Library';heart.setAttribute('aria-label','Save to My Library');heart.onclick=()=>toggleFavorite(l.id);panel.append(heart);
    panel.append(el('h3','',gamesLabel(l.game_slug)));
    const chips=el('div','tk-preview-chips');(l.preview_items||[]).slice(0,6).forEach(v=>chips.append(el('span','',String(v).slice(0,40))));panel.append(chips);card.append(panel);
    card.append(el('h4','',l.title));card.append(el('p','tk-lesson-meta',`${gamesLabel(l.game_slug)} • ${l.grade_level||'All Grades'} • ${(l.preview_items||[]).length} preview items`));
    const buttons=el('div','tk-lesson-actions');const preview=el('button','', '◉ Preview');preview.onclick=()=>showPreview(l);buttons.append(preview);
    const locked=l.access_level==='premium'&&!prem()&&!isAdmin;
    const play=el('button','',locked?'🔒 Unlock':'▶ Play');play.onclick=()=>locked?openPremiumModal():playLesson(l);buttons.append(play);card.append(buttons);return card;
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
    const url=URLS[l.game_slug];if(!url){alert('This game has not been linked to Community yet.');return;}
    // Blank popup is opened synchronously so browser popup blockers do not reject it.
    const popup=window.open('about:blank','_blank');if(!popup){alert('Please allow popups for this site.');return;}
    popup.document.body.textContent='Opening your classroom lesson...';
    try{
      const {data,error}=await client().functions.invoke('community-lesson',{body:{lesson_id:l.id}});
      if(error)throw error;
      if(!data||!Array.isArray(data.words))throw new Error('Lesson data was invalid or not a Click It! JSON file.');
      const gameOrigin=new URL(url).origin;
      const onReady=e=>{if(e.source!==popup||e.origin!==gameOrigin||e.data?.type!=='TK_CLICKIT_READY')return;
        popup.postMessage({type:'TK_CLICKIT_LESSON',lesson:data},gameOrigin);window.removeEventListener('message',onReady);};
      window.addEventListener('message',onReady);
      popup.location.href=url+'#tk-community';
      setTimeout(()=>window.removeEventListener('message',onReady),60000);
    }catch(err){popup.close();alert('Unable to open lesson: '+(err.message||'Access denied. Please sign in or check membership.'));}
  }
  async function upload(e){e.preventDefault();if(!isAdmin||!user())return;
    const status=$('tk-upload-status'),form=$('tk-upload-form'),fd=new FormData(form),file=fd.get('lesson_file');
    if(!file?.name?.toLowerCase().endsWith('.json')){status.textContent='Please choose a JSON file.';return;}
    const submit=form.querySelector('[type=submit]');submit.disabled=true;status.textContent='Validating and uploading...';let path=null;
    try{
      if(file.size>3*1024*1024)throw new Error('JSON exceeds 3 MB.');
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
