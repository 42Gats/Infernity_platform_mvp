// --- CATALOGUES & BOSSES ---
window.ROOM_TYPES = ["Combat (Facile)", "Combat (Moyen)", "Combat (Difficile)", "Mystère", "Défi", "Repos / Sanctuaire", "Salle Spéciale"];

window.CATALOG_COMBATS = {
    "Facile": [
        "3 Dryads (600 XP)", "6 Orcs (600 XP)", "3 Animated Armors (600 XP)",
        "3 Black Bears, 2 Brown Bears (700 XP)", "1 Goblin Boss, 10 Goblins (700 XP)",
        "2 Ettins (2200 XP - Étage 2)", "2 Black Puddings (2200 XP - Étage 2)", "5 Ogres (2250 XP - Étage 2)"
    ],
    "Moyen": [
        "3 Brown Bears, 1 Polar Bear (1050 XP)", "1 Manticore, 1 Ankheg (1150 XP)",
        "4 Ghouls, 1 Ghast (1250 XP)", "1 Minotaur, 2 Harpies (1100 XP)",
        "3 Wereboars (3300 XP - Étage 2)", "1 Chimera, 1 Lamia (3400 XP - Étage 2)", "1 Wyvern, 2 Griffons (3200 XP - Étage 2)"
    ],
    "Difficile": [
        "2 Displacer Beasts (1400 XP)", "1 Werewolf, 1 Owlbear (1400 XP)",
        "1 Banshee, 1 Specter (1300 XP)", "3 Gargoyles (1350 XP)", "2 Phase Spiders (1400 XP)",
        "1 Frost Giant (3900 XP - Étage 2)", "1 Spirit Naga (3900 XP - Étage 2)", "1 T. Rex (3900 XP - Étage 2)"
    ]
};

window.CATALOG_DEFIS = [
    "Défi 1 : Le Pont des Cendres et de la Rouille (Agilité / Dextérité DD 12)",
    "Défi 2 : Le Siphon Temporel des Arcanes (Sacrifice de 3 PV max permanent)",
    "Défi 3 : Le Tribunal des Murmures et du Tribut (Tribut de 4 PI remboursé à 8 PI si succès)",
    "Défi 4 : Le Labyrinthe des Lames Silencieuses (Sacrifice d'un objet/arme magique)",
    "Défi 5 : L'Autel du Pacte Sanguin Majeur (Personnage gravement blessé requis)"
];

window.CATALOG_MYSTERES = [
    "Mystère Classe : La Guilde des Ombres (Déblocage Rogue / Cible de Guilde)",
    "Mystère Classe : L'Arène des Terres Sauvages (Déblocage Barbarian)",
    "Mystère Classe : Le Cabaret des Illusions (Déblocage Bard)",
    "Mystère Classe : Le Sanctuaire des Étoiles Fuyantes (Déblocage Clerc)",
    "Mystère Classe : Le Bosquet Primordial (Déblocage Druid)",
    "Mystère Race : L'Autel de l'Aube Céleste (Déblocage Aasimar)",
    "Mystère Race : La Caverne des Braises Éternelles (Déblocage Dragonborn)",
    "Mystère Race : La Forge Profonde des Ancêtres (Déblocage Dwarf)",
    "Mystère Race : La Canopée des Murmures Éternels (Déblocage Elf)"
];

window.CATALOG_SPECIALES = [
    "Salle de Sacrifice d'Artefact (Permet de sacrifier un objet pour l'acquisition permanente au Hub)",
    "Salle de Résurrection (Ressuscite exactement 1 personnage gravement blessé avec tous ses PV)",
    "Sanctuaire de Repos Long (Nœud 0 de l'étage - Récupération complète)",
    "Salle de Repos Intermédiaire (Repos court et récupération de dés de vie)"
];

window.FLOOR_BOSSES = {
    1: "Le Gardien des Chaînes (Colosse de fer et de pierre aux chaînes magiques entravantes)",
    2: "L'Araignée Tisse-Rêves (Créature arachnide manipulant illusions et sommeil)",
    3: "Malakor, le Seigneur Cendré (Roi déchu enflammé en 2 phases martiales)",
    4: "L'Hydre des Abysses Oubliés (Serpentine à têtes multiples aux attaques élémentaires)",
    5: "La Sentinelle Temporelle (Automate géant manipulant l'initiative et le flux temporel)",
    6: "Le Tyran de Cristal (Entité cristalline invulnérable protégeant ses prismes de lumière)",
    7: "Le Maître des Ombres et des Échos (Assassin polymorphe se dupliquant à l'infini)",
    8: "Le Colosse de Magma et de Fer (Démon de lave fusionné à une machinerie sur-activée)",
    9: "L'Archonte du Vide Primordial (Entité cosmique modifiant la gravité et les lois physiques)",
    10: "L'Architecte des Abysses (Boss final à 3 phases synthétisant tous les dangers du donjon)"
};
