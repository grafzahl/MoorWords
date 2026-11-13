# Entwicklung und Bereitstellung

Als zentrale Quelle ist [grafzahl/MoorWords](https://github.com/grafzahl/MoorWords), Hauptbranch `main`, vorgesehen. Der verbundene GitHub-Account ist `grafzahl`. Das Repository wurde vom Eigentümer öffentlich angelegt; diese Sichtbarkeit wird ohne ausdrücklichen Auftrag nicht verändert. Version 0.3.0 ist als erster Projektstand auf GitHub verfügbar.

Das Repository umfasst:

- `dist/` mit der Browser-App und Wortdaten
- `tests/` mit automatisierten Prüfungen
- `docs/` mit Lernzielen und Entwicklungsablauf
- `README.md`, `CHANGELOG.md`, `package.json`, `server.mjs`
- `Start-MoorWords.ps1`, `Start-MoorWords.cmd`, `.gitignore`

Lokale Git-Metadaten, die nicht verwendete Sites-Konfiguration `.openai/`, Laufzeiten, Sprachmodelle, Downloads und persönliche Dateien gehören nicht in dieses Repository. Änderungen werden vor dem Upload mit passenden Tests und den Syntaxprüfungen aus `package.json` geprüft. Die vollständige Testsuite läuft mit `node --test tests/*.test.mjs`. Der aktuelle Stand ist 0.4.1. Die Erkennungslogik steht in `dist/reading.mjs`; ihre Tests simulieren Erkennungsergebnisse und prüfen keine Audioqualität. Vor einem Einsatz mit Kindern die in der README beschriebenen Mikrofon-Vergleichstests durchführen.

Für weitere Änderungen das vorhandene Repository verwenden und dessen aktuellen Stand zuerst lesen. Wortpools bleiben nach Klasse 1–4 getrennt; Lernziele und Wortauswahl in `docs/LERNZIELE.md` nachvollziehbar halten. Änderungen an Klassenpools oder Punktewertung müssen den Umgang mit bestehenden Rekorden berücksichtigen.

GitHub Actions veröffentlicht Änderungen an `main` nach Tests und Syntaxprüfungen automatisch aus `dist/` auf https://grafzahl.github.io/MoorWords/. Der Workflow `.github/workflows/pages.yml` gehört zum Repository.
