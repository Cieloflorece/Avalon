/* =====================================================================
   AVALON – INHALTE
   ---------------------------------------------------------------------
   In dieser Datei pflegst du alle Texte für Welten, Stufen und Missionen.
   Du musst dafür KEIN JavaScript verstehen – ersetze einfach die Texte
   zwischen den Anführungszeichen.

   Regeln:
   - Jede Mission braucht eine eindeutige "id" (keine Leerzeichen).
   - Absätze im Text trennst du mit einer Leerzeile: "\n\n"
   - Fehlt eine Übersetzung (en/es), wird automatisch Deutsch angezeigt.
   - "unlocked" legt fest, welche Stufen einer Welt geöffnet sind.
   ===================================================================== */

/* Platzhalter, die mehrfach verwendet werden – später einfach ersetzen. */
const PH_SHORT = {
  de: 'Kurze Beschreibung der Mission (Platzhalter).',
  en: 'Short description of the mission (placeholder).',
  es: 'Breve descripción de la misión (texto provisional).'
};

const PH_TEXT = {
  de: 'Hier steht später dein eigener Text zu dieser Mission.\n\nBeschreibe, worum es geht, warum diese Übung wichtig ist und wie der Spieler sie Schritt für Schritt umsetzt.\n\nTipp: Absätze werden durch eine Leerzeile getrennt.',
  en: 'Your own text for this mission will appear here later.\n\nDescribe what it is about, why this exercise matters and how the player completes it step by step.\n\nTip: separate paragraphs with an empty line.',
  es: 'Aquí aparecerá más adelante tu propio texto para esta misión.\n\nDescribe de qué se trata, por qué es importante este ejercicio y cómo el jugador lo realiza paso a paso.\n\nConsejo: separa los párrafos con una línea vacía.'
};

window.AVALON_CONTENT = {

  /* Welt, die beim Öffnen des Buches angezeigt wird */
  startWorld: 'avalon',

  /* Reihenfolge = Reihenfolge beim Wischen (links → rechts) */
  worlds: [
    {
      id: 'brain',
      icon: '🧠',
      title: { de: 'Gehirnsynchronisation', en: 'Brain Synchronisation', es: 'Sincronización cerebral' },
      levels: 10,
      unlocked: []          // noch alles gesperrt
    },
    {
      id: 'avalon',
      icon: '🪄',
      title: { de: 'Avalon, Weg des Magiers', en: 'Avalon, Path of the Magician', es: 'Avalon, el camino del mago' },
      levels: 10,
      unlocked: [1]         // nur Stufe 1 ist offen
    },
    {
      id: 'anahoba',
      icon: '🌺',
      title: { de: 'Anahoba', en: 'Anahoba', es: 'Anahoba' },
      levels: 10,
      unlocked: []
    }
  ],

  /* Einleitungstext pro Stufe (optional). Schlüssel: "<welt-id>-<stufe>" */
  levelIntros: {
    'avalon-1': {
      de: 'Willkommen auf Stufe 1. Wähle einen Bereich und nimm deine ersten Missionen an.',
      en: 'Welcome to level 1. Choose an area and accept your first missions.',
      es: 'Bienvenido al nivel 1. Elige un área y acepta tus primeras misiones.'
    }
  },

  /* Missionen pro Stufe. Schlüssel: "<welt-id>-<stufe>"
     Kategorien: body = Körper (grün), mind = Geist (gelb), soul = Seele (violett) */
  missions: {
    'avalon-1': {
      body: [
        {
          id: 'avalon-1-body-1', xp: 20,
          title: { de: 'Morgenbewegung', en: 'Morning Movement', es: 'Movimiento matutino' },
          short: PH_SHORT, text: PH_TEXT
        },
        {
          id: 'avalon-1-body-2', xp: 20,
          title: { de: 'Bewusst atmen', en: 'Conscious Breathing', es: 'Respiración consciente' },
          short: PH_SHORT, text: PH_TEXT
        },
        {
          id: 'avalon-1-body-3', xp: 30,
          title: { de: 'Wasser des Lebens', en: 'Water of Life', es: 'Agua de vida' },
          short: PH_SHORT, text: PH_TEXT
        }
      ],
      mind: [
        {
          id: 'avalon-1-mind-1', xp: 20,
          title: { de: 'Die stille Minute', en: 'The Silent Minute', es: 'El minuto de silencio' },
          short: PH_SHORT, text: PH_TEXT
        },
        {
          id: 'avalon-1-mind-2', xp: 20,
          title: { de: 'Buch der Gedanken', en: 'Book of Thoughts', es: 'Libro de pensamientos' },
          short: PH_SHORT, text: PH_TEXT
        },
        {
          id: 'avalon-1-mind-3', xp: 30,
          title: { de: 'Etwas Neues lernen', en: 'Learn Something New', es: 'Aprender algo nuevo' },
          short: PH_SHORT, text: PH_TEXT
        }
      ],
      soul: [
        {
          id: 'avalon-1-soul-1', xp: 20,
          title: { de: 'Dankbarkeit', en: 'Gratitude', es: 'Gratitud' },
          short: PH_SHORT, text: PH_TEXT
        },
        {
          id: 'avalon-1-soul-2', xp: 20,
          title: { de: 'Herzensbegegnung', en: 'Heart Encounter', es: 'Encuentro del corazón' },
          short: PH_SHORT, text: PH_TEXT
        },
        {
          id: 'avalon-1-soul-3', xp: 30,
          title: { de: 'Dein Ort der Kraft', en: 'Your Place of Power', es: 'Tu lugar de poder' },
          short: PH_SHORT, text: PH_TEXT
        }
      ]
    }
  }
};
