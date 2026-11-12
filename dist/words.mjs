// Eigenständig kuratierte Übungswörter, keine amtliche Klassenwortliste.
// Lehrplanbezug und Grenzen: docs/LERNZIELE.md.
export const GRADES = Object.freeze([
  {id:1, name:'Lesestart', icon:'🌱', goal:'Laute verbinden und vertraute Wörter in Silben lesen.', examples:['Hase','malen','rot']},
  {id:2, name:'Wortforscher', icon:'🌿', goal:'Buchstabengruppen und häufige Wortformen sicher lesen.', examples:['Schule','Biene','Häuser']},
  {id:3, name:'Wortentdecker', icon:'🌳', goal:'Zusammengesetzte Wörter und Wortbausteine erschließen.', examples:['Schulhof','erzählen','gefährlich']},
  {id:4, name:'Leseprofi', icon:'🌟', goal:'Anspruchsvolle Alltags- und Sachwörter flüssig lesen.', examples:['Verantwortung','beobachten','wahrscheinlich']}
]);

// grade = Wortpool der gewählten Klasse; tier = Lesehürde für Farbe und Punkte.
// Eine Klassenstufe enthält bewusst mehrere Hürden, nicht nur lange Nomen.
const groups = [
  [1,1,'Vertraute kurze Wörter','Mama Papa Oma Opa Hut Ball Haus Maus Baum Eis Brot Buch Boot Mond Hand Hund'],
  [1,1,'Silben verbinden','Hase Nase Rose Hose Dose Sofa Lama Limo Melone Banane Tomate Salat Regen Rabe Lupe Tafel'],
  [1,2,'Häufige Tätigkeitswörter lesen','malen lesen rufen reden sagen holen legen leben geben baden haben hören sehen laufen essen lernen'],
  [1,1,'Eigenschaftswörter wiedererkennen','rot rosa lila blau grün gelb gut neu alt warm kalt laut leise klein fein lieb'],

  [2,2,'Buchstabengruppen und Konsonantenfolgen','Schule Schere Schuh Tasche Fisch Frosch Tisch Milch Stern Stuhl Blume Wolke Kirsche Kirche Woche Drache'],
  [2,2,'Lange Vokale und häufige Schreibmuster','Biene Wiese Brief Tier Spiel sieben fliegen spielen lieben tief fahren fühlen zählen wohnen früh schön'],
  [2,2,'Kurze Vokale und Wortmuster','Sonne Wasser Teller Bett Puppe Tasse Klasse Kissen Katze backen packen sitzen rennen schwimmen lachen Mutter'],
  [2,3,'Wortformen, Umlaute und Endungen','Kinder Hunde Hände Bäume Häuser Bücher Mäuse Äpfel größer fröhlich freundlich fleißig traurig lustig langsam schnell'],

  [3,3,'Zusammengesetzte Wörter gliedern','Haustür Schulhof Fußball Apfelbaum Regenbogen Schneemann Zahnbürste Fahrrad Sandkasten Spielplatz Haustier Blumenbeet Baumhaus Turnhalle Geburtstag Frühstück'],
  [3,3,'Verben mit Vor- und Nachsilben','erzählen erklären besuchen verkaufen einkaufen aufräumen mitbringen abholen vorlesen zuhören aufpassen entdecken verlieren vergessen gewinnen sammeln'],
  [3,3,'Wortstämme und Wortbausteine erkennen','gefährlich glücklich ehrlich hoffentlich plötzlich vorsichtig fleißiger freundlicher mutiger schöner Sänger Bäcker Lehrerin Lehrling Liebling Einladung'],
  [3,2,'Erweiterter Alltagswortschatz','Ferien Familie Reise Gesundheit Frühling Sommer Herbst Winter Kalender Minute Stunde Norden Süden Osten Westen morgen'],

  [4,4,'Längere Zusammensetzungen erschließen','Sonnenblume Schmetterling Eichhörnchen Marienkäfer Klassenzimmer Wörterbuch Bücherei Fahrradhelm Straßenverkehr Umweltschutz Wasserkreislauf Pflanzenwelt Jahreszeiten Himmelsrichtung Experiment Thermometer'],
  [4,4,'Abstrakte Begriffe und Ableitungen lesen','Verantwortung Freundschaft Gemeinschaft Gerechtigkeit Freiheit Sicherheit Unterschied Möglichkeit Schwierigkeit Entscheidung Entschuldigung Erinnerung Vorstellung Überraschung Verhältnis Ergebnis'],
  [4,3,'Sach- und Arbeitswortschatz lesen','beobachten vergleichen beschreiben begründen untersuchen vermuten überprüfen ordnen unterscheiden entwickeln verändern zusammenfassen vereinbaren unterstützen schützen dokumentieren'],
  [4,4,'Anspruchsvolle Eigenschafts- und Verknüpfungswörter','wahrscheinlich möglicherweise unterschiedlich außergewöhnlich zuverlässig selbstständig notwendig vollständig wesentlich regelmäßig schließlich trotzdem deshalb obwohl während außerdem']
];
export const WORDS = Object.freeze(groups.flatMap(([grade,tier,focus,words])=>words.split(' ').map(text=>Object.freeze({text,grade,tier,focus}))));
