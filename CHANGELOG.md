# Änderungen

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
