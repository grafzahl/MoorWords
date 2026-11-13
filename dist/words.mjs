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
  [1,1,'Vertraute kurze Wörter','Mama Papa Oma Opa Hut Ball Haus Maus Baum Eis Brot Buch Boot Mond Hand Hund Arm Bein Ohr Mund Kopf Haar Zahn Bauch Fuß Tor Bus Zug Rad Seil Topf Glas'],
  [1,1,'Silben verbinden','Hase Nase Rose Hose Dose Sofa Lama Limo Melone Banane Tomate Salat Regen Rabe Lupe Tafel Ente Eule Igel Affe Löwe Bär Huhn Hahn Esel Rakete Paket Kamel Koala Kiwi Ananas Ufo'],
  [1,2,'Häufige Tätigkeitswörter lesen','malen lesen rufen reden sagen holen legen leben geben baden haben hören sehen laufen essen lernen suchen finden machen weinen trinken kochen bauen putzen tanzen winken zeigen fragen tragen schlafen kaufen teilen'],
  [1,1,'Eigenschaftswörter wiedererkennen','rot rosa lila blau grün gelb gut neu alt warm kalt laut leise klein fein lieb groß rund bunt weich hart nass trocken müde wach satt fit nett brav hell dunkel süß'],

  [2,2,'Buchstabengruppen und Konsonantenfolgen','Schule Schere Schuh Tasche Fisch Frosch Tisch Milch Stern Stuhl Blume Wolke Kirsche Kirche Woche Drache Schlange Schnecke Schwein Specht Storch Strumpf Strand Knopf Krone Treppe Brille Flasche Bürste Pilz Zwerg Pferd'],
  [2,2,'Lange Vokale und häufige Schreibmuster','Biene Wiese Brief Tier Spiel sieben fliegen spielen lieben tief fahren fühlen zählen wohnen früh schön Ziege Fliege Schiene Zwiebel Spiegel Stiefel Riese Biber Tiger Ofen Honig ziehen schieben liegen wiegen blühen'],
  [2,2,'Kurze Vokale und Wortmuster','Sonne Wasser Teller Bett Puppe Tasse Klasse Kissen Katze backen packen sitzen rennen schwimmen lachen Mutter Butter Suppe Wolle Wanne Koffer Hammer Zimmer Löffel Schlüssel Nuss Kamm Rock Jacke rollen klettern treffen'],
  [2,3,'Wortformen, Umlaute und Endungen','Kinder Hunde Hände Bäume Häuser Bücher Mäuse Äpfel größer fröhlich freundlich fleißig traurig lustig langsam schnell Füße Zähne Vögel Züge Stühle Bälle Nächte Gärten Röcke Körbe dünn kräftig hungrig durstig sauber schmutzig'],

  [3,3,'Zusammengesetzte Wörter gliedern','Haustür Schulhof Fußball Apfelbaum Regenbogen Schneemann Zahnbürste Fahrrad Sandkasten Spielplatz Haustier Blumenbeet Baumhaus Turnhalle Geburtstag Frühstück Bilderbuch Schultasche Brotdose Trinkflasche Buntstift Federmappe Bushaltestelle Spielzeug Wohnzimmer Badezimmer Handtuch Bettdecke Kirschbaum Vogelhaus Schneeball Sommerferien'],
  [3,3,'Verben mit Vor- und Nachsilben','erzählen erklären besuchen verkaufen einkaufen aufräumen mitbringen abholen vorlesen zuhören aufpassen entdecken verlieren vergessen gewinnen sammeln anfangen anziehen ausziehen einladen auspacken einpacken ausmalen nachdenken nachfragen mitmachen einschlafen aufwachen weglaufen zurückkommen vorbereiten wiederholen'],
  [3,3,'Wortstämme und Wortbausteine erkennen','gefährlich glücklich ehrlich hoffentlich plötzlich vorsichtig fleißiger freundlicher mutiger schöner Sänger Bäcker Lehrerin Lehrling Liebling Einladung dankbar wunderbar lesbar essbar sonnig windig neblig regnerisch friedlich sportlich neugierig ärgerlich Geduld Freude Hoffnung Bewegung'],
  [3,2,'Erweiterter Alltagswortschatz','Ferien Familie Reise Gesundheit Frühling Sommer Herbst Winter Kalender Minute Stunde Norden Süden Osten Westen morgen Abenteuer Ausflug Bahnhof Flughafen Verkehr Unterricht Pause Aufgabe Lösung Nachricht Werkzeug Material Richtung Entfernung gestern heute'],

  [4,4,'Längere Zusammensetzungen erschließen','Sonnenblume Schmetterling Eichhörnchen Marienkäfer Klassenzimmer Wörterbuch Bücherei Fahrradhelm Straßenverkehr Umweltschutz Wasserkreislauf Pflanzenwelt Jahreszeiten Himmelsrichtung Experiment Thermometer Feuerwehr Rettungswagen Krankenwagen Fußgängerüberweg Verkehrsschild Geburtstagskuchen Schulgemeinschaft Klassensprecher Naturwissenschaft Niederschlag Luftfeuchtigkeit Verdunstung Stromkreislauf Nahrungsmittel Gleichgewicht Magnetismus'],
  [4,4,'Abstrakte Begriffe und Ableitungen lesen','Verantwortung Freundschaft Gemeinschaft Gerechtigkeit Freiheit Sicherheit Unterschied Möglichkeit Schwierigkeit Entscheidung Entschuldigung Erinnerung Vorstellung Überraschung Verhältnis Ergebnis Zusammenarbeit Hilfsbereitschaft Rücksichtnahme Selbstvertrauen Begeisterung Enttäuschung Zufriedenheit Dankbarkeit Zuversicht Aufmerksamkeit Konzentration Ausdauer Fähigkeit Eigenschaft Voraussetzung Zusammenhang'],
  [4,3,'Sach- und Arbeitswortschatz lesen','beobachten vergleichen beschreiben begründen untersuchen vermuten überprüfen ordnen unterscheiden entwickeln verändern zusammenfassen vereinbaren unterstützen schützen dokumentieren präsentieren recherchieren analysieren strukturieren formulieren argumentieren diskutieren reflektieren kontrollieren korrigieren organisieren protokollieren berechnen zuordnen veranschaulichen vervollständigen'],
  [4,4,'Anspruchsvolle Eigenschafts- und Verknüpfungswörter','wahrscheinlich möglicherweise unterschiedlich außergewöhnlich zuverlässig selbstständig notwendig vollständig wesentlich regelmäßig schließlich trotzdem deshalb obwohl während außerdem selbstverständlich verantwortungsbewusst umweltfreundlich rücksichtsvoll hilfsbereit abwechslungsreich geheimnisvoll wissenschaftlich verständlich unverständlich unabhängig gemeinsam inzwischen dennoch allerdings deswegen']
];
export const WORDS = Object.freeze(groups.flatMap(([grade,tier,focus,words])=>words.split(' ').map(text=>Object.freeze({text,grade,tier,focus}))));
