# MoorWords – Deine Lesewiese

Browser-Lesespiel für Grundschulkinder. Kindgerechte Gegenstände schweben mit zufälligen, voneinander unabhängigen Wörtern durch eine illustrierte Wiese. Ein korrekt erkanntes, laut vorgelesenes Wort lässt den Gegenstand in Konfetti platzen.

**Online spielen:** [MoorWords öffnen](https://grafzahl.github.io/MoorWords/)

Die Website wird bei Änderungen an `main` automatisch über GitHub Actions aus `dist/` veröffentlicht. Vorher laufen Tests und Syntaxprüfungen.

**Repository:** [grafzahl/MoorWords](https://github.com/grafzahl/MoorWords) · **Version:** 0.4.0.

## Lokal starten

Unter Windows das ZIP vollständig entpacken und `Start-MoorWords.cmd` doppelklicken. Alternativ `Start-MoorWords.ps1` in PowerShell starten. Der Starter nutzt vorhandenes Node.js ab Version 20 oder lädt eine portable Node.js-24-Version von nodejs.org. Er prüft die offizielle SHA-512-Prüfsumme und legt die Laufzeit unter `%LOCALAPPDATA%\MoorWords\runtime` ab. Keine Administratorrechte und keine Änderung des systemweiten PATH nötig. Beim ersten Start ist Internet erforderlich, danach wird die gespeicherte Laufzeit verwendet. Unternehmensrichtlinien können Downloads oder PowerShell-Skripte weiterhin verhindern; der Starter verändert diese Richtlinien nicht.

Danach http://localhost:4173 öffnen und das Serverfenster offen lassen. Alternativ mit vorhandenem Node.js im Projektordner `node server.mjs` ausführen. Die Dateien in `dist/` können auf einem HTTPS-Webserver bereitgestellt werden. Kein npm-Installationsschritt erforderlich. `file://` unterstützt das Spiel wegen Modulen und Mikrofonanforderungen nicht.

## Enthalten

- 512 deutsche Übungswörter in vier getrennten Klassenstufen (Klasse 1–4, jeweils 128 Wörter).
- 60/90/120/180 Sekunden oder Üben ohne Zeitlimit, reduzierte Bewegung.
- Gemeinsame Punktebaseline: durchschnittlich rund 100 Punkte je Wort in jeder Klasse. Länge und Lesehürde ergeben Zu- oder Abschläge relativ zum Klassenmittel.
- Mittlere Wörter blau, schwere Wörter größer und golden, besonders anspruchsvolle Wörter violett, zusätzlich Punkteschild.
- Mikrofon erst nach bewusstem Start; Abschalten bei Pause, verborgenem Tab und Rundenende.
- Separater Klick-Demomodus ohne Mikrofon und ohne Rekordwertung.
- Rekorde pro Stufe, Modus, Dauer und Erkennungseinstellung im localStorage; keine Namen/Konten.
- Wortschatzhilfe je Klasse und einstellbare Wartezeit für langsam vorgelesene Wortteile.

Während einer Runde füllt das Spielfeld die verfügbare Bildschirmhöhe einschließlich Berücksichtigung der Displayränder. Auf schmalen Displays fliegen zwei, auf breiten vier Wörter. Zufällige Richtungswechsel bleiben innerhalb getrennter Flugbereiche, damit sich Wörter nicht verdecken. Die Einstellung „Ruhige Wörter“ hält sie still; Ablaufzeiten gelten weiterhin. Vergleiche Scores bei gleicher Rundenlänge und denselben Einstellungen.

## Klassenstufen und Lernziele

| Stufe | Schwerpunkt | Beispiele |
| --- | --- | --- |
| Klasse 1 · Lesestart | Vertraute Wörter und Silben | Hase, malen, rot |
| Klasse 2 · Wortforscher | Buchstabengruppen und Wortformen | Schule, Biene, Häuser |
| Klasse 3 · Wortentdecker | Zusammensetzungen und Wortbausteine | Schulhof, erzählen, gefährlich |
| Klasse 4 · Leseprofi | Anspruchsvoller Alltags- und Sachwortschatz | Verantwortung, beobachten, wahrscheinlich |

Die Auswahl ist an Grundschul-Lernzielen orientiert und eigenständig zusammengestellt. Sie ist keine amtliche bundesweite Wortliste je Klasse. Quellen, didaktische Entscheidungen und Grenzen stehen in [docs/LERNZIELE.md](docs/LERNZIELE.md). In der App zeigt „Lernziele & Wörter“ den aktuellen Schwerpunkt und alle Wörter der ausgewählten Klasse. Die vollständigen Daten stehen in `dist/words.mjs`.

Die Rekorde vorheriger Versionen werden nicht überschrieben, aber wegen der geänderten Erkennung auch nicht übernommen. Der aktuelle Entwicklungsstand verwendet `moorwords-best-reading-v4` im lokalen Browserspeicher. Wartezeit, Wortschatzhilfe und ruhige/fliegende Darstellung fließen in den Rekordschlüssel ein. Alte v3-Rekorde bleiben gespeichert.

## Lokale Spracherkennung

Vosk Browser 0.0.8 nutzt einen WebAssembly-Worker. Deutsches Modell: `vosk-model-small-de-0.15`, ca. 45 MB Download. Die Verarbeitung aller Audiodaten erfolgt im Browser. Keine Cloud-Speech-API und keine Audio-Uploads. Vosk verwaltet Modell-Caching über seinen Browser-Speicher.

Der erste Start benötigt Internet: Vosk-Code von jsDelivr, Modell von den GitHub Pages des Projekts. Google Fonts liefert die Schriftarten; Systemschriften springen ein, wenn die Schriftanfrage fehlschlägt. **Dies ist noch keine vollständig offline installierbare App.** Für strikt abgeschottete Schulnetze sollten Engine, Modell und Schriften selbst gehostet werden; dazu die URLs in `dist/speech.mjs` und `dist/style.css` ersetzen.

Die standardmäßig aktive Wortschatzhilfe übergibt Vosk den Wortpool der gewählten Klasse sowie bekannte Bestandteile zusammengesetzter Wörter. Ein `[unk]`-Eintrag erlaubt unbekannte Äußerungen, statt jedes Geräusch auf ein Übungswort festzulegen. In den Einstellungen lässt sich die Hilfe für einen Vergleich abschalten; dann nutzt Vosk seinen allgemeinen deutschen Wortschatz. Wörter, die dem Modell fehlen, werden dadurch nicht neu gelernt. Auch mit dieser Hilfe sind falsche Erkennungen möglich.

Die App hält erkannte Wortteile standardmäßig zwei Sekunden zusammen. Unter Einstellungen stehen 1,2 / 2 / 3 Sekunden zur Wahl. Geänderte Teilhypothesen verlängern das Zuhören, identisch wiederholte Teilhypothesen nicht. Ein Versuch ist auf 15 Sekunden begrenzt. Bleibt eine nicht leere Teilhypothese für die eingestellte Wartezeit unverändert, fordert die App zusätzlich mit `retrieveFinalResult()` ein endgültiges Vosk-Ergebnis an. Wiederholte identische Teilhypothesen verschieben diesen Abschluss nicht. Erst das gelieferte Endergebnis wird einschließlich seiner Wort-Konfidenzen geprüft. Normale Endergebnisse, leere Hypothesen und das Abschalten des Mikrofons löschen den ausstehenden Timer. Das ist ein zusätzlicher Abschluss durch die App; die akustische Sprechpausenerkennung des Modells bleibt unverändert.

Nur endgültige Ergebnisse zählen. Bis zu vier unmittelbar aufeinanderfolgende erkannte Teile können exakt ein ganzes Zielwort ergeben, etwa „Regen“ + „Bogen“. Jeder verbundene Teil muss mindestens zwei Zeichen und eine gelieferte Wort-Konfidenz von mindestens 0,6 haben. Unbekannte, unsichere oder dazwischenliegende Wörter werden nicht übersprungen; bekannte Audiozeitstempel begrenzen zusätzlich den Abstand. Ähnlich klingende Wörter werden nicht durch unscharfen Vergleich akzeptiert. Bei einzelnen ganzen Wörtern gilt die Konfidenzgrenze, sofern Metadaten geliefert werden. Bereits gewertete Teile werden verbraucht. Ein Versuch darf nur Wörter treffen, die bereits bei seinem Beginn sichtbar waren und noch vorhanden sind. Pause, Neustart und Rundenende löschen den Puffer.

Es gibt keinen Punktabzug. Dies ist ein Lesespiel, keine objektive Bewertung von Aussprache. Die Änderungen sind auf langsam vorgelesene Wörter ausgelegt; eine messbare Verbesserung bei Kinderstimmen, Dialekten oder Hintergrundgeräuschen ist noch nicht nachgewiesen.

Browser: moderner Desktop-Chromium empfohlen als erster Test. Safari/iPadOS nicht am realen Gerät verifiziert. Audioanbindung nutzt die von Vosk dokumentierte ScriptProcessor/AudioBuffer-Schnittstelle (deprecated, noch unterstützt); zukünftige Weiterentwicklung sollte einen AudioWorklet einsetzen. In Ruhemodus schweben Ziele nicht. In beiden Modi verschwinden Wörter nach `12 + 4 × tier + 0,5 × min(Wortlänge, 16)` Sekunden (derzeit 17–36 Sekunden), ohne Strafe. Ein Restzeitbalken zeigt den Ablauf. Schwierige Wörter bleiben länger. Der Übungsmodus hat keine Rundenzeit. Ein gemischter Vorrat enthält alle 128 Wörter der Klasse genau einmal: Auch verpasste Wörter erscheinen in derselben Runde nicht erneut. Pause/Fortsetzen erhält den Vorrat; eine neue Runde mischt neu. Nach dem letzten verschwundenen oder getroffenen Wort endet die Runde.

## Prüfen

`node --test tests/*.test.mjs` prüft Wortgrenzen, Normalisierung, Konfidenzfilter, Punkte, Wortauswahl, Lesepuffer und den Mikrofon-Lebenszyklus mit simulierten Browser-APIs. Die Syntax lässt sich mit `node --check` für jedes Modul in `dist/` prüfen. Wenn npm verfügbar ist, stehen dafür auch `npm test` und `npm run check` bereit. Es werden keine zusätzlichen Pakete benötigt.

Version 0.4.0: 42 automatisierte Tests und alle Syntaxprüfungen bestanden. Die Oberfläche wurde im Browser bei 320 × 568, 390 × 844 und 844 × 390 Pixeln geprüft, einschließlich Demo-Treffer und Pause/Fortsetzen. Echter Mikrofoneingang, Modelldownload und Erkennungsqualität der Wortschatzhilfe wurden nicht praktisch verifiziert. Der Quellcode ist im oben verlinkten GitHub-Repository verfügbar. Die gehostete Spielversion ist unter https://grafzahl.github.io/MoorWords/ verfügbar.

Manueller Test: Mikrofon erlauben, Ladeabschluss abwarten, sichtbares Wort sprechen, Pause lassen. Ein Treffer zählt einmal. Falsches Wort darf nicht treffen. Pause/Tabwechsel beendet Mikrofonzugriff; Fortsetzen fordert es erneut an. Verweigerte Berechtigung zeigt Hilfe; Demo bleibt verwendbar. Demo-Rekord bleibt unverändert. Kleinen Bildschirm und Tastaturbedienung prüfen. Zusätzlich in Klasse 3 ein sichtbares „Regenbogen“ als „Regen … Bogen“ lesen, erst mit kurzer und dann mit längerer Pause. Die Einstellung „Geduldig – 3 Sekunden“ mit dem Standard vergleichen. Falsche Wörter und Hintergrundgespräche testen, danach Wortschatzhilfe ausschalten und dieselben Versuche wiederholen. Die automatische Testsuite simuliert Text-Ergebnisse; sie ersetzt diesen Audiotest nicht.

## Quellen und Lizenzen

- https://github.com/ccoreilly/vosk-browser – Apache 2.0.
- https://alphacephei.com/vosk/models – deutsches Kleinmodell, Apache 2.0.
- https://fonts.google.com/specimen/Nunito und https://fonts.google.com/specimen/DM+Sans – Open Font License.
- Landschaft und Gestaltung sind im Projekt als SVG/CSS erstellt. Gegenstände sind System-Emoji, deren Darstellung vom Gerät abhängt.

Keine Bibliotheken oder Sprachmodelle werden im Quellarchiv mitgeliefert; sie werden zur Laufzeit von den genannten Quellen geladen.
