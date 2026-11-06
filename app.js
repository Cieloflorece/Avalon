/* =====================================================================
   AVALON – APP-LOGIK
   Navigation (Hash-Routing), Spielstand (localStorage), Mehrsprachigkeit
   ===================================================================== */
(function () {
  'use strict';

  const C = window.AVALON_CONTENT;
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
      
