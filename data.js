/* Q-Fresh: assortiment (indeling en teksten van q-fresh.be) */
const I = (f) => "img/" + f;

const CATS = [
  { id: "fruit", naam: "Fruit", tekst: "Vers. Sappig. Kwaliteit.", foto: "Pink-lady-11.jpg" },
  { id: "groenten", naam: "Groenten", tekst: "Boordevol vitaminen. Vers. Lekker.", foto: "Tomaat-cherry-tros-rood.jpg" },
  { id: "noten", naam: "Noten en gedroogd fruit", tekst: "Uitgebreide keuze. Lekker. Superfoods.", foto: "noten-en-gedroogd.jpg" },
  { id: "sappen", naam: "Vruchtensappen", tekst: "Schulp. Puur sap. Ambachtelijk.", foto: "ambachtelijk.jpg" },
  { id: "kruiden", naam: "Verse kruiden", tekst: "Vers. Ruim assortiment.", foto: "kruiden/basilicum.jpg" }
];

const P = [];
const add = (cat, sub, n, img, note) => P.push({ cat, sub, n, img, note });

/* Fruit */
add("fruit", "Ananas", "Ananas", "Ananas-21.jpg");
["Boskoop-12:Boskoop", "Golden-1:Golden Delicious", "Jazz-1:Jazz", "Jonagold-1-e1448996552158:Jonagold", "Kanzi-1-e1448996429125:Kanzi", "Pink-lady-11:Pink Lady", "Royal-Gala:Royal Gala"]
  .forEach(s => { const [f, n] = s.split(":"); add("fruit", "Appelen", n, f + ".jpg"); });
add("fruit", "Banaan", "Banaan", "banaan-1.jpg");
[["g/aardbeien-bakje", "Aardbeien, bakje"], ["g/blauwe-bessen-bakje", "Blauwe bessen, bakje"], ["g/bramen-bakje", "Bramen, bakje"], ["Framboos-1", "Framboos"], ["g/frambozen-bakje", "Frambozen, bakje"], ["Rode-bessen-1", "Rode bes"]]
  .forEach(([f, n]) => add("fruit", "Bessen", n, f + ".jpg"));
[["Clementine-llusar-1", "Clementine Llusar"], ["Hey", "Clementine Hey"], ["Limoen-1", "Limoen"], ["Minneola", "Minneola"], ["Persappelsien-1", "Persappelsien"], ["Pompelmoes-Friola-1", "Pompelmoes Friola"], ["Pompelmoes-rood-1-e1449661011394", "Pompelmoes rood"], ["g/satsuma", "Satsuma"], ["g/mandarijnen", "Mandarijnen"], ["LLUSAR-2", "Llusar-sinaasappel"]]
  .forEach(([f, n]) => add("fruit", "Citrus", n, f + ".jpg"));
[["Red-globe", "Rosé druiven"], ["Witte-druiven", "Witte druiven"], ["Ribier-druif", "Blauwe druiven"]]
  .forEach(([f, n]) => add("fruit", "Druiven", n, f + ".jpg"));
[["Avocado-Hass-1", "Avocado Hass"], ["Avocado-1", "Avocado"], ["Granaatappel-1", "Granaatappel"], ["Granadilla-1", "Granadilla"], ["Litchie-11", "Litchi"], ["Mango-Avion-1", "Mango (per vliegtuig)"], ["Mango-boot-1", "Mango (per boot)"], ["Passie-1", "Passievrucht"], ["Persimon-1", "Persimon"], ["Physalis-1", "Physalis"], ["Sterfruit-1", "Sterfruit"], ["Verse-vijg-1", "Verse vijg"]]
  .forEach(([f, n]) => add("fruit", "Exoten", n, f + ".jpg"));
add("fruit", "Kiwi", "Kiwi groen", "Kiwi-1.jpg");
add("fruit", "Kiwi", "Kiwi geel", "Kiwi-Geel-1.jpg");
[["cantaloupe", "Cantaloupe"], ["galia", "Galia"], ["Gele-meloen", "Gele meloen"], ["Meloen-Caribbean", "Meloen Caribbean"], ["piel-de-sapo", "Piel de Sapo"], ["watermeloen", "Watermeloen"]]
  .forEach(([f, n]) => add("fruit", "Meloenen", n, f + ".jpg"));
add("fruit", "Peren", "Conference", "Conference-1.jpg");
add("fruit", "Peren", "Doyenné", "doyenne.jpg");
add("fruit", "Steenfruit", "Abrikoos", "Abrikoos.jpg");
add("fruit", "Steenfruit", "Kers", "Kers-1.jpg");

