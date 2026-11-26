// --- AMÉLIORATIONS DU HUB ---
window.HUB_UPGRADES_CONFIG = [
    { key: 'startLevel', name: "Niveau de Départ", min: 1, max: 7, unit: "Niveau", costs: { 2: 35, 3: 60, 4: 90, 5: 130, 6: 175, 7: 225 } },
    { key: 'xpBonus', name: "Bonus Permanent XP", min: 0, max: 5, unit: "XP", costs: { 1: 20, 2: 30, 3: 40, 4: 55, 5: 70 } },
    { key: 'artifactSlots', name: "Emplacements d'Artefacts", min: 1, max: 6, unit: "Empl.", costs: { 2: 30, 3: 50, 4: 75, 5: 105, 6: 140 } },
    { key: 'passiveBudget', name: "Budget de Passifs", min: 3, max: 10, unit: "Pts", costs: { 4: 20, 5: 30, 6: 45, 7: 60, 8: 80, 9: 105, 10: 130 } },
    { key: 'potionsQty', name: "Potions de Soin (Qté)", min: 0, max: 4, unit: "Potions", costs: { 1: 25, 2: 40, 3: 60, 4: 85 } },
    { key: 'potionsQuality', name: "Qualité des Potions", min: 1, max: 3, unit: "Qualité", labels: { 1: "Normales", 2: "Supérieures", 3: "Suprêmes" }, costs: { 2: 45, 3: 80 } },
    { key: 'relaneQuests', name: "Relances de Quêtes", min: 0, max: 5, unit: "Relances", costs: { 1: 15, 2: 25, 3: 40, 4: 60, 5: 85 } },
    { key: 'relaneLoot', name: "Relances de Butin", min: 0, max: 5, unit: "Relances", costs: { 1: 20, 2: 35, 3: 55, 4: 80, 5: 110 } },
    { key: 'relaneBoss', name: "Relances de Boss", min: 0, max: 5, unit: "Relances", costs: { 1: 35, 2: 55, 3: 80, 4: 110, 5: 145 } },
    { key: 'teleporterMax', name: "Téléporteur d'Étage", min: 1, max: 7, unit: "Étage max", costs: { 2: 40, 3: 65, 4: 95, 5: 130, 6: 170, 7: 215 } }
];
