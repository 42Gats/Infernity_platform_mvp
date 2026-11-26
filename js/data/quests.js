// --- TOUTES LES QUÊTES OFFICIELLES ---
window.ALL_QUESTS = [
    // ─── EXPLORATION ───
    { id: "EXP-01", name: "Premiers pas dans les abîmes", type: "Exploration", diff: "Facile", reward: 5, desc: "Atteindre le troisième nœud du premier étage." },
    { id: "EXP-02", name: "Marcheur des embranchements", type: "Exploration", diff: "Facile", reward: 5, desc: "Choisir et traverser au moins 3 bifurcations distinctes au cours du premier étage." },
    { id: "EXP-03", name: "Gros dormeur", type: "Exploration", diff: "Facile", reward: 5, desc: "Interagir avec au moins 2 salles de repos différentes avant d'atteindre le boss de l'étage 2." },
    { id: "EXP-04", name: "Pèlerinage des sentiers", type: "Exploration", diff: "Facile", reward: 5, desc: "Atteindre le nœud 6 du premier étage en suivant une ligne de progression continue." },
    { id: "EXP-05", name: "Explorateur vigilant", type: "Exploration", diff: "Moyenne", reward: 10, desc: "Visiter 5 salles différentes aux étages 3 ou 4 sans subir de dégâts." },
    { id: "EXP-06", name: "Cap sur le deuxième niveau", type: "Exploration", diff: "Moyenne", reward: 10, desc: "Vaincre le boss du premier étage et pénétrer dans le quatrième étage." },
    { id: "EXP-07", name: "Arpenteur de bifurcations", type: "Exploration", diff: "Moyenne", reward: 10, desc: "Emprunter tous les types de salles intermédiaires (combat, repos, mystère, défis) au cours des six premiers étages." },
    { id: "EXP-08", name: "Pèlerin des profondeurs", type: "Exploration", diff: "Difficile", reward: 15, desc: "Atteindre le septième étage du donjon." },
    { id: "EXP-09", name: "Maître arpenteur", type: "Exploration", diff: "Difficile", reward: 15, desc: "Atteindre le neuvième étage du donjon." },
    { id: "EXP-10", name: "L'abysse lointain", type: "Exploration", diff: "Difficile", reward: 15, desc: "Atteindre le dixième étage et affronter le boss final." },

    // ─── COMBAT ───
    { id: "COM-01", name: "Épreuve de force initiale", type: "Combat", diff: "Facile", reward: 5, desc: "Vaincre 3 salles de combat distinctes au premier étage sans utiliser de repos court." },
    { id: "COM-02", name: "Chasse aux monstres", type: "Combat", diff: "Facile", reward: 5, desc: "Vaincre au moins 8 créatures hostiles au total au cours du premier étage." },
    { id: "COM-03", name: "Premières armes de boss", type: "Combat", diff: "Facile", reward: 5, desc: "Vaincre le boss du premier étage." },
    { id: "COM-04", name: "Frappe chirurgicale", type: "Combat", diff: "Moyenne", reward: 10, desc: "Vaincre un monstre d'élite aux étages 3 ou 4 en moins de 2 rounds de combat." },
    { id: "COM-05", name: "Vigilance martiale", type: "Combat", diff: "Moyenne", reward: 10, desc: "Terminer un combat de salle aux étages 5 ou 6 sans qu'aucun personnage ne subisse d'attaque critique." },
    { id: "COM-06", name: "Nettoyage méthodique", type: "Combat", diff: "Moyenne", reward: 10, desc: "Vaincre le boss de l'étage 6 après avoir traversé au moins 3 salles de combat sur ce même étage." },
    { id: "COM-07", name: "Duel sans faille", type: "Combat", diff: "Difficile", reward: 15, desc: "Vaincre un boss d'étage (étages 7 à 9) sans qu'aucun personnage du groupe ne devienne gravement blessé (0 PV) pendant l'affrontement." },
    { id: "COM-08", name: "Économie de guerre", type: "Combat", diff: "Difficile", reward: 15, desc: "Vaincre le boss de l'étage 8 en ayant conservé au moins un emplacement de sort de niveau 3 ou plus (ou une aptitude majeure de classe équivalente) non dépensé par chaque lanceur de sorts du groupe." },
    { id: "COM-09", name: "Briseur d'élites", type: "Combat", diff: "Difficile", reward: 15, desc: "Vaincre 2 salles de combat classées comme « Difficiles » ou plus entre l'étage 7 et l'étage 9." },
    { id: "COM-10", name: "Exécution sans appel", type: "Combat", diff: "Difficile", reward: 15, desc: "Vaincre le boss final de l'étage 10 en moins de 4 rounds de combat." },

    // ─── DÉFIS DE PARCOURS ───
    { id: "PAR-01", name: "Détour pacifique", type: "Défis", diff: "Facile", reward: 5, desc: "Atteindre le boss de l'étage en évitant au moins une salle de combat grâce à un choix de bifurcation alternative." },
    { id: "PAR-02", name: "Marche forcée", type: "Défis", diff: "Facile", reward: 5, desc: "Atteindre l'étage 2 en n'ayant visité aucune salle mystère (uniquement des salles de combat, exploration ou repos)." },
    { id: "PAR-03", name: "Trajet direct", type: "Défis", diff: "Facile", reward: 5, desc: "Atteindre le boss de l'étage en visitant exactement le nombre minimal de salles requis (parcours le plus court de 10 nœuds)." },
    { id: "PAR-04", name: "Ascète des repos", type: "Défis", diff: "Moyenne", reward: 10, desc: "Atteindre le quatrième étage sans jamais être entré dans une salle de repos ou sanctuaire de récupération." },
    { id: "PAR-05", name: "Évitement tactique", type: "Défis", diff: "Moyenne", reward: 10, desc: "Atteindre le boss de l'étage 5 sans entrer dans aucune salle de combat intermédiaire (uniquement salles de mystère, exploration ou repos)." },
    { id: "PAR-06", name: "Sans filet ni raccourci", type: "Défis", diff: "Moyenne", reward: 10, desc: "Atteindre le septième étage sans utiliser de raccourci d'étage ou de portail de téléportation majeur." },
    { id: "PAR-07", name: "Le chemin des braves", type: "Défis", diff: "Difficile", reward: 15, desc: "Atteindre le boss du septième étage sans avoir visité la moindre salle de repos depuis le début de la run." },
    { id: "PAR-08", name: "Itinéraire de l'ombre", type: "Défis", diff: "Difficile", reward: 15, desc: "Atteindre l'étage 8 en n'ayant emprunté que des salles cataloguées comme mystérieuses ou dangereuses, sans jamais choisir de salle de repos." },
    { id: "PAR-09", name: "L'odyssée pure", type: "Défis", diff: "Difficile", reward: 15, desc: "Atteindre l'étage 9 sans utiliser aucune salle de résurrection ou de sanctuaire de soins majeurs." },
    { id: "PAR-10", name: "Course contre le destin", type: "Défis", diff: "Difficile", reward: 15, desc: "Atteindre le dixième étage en ayant totalisé au plus 55 salles explorées au total depuis le début de la run." },

    // ─── BUTIN ET RÉCOMPENSES ───
    { id: "BUT-01", name: "Collectionneur débutant", type: "Butin", diff: "Facile", reward: 5, desc: "Posséder au moins 3 artefacts différents simultanément dans l'inventaire du groupe." },
    { id: "BUT-02", name: "Chasse au coffre", type: "Butin", diff: "Facile", reward: 5, desc: "Obtenir le contenu de 3 coffres ou récompenses de fin de salle mystère." },
    { id: "BUT-03", name: "Magie de l'artisan", type: "Butin", diff: "Facile", reward: 5, desc: "Obtenir au moins un artefact de rareté « Peu commune » avant la fin de l'étage 3." },
    { id: "BUT-04", name: "Mains pleines", type: "Butin", diff: "Moyenne", reward: 10, desc: "Posséder au moins 6 artefacts différents simultanément dans l'inventaire du groupe." },
    { id: "BUT-05", name: "Relique remarquable", type: "Butin", diff: "Moyenne", reward: 10, desc: "Obtenir un artefact de rareté « Rare » au cours des sept premiers étages." },
    { id: "BUT-06", name: "Spécialiste d'arsenal", type: "Butin", diff: "Moyenne", reward: 10, desc: "Équiper au moins 3 artefacts de catégorie « Offensif » ou « Magique » en même temps sur un même personnage." },
    { id: "BUT-07", name: "La quête du légendaire", type: "Butin", diff: "Difficile", reward: 15, desc: "Trouver et lier un artefact de rareté « Légendaire » avant d'atteindre l'étage 9." },
    { id: "BUT-08", name: "L'amas d'artefacts", type: "Butin", diff: "Difficile", reward: 15, desc: "Posséder un total cumulé d'au moins 10 artefacts actifs répartis dans le groupe au moment d'atteindre l'étage 8." },
    { id: "BUT-09", name: "Trésor des abîmes", type: "Butin", diff: "Difficile", reward: 15, desc: "Obtenir au moins deux artefacts de rareté « Rare » ou supérieure entre l'étage 8 et l'étage 10." },
    { id: "BUT-10", name: "Le coffre de l'étage 10", type: "Butin", diff: "Difficile", reward: 15, desc: "Récupérer le contenu d'un coffre ou d'une relique cachée au dixième étage juste avant le combat contre le boss final." },

    // ─── DÉCOUVERTE ET NARRATION ───
    { id: "NAR-01", name: "Premier indice", type: "Narration", diff: "Facile", reward: 5, desc: "Découvrir au moins un indice narratif ou une stèle ancienne dans le donjon." },
    { id: "NAR-02", name: "L'oreille aux guichets", type: "Narration", diff: "Facile", reward: 5, desc: "Interagir avec succès lors d'une rencontre narrative ou d'un PNJ errant dans les trois premiers étages." },
    { id: "NAR-03", name: "Esprit perspicace", type: "Narration", diff: "Facile", reward: 5, desc: "Réussir un test de caractéristique en Investigation ou Perspicacité d'une DD de 13 ou plus dans une salle narrative." },
    { id: "NAR-04", name: "Archiviste des cryptes", type: "Narration", diff: "Moyenne", reward: 10, desc: "Découvrir au moins 3 indices textuels ou pages de grimoire ancien liés à l'histoire du donjon." },
    { id: "NAR-05", name: "Langue de diplomate", type: "Narration", diff: "Moyenne", reward: 10, desc: "Résoudre pacifiquement ou par la négociation une rencontre ou une énigme dans une salle narrative entre les étages 5 et 7." },
    { id: "NAR-06", name: "Secrets enfouis", type: "Narration", diff: "Moyenne", reward: 10, desc: "Identifier correctement un piège complexe ou un secret dissimulé grâce à un test d'Intelligence (Investigation) ou de Sagesse (Perception) réussi à l'étage 6 ou plus." },
    { id: "NAR-07", name: "Le mystère des origines", type: "Narration", diff: "Difficile", reward: 15, desc: "Rassembler l'intégralité des indices narratifs majeurs d'un arc thématique du donjon (au moins 5 stèles ou fresques spécifiques examinées)." },
    { id: "NAR-08", name: "Sage érudit", type: "Narration", diff: "Difficile", reward: 15, desc: "Réussir trois tests de compétences liés au savoir (Arcanes, Histoire, Nature ou Religion) avec un DD de 15 ou plus au cours de la même run." },
    { id: "NAR-09", name: "Le pacte des profondeurs", type: "Narration", diff: "Difficile", reward: 15, desc: "Accomplir une interaction narrative complexe de niveau « Difficile » impliquant un choix moral ou un sacrifice de ressources sans déclencher de combat à l'étage 9." },
    { id: "NAR-10", name: "Témoin de l'éternité", type: "Narration", diff: "Difficile", reward: 15, desc: "Découvrir la stèle finale cachée au dixième étage et réussir le test d'interaction associé avant le combat ultime." },

    // ─── MAÎTRISE ET SURVIE ───
    { id: "SUR-01", name: "Premiers soins", type: "Survie", diff: "Facile", reward: 5, desc: "Terminer un étage sans qu'aucun personnage ne devienne gravement blessé (0 PV)." },
    { id: "SUR-02", name: "Économie de soins", type: "Survie", diff: "Facile", reward: 5, desc: "Terminer l'étage 3 en n'ayant dépensé aucun Dé de vie pendant les repos courts." },
    { id: "SUR-03", name: "Rempart solide", type: "Survie", diff: "Facile", reward: 5, desc: "Atteindre l'étage 4 avec l'intégralité des membres du groupe disposant de plus de 75 % de leurs PV maximums." },
    { id: "SUR-04", name: "Discipline de fer", type: "Survie", diff: "Moyenne", reward: 10, desc: "Terminer deux étages consécutifs (étages 4 et 5) sans qu'aucun personnage ne devienne gravement blessé (0 PV)." },
    { id: "SUR-05", name: "Réserves intactes", type: "Survie", diff: "Moyenne", reward: 10, desc: "Atteindre l'étage 6 en ayant conservé au moins la moitié de ses Dés de vie totaux par personnage." },
    { id: "SUR-06", name: "Résilience face aux ténèbres", type: "Survie", diff: "Moyenne", reward: 10, desc: "Vaincre le boss d'un étage après avoir relevé un personnage devenu gravement blessé (0 PV) (par un sort de soin, une potion ou une aptitude) pendant l'affrontement." },
    { id: "SUR-07", name: "Intouchables", type: "Survie", diff: "Difficile", reward: 15, desc: "Terminer l'intégralité d'un étage avancé (étages 7, 8 ou 9 : toutes les salles traversées et le boss vaincu) sans qu'aucun personnage du groupe ne devienne gravement blessé (0 PV)." },
    { id: "SUR-08", name: "L'art de la survie extrême", type: "Survie", diff: "Difficile", reward: 15, desc: "Atteindre l'étage 8 en n'ayant jamais subi l'état Inconscient ou ne devienne gravement blessé (0 PV) depuis le début de la run." },
    { id: "SUR-09", name: "Marathon de l'endurance", type: "Survie", diff: "Difficile", reward: 15, desc: "Atteindre l'étage 9 sans qu'aucun membre du groupe n'ait jamais subi l'état Inconscient ou ne devienne gravement blessé (0 PV) depuis le début de la run." },
    { id: "SUR-10", name: "Immortels des abîmes", type: "Survie", diff: "Difficile", reward: 15, desc: "Terminer l'ensemble de la run jusqu'à la victoire contre le boss final de l'étage 10 sans qu'aucun personnage ne devienne gravement blessé (0 PV)." }
];