/* Groenten: per groep meerdere producten */
const G = (groep, items) => items.forEach(([n, f]) => add("groenten", groep, n, f.includes(".") ? f : "g/" + f + ".jpg"));
G("Aardappelen", [["Zoete aardappel", "Zoete-aardapel-1.jpg"]]);
G("Ajuin en wortelen", [["Ajuin", "ajuin"], ["Rode ajuin", "rode-ajuin"], ["Sjalot", "sjalot.jpg"], ["Wortelen", "wortelen"]]);
G("Bladgroenten", [["Kropsla", "kropsla"], ["IJsbergsla", "ijsbergsla"], ["Lollo rosso", "lollo-rosso"], ["Spinazie", "spinazie"]]);
G("Champignon en witloof", [["Champignons", "champignons"], ["Kastanjechampignons", "kastanjechampignons"], ["Witloof", "Witloof.jpg"]]);
G("Kolen en broccoli", [["Broccoli", "broccoli"], ["Bloemkool", "bloemkool"], ["Spitskool", "Spitskool.jpg"], ["Witte kool", "witte-kool"], ["Rode kool", "rode-kool"], ["Savooikool", "savooikool"], ["Chinese kool", "chinese-kool"]]);
G("Prei en selder", [["Prei", "Prei-los-e1450177852945.jpg"], ["Bleekselder", "bleekselder"], ["Knolselder", "knolselder"]]);
G("Paprika, courgette, komkommer en aubergine", [["Paprika rood", "Paprika-rood.jpg"], ["Paprika geel", "paprika-geel"], ["Paprika groen", "paprika-groen"], ["Courgette", "courgette"], ["Komkommer", "komkommer"], ["Aubergine", "aubergine"]]);
G("Bonen, erwten en spruiten", [["Spruiten", "Spruiten.jpg"], ["Sperziebonen", "sperziebonen"], ["Erwten", "erwten"], ["Peultjes", "peultjes"]]);
G("Tomaten", [["Tomaten", "Tomaat-cherry-tros-rood.jpg"]]);
G("Diversen", [["Radijs", "Radijs-1.jpg"]]);

/* Noten */
add("noten", "Noten en gedroogd fruit", "Noten en gedroogd fruit", "noten-en-gedroogd.jpg", "Uitgebreide keuze. Superfoods.");

/* Sappen (Schulp) */
[["Appel", "a-appel"], ["Appel en peer", "a-appel-peer"], ["Peer", "a-peer"], ["Appel en vlierbes", "a-appel-vlierbes"], ["Appel en aardbei", "a-appel-aardbei"], ["Appel en zwarte bes", "a-appel-zwarte-bes"]]
  .forEach(([n, f]) => add("sappen", "Schulp ambachtelijk", n, "sap/" + f + ".png", "0,2 l · 0,75 l · 5 l"));
[["Cranberry", "k-cranberry"], ["Blauwe bes", "k-blauwe-bes"], ["Tomaat", "k-tomaat"], ["Granaatappel", "k-granaatappel"], ["Rode biet", "k-rode-biet"], ["Wortel", "k-wortel"], ["Vlierbes", "k-vlierbes"], ["Kers", "k-kers"], ["Groentemix", "k-groentemix"]]
  .forEach(([n, f]) => add("sappen", "Schulp krachtsap", n, "sap/" + f + ".jpg", "Puur en ongezoet"));

/* Verse kruiden (foto's: Pexels) */
const K = (n) => "kruiden/" + n + ".jpg";
[["Basilicum", "basilicum"], ["Bieslook", "bieslook"], ["Citroengras", "citroengras"], ["Peperbollen", "peperbollen"], ["Baby leaf / mesclun", "baby-leaf"], ["Rucola", "rucola"], ["Bladpeterselie", "bladpeterselie"], ["Bloemen", "bloemen"], ["Bonekruid", "bonekruid"], ["Citronelle", "citronelle"], ["Waterkers", "waterkers"], ["Dille", "dille"], ["Dragon", "dragon"], ["Kervel", "kervel"], ["Koriander", "koriander"], ["Laurier", "laurier"], ["Marjolein", "marjolein"], ["Munt", "munt"], ["Oregano", "oregano"], ["Postelein", "postelein"], ["Rozemarijn", "rozemarijn"], ["Salie", "salie"], ["Thijm", "thijm"], ["Zurkel", "zurkel"], ["Bloedzurkel", "bloedzurkel"]]
  .forEach(([n, f]) => add("kruiden", "Kruiden", n, K(f)));
[["Hutsepot", "hutsepot"], ["Mix sla", "mix-sla"], ["Mosselgroenten", "mosselgroenten"], ["Soepgroenten", "soepgroenten"], ["Soyascheuten", "soyascheuten"], ["Wokgroenten", "wokgroenten"], ["Scheuten (rode biet, prei, asperge)", "scheuten"]]
  .forEach(([n, f]) => add("kruiden", "Gesneden groenten", n, K(f)));

P.forEach((p, i) => { p.id = i; });

const TEAM = [
  { groep: "Order Team", wie: ["Manu", "Nico", "Mathieu"], tekst: "Nemen uw bestelling aan en zorgen dat ze klaarstaat." },
  { groep: "Quality Control", wie: ["Mario", "Marnik"], tekst: "Controleren elke levering bij aankomst." },
  { groep: "Verkoop Team", wie: ["Bianca"], tekst: "Persoonlijk aanspreekpunt voor uw prijzen en aanbod." },
  { groep: "Aankoop en Verkoop", wie: ["Kris", "Bram", "Krist"], tekst: "Zoeken elke dag het beste product op de markt." },
  { groep: "Flexi Team", wie: ["Flexi Team"], tekst: "Springt bij waar het nodig is." },
  { groep: "Boekhouding", wie: ["Boekhouding"], tekst: "Facturen en betalingen." }
];
