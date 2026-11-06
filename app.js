/* =====================================================================
   AVALON – APP-LOGIK
   Navigation (Hash-Routing), Spielstand (localStorage), Mehrsprachigkeit
   ===================================================================== */
(function () {
  'use strict';

  const C = window.AVALON_CONTENT;
  if (!C || !Array.isArray(C.worlds)) {
    if (window.avalonShowError) window.avalonShowError('Die Inhalte (AVALON_CONTENT) wurden nicht gefunden.');
    return;
  }
  const STORE_KEY = 'avalon.save.v1';
  const XP_PER_LEVEL = 100;
  const AVATARS = ['🧙', '🧝', '🧚', '🦉', '🐉', '🦊', '🐺', '🦋', '🌙', '🔮', '🌿', '⭐'];
  const CATS = ['body', 'mind', 'soul'];
  const CAT_ICON = { body: '🌿', mind: '💡', soul: '🔮' };
  const LANGS = [
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'es', label: 'Español', flag: '🇪🇸' }
  ];
  const LOCALES = { de: 'de-DE', en: 'en-GB', es: 'es-ES' };

  /* ------------------------------------------------------------------
     ÜBERSETZUNGEN der Oberfläche
     ------------------------------------------------------------------ */
  const I18N = {
    de: {
      step: 'Schritt {n} von 3', back: 'Zurück', continue: 'Weiter', ok: 'Weiter',
      createProfile: 'Erstelle dein Profil', yourName: 'Dein Name', namePh: 'z. B. Merlin',
      chooseAvatar: 'Wähle deinen Avatar', nameRequired: 'Bitte gib einen Namen ein und wähle einen Avatar.',
      welcomeTitle: 'Willkommen, {name}!',
      welcomeText: 'Ich bin dein Begleiter auf dieser Reise. Dein Weg führt dich durch Körper, Geist und Seele. Öffne das Buch, um deine erste Stufe zu beginnen.',
      letsGo: 'Los geht’s',
      playerCard: 'Spielerausweis', level: 'Stufe', toNext: 'Noch {n} XP bis zur nächsten Stufe',
      currentMissions: 'Aktuelle Missionen', noActive: 'Noch keine Mission angenommen', openBook: 'Buch öffnen',
      body: 'Körper', mind: 'Geist', soul: 'Seele',
      menu: 'Menü', close: 'Schließen', prevWorld: 'Vorherige Welt', nextWorld: 'Nächste Welt',
      swipeHint: 'Wische nach links oder rechts, um die Welt zu wechseln',
      levelN: 'Stufe {n}', locked: 'Diese Stufe ist noch gesperrt.', lockedShort: 'gesperrt',
      comingSoon: 'Diese Welt wird bald freigeschaltet.', chooseArea: 'Wähle einen Bereich',
      noMissions: 'Hier gibt es noch keine Missionen.',
      acceptMission: 'Mission annehmen', continueMission: 'Mission weiterführen', completeMission: 'Mission abschließen',
      completed: 'Abgeschlossen', statusActive: 'Aktiv', statusDone: 'Erledigt',
      acceptedToast: 'Mission angenommen!', completedToast: 'Mission abgeschlossen! +{xp} XP',
      levelUpTitle: 'Stufe {n} erreicht!', levelUpText: 'Großartig! Deine Kraft wächst. Mach weiter auf deinem Weg.',
      acceptedOn: 'Angenommen am {d}', doneOn: 'Abgeschlossen am {d}', notFound: 'Diese Seite wurde nicht gefunden.',
      home: 'Startseite', character: 'Charakterprofil', logbook: 'Logbuch', diary: 'Tagebuch',
      books: 'Bücher', settings: 'Einstellungen', notifications: 'Benachrichtigungen', design: 'Design',
      language: 'Sprache', monthplan: 'Monatsplan', community: 'Community',
      group: 'Lerngruppe', mentor: 'Mentor', help: 'Hilfe',
      save: 'Speichern', saved: 'Gespeichert', reset: 'Fortschritt zurücksetzen',
      resetConfirm: 'Wirklich den gesamten Fortschritt löschen? Das kann nicht rückgängig gemacht werden.',
      logEmpty: 'Noch keine Einträge. Nimm im Buch deine erste Mission an.',
      logSummary: '{a} aktiv · {d} abgeschlossen · {xp} XP gesammelt',
      diaryPh: 'Was hast du heute erlebt?', addEntry: 'Eintrag speichern', diaryEmpty: 'Noch keine Tagebucheinträge.',
      delete: 'Löschen', deleteConfirm: 'Diesen Eintrag löschen?',
      notifReminders: 'Erinnerungen', notifText: 'Erinnerungen an deine Missionen (Grundgerüst – echte Push-Nachrichten folgen später).',
      notifDenied: 'Benachrichtigungen sind im Browser blockiert.', notifUnsupported: 'Dieser Browser unterstützt hier keine Benachrichtigungen.',
      notifTest: 'Test senden', notifTestBody: 'So sehen deine Erinnerungen aus.',
      themeLight: 'Hell', themeDark: 'Dunkel', themeSystem: 'Automatisch (System)', colorLegend: 'Farben der Bereiche',
      monthLegend: 'Tage mit Aktivität', monthPlaceholder: 'Hier planst du später deine Monatsziele und Rituale.',
      placeholder: 'Dieser Bereich ist ein Platzhalter – Inhalte folgen.',
      groupText: 'Finde Gleichgesinnte und geht den Weg gemeinsam.',
      mentorText: 'Ein Mentor begleitet dich persönlich auf deiner Reise.',
      helpText: 'Häufige Fragen',
      faq1q: 'Wie nehme ich eine Mission an?', faq1a: 'Öffne das Buch, tippe auf Stufe 1, wähle einen Bereich und tippe auf „Mission annehmen“.',
      faq2q: 'Wie bekomme ich XP?', faq2a: 'Schließe eine angenommene Mission in ihrer Detailansicht ab. Alle 100 XP steigst du eine Stufe auf.',
      faq3q: 'Wo wird mein Fortschritt gespeichert?', faq3a: 'Lokal auf deinem Gerät im Browser. Wenn du die Browserdaten löschst, geht er verloren.',
      wd: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    },
    en: {
      step: 'Step {n} of 3', back: 'Back', continue: 'Continue', ok: 'Continue',
      createProfile: 'Create your profile', yourName: 'Your name', namePh: 'e.g. Merlin',
      chooseAvatar: 'Choose your avatar', nameRequired: 'Please enter a name and choose an avatar.',
      welcomeTitle: 'Welcome, {name}!',
      welcomeText: 'I am your companion on this journey. Your path leads through body, mind and soul. Open the book to begin your first level.',
      letsGo: 'Let’s go',
      playerCard: 'Player card', level: 'Level', toNext: '{n} XP to the next level',
      currentMissions: 'Current missions', noActive: 'No mission accepted yet', openBook: 'Open book',
      body: 'Body', mind: 'Mind', soul: 'Soul',
      menu: 'Menu', close: 'Close', prevWorld: 'Previous world', nextWorld: 'Next world',
      swipeHint: 'Swipe left or right to change worlds',
      levelN: 'Level {n}', locked: 'This level is still locked.', lockedShort: 'locked',
      comingSoon: 'This world will be unlocked soon.', chooseArea: 'Choose an area',
      noMissions: 'There are no missions here yet.',
      acceptMission: 'Accept mission', continueMission: 'Continue mission', completeMission: 'Complete mission',
      completed: 'Completed', statusActive: 'Active', statusDone: 'Done',
      acceptedToast: 'Mission accepted!', completedToast: 'Mission completed! +{xp} XP',
      levelUpTitle: 'Level {n} reached!', levelUpText: 'Great! Your power is growing. Keep going on your path.',
      acceptedOn: 'Accepted on {d}', doneOn: 'Completed on {d}', notFound: 'This page could not be found.',
      home: 'Home', character: 'Character profile', logbook: 'Logbook', diary: 'Diary',
      books: 'Books', settings: 'Settings', notifications: 'Notifications', design: 'Design',
      language: 'Language', monthplan: 'Monthly plan', community: 'Community',
      group: 'Study group', mentor: 'Mentor', help: 'Help',
      save: 'Save', saved: 'Saved', reset: 'Reset progress',
      resetConfirm: 'Really delete all progress? This cannot be undone.',
      logEmpty: 'No entries yet. Accept your first mission in the book.',
      logSummary: '{a} active · {d} completed · {xp} XP collected',
      diaryPh: 'What did you experience today?', addEntry: 'Save entry', diaryEmpty: 'No diary entries yet.',
      delete: 'Delete', deleteConfirm: 'Delete this entry?',
      notifReminders: 'Reminders', notifText: 'Reminders for your missions (framework – real push messages will follow).',
      notifDenied: 'Notifications are blocked in your browser.', notifUnsupported: 'This browser does not support notifications here.',
      notifTest: 'Send test', notifTestBody: 'This is what your reminders look like.',
      themeLight: 'Light', themeDark: 'Dark', themeSystem: 'Automatic (system)', colorLegend: 'Area colours',
      monthLegend: 'Days with activity', monthPlaceholder: 'Later you will plan your monthly goals and rituals here.',
      placeholder: 'This area is a placeholder – content will follow.',
      groupText: 'Find like-minded people and walk the path together.',
      mentorText: 'A mentor accompanies you personally on your journey.',
      helpText: 'Frequently asked questions',
      faq1q: 'How do I accept a mission?', faq1a: 'Open the book, tap level 1, choose an area and tap “Accept mission”.',
      faq2q: 'How do I earn XP?', faq2a: 'Complete an accepted mission in its detail view. Every 100 XP you reach a new level.',
      faq3q: 'Where is my progress stored?', faq3a: 'Locally in your browser on this device. Clearing browser data will remove it.',
      wd: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    },
    es: {
      step: 'Paso {n} de 3', back: 'Atrás', continue: 'Continuar', ok: 'Continuar',
      createProfile: 'Crea tu perfil', yourName: 'Tu nombre', namePh: 'p. ej. Merlín',
      chooseAvatar: 'Elige tu avatar', nameRequired: 'Introduce un nombre y elige un avatar.',
      welcomeTitle: '¡Bienvenido, {name}!',
      welcomeText: 'Soy tu compañero en este viaje. Tu camino recorre cuerpo, mente y alma. Abre el libro para comenzar tu primer nivel.',
      letsGo: '¡Vamos!',
      playerCard: 'Tarjeta de jugador', level: 'Nivel', toNext: 'Faltan {n} XP para el siguiente nivel',
      currentMissions: 'Misiones actuales', noActive: 'Aún no has aceptado ninguna misión', openBook: 'Abrir libro',
      body: 'Cuerpo', mind: 'Mente', soul: 'Alma',
      menu: 'Menú', close: 'Cerrar', prevWorld: 'Mundo anterior', nextWorld: 'Mundo siguiente',
      swipeHint: 'Desliza a la izquierda o a la derecha para cambiar de mundo',
      levelN: 'Nivel {n}', locked: 'Este nivel todavía está bloqueado.', lockedShort: 'bloqueado',
      comingSoon: 'Este mundo se desbloqueará pronto.', chooseArea: 'Elige un área',
      noMissions: 'Aquí todavía no hay misiones.',
      acceptMission: 'Aceptar misión', continueMission: 'Continuar misión', completeMission: 'Completar misión',
      completed: 'Completada', statusActive: 'Activa', statusDone: 'Hecha',
      acceptedToast: '¡Misión aceptada!', completedToast: '¡Misión completada! +{xp} XP',
      levelUpTitle: '¡Nivel {n} alcanzado!', levelUpText: '¡Genial! Tu poder crece. Sigue tu camino.',
      acceptedOn: 'Aceptada el {d}', doneOn: 'Completada el {d}', notFound: 'No se encontró esta página.',
      home: 'Inicio', character: 'Perfil del personaje', logbook: 'Bitácora', diary: 'Diario',
      books: 'Libros', settings: 'Ajustes', notifications: 'Notificaciones', design: 'Diseño',
      language: 'Idioma', monthplan: 'Plan mensual', community: 'Comunidad',
      group: 'Grupo de estudio', mentor: 'Mentor', help: 'Ayuda',
      save: 'Guardar', saved: 'Guardado', reset: 'Restablecer progreso',
      resetConfirm: '¿Seguro que quieres borrar todo el progreso? No se puede deshacer.',
      logEmpty: 'Aún no hay entradas. Acepta tu primera misión en el libro.',
      logSummary: '{a} activas · {d} completadas · {xp} XP acumulados',
      diaryPh: '¿Qué has vivido hoy?', addEntry: 'Guardar entrada', diaryEmpty: 'Aún no hay entradas en el diario.',
      delete: 'Eliminar', deleteConfirm: '¿Eliminar esta entrada?',
      notifReminders: 'Recordatorios', notifText: 'Recordatorios de tus misiones (estructura base – las notificaciones reales llegarán después).',
      notifDenied: 'Las notificaciones están bloqueadas en el navegador.', notifUnsupported: 'Este navegador no admite notificaciones aquí.',
      notifTest: 'Enviar prueba', notifTestBody: 'Así se verán tus recordatorios.',
      themeLight: 'Claro', themeDark: 'Oscuro', themeSystem: 'Automático (sistema)', colorLegend: 'Colores de las áreas',
      monthLegend: 'Días con actividad', monthPlaceholder: 'Aquí planificarás más adelante tus metas y rituales del mes.',
      placeholder: 'Esta área es provisional – el contenido llegará pronto.',
      groupText: 'Encuentra personas afines y recorred el camino juntos.',
      mentorText: 'Un mentor te acompaña personalmente en tu viaje.',
      helpText: 'Preguntas frecuentes',
      faq1q: '¿Cómo acepto una misión?', faq1a: 'Abre el libro, toca el nivel 1, elige un área y toca «Aceptar misión».',
      faq2q: '¿Cómo consigo XP?', faq2a: 'Completa una misión aceptada en su vista de detalle. Cada 100 XP subes de nivel.',
      faq3q: '¿Dónde se guarda mi progreso?', faq3a: 'Localmente en el navegador de este dispositivo. Si borras los datos del navegador, se perderá.',
      wd: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
    }
  };

  /* ------------------------------------------------------------------
     SPIELSTAND (localStorage)
     ------------------------------------------------------------------ */
  function defaults() {
    return {
      lang: null, name: '', avatar: '', onboarded: false, xp: 0,
      missions: {},            // { [missionId]: { status: 'active'|'done', acceptedAt, doneAt } }
      diary: [],               // [{ id, ts, text }]
      settings: { notifications: false, theme: 'system' }
    };
  }
  function load() {
    const d = defaults();
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return d;
      const s = JSON.parse(raw);
      if (!s || typeof s !== 'object') return d;
      const merged = Object.assign(d, s, {
        missions: (s.missions && typeof s.missions === 'object') ? s.missions : {},
        diary: Array.isArray(s.diary) ? s.diary : [],
        settings: Object.assign(defaults().settings, s.settings || {}),
        xp: Number(s.xp) || 0
      });
      if (merged.lang && !I18N[merged.lang]) merged.lang = null;
      return merged;
    } catch (e) {
      return d;
    }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* z. B. privater Modus */ }
  }
  let state = load();

  /* ------------------------------------------------------------------
     HELFER
     ------------------------------------------------------------------ */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function t(key, vars) {
    const dict = I18N[state.lang] || I18N.de;
    let s = dict[key] != null ? dict[key] : (I18N.de[key] != null ? I18N.de[key] : key);
    if (vars) Object.keys(vars).forEach(k => { s = String(s).split('{' + k + '}').join(vars[k]); });
    return s;
  }
  const L = obj => (obj ? (obj[state.lang] || obj.de || '') : '');
  const locale = () => LOCALES[state.lang] || 'de-DE';
  const fmtDate = ts => new Date(ts).toLocaleDateString(locale(), { day: '2-digit', month: '2-digit', year: 'numeric' });
  const fmtDateTime = ts => new Date(ts).toLocaleString(locale(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const levelOf = xp => Math.floor((Number(xp) || 0) / XP_PER_LEVEL) + 1;
  const paras = text => esc(text).split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  const burger = () => '<span class="burger"><i></i><i></i><i></i></span>';

  /* ------------------------------------------------------------------
     INHALTE INDIZIEREN
     ------------------------------------------------------------------ */
  const WORLDS = C.worlds;
  const worldById = id => WORLDS.find(w => w.id === id);
  const MISSIONS = {}; // id -> { m, world, level, cat }
  Object.keys(C.missions || {}).forEach(key => {
    const cut = key.lastIndexOf('-');
    const world = key.slice(0, cut);
    const level = parseInt(key.slice(cut + 1), 10);
    CATS.forEach(cat => (C.missions[key][cat] || []).forEach(m => {
      MISSIONS[m.id] = { m, world, level, cat };
    }));
  });
  const missionsOf = (w, n, cat) => ((C.missions[w + '-' + n] || {})[cat]) || [];
  const statusOf = id => (state.missions[id] && state.missions[id].status) || 'open';
  const isUnlocked = (w, n) => { const wd = worldById(w); return !!wd && (wd.unlocked || []).includes(n); };
  function levelDone(w, n) {
    const all = CATS.reduce((acc, c) => acc.concat(missionsOf(w, n, c)), []);
    return all.length > 0 && all.every(m => statusOf(m.id) === 'done');
  }

  /* ------------------------------------------------------------------
     DOM-REFERENZEN
     ------------------------------------------------------------------ */
  const $view = $('#view');
  const $topbar = $('#topbar');
  const $sidebar = $('#sidebar');
  const $scrim = $('#scrim');
  const $dialog = $('#dialog');
  const $toast = $('#toast');

  /* ------------------------------------------------------------------
     ROUTER (Hash-basiert – funktioniert auf GitHub Pages ohne Server)
     Routen:
       #/lang  #/setup  #/home
       #/book/<welt>
       #/level/<welt>/<stufe>
       #/missions/<welt>/<stufe>/<body|mind|soul>
       #/mission/<missionId>
       #/page/<character|logbook|diary|notifications|design|language|monthplan|group|mentor|help>
     ------------------------------------------------------------------ */
  let lastHash = null;
  let navCount = 0;
  let draft = { name: '', avatar: '' };
  let worldIdx = 0;
  let monthOffset = 0;

  function route() {
    return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(s => {
      try { return decodeURIComponent(s); } catch (e) { return s; }
    });
  }
  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }
  function goBack() {
    if (navCount > 0) history.back();
    else go('#/book/' + C.startWorld);
  }

  function render() {
    applyPrefs();
    closeMenu();
    const r = route();
    const v = r[0] || '';
    const a = r.slice(1);
    let html;
    let chrome = true;
    let key = v;

    if (!state.lang || (v === 'lang' && !state.onboarded)) {
      html = viewLang(); chrome = false; key = 'lang';
    } else if (!state.onboarded) {
      html = viewSetup(); chrome = false; key = 'setup';
    } else {
      switch (v) {
        case 'book': html = viewBook(a[0]); break;
        case 'level': html = viewLevel(a[0], parseInt(a[1], 10)); break;
        case 'missions': html = viewMissions(a[0], parseInt(a[1], 10), a[2]); break;
        case 'mission': html = viewMission(a[0]); break;
        case 'page': html = viewPage(a[0]); break;
        default: html = viewHome(); chrome = false; key = 'home';
      }
    }

    $view.innerHTML = html;
    $view.dataset.view = key;
    setChrome(chrome);
    if (state.onboarded) renderMenu();
    if (key === 'book') initBook();

    if (location.hash !== lastHash) {
      window.scrollTo(0, 0);
      $view.classList.remove('enter');
      void $view.offsetWidth; // Animation neu starten
      $view.classList.add('enter');
      lastHash = location.hash;
    }
  }

  function setChrome(show) {
    $topbar.hidden = !show;
    document.body.classList.toggle('has-topbar', show);
    if (show) {
      $('#tbAvatar').textContent = state.avatar;
      $('#tbName').textContent = state.name;
      $('#tbLevel').textContent = `${t('level')} ${levelOf(state.xp)} · ${state.xp} XP`;
    }
  }

  function applyPrefs() {
    const root = document.documentElement;
    root.lang = state.lang || 'de';
    const th = state.settings.theme;
    if (th === 'light' || th === 'dark') root.dataset.theme = th;
    else delete root.dataset.theme;
    const meta = $('meta[name="theme-color"]');
    if (meta) {
      const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
      if (bg) meta.setAttribute('content', bg);
    }
  }

  /* ------------------------------------------------------------------
     1. ONBOARDING
     ------------------------------------------------------------------ */
  function stepper(n) {
    return `<div class="stepper" aria-label="${esc(t('step', { n }))}">${
      CATS.map((c, i) => `<span class="cat-${c} ${i < n ? 'on' : ''}"></span>`).join('')}</div>`;
  }

  function viewLang() {
    return `<section class="onb">
      ${stepper(1)}
      <div class="onb-mark">📖</div>
      <h1 class="onb-title">Avalon</h1>
      <p class="muted">Sprache · Language · Idioma</p>
      <div class="stack">
        ${LANGS.map(l => `
          <button class="choice ${state.lang === l.id ? 'is-selected' : ''}" data-action="set-lang" data-lang="${l.id}">
            <span class="flag">${l.flag}</span><span>${l.label}</span><span class="chev">›</span>
          </button>`).join('')}
      </div>
    </section>`;
  }

  function avatarGrid(selected) {
    return `<div class="avatar-grid" role="radiogroup">${AVATARS.map(av => `
      <button type="button" class="avatar-opt ${av === selected ? 'is-selected' : ''}" data-action="pick-avatar"
        data-avatar="${av}" role="radio" aria-checked="${av === selected}">${av}</button>`).join('')}</div>`;
  }

  function viewSetup() {
    if (!draft.name) draft.name = state.name;
    if (!draft.avatar) draft.avatar = state.avatar;
    return `<section class="onb onb-top">
      ${stepper(2)}
      <div><button class="back" data-go="#/lang">‹ ${esc(t('back'))}</button></div>
      <h1 class="onb-title">${esc(t('createProfile'))}</h1>
      <form id="setupForm" class="stack" novalidate autocomplete="off">
        <label class="field">
          <span>${esc(t('yourName'))}</span>
          <input id="nameInput" type="text" maxlength="24" value="${esc(draft.name)}" placeholder="${esc(t('namePh'))}">
        </label>
        <div class="field"><span>${esc(t('chooseAvatar'))}</span>${avatarGrid(draft.avatar)}</div>
        <button class="btn primary big block" type="submit">${esc(t('continue'))}</button>
      </form>
    </section>`;
  }

  function submitSetup() {
    const name = ($('#nameInput').value || '').trim();
    if (!name || !draft.avatar) { toast(t('nameRequired')); return; }
    state.name = name.slice(0, 24);
    state.avatar = draft.avatar;
    state.onboarded = true;
    save();
    go('#/home');
    // Schritt 3: Begrüßung in der Sprechblase
    setTimeout(() => openDialog(t('welcomeTitle', { name: state.name }), t('welcomeText'), t('letsGo')), 300);
  }

  /* ------------------------------------------------------------------
     2. HAUPTSEITE – Spielerprofil als Visitenkarte
     ------------------------------------------------------------------ */
  function currentMission(cat) {
    const ids = Object.keys(state.missions)
      .filter(id => MISSIONS[id] && MISSIONS[id].cat === cat && statusOf(id) === 'active')
      .sort((x, y) => (state.missions[y].acceptedAt || 0) - (state.missions[x].acceptedAt || 0));
    return ids.length ? MISSIONS[ids[0]] : null;
  }

  function viewHome() {
    const lvl = levelOf(state.xp);
    const rest = state.xp % XP_PER_LEVEL;
    const pct = rest / XP_PER_LEVEL * 100;
    return `<section class="home">
      <article class="id-card">
        <div class="id-top">
          <span class="eyebrow">${esc(t('playerCard'))}</span>
          <button class="icon-btn sm" data-action="menu" aria-label="${esc(t('menu'))}">${burger()}</button>
        </div>
        <div class="id-head">
          <div class="avatar lg">${esc(state.avatar)}</div>
          <div class="id-info">
            <h1 class="name">${esc(state.name)}</h1>
            <div class="meta">${esc(t('level'))} ${lvl} · ${state.xp} XP</div>
            <div class="xpbar" role="progressbar" aria-valuemin="0" aria-valuemax="${XP_PER_LEVEL}" aria-valuenow="${rest}"><span style="width:${pct}%"></span></div>
            <div class="meta small">${esc(t('toNext', { n: XP_PER_LEVEL - rest }))}</div>
          </div>
        </div>
        <h2 class="section-label">${esc(t('currentMissions'))}</h2>
        <div class="current">
          ${CATS.map(cat => {
            const cm = currentMission(cat);
            const target = cm ? '#/mission/' + cm.m.id : `#/missions/${C.startWorld}/1/${cat}`;
            return `<button class="cur cat-${cat}" data-go="${esc(target)}">
              <span class="cur-icon">${CAT_ICON[cat]}</span>
              <span class="cur-text">
                <small>${esc(t(cat))}</small>
                <strong class="${cm ? '' : 'none'}">${cm ? esc(L(cm.m.title)) : esc(t('noActive'))}</strong>
              </span>
              <span class="chev">›</span>
            </button>`;
          }).join('')}
        </div>
      </article>
      <button class="btn primary big block btn-book" data-action="open-book">📖 ${esc(t('openBook'))}</button>
    </section>`;
  }

  function openBook() {
    const card = $('.id-card');
    const btn = $('.btn-book');
    const target = '#/book/' + C.startWorld;
    if (!card) { go(target); return; }
    card.classList.add('collapsing');
    if (btn) btn.classList.add('fade');
    setTimeout(() => go(target), 380);
  }

  /* ------------------------------------------------------------------
     3. LEVEL-ANSICHT – Welten zum Wischen
     ------------------------------------------------------------------ */
  const POS = ['center', 'right', 'center', 'left'];

  function viewBook(id) {
    let i = WORLDS.findIndex(w => w.id === id);
    if (i < 0) i = Math.max(0, WORLDS.findIndex(w => w.id === C.startWorld));
    worldIdx = i;
    return `<section class="book">
      <div class="world-nav">
        <button class="arrow" data-action="world-prev" aria-label="${esc(t('prevWorld'))}">‹</button>
        <div class="dots">${WORLDS.map((w, k) => `<button class="dot ${k === i ? 'on' : ''}" data-action="world-goto" data-idx="${k}" aria-label="${esc(L(w.title))}"></button>`).join('')}</div>
        <button class="arrow" data-action="world-next" aria-label="${esc(t('nextWorld'))}">›</button>
      </div>
      <div class="world-viewport" id="worldViewport">
        <div class="world-track" id="worldTrack" style="transform:translateX(${-i * 100}%)">
          ${WORLDS.map(worldSlide).join('')}
        </div>
      </div>
      <p class="hint">${esc(t('swipeHint'))}</p>
    </section>`;
  }

  function worldSlide(w, k) {
    const prev = WORLDS[k - 1];
    const next = WORLDS[k + 1];
    const anyOpen = (w.unlocked || []).length > 0;
    let rows = '';
    for (let n = 1; n <= w.levels; n++) {
      const open = (w.unlocked || []).includes(n);
      const done = open && levelDone(w.id, n);
      const pos = POS[(n - 1) % POS.length];
      const label = t('levelN', { n }) + (open ? '' : ' – ' + t('lockedShort'));
      rows += `<div class="lvl-row pos-${pos}">
        <div class="lvl-unit">
          <button class="lvl ${open ? 'open' : 'locked'} ${done ? 'done' : ''}"
            ${open ? `data-go="#/level/${w.id}/${n}"` : 'data-action="locked"'} aria-label="${esc(label)}">
            ${open ? `<span>${n}</span>` : '<span class="lock">🔒</span>'}
          </button>
          <span class="lvl-cap">${esc(t('levelN', { n }))}</span>
        </div>
      </div>`;
    }
    return `<div class="world">
      <div class="neighbors">
        <span>${prev ? '‹ ' + esc(L(prev.title)) : ''}</span>
        <span>${next ? esc(L(next.title)) + ' ›' : ''}</span>
      </div>
      <h1 class="world-title">${esc(w.icon || '')} ${esc(L(w.title))}</h1>
      ${anyOpen ? '' : `<p class="world-sub">${esc(t('comingSoon'))}</p>`}
      <div class="levels">${rows}</div>
    </div>`;
  }

  function setWorld(i, animate) {
    const track = $('#worldTrack');
    if (!track) return;
    worldIdx = Math.max(0, Math.min(WORLDS.length - 1, i));
    track.style.transition = animate === false ? 'none' : '';
    track.style.transform = `translateX(${-worldIdx * 100}%)`;
    $$('.dot').forEach((d, k) => d.classList.toggle('on', k === worldIdx));
    $$('.world').forEach((w, k) => { w.inert = k !== worldIdx; });
    const prevBtn = $('[data-action="world-prev"]');
    const nextBtn = $('[data-action="world-next"]');
    if (prevBtn) prevBtn.disabled = worldIdx === 0;
    if (nextBtn) nextBtn.disabled = worldIdx === WORLDS.length - 1;
    const h = '#/book/' + WORLDS[worldIdx].id;
    if (location.hash !== h) history.replaceState(null, '', h);
    lastHash = location.hash;
    renderMenu();
  }

  function initBook() {
    setWorld(worldIdx, false);
    const vp = $('#worldViewport');
    const track = $('#worldTrack');
    if (!vp || !track) return;
    let x0 = null, y0 = null, dx = 0, axis = null;

    vp.addEventListener('touchstart', e => {
      const p = e.touches[0];
      x0 = p.clientX; y0 = p.clientY; dx = 0; axis = null;
      track.style.transition = 'none';
    }, { passive: true });

    vp.addEventListener('touchmove', e => {
      if (x0 === null) return;
      const p = e.touches[0];
      const ddx = p.clientX - x0;
      const ddy = p.clientY - y0;
      if (axis === null && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) {
        axis = Math.abs(ddx) > Math.abs(ddy) ? 'x' : 'y';
      }
      if (axis === 'x') {
        const atEdge = (worldIdx === 0 && ddx > 0) || (worldIdx === WORLDS.length - 1 && ddx < 0);
        dx = atEdge ? ddx / 3 : ddx; // Widerstand am Rand
        track.style.transform = `translateX(calc(${-worldIdx * 100}% + ${dx}px))`;
      }
    }, { passive: true });

    const end = () => {
      if (x0 === null) return;
      track.style.transition = '';
      if (axis === 'x' && Math.abs(dx) > 50) setWorld(worldIdx + (dx < 0 ? 1 : -1));
      else setWorld(worldIdx);
      x0 = null; axis = null; dx = 0;
    };
    vp.addEventListener('touchend', end);
    vp.addEventListener('touchcancel', end);
  }

  /* ------------------------------------------------------------------
     4. STUFE – Körper / Geist / Seele
     ------------------------------------------------------------------ */
  function viewLockedMsg(w) {
    const target = '#/book/' + (worldById(w) ? w : C.startWorld);
    return `<section class="page">
      <button class="back" data-go="${target}">‹ ${esc(t('back'))}</button>
      <div class="card placeholder"><div class="ph-icon">🔒</div><p>${esc(t('locked'))}</p></div>
    </section>`;
  }

  function viewNotFound() {
    return `<section class="page">
      <button class="back" data-go="#/home">‹ ${esc(t('home'))}</button>
      <div class="card placeholder"><div class="ph-icon">🧭</div><p>${esc(t('notFound'))}</p></div>
    </section>`;
  }

  function viewLevel(w, n) {
    const wd = worldById(w);
    if (!wd || !isUnlocked(w, n)) return viewLockedMsg(w);
    const intro = (C.levelIntros || {})[w + '-' + n];
    return `<section class="page">
      <button class="back" data-go="#/book/${w}">‹ ${esc(L(wd.title))}</button>
      <p class="eyebrow">${esc(L(wd.title))}</p>
      <h1 class="page-title">${esc(t('levelN', { n }))}</h1>
      <p class="muted">${esc(t('chooseArea'))}</p>
      <div class="cat-grid">
        ${CATS.map(cat => {
          const list = missionsOf(w, n, cat);
          const done = list.filter(m => statusOf(m.id) === 'done').length;
          return `<button class="cat-card cat-${cat}" data-go="#/missions/${w}/${n}/${cat}">
            <span class="cat-icon">${CAT_ICON[cat]}</span>
            <strong>${esc(t(cat))}</strong>
            <small>${done}/${list.length} ✓</small>
          </button>`;
        }).join('')}
      </div>
      ${intro ? `<div class="card intro prose">${paras(L(intro))}</div>` : ''}
    </section>`;
  }

  function missionItem(m) {
    const st = statusOf(m.id);
    let action;
    if (st === 'done') action = `<span class="done-label">✓ ${esc(t('completed'))}</span>`;
    else if (st === 'active') action = `<button class="btn cat-btn" data-go="#/mission/${esc(m.id)}">${esc(t('continueMission'))}</button>`;
    else action = `<button class="btn cat-btn" data-action="accept" data-id="${esc(m.id)}">${esc(t('acceptMission'))}</button>`;
    return `<li class="mission-item st-${st}">
      <button class="mission-title" data-go="#/mission/${esc(m.id)}"><span>${esc(L(m.title))}</span><span class="chev">›</span></button>
      <p class="muted small">${esc(L(m.short))}</p>
      <div class="mission-foot">
        <span class="badges">
          <span class="badge">+${Number(m.xp) || 0} XP</span>
          ${st !== 'open' ? `<span class="badge st">${esc(t(st === 'done' ? 'statusDone' : 'statusActive'))}</span>` : ''}
        </span>
        ${action}
      </div>
    </li>`;
  }

  function viewMissions(w, n, cat) {
    const wd = worldById(w);
    if (!wd || !isUnlocked(w, n) || !CATS.includes(cat)) return viewLockedMsg(w);
    const list = missionsOf(w, n, cat);
    return `<section class="page cat-${cat}">
      <button class="back" data-go="#/level/${w}/${n}">‹ ${esc(t('levelN', { n }))}</button>
      <header class="cat-header">
        <span class="cat-icon">${CAT_ICON[cat]}</span>
        <div><p class="eyebrow">${esc(L(wd.title))} · ${esc(t('levelN', { n }))}</p><h1 class="page-title">${esc(t(cat))}</h1></div>
      </header>
      ${list.length ? `<ul class="mission-list">${list.map(missionItem).join('')}</ul>` : `<p class="empty">${esc(t('noMissions'))}</p>`}
      <div class="cat-switch">
        ${CATS.filter(c => c !== cat).map(c => `<button class="chip cat-${c}" data-go="#/missions/${w}/${n}/${c}">${CAT_ICON[c]} ${esc(t(c))}</button>`).join('')}
      </div>
    </section>`;
  }

  function viewMission(id) {
    const info = MISSIONS[id];
    if (!info || !isUnlocked(info.world, info.level)) return viewNotFound();
    const { m, world, level, cat } = info;
    const st = statusOf(id);
    const rec = state.missions[id];
    let actions;
    if (st === 'open') {
      actions = `<button class="btn cat-btn big block" data-action="accept" data-id="${esc(id)}">${esc(t('acceptMission'))}</button>`;
    } else if (st === 'active') {
      actions = `<p class="muted small center">${esc(t('acceptedOn', { d: fmtDate(rec.acceptedAt) }))}</p>
        <button class="btn cat-btn big block" data-action="complete" data-id="${esc(id)}">✓ ${esc(t('completeMission'))}</button>`;
    } else {
      actions = `<p class="done-banner">✓ ${esc(t('doneOn', { d: fmtDate(rec.doneAt) }))}</p>`;
    }
    return `<section class="page detail cat-${cat}">
      <button class="back" data-go="#/missions/${world}/${level}/${cat}">‹ ${esc(t(cat))}</button>
      <header class="cat-header">
        <span class="cat-icon">${CAT_ICON[cat]}</span>
        <div><p class="eyebrow">${esc(t(cat))} · ${esc(t('levelN', { n: level }))} · +${Number(m.xp) || 0} XP</p>
        <h1 class="page-title">${esc(L(m.title))}</h1></div>
      </header>
      <article class="card prose">${paras(L(m.text))}</article>
      <div class="detail-actions">${actions}</div>
    </section>`;
  }

  function accept(id) {
    if (!MISSIONS[id] || statusOf(id) !== 'open') return;
    state.missions[id] = { status: 'active', acceptedAt: Date.now() };
    save();
    render();
    toast(t('acceptedToast'));
  }

  function complete(id) {
    const info = MISSIONS[id];
    if (!info || statusOf(id) !== 'active') return;
    const before = levelOf(state.xp);
    state.missions[id].status = 'done';
    state.missions[id].doneAt = Date.now();
    state.xp += Number(info.m.xp) || 0;
    save();
    render();
    const after = levelOf(state.xp);
    if (after > before) openDialog(t('levelUpTitle', { n: after }), t('levelUpText'), t('ok'), '🏆');
    else toast(t('completedToast', { xp: Number(info.m.xp) || 0 }));
  }

  /* ------------------------------------------------------------------
     5. SEITENMENÜ
     ------------------------------------------------------------------ */
  function renderMenu() {
    const cur = location.hash;
    const item = (href, icon, label, sub) => `
      <button class="menu-item ${sub ? 'sub' : ''} ${cur === href ? 'active' : ''}" data-go="${href}">
        <span class="mi-icon">${icon}</span><span>${esc(label)}</span>
      </button>`;
    const start = worldById(C.startWorld);
    const bookOrder = (start ? [start] : []).concat(WORLDS.filter(w => w !== start));
    $sidebar.innerHTML = `
      <div class="sb-head">
        <div class="avatar">${esc(state.avatar)}</div>
        <div class="sb-who"><strong>${esc(state.name)}</strong><small>${esc(t('level'))} ${levelOf(state.xp)} · ${state.xp} XP</small></div>
        <button class="icon-btn sm" data-action="close-menu" aria-label="${esc(t('close'))}">✕</button>
      </div>
      <nav>
        ${item('#/home', '🏠', t('home'))}
        ${item('#/page/character', '🪪', t('character'))}
        ${item('#/page/logbook', '📜', t('logbook'))}
        ${item('#/page/diary', '✍️', t('diary'))}

        <h4 class="sb-sec">${esc(t('books'))}</h4>
        ${bookOrder.map(w => item('#/book/' + w.id, w.icon || '📘', L(w.title), true)).join('')}

        <h4 class="sb-sec">${esc(t('settings'))}</h4>
        ${item('#/page/notifications', '🔔', t('notifications'), true)}
        ${item('#/page/design', '🎨', t('design'), true)}
        ${item('#/page/language', '🌐', t('language'), true)}
        ${item('#/page/monthplan', '🗓️', t('monthplan'), true)}

        <h4 class="sb-sec">${esc(t('community'))}</h4>
        ${item('#/page/group', '👥', t('group'), true)}
        ${item('#/page/mentor', '🧭', t('mentor'), true)}
        ${item('#/page/help', '❓', t('help'), true)}
      </nav>`;
  }

  function openMenu() {
    renderMenu();
    $sidebar.classList.add('open');
    $sidebar.setAttribute('aria-hidden', 'false');
    $scrim.classList.add('show');
    document.body.classList.add('no-scroll');
  }
  function closeMenu() {
    $sidebar.classList.remove('open');
    $sidebar.setAttribute('aria-hidden', 'true');
    $scrim.classList.remove('show');
    document.body.classList.remove('no-scroll');
  }

  /* ------------------------------------------------------------------
     SEITEN AUS DEM MENÜ
     ------------------------------------------------------------------ */
  function pageShell(titleKey, icon, body) {
    return `<section class="page">
      <button class="back" data-action="back">‹ ${esc(t('back'))}</button>
      <h1 class="page-title">${icon} ${esc(t(titleKey))}</h1>
      ${body}
    </section>`;
  }

  function viewPage(key) {
    const pages = {
      character: pageCharacter,
      logbook: pageLogbook,
      diary: pageDiary,
      notifications: pageNotifications,
      design: pageDesign,
      language: pageLanguage,
      monthplan: pageMonthplan,
      group: () => pagePlaceholder('group', '👥'),
      mentor: () => pagePlaceholder('mentor', '🧭'),
      help: pageHelp
    };
    return pages[key] ? pages[key]() : viewNotFound();
  }

  function pageCharacter() {
    draft = { name: state.name, avatar: state.avatar };
    const recs = Object.values(state.missions);
    const act = recs.filter(r => r.status === 'active').length;
    const done = recs.filter(r => r.status === 'done').length;
    return pageShell('character', '🪪', `
      <div class="card stats">
        <div><strong>${levelOf(state.xp)}</strong><small>${esc(t('level'))}</small></div>
        <div><strong>${state.xp}</strong><small>XP</small></div>
        <div><strong>${act}</strong><small>${esc(t('statusActive'))}</small></div>
        <div><strong>${done}</strong><small>${esc(t('statusDone'))}</small></div>
      </div>
      <form id="charForm" class="card stack" novalidate autocomplete="off">
        <label class="field">
          <span>${esc(t('yourName'))}</span>
          <input id="nameInput" type="text" maxlength="24" value="${esc(draft.name)}" placeholder="${esc(t('namePh'))}">
        </label>
        <div class="field"><span>${esc(t('chooseAvatar'))}</span>${avatarGrid(draft.avatar)}</div>
        <button class="btn primary block" type="submit">${esc(t('save'))}</button>
      </form>
      <button class="btn danger block" data-action="reset">${esc(t('reset'))}</button>`);
  }

  function saveCharacter() {
    const name = ($('#nameInput').value || '').trim();
    if (!name || !draft.avatar) { toast(t('nameRequired')); return; }
    state.name = name.slice(0, 24);
    state.avatar = draft.avatar;
    save();
    render();
    toast(t('saved'));
  }

  function pageLogbook() {
    const ids = Object.keys(state.missions).filter(id => MISSIONS[id]);
    const last = id => { const r = state.missions[id]; return r.doneAt || r.acceptedAt || 0; };
    ids.sort((a, b) => last(b) - last(a));
    const act = ids.filter(id => statusOf(id) === 'active').length;
    const done = ids.filter(id => statusOf(id) === 'done').length;
    const list = ids.map(id => {
      const { m, cat } = MISSIONS[id];
      const r = state.missions[id];
      const line = r.status === 'done' ? t('doneOn', { d: fmtDate(r.doneAt) }) : t('acceptedOn', { d: fmtDate(r.acceptedAt) });
      return `<button class="log-item cat-${cat}" data-go="#/mission/${esc(id)}">
        <span class="mi-icon">${r.status === 'done' ? '✅' : CAT_ICON[cat]}</span>
        <span><strong>${esc(L(m.title))}</strong><small>${esc(t(cat))} · ${esc(line)}</small></span>
        <span class="chev">›</span>
      </button>`;
    }).join('');
    return pageShell('logbook', '📜', ids.length
      ? `<p class="muted small">${esc(t('logSummary', { a: act, d: done, xp: state.xp }))}</p>${list}`
      : `<p class="empty">${esc(t('logEmpty'))}</p>`);
  }

  function pageDiary() {
    const entries = state.diary.slice().sort((a, b) => b.ts - a.ts);
    return pageShell('diary', '✍️', `
      <form id="diaryForm" class="card stack">
        <textarea id="diaryText" rows="4" maxlength="4000" placeholder="${esc(t('diaryPh'))}"></textarea>
        <button class="btn primary block" type="submit">${esc(t('addEntry'))}</button>
      </form>
      ${entries.length ? entries.map(e => `
        <div class="card">
          <div class="entry-head">
            <small>${esc(fmtDateTime(e.ts))}</small>
            <button class="link danger" data-action="diary-del" data-id="${esc(e.id)}">${esc(t('delete'))}</button>
          </div>
          <div class="prose">${paras(e.text)}</div>
        </div>`).join('') : `<p class="empty">${esc(t('diaryEmpty'))}</p>`}`);
  }

  function addDiary() {
    const el = $('#diaryText');
    const text = (el && el.value || '').trim();
    if (!text) return;
    state.diary.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ts: Date.now(), text });
    save();
    render();
    toast(t('saved'));
  }

  function pageNotifications() {
    const supported = 'Notification' in window;
    const perm = supported ? Notification.permission : 'unsupported';
    let note = '';
    if (!supported) note = t('notifUnsupported');
    else if (perm === 'denied') note = t('notifDenied');
    const canTest = supported && perm === 'granted' && state.settings.notifications;
    return pageShell('notifications', '🔔', `
      <div class="card">
        <label class="row-switch">
          <span><strong>${esc(t('notifReminders'))}</strong><small>${esc(t('notifText'))}</small></span>
          <input type="checkbox" class="switch" data-action="toggle-notif" ${state.settings.notifications ? 'checked' : ''}>
        </label>
        ${note ? `<p class="note">${esc(note)}</p>` : ''}
        ${canTest ? `<div style="margin-top:14px"><button class="btn block" data-action="notif-test">${esc(t('notifTest'))}</button></div>` : ''}
      </div>`);
  }

  function toggleNotifications(el) {
    const want = el.checked;
    if (want && 'Notification' in window && Notification.permission !== 'granted') {
      let handled = false;
      const handle = p => {
        if (handled) return;
        handled = true;
        state.settings.notifications = p === 'granted';
        save();
        render();
        if (p !== 'granted') toast(t('notifDenied'));
      };
      try {
        const res = Notification.requestPermission(handle);
        if (res && typeof res.then === 'function') res.then(handle, () => handle('denied'));
      } catch (e) { handle('denied'); }
      return;
    }
    state.settings.notifications = want;
    save();
    render();
  }

  function testNotification() {
    try { new Notification('Avalon', { body: t('notifTestBody') }); }
    catch (e) { toast(t('notifUnsupported')); }
  }

  function pageDesign() {
    const th = state.settings.theme;
    const opt = (id, icon, label) => `
      <button class="choice ${th === id ? 'is-selected' : ''}" data-action="set-theme" data-theme="${id}">
        <span class="flag">${icon}</span><span>${esc(label)}</span><span class="chev">${th === id ? '✓' : ''}</span>
      </button>`;
    return pageShell('design', '🎨', `
      <div class="stack" style="margin-bottom:16px">
        ${opt('light', '☀️', t('themeLight'))}
        ${opt('dark', '🌙', t('themeDark'))}
        ${opt('system', '📱', t('themeSystem'))}
      </div>
      <div class="card">
        <p class="eyebrow" style="margin-bottom:10px">${esc(t('colorLegend'))}</p>
        <div class="legend">
          ${CATS.map(c => `<div class="cat-${c}"><i></i>${esc(t(c))}</div>`).join('')}
        </div>
      </div>`);
  }

  function pageLanguage() {
    return pageShell('language', '🌐', `<div class="stack">
      ${LANGS.map(l => `
        <button class="choice ${state.lang === l.id ? 'is-selected' : ''}" data-action="change-lang" data-lang="${l.id}">
          <span class="flag">${l.flag}</span><span>${l.label}</span><span class="chev">${state.lang === l.id ? '✓' : ''}</span>
        </button>`).join('')}
    </div>`);
  }

  function pageMonthplan() {
    const now = new Date();
    const ref = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const y = ref.getFullYear();
    const mo = ref.getMonth();
    const days = new Date(y, mo + 1, 0).getDate();
    const lead = (ref.getDay() + 6) % 7; // Woche beginnt am Montag
    const active = new Set();
    const mark = ts => {
      if (!ts) return;
      const d = new Date(ts);
      if (d.getFullYear() === y && d.getMonth() === mo) active.add(d.getDate());
    };
    Object.values(state.missions).forEach(r => { mark(r.acceptedAt); mark(r.doneAt); });
    state.diary.forEach(e => mark(e.ts));

    const wd = (I18N[state.lang] || I18N.de).wd;
    let cells = wd.map(w => `<div class="wd">${esc(w)}</div>`).join('');
    for (let i = 0; i < lead; i++) cells += '<div></div>';
    for (let d = 1; d <= days; d++) {
      const today = monthOffset === 0 && d === now.getDate();
      cells += `<div class="d ${today ? 'today' : ''} ${active.has(d) ? 'act' : ''}">${d}</div>`;
    }
    const title = ref.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
    return pageShell('monthplan', '🗓️', `
      <div class="card">
        <div class="cal-head">
          <button class="arrow sm" data-action="month" data-dir="-1" aria-label="‹">‹</button>
          <strong>${esc(title)}</strong>
          <button class="arrow sm" data-action="month" data-dir="1" aria-label="›">›</button>
        </div>
        <div class="cal">${cells}</div>
        <p class="note"><span class="legend-dot">●</span> ${esc(t('monthLegend'))}</p>
      </div>
      <div class="card placeholder"><p>${esc(t('monthPlaceholder'))}</p></div>`);
  }

  function pagePlaceholder(key, icon) {
    return pageShell(key, icon, `
      <div class="card placeholder">
        <div class="ph-icon">${icon}</div>
        <p><strong>${esc(t(key + 'Text'))}</strong></p>
        <p class="muted small">${esc(t('placeholder'))}</p>
      </div>`);
  }

  function pageHelp() {
    return pageShell('help', '❓', `
      <p class="muted">${esc(t('helpText'))}</p>
      ${[1, 2, 3].map(i => `<details class="card"><summary>${esc(t('faq' + i + 'q'))}</summary><p>${esc(t('faq' + i + 'a'))}</p></details>`).join('')}
      <div class="card placeholder"><p class="muted small">${esc(t('placeholder'))}</p></div>`);
  }

  /* ------------------------------------------------------------------
     DIALOG & TOAST
     ------------------------------------------------------------------ */
  function openDialog(title, text, btnLabel, guide) {
    $('#dialogGuide').textContent = guide || '🧙‍♂️';
    $('#dialogTitle').textContent = title;
    $('#dialogText').textContent = text;
    $('#dialogBtn').textContent = btnLabel;
    $dialog.hidden = false;
    setTimeout(() => $('#dialogBtn').focus(), 60);
  }
  function closeDialog() { $dialog.hidden = true; }

  let toastTimer = null;
  function toast(msg) {
    $toast.textContent = msg;
    $toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove('show'), 2400);
  }

  /* ------------------------------------------------------------------
     EREIGNISSE
     ------------------------------------------------------------------ */
  function handleAction(action, el) {
    switch (action) {
      case 'set-lang':
        state.lang = el.dataset.lang; save(); go('#/setup'); break;
      case 'pick-avatar':
        draft.avatar = el.dataset.avatar;
        $$('.avatar-opt', el.parentElement).forEach(b => {
          const on = b === el;
          b.classList.toggle('is-selected', on);
          b.setAttribute('aria-checked', String(on));
        });
        break;
      case 'open-book': openBook(); break;
      case 'menu': openMenu(); break;
      case 'close-menu': closeMenu(); break;
      case 'close-dialog': closeDialog(); break;
      case 'world-prev': setWorld(worldIdx - 1); break;
      case 'world-next': setWorld(worldIdx + 1); break;
      case 'world-goto': setWorld(parseInt(el.dataset.idx, 10) || 0); break;
      case 'locked': toast(t('locked')); break;
      case 'accept': accept(el.dataset.id); break;
      case 'complete': complete(el.dataset.id); break;
      case 'back': goBack(); break;
      case 'reset':
        if (confirm(t('resetConfirm'))) {
          try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignorieren */ }
          state = defaults();
          draft = { name: '', avatar: '' };
          navCount = 0;
          go('#/lang');
        }
        break;
      case 'diary-del':
        if (confirm(t('deleteConfirm'))) {
          state.diary = state.diary.filter(e => e.id !== el.dataset.id);
          save(); render();
        }
        break;
      case 'toggle-notif': toggleNotifications(el); break;
      case 'notif-test': testNotification(); break;
      case 'set-theme': state.settings.theme = el.dataset.theme; save(); render(); break;
      case 'change-lang': state.lang = el.dataset.lang; save(); render(); toast(t('saved')); break;
      case 'month': monthOffset += parseInt(el.dataset.dir, 10) || 0; render(); break;
    }
  }

  document.addEventListener('click', e => {
    if (e.target === $dialog) { closeDialog(); return; }
    const el = e.target.closest('[data-go], [data-action]');
    if (!el) return;
    if (el.dataset.go) {
      e.preventDefault();
      go(el.dataset.go);
      return;
    }
    handleAction(el.dataset.action, el);
  });

  document.addEventListener('submit', e => {
    e.preventDefault();
    if (e.target.id === 'setupForm') submitSetup();
    else if (e.target.id === 'charForm') saveCharacter();
    else if (e.target.id === 'diaryForm') addDiary();
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'nameInput') draft.name = e.target.value;
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!$dialog.hidden) closeDialog();
      else closeMenu();
      return;
    }
    const typing = /^(INPUT|TEXTAREA)$/.test((e.target.tagName || ''));
    if (!typing && $view.dataset.view === 'book' && !$sidebar.classList.contains('open')) {
      if (e.key === 'ArrowLeft') setWorld(worldIdx - 1);
      if (e.key === 'ArrowRight') setWorld(worldIdx + 1);
    }
  });

  window.addEventListener('hashchange', () => { navCount++; render(); });

  // Start
  render();
})();
