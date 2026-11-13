# Änderungen

## 0.4.0 · 13.11.2026

- 128 Wörter pro Klassenstufe (512 insgesamt), weiterhin vier Lernschwerpunkte je Klasse. Gemischter Rundenvorrat ohne Wiederholung, auch bei verpassten Wörtern; neue Runde mischt neu.
- Klassenbezogene Punktebaseline von durchschnittlich rund 100 Punkten pro Wort. Neue Rekordablage v4, nach Bewegungseinstellung getrennt; alte Rekorde bleiben erhalten.
- Mobile Spielansicht mit voller verfügbarer Höhe, Displayrand-Abständen, großen Bedienelementen, zwei Zielen im Hochformat und angepasstem Querformat. Lange Wörter werden bei Bedarf verkleinert.
- Zufällige Flugrichtungen und Richtungswechsel, Begrenzung am Spielfeldrand, Ablaufzeit nach Lesehürde und Wortlänge samt Restzeitbalken. Ablauf gilt auch im Übungsmodus; Pausieren hält Bewegung und Zeit an.
- Bleibt eine vorläufige Spracherkennung für die eingestellte Wartezeit unverändert, fordert die App jetzt ein endgültiges Vosk-Ergebnis an. Dadurch wartet die Trefferwertung nicht unbegrenzt auf den automatischen Abschluss.
- Konfidenzprüfung und exakte Wortzuordnung bleiben erhalten; vorläufiger Text allein gibt weiterhin keine Punkte. Pause und Neustart löschen ausstehende Abschlussanforderungen.
- Fünf zusätzliche Regressionstests für verzögerte Ergebnisse, wechselnde Hypothesen, normale Abschlüsse und Stop/Neustart; zusammen mit den Spieltests insgesamt 42 Tests bestanden. Android-/iOS-Audiotest steht noch aus.

## 0.3.0

- Lokale Wortschatzhilfe für die gewählte Klasse, bekannte Wortbestandteile und unbekannte Äußerungen; für Vergleichstests abschaltbar.
- Ergebnispuffer mit 1,2 / 2 / 3 Sekunden Wartezeit, Standard 2 Sekunden. Er verlängert nicht das akustische Endpunktverhalten von Vosk.
- Exaktes Zusammenfügen aufeinanderfolgender, sicher erkannter Wortteile; keine unscharfen Worttreffer, keine mehrfach gewerteten Teile oder Treffer auf nachträglich erschienene Ziele.
- Geduldigere Rückmeldung bei laufenden Leseversuchen; Teilhypothesen geben weiterhin keine Punkte.
- Separate Rekorde nach Erkennungseinstellungen, bestehende Rekorde bleiben gespeichert.
- 32 automatisierte Tests und Syntaxprüfungen bestanden. Reale Erkennungsqualität und Browserdarstellung noch nicht praktisch geprüft.

## 0.2.0

- Vier Klassenstufen mit jeweils 64 eigenen Übungswörtern (256 insgesamt).
- Lernziel und Wortbeispiele direkt im Spiel; vollständige Wortliste je Klasse einsehbar.
- Unterschiedliche Wortarten und Lesehürden; neue violette Hervorhebung für besonders anspruchsvolle Wörter.
- Neue, getrennte Rekorde: Die alten Rekorde bleiben im Browser erhalten, werden wegen der veränderten Wortpools aber nicht mit den neuen Klassenrekorden vermischt.
- Quellen und Grenzen der didaktischen Zuordnung in `docs/LERNZIELE.md` dokumentiert.
- Windows-Starter lädt fehlendes Node.js portabel mit SHA-256-Prüfung; Start per `.cmd` möglich.

## 0.1.0

- Erste Lesewiese mit lokal angebundener Vosk-Spracherkennung, 64 Wörtern, Zeit- und Übungsmodus sowie Klick-Demo.
