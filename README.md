# GigMatch - Ohne Musik keine Stimmung

GigMatch ist eine moderne, hoch-interaktive Web-Applikation (Single Page Application - SPA) zur Vermittlung von Musikern (Bands, DJs, Solisten) und Veranstaltern. Die App basiert auf einem ausgeklügelten **8-Faktoren-Matching-Algorithmus**, um Musiker und Events effizient und passgenau zusammenzubringen.

---

## Hauptfunktionen des Prototyps

1. **Öffentliche Marktplätze**:
   - **Event-Markt**: Liste aller aktiven Veranstaltungen ohne Kontaktdaten.
   - **Musiker-Markt**: Anonymisierte Musikerprofile (z.B. "Heisse Elektro-Pop Coverband" statt "The Neon Beats") ohne Kontaktdaten oder Social-Media-Links.
2. **Benutzerregistrierung & Simulation**:
   - Getrennte Formulare für Musiker (inkl. Gigs, Umkreis, Wochentags-Verfügbarkeiten, SEPA-Mandat für das 5 €/Monat Abo) und Veranstalter (inkl. Event-Details, Budget, Spieldauer).
   - **Simulierte E-Mail-Verifizierung**: Nach der Registrierung erscheint eine Verifizierungsseite. Ein Klick bestätigt die E-Mail und loggt dich ein.
3. **Persönliches Dashboard**:
   - Zeigt Statistiken zu Kontakten und erfolgreichen Auftritten.
   - **"Gig war erfolgreich!" Button**: Manuelle Bestätigung eines Gigs erhöht den Vermittlungszähler.
   - **Match-Empfehlungen**: Direkte Anzeige von passenden Profilen mit einer Übereinstimmung von über 49%.
4. **Postbox (Postfach)**:
   - Integriertes Nachrichtensystem für den Chat zwischen Musikern und Veranstaltern.
   - Automatische Benachrichtigungen vom System bei neuen hohen Matching-Faktoren (> 49%).
5. **Abo-Verwaltung & Sichtbarkeit**:
   - Musiker können im Dashboard oder Profil ihr Premium-Abonnement aktivieren (simuliertes SEPA-Mandat) oder kündigen.
   - Nur verifizierte Veranstalter oder Musiker mit aktivem Abonnement sehen die echten Kontaktdaten und Social-Media-Links.
6. **Medien-Galerie**:
   - Musiker können Fotos, Videos und Audios hochladen und verwalten (Simulierter Bilder- und Audio-Uploader).

---

## Verzeichnisstruktur

```
gigmatch/
├── index.html          # HTML-Struktur der Webanwendung
├── style.css           # Premium Vanilla CSS-Designsystem (Obsidian-Dark & Glassmorphism)
├── app.js              # Gesamte App-Logik (Mock-Daten, State-Management, Matching & UI)
└── README.md           # Projektdokumentation & Test-Anleitung
```

---

## 8-Faktoren Matching-Algorithmus

Der Übereinstimmungsfaktor zwischen einem Musiker und einem Event wird anhand von 8 Kriterien berechnet (jeweils 12.5%):
1. **Typ**: Passt der Musiker-Typ (z.B. Band) zur gesuchten Kategorie des Events?
2. **Datum**: Ist der Musiker am Wochentag des Events verfügbar?
3. **Ort**: Ist der Veranstaltungsort identisch?
4. **Umkreis**: Befindet sich der Eventort innerhalb des maximalen Radius des Musikers?
5. **Genres**: Gibt es mindestens ein überschneidendes Genre?
6. **Instrumente**: Gibt es mindestens ein übereinstimmendes Instrument?
7. **Spieldauer**: Ist die geplante Dauer kleiner/gleich der maximalen Spieldauer des Musikers?
8. **Budget**: Ist das Event-Budget größer/gleich der Mindestgage des Musikers?

*Hinweis:* Sobald der Match-Faktor **über 49%** (d.h. mindestens 4 von 8 Kriterien) beträgt, erhält der Musiker/Veranstalter automatisch eine Benachrichtigung im Postfach.

---

## Starten der Anwendung

Du brauchst **keinen lokalen Server oder Build-Tools**!
1. Navigiere in das Verzeichnis: `C:\Users\vibul\.gemini\antigravity\scratch\gigmatch\`
2. Klicke doppelt auf die Datei **`index.html`** oder ziehe sie in deinen Webbrowser (z.B. Google Chrome, Microsoft Edge, Firefox).
3. Die Anwendung läuft vollständig im Browser. Alle Registrierungen, Chat-Nachrichten und Änderungen bleiben dank `localStorage` auch nach dem Neuladen der Seite erhalten.

### Zugangsdaten für die Demo-Accounts

Wir haben die App mit Testdaten vorbefüllt. Du kannst dich mit folgenden Daten einloggen:

*   **Musiker-Account (Premium)**:
    *   **E-Mail**: `contact@neonbeats.de`
    *   **Passwort**: `pass123`
*   **Veranstalter-Account (Kostenlos)**:
    *   **E-Mail**: `julia.michael.wedding2026@gmail.com`
    *   **Passwort**: `pass123`
