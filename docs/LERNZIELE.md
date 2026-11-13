# Lernziele und Wortauswahl

Der aktuelle Entwicklungsstand enthält vier getrennte Wortpools mit jeweils 128 Wörtern. Die Klasse wird frei gewählt; entscheidend ist der individuelle Lesestand. Die Zuordnung ist eine eigenständige didaktische Arbeitshypothese und keine amtliche, für alle deutschen Schulen verbindliche Klassenwortliste. Eine fachliche Erprobung durch Grundschullehrkräfte steht aus.

## Fachlicher Bezug

Die KMK-Bildungsstandards Deutsch (2022), Abschnitt 4.3, beschreiben am Ende des Primarbereichs sicheres Wiedererkennen häufiger Wörter sowie das Erlesen unvertrauter Wörter mithilfe von Silben und Wortbausteinen. Abschnitt 4.5 bezieht Wortbildung und unterschiedliche Wortarten ein. Diese Ziele begründen die Entwicklung vom vertrauten Wort zu Zusammensetzungen und anspruchsvollerem Wortschatz. Sie legen keine vier einzelnen Klassenwortlisten fest.

Der Bildungsserver Sachsen-Anhalt beschreibt die Kompetenzziele des seit August 2026 geltenden Lehrplans für das Ende der Schuleingangsphase und das Ende der Klasse 4. Der dort eingebundene Grundwortschatz war in der verfügbaren Textansicht nicht direkt auslesbar. Daher wird ausdrücklich keine vollständige Übereinstimmung einzelner Wörter mit dieser Liste behauptet.

Ergänzend dient die offizielle ZSL-Erläuterung zum Grundwortschatz Baden-Württemberg als Orientierung für die Progression in den Gruppen 1/2 und 3/4. Es handelt sich um Rechtschreibmaterial: Die Übertragung seiner Wortmerkmale auf ein Vorlesespiel ist eine eigene didaktische Entscheidung. Die Listen wurden nicht vollständig übernommen.

## Umsetzung im Spiel

| Klasse | Schwerpunkt der eigenen Auswahl | Beispiele |
| --- | --- | --- |
| 1 – Lesestart | Vertraute Wörter erkennen, Laute verbinden und einfache Silben erlesen; häufige Tätigkeits- und Eigenschaftswörter | Hase, malen, rot |
| 2 – Wortforscher | Mehrgliedrige Grapheme, Konsonantenfolgen, Vokalmuster, Umlaute und Wortformen erlesen | Schule, Biene, Häuser |
| 3 – Wortentdecker | Zusammensetzungen gliedern, Vor- und Nachsilben sowie Wortstämme nutzen; Alltagswortschatz erweitern | Schulhof, erzählen, gefährlich |
| 4 – Leseprofi | Längere und weniger vertraute Wörter, abstrakte Begriffe, Sach- und Arbeitswortschatz erlesen | Verantwortung, beobachten, wahrscheinlich |

Die Klassenpools sind getrennt. In Klasse 4 erscheinen keine zufällig beigemischten Wörter aus Klasse 1. Eine Wiederholung erfolgt durch bewusste Wahl einer anderen Klasse. Innerhalb jeder Klasse gibt es unterschiedlich hohe Lesehürden. Wortlänge allein entscheidet nicht über den Klassenbezug.

Jedes Wort hat in `dist/words.mjs` die Felder `text`, `grade`, `tier` und `focus`. `grade` bestimmt den Wortpool. `tier` ist eine redaktionelle Einschätzung der Lesehürde (1–4), keine standardisierte Messung; sie steuert Farbe, Schriftgröße und Punkte. `focus` dokumentiert den Schwerpunkt. Das Spiel vergibt `round(100 + Schwierigkeit(Wort) − mittlere Schwierigkeit(Klasse))` Punkte; Schwierigkeit = `2 × Buchstabenanzahl + 10 × (tier − 1)`. Dadurch liegt jede Klasse im Mittel bei rund 100 Punkten pro Wort. Das macht Spielwerte ähnlicher, ist aber keine pädagogische Normierung der Leseleistung.

Die Auswahl deckt Übungsbeispiele ab, nicht den vollständigen Grundwortschatz. Einzelne schwierige Wörter der Klasse 1 setzen bereits erarbeitete Buchstaben voraus. Für den allerersten Lesestart wäre zusätzlich ein Filter nach bekannten Buchstaben sinnvoll.

## Grenzen

Das Spiel übt isoliertes Wortlesen. Es überprüft weder Wortbedeutungen noch Satz- und Textverständnis, Rechtschreibung, Betonung oder eine fehlerfreie Aussprache. Die automatische Spracherkennung kann besonders bei Kinderstimmen und seltenen Wörtern Fehler machen. Punkte sind Spielwerte und keine Schulnoten. Die neue Wortauswahl wurde noch nicht mit Kinderstimmen erprobt.

## Quellen

- [KMK: Bildungsstandards Deutsch Primarbereich, 23.06.2022](https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-Primarbereich-Deutsch.pdf), insbesondere Abschnitte 4.3 und 4.5.
- [Bildungsserver Sachsen-Anhalt: Lehrplan Grundschule](https://www.bildung-lsa.de/informationsportal/unterricht/grundschule/schulformbezogene_informationen/lehrplan.html), Einführung und Kompetenzstufen.
- [ZSL Baden-Württemberg: Grundwortschatz Deutsch Grundschule](https://zsl-bw.de/,Lde/Startseite/allgemein-bildende-schulen/grundwortschatz-deutsch-gs), Erläuterungen für Klassen 1/2 und 3/4.

Recherche: 11.11.2026. Wortlisten und Klassenzuordnung wurden für MoorWords neu zusammengestellt.
