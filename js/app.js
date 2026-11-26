// --- ÉTAT DE LA SAUVEGARDE ---
let hubState = {
    coins: 50,
    startLevel: 1,
    xpBonus: 0,
    artifactSlots: 1,
    passiveBudget: 3,
    potionsQty: 0,
    potionsQuality: 1,
    relaneQuests: 0,
    relaneLoot: 0,
    relaneBoss: 0,
    teleporterMax: 1,
    foundArtifacts: [],
    unlockedArtifacts: [],
    foundPassives: [],
    purchasedPassives: [],
    discoveredCompanions: [],
    activeRunQuests: [],
    companions: { scout: 1, healer: 1, smith: 1, tricks: 1 },
    selectedArtifacts: [],
    selectedPassives: []
};

let mjUnlocked = false;
let lootAnimating = false; // Verrou anti-double-clic pour la roulette

let dungeonMapState = {
    currentFloor: 1,
    currentNodeIndex: 1,
    unlockedMaxNode: 1,
    nodes: []
};

// --- UTILITAIRES (doivent être définis AVANT les fonctions qui les utilisent) ---
function calcProb(p1, p10, f) { return p1 + ((f - 1) / 9) * (p10 - p1); }

function badgeStyle(r) {
    const map = { Commun: 'bg-stone-800 text-stone-300 border-stone-600', 'Peu commun': 'bg-emerald-950 text-emerald-300 border-emerald-700', Rare: 'bg-blue-950 text-blue-300 border-blue-700', Épique: 'bg-purple-950 text-purple-300 border-purple-700', Légendaire: 'bg-amber-950 text-amber-300 border-amber-700' };
    return map[r] || map.Commun;
}
function borderStyle(r) {
    const map = { Commun: 'border-stone-600', 'Peu commun': 'border-emerald-600', Rare: 'border-blue-500', Épique: 'border-purple-500', Légendaire: 'border-amber-500' };
    return map[r] || map.Commun;
}
function pickRarity(ref1, ref10, floor) {
    const probs = {}; let total = 0;
    for (const k of Object.keys(ref1)) { probs[k] = calcProb(ref1[k], ref10[k], floor); total += probs[k]; }
    const r = Math.random() * total; let acc = 0;
    for (const [k, v] of Object.entries(probs)) { acc += v; if (r <= acc) return k; }
    return Object.keys(probs)[0];
}

function loadState() {
    const saved = localStorage.getItem('infernity_state_v5');
    if (saved) {
        try { hubState = JSON.parse(saved); } catch(e) { console.error("Erreur chargement save", e); }
    }
    if (!hubState.activeRunQuests || hubState.activeRunQuests.length === 0) {
        mjRollRunQuestsInternal();
    }
    applyHubStateToDOM();
}

function saveHubState() {
    localStorage.setItem('infernity_state_v5', JSON.stringify(hubState));
    applyHubStateToDOM();
}

function applyHubStateToDOM() {
    const coinsEl = document.getElementById('global-coins-display');
    if (coinsEl) coinsEl.innerText = hubState.coins;
    const coinsInput = document.getElementById('mj-coins-input');
    if (coinsInput) coinsInput.value = hubState.coins;

    renderHubClientView();
    renderHubMjView();
    renderLoadoutSelectors();
    renderCodex();
    renderCompanions();
    renderActiveQuests();
}

function setMjCoinsFromInput() {
    const val = parseInt(document.getElementById('mj-coins-input').value);
    if (!isNaN(val)) { hubState.coins = Math.max(0, val); saveHubState(); }
}

// --- VUE CLIENT HUB ---
function renderHubClientView() {
    const container = document.getElementById('hub-upgrades-grid');
    if (!container) return;
    container.innerHTML = '';
    window.HUB_UPGRADES_CONFIG.forEach(upg => {
        const currentVal = hubState[upg.key];
        const nextVal = currentVal + 1;
        const nextCost = upg.costs[nextVal] ? upg.costs[nextVal] : null;
        const displayVal = upg.labels ? upg.labels[currentVal] : (currentVal + ' ' + upg.unit);

        const card = document.createElement('div');
        card.className = "bg-infernal-900/60 border border-infernal-700 rounded-xl p-4 flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-white text-sm">${upg.name}</h3>
                    <span class="text-xs bg-red-900/60 text-red-300 px-2 py-0.5 rounded border border-red-700/50">${displayVal}</span>
                </div>
                <p class="text-xs text-stone-400 mb-3">Amélioration permanente du Hub.</p>
            </div>
            <div class="flex justify-between items-center text-xs pt-2 border-t border-infernal-800">
                <span class="text-stone-400">Coût suivant :</span>
                <span class="font-bold ${nextCost ? 'text-amber-400' : 'text-stone-500'}">${nextCost ? nextCost + ' PI' : 'Max atteint'}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- VUE MJ HUB ---
function renderHubMjView() {
    const container = document.getElementById('mj-hub-controls');
    if (!container) return;
    container.innerHTML = '';
    window.HUB_UPGRADES_CONFIG.forEach(upg => {
        const currentVal = hubState[upg.key];
        const nextCost = upg.costs[currentVal + 1];
        const displayVal = upg.labels ? upg.labels[currentVal] : currentVal;

        const card = document.createElement('div');
        card.className = "bg-infernal-800 border border-infernal-700 rounded-xl p-3 flex flex-col justify-between text-xs";
        card.innerHTML = `
            <div>
                <div class="font-bold text-white mb-1">${upg.name}</div>
                <div class="text-stone-400 mb-2">Valeur actuelle : <span class="text-red-400 font-bold">${displayVal}</span></div>
            </div>
            <div class="flex gap-2">
                <button onclick="mjDecreaseUpgrade('${upg.key}', ${currentVal}, ${upg.min})" class="flex-1 bg-red-950 hover:bg-red-900 text-red-200 py-1.5 rounded font-medium ${currentVal <= upg.min ? 'opacity-50 cursor-not-allowed' : ''}">- (Rembourser)</button>
                <button onclick="mjIncreaseUpgrade('${upg.key}', ${currentVal}, ${upg.max}, ${nextCost})" class="flex-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 py-1.5 rounded font-medium ${!nextCost || hubState.coins < nextCost ? 'opacity-50 cursor-not-allowed' : ''}">+ (${nextCost ? nextCost + ' PI' : 'Max'})</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function mjIncreaseUpgrade(key, current, max, cost) {
    if (current >= max || !cost) return;
    if (hubState.coins < cost) { alert("PI insuffisantes !"); return; }
    hubState.coins -= cost; hubState[key] += 1; saveHubState();
}
function mjDecreaseUpgrade(key, current, min) {
    if (current <= min) return;
    const upg = window.HUB_UPGRADES_CONFIG.find(u => u.key === key);
    const refundCost = upg.costs[current];
    if (refundCost) hubState.coins += refundCost;
    hubState[key] -= 1; saveHubState();
}

// --- TIRAGE DES 5 QUÊTES DE RUN ---
function mjRollRunQuestsInternal() {
    const faciles = window.ALL_QUESTS.filter(q => q.diff === 'Facile');
    const moyennes = window.ALL_QUESTS.filter(q => q.diff === 'Moyenne');
    const difficiles = window.ALL_QUESTS.filter(q => q.diff === 'Difficile');
    const qFacile = faciles[Math.floor(Math.random() * faciles.length)];
    const qMoyenne = moyennes[Math.floor(Math.random() * moyennes.length)];
    const qDifficile = difficiles[Math.floor(Math.random() * difficiles.length)];
    const remaining = window.ALL_QUESTS.filter(q => q.id !== qFacile.id && q.id !== qMoyenne.id && q.id !== qDifficile.id);
    remaining.sort(() => Math.random() - 0.5);
    hubState.activeRunQuests = [qFacile, qMoyenne, qDifficile, remaining[0], remaining[1]];
}
function mjRollRunQuests() {
    mjRollRunQuestsInternal();
    saveHubState();
    alert("Les 5 quêtes de la run ont été tirées avec succès (1 Facile, 1 Moyenne, 1 Difficile + 2 aléatoires) !");
}

function renderActiveQuests() {
    const container = document.getElementById('active-quests-container');
    if (!container) return;
    container.innerHTML = '';
    const quests = hubState.activeRunQuests || [];
    if (quests.length === 0) {
        container.innerHTML = `<div class="text-stone-500 text-xs italic text-center py-6 col-span-2">Aucune quête active pour cette run. Le MJ doit en effectuer le tirage depuis ses outils.</div>`;
        return;
    }
    quests.forEach(q => {
        const card = document.createElement('div');
        card.className = "bg-infernal-900/90 border border-infernal-700 rounded-xl p-4 flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-mono text-amber-400 font-bold">${q.id} — ${q.name}</span>
                    <span class="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/50">+${q.reward} PI</span>
                </div>
                <p class="text-xs text-stone-300 mb-3">${q.desc}</p>
            </div>
            <div class="flex justify-between items-center text-[11px] text-stone-500 pt-2 border-t border-infernal-800">
                <span>Type : ${q.type}</span>
                <span class="text-red-400 font-bold">Difficulté : ${q.diff}</span>
            </div>
        `;
        container.appendChild(card);
    });
    const btnContainer = document.getElementById('mj-quest-draw-btn-container');
    if (btnContainer) btnContainer.innerHTML = mjUnlocked ? `<button onclick="mjRollRunQuests()" class="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5"><i class="fa-solid fa-dice"></i> Retirer les 5 quêtes</button>` : '';
}

// --- COMPAGNONS ---
function renderCompanions() {
    const container = document.getElementById('companions-grid');
    if (!container) return;
    container.innerHTML = '';
    const compCosts = { 2: 25, 3: 50, 4: 85, 5: 125 };
    window.COMPANIONS_DATA.forEach(comp => {
        const isDiscovered = hubState.discoveredCompanions.includes(comp.id);
        const lvl = hubState.companions[comp.id] || 1;
        const nextCost = compCosts[lvl + 1];
        const card = document.createElement('div');
        card.className = `border rounded-xl p-5 flex flex-col justify-between ${isDiscovered ? 'bg-infernal-900 border-infernal-700' : 'bg-infernal-900/40 border-infernal-800'}`;
        if (!isDiscovered && !mjUnlocked) {
            card.innerHTML = `<div><div class="flex justify-between items-start mb-2"><h3 class="font-bold text-stone-500 text-base">??? (Compagnon Inconnu)</h3></div><p class="text-xs text-stone-600 italic mb-4">Ce compagnon n'a pas encore été découvert au cours d'une run.</p></div><div class="text-[11px] text-stone-600 pt-2 border-t border-infernal-800">Statut : Non rencontré</div>`;
        } else {
            card.innerHTML = `<div><div class="flex justify-between items-start mb-2"><h3 class="font-bold text-white text-base">${comp.name}</h3><span class="text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/50">${isDiscovered ? 'Camp Niv. ' + lvl : 'Bloqué (Non découvert)'}</span></div><p class="text-xs text-stone-300 mb-4">${comp.desc}</p></div><div class="pt-3 border-t border-infernal-800 flex justify-between items-center text-xs"><span class="text-stone-400">${isDiscovered ? 'Amélioration camp : <strong class="text-amber-400">' + (nextCost ? nextCost + ' PI' : 'Max') + '</strong>' : 'En attente de découverte'}</span>${mjUnlocked ? `<div class="flex gap-2 items-center"><button onclick="mjToggleCompanion('${comp.id}')" class="px-2 py-1 rounded text-[10px] font-bold ${isDiscovered ? 'bg-amber-900 text-amber-200' : 'bg-emerald-900 text-emerald-200'}">${isDiscovered ? 'Masquer' : 'Découvrir'}</button>${isDiscovered ? `<button onclick="mjUpdateCompanion('${comp.id}', -1)" class="bg-red-950 text-red-200 px-2 py-1 rounded ${lvl <= 1 ? 'opacity-50' : ''}">-</button><button onclick="mjUpdateCompanion('${comp.id}', 1)" class="bg-emerald-950 text-emerald-300 px-2 py-1 rounded ${!nextCost || hubState.coins < nextCost ? 'opacity-50' : ''}">+</button>` : ''}</div>` : '<span class="text-stone-500 italic">Vue Joueur</span>'}</div>`;
        }
        container.appendChild(card);
    });
}
function mjToggleCompanion(id) {
    const idx = hubState.discoveredCompanions.indexOf(id);
    if (idx > -1) hubState.discoveredCompanions.splice(idx, 1); else hubState.discoveredCompanions.push(id);
    saveHubState();
}
function mjUpdateCompanion(id, delta) {
    let lvl = hubState.companions[id] || 1;
    const compCosts = { 2: 25, 3: 50, 4: 85, 5: 125 };
    if (delta > 0 && lvl < 5) { const cost = compCosts[lvl + 1]; if (hubState.coins < cost) { alert("PI insuffisantes !"); return; } hubState.coins -= cost; hubState.companions[id] = lvl + 1; }
    else if (delta < 0 && lvl > 1) { hubState.coins += compCosts[lvl]; hubState.companions[id] = lvl - 1; }
    saveHubState();
}

// --- CODEX ---
function renderCodex() {
    const type = document.getElementById('codex-type-filter').value;
    const rarity = document.getElementById('codex-rarity-filter').value;
    const container = document.getElementById('codex-container');
    if (!container) return;
    container.innerHTML = '';
    const list = type === 'artifacts' ? window.ALL_ARTIFACTS : window.ALL_PASSIVES;
    const filtered = list.filter(item => rarity === 'all' || item.rarity === rarity);
    filtered.forEach(item => {
        const isArtifact = type === 'artifacts';
        const isFound = isArtifact ? hubState.foundArtifacts.includes(item.name) : hubState.foundPassives.includes(item.name);
        const isUnlocked = isArtifact ? hubState.unlockedArtifacts.includes(item.name) : hubState.purchasedPassives.includes(item.name);
        const card = document.createElement('div');
        card.className = `border rounded-xl p-4 flex flex-col justify-between ${isFound || isUnlocked ? 'bg-infernal-900/90 border-infernal-700' : 'bg-infernal-900/40 border-infernal-800 opacity-75'}`;
        if (!isFound && !isUnlocked && !mjUnlocked) {
            card.innerHTML = `<div><div class="flex justify-between items-start mb-2"><h4 class="font-bold text-stone-500 text-sm">??? (Inconnu)</h4><span class="text-[10px] px-2 py-0.5 rounded border ${badgeStyle(item.rarity)}">${item.rarity}</span></div><p class="text-xs text-stone-600 italic mb-3">Jamais découvert au cours des expéditions.</p></div><div class="text-[11px] text-stone-600 pt-2 border-t border-infernal-800">Statut : Bloqué (???)</div>`;
        } else {
            card.innerHTML = `<div><div class="flex justify-between items-start mb-2"><h4 class="font-bold text-white text-sm">${item.name}</h4><span class="text-[10px] px-2 py-0.5 rounded border ${badgeStyle(item.rarity)}">${item.rarity}</span></div><p class="text-xs text-stone-300 mb-3">${item.effect}</p></div><div class="pt-2 border-t border-infernal-800 flex justify-between items-center text-[11px]"><span class="text-stone-400">${isArtifact ? 'Artefact' : ('Coût budget : ' + item.cost + ' pt(s)')}</span>${mjUnlocked ? renderMjCodexAction(item, isArtifact, isFound, isUnlocked) : renderClientCodexStatus(isArtifact, isFound, isUnlocked)}</div>`;
        }
        container.appendChild(card);
    });
}
function renderClientCodexStatus(isArtifact, isFound, isUnlocked) {
    if (isArtifact) { if (isUnlocked) return `<span class="text-emerald-400 font-bold">Débloqué (Sacrifié)</span>`; if (isFound) return `<span class="text-amber-400 font-medium">Trouvé en run (Non sacrifié)</span>`; }
    else { if (isUnlocked) return `<span class="text-emerald-400 font-bold">Acheté Hub</span>`; if (isFound) return `<span class="text-amber-400 font-medium">Découvert (Non acheté)</span>`; }
    return `<span class="text-stone-500">Inconnu</span>`;
}
function renderMjCodexAction(item, isArtifact, isFound, isUnlocked) {
    const safeName = item.name.replace(/'/g, "\\'");
    if (isArtifact) return `<div class="flex gap-1 items-center"><button onclick="mjToggleFoundArtifact('${safeName}')" class="px-2 py-1 rounded text-[10px] font-bold ${isFound ? 'bg-amber-900 text-amber-200' : 'bg-stone-700 text-stone-300'}">${isFound ? 'Trouvé ✅' : 'Marquer Trouvé'}</button><button onclick="mjToggleArtifact('${safeName}')" class="px-2 py-1 rounded text-[10px] font-bold ${isUnlocked ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-800 text-stone-400'}">${isUnlocked ? 'Sacrifié (Débloqué) ✅' : 'Valider Sacrifice'}</button></div>`;
    else return `<div class="flex gap-1 items-center"><button onclick="mjToggleFoundPassive('${safeName}')" class="px-2 py-1 rounded text-[10px] font-bold ${isFound ? 'bg-amber-900 text-amber-200' : 'bg-stone-700 text-stone-300'}">${isFound ? 'Découvert ✅' : 'Marquer Découvert'}</button><button onclick="mjBuyPassive('${safeName}', ${item.unlockCost})" class="px-2 py-1 rounded text-[10px] font-bold ${isUnlocked ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-800 text-stone-400'}">${isUnlocked ? 'Acheté Hub ✅' : 'Acheter (' + item.unlockCost + ' PI)'}</button></div>`;
}
function mjToggleFoundArtifact(name) { const i = hubState.foundArtifacts.indexOf(name); if (i > -1) hubState.foundArtifacts.splice(i, 1); else hubState.foundArtifacts.push(name); saveHubState(); }
function mjToggleArtifact(name) { const i = hubState.unlockedArtifacts.indexOf(name); if (i > -1) hubState.unlockedArtifacts.splice(i, 1); else { hubState.unlockedArtifacts.push(name); if (!hubState.foundArtifacts.includes(name)) hubState.foundArtifacts.push(name); } saveHubState(); }
function mjToggleFoundPassive(name) { const i = hubState.foundPassives.indexOf(name); if (i > -1) hubState.foundPassives.splice(i, 1); else hubState.foundPassives.push(name); saveHubState(); }
function mjBuyPassive(name, cost) { const i = hubState.purchasedPassives.indexOf(name); if (i > -1) { hubState.coins += cost; hubState.purchasedPassives.splice(i, 1); } else { if (hubState.coins < cost) { alert("PI insuffisantes !"); return; } hubState.coins -= cost; hubState.purchasedPassives.push(name); if (!hubState.foundPassives.includes(name)) hubState.foundPassives.push(name); } saveHubState(); }

// --- SIMULATEUR DE LOADOUT ---
function renderLoadoutSelectors() {
    const artContainer = document.getElementById('loadout-artifacts-list');
    if (!artContainer) return;
    artContainer.innerHTML = '';
    const availableArts = window.ALL_ARTIFACTS.filter(a => hubState.unlockedArtifacts.includes(a.name));
    if (availableArts.length === 0) artContainer.innerHTML = `<div class="text-stone-500 text-xs italic text-center py-2">Aucun artefact débloqué par sacrifice permanent.</div>`;
    else availableArts.forEach(art => { const sel = hubState.selectedArtifacts.includes(art.name); const div = document.createElement('div'); div.className = `p-2.5 rounded-lg border flex justify-between items-center text-xs ${sel ? 'bg-infernal-700/60 border-purple-500/50 text-white' : 'bg-infernal-900 border-infernal-700 text-stone-400'}`; div.innerHTML = `<div><span class="font-bold">${art.name}</span> <span class="text-[10px] text-purple-300">(${art.rarity})</span><p class="text-[11px] text-stone-300 mt-0.5">${art.effect}</p></div><button onclick="toggleArtifact('${art.name.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded text-xs font-semibold ${sel ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-infernal-600 hover:bg-infernal-500 text-stone-200'}">${sel ? 'Retirer' : 'Équiper'}</button>`; artContainer.appendChild(div); });
    document.getElementById('selected-artifacts-count').innerText = hubState.selectedArtifacts.length;
    document.getElementById('max-artifact-slots-label').innerText = hubState.artifactSlots;

    const passContainer = document.getElementById('loadout-passives-list');
    passContainer.innerHTML = '';
    let currentCost = 0; hubState.selectedPassives.forEach(n => { const p = window.ALL_PASSIVES.find(i => i.name === n); if (p) currentCost += p.cost; });
    const availablePassives = window.ALL_PASSIVES.filter(p => hubState.purchasedPassives.includes(p.name));
    if (availablePassives.length === 0) passContainer.innerHTML = `<div class="text-stone-500 text-xs italic text-center py-2">Aucun passif acheté définitivement au Hub.</div>`;
    else availablePassives.forEach(pas => { const sel = hubState.selectedPassives.includes(pas.name); const div = document.createElement('div'); div.className = `p-2.5 rounded-lg border flex justify-between items-center text-xs ${sel ? 'bg-infernal-700/60 border-blue-500/50 text-white' : 'bg-infernal-900 border-infernal-700 text-stone-400'}`; div.innerHTML = `<div><span class="font-bold">${pas.name}</span> <span class="text-[10px] text-blue-300">(${pas.rarity} - ${pas.cost} pt${pas.cost>1?'s':''})</span><p class="text-[11px] text-stone-300 mt-0.5">${pas.effect}</p></div><button onclick="togglePassive('${pas.name.replace(/'/g, "\\'")}', ${pas.cost})" class="px-2.5 py-1 rounded text-xs font-semibold ${sel ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-infernal-600 hover:bg-infernal-500 text-stone-200'}">${sel ? 'Retirer' : 'Activer'}</button>`; passContainer.appendChild(div); });
    document.getElementById('selected-passives-cost').innerText = currentCost;
    document.getElementById('max-passive-budget-label').innerText = hubState.passiveBudget;
}
function toggleArtifact(name) { const i = hubState.selectedArtifacts.indexOf(name); if (i > -1) hubState.selectedArtifacts.splice(i, 1); else { if (hubState.selectedArtifacts.length >= hubState.artifactSlots) { alert(`Limite atteinte ! Votre Hub autorise seulement ${hubState.artifactSlots} emplacement(s).`); return; } hubState.selectedArtifacts.push(name); } saveHubState(); }
function togglePassive(name, cost) { const i = hubState.selectedPassives.indexOf(name); if (i > -1) hubState.selectedPassives.splice(i, 1); else { let cc = 0; hubState.selectedPassives.forEach(n => { const p = window.ALL_PASSIVES.find(i => i.name === n); if (p) cc += p.cost; }); if (cc + cost > hubState.passiveBudget) { alert(`Budget insuffisant ! Votre budget de passifs est de ${hubState.passiveBudget} points.`); return; } hubState.selectedPassives.push(name); } saveHubState(); }

// --- NAVIGATION & AUTH MJ ---
function switchTab(tabId) {
    if (tabId === 'mj' && !mjUnlocked) { document.getElementById('mj-auth-modal').classList.remove('hidden'); return; }
    ['hub','dungeon','loot','codex','companions','quests','mj'].forEach(id => { const el = document.getElementById(`tab-${id}`); const btn = document.getElementById(`btn-${id}`); if (el) el.classList.add('hidden'); if (btn) { btn.classList.remove('bg-red-800','text-white','shadow'); btn.classList.add('text-stone-400','hover:text-white','hover:bg-infernal-700'); } });
    const targetTab = document.getElementById(`tab-${tabId}`); const targetBtn = document.getElementById(`btn-${tabId}`);
    if (targetTab) { targetTab.classList.remove('hidden'); void targetTab.offsetWidth; }
    if (targetBtn) { targetBtn.classList.add('bg-red-800','text-white','shadow'); targetBtn.classList.remove('text-stone-400','hover:text-white','hover:bg-infernal-700'); }
}
function verifyMjPin(e) { e.preventDefault(); const pin = document.getElementById('mj-pin-input').value; if (pin === "3005") { mjUnlocked = true; document.getElementById('mj-auth-modal').classList.add('hidden'); document.getElementById('mj-lock-icon').innerHTML = '<i class="fa-solid fa-unlock text-emerald-400"></i>'; switchTab('mj'); } else document.getElementById('mj-auth-error').classList.remove('hidden'); }
function closeMjAuth() { document.getElementById('mj-auth-modal').classList.add('hidden'); }
function lockMj() { mjUnlocked = false; document.getElementById('mj-lock-icon').innerHTML = '<i class="fa-solid fa-lock"></i>'; switchTab('hub'); }

// --- EXPORT / IMPORT ---
function exportSave() { const s = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hubState, null, 2)); const a = document.createElement('a'); a.href = s; a.download = "infernity_save.json"; document.body.appendChild(a); a.click(); a.remove(); }
function importSave(e) { const fr = new FileReader(); if (e.target.files[0]) { fr.readAsText(e.target.files[0], "UTF-8"); fr.onload = (ev) => { try { hubState = JSON.parse(ev.target.result); saveHubState(); alert("Sauvegarde importée !"); } catch(err) { alert("Erreur import JSON."); } }; } }

// --- RENDU DONJON ---
function renderPlayerDungeonMap() {
    const c = document.getElementById('dungeon-map-container');
    if (!c) return;
    if (!dungeonMapState.nodes.length) { c.innerHTML = `<div class="text-center text-stone-500 py-16 italic text-sm">Aucun parcours généré. ${mjUnlocked ? 'Le MJ peut générer la carte.' : 'En attente du MJ.'}</div>`; return; }
    let html = `<div class="w-full space-y-6 max-w-4xl mx-auto py-4"><div class="flex flex-wrap justify-between items-center bg-infernal-800 p-4 rounded-xl border border-infernal-700 gap-4"><div><span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Étage ${dungeonMapState.currentFloor} — Position : Nœud ${dungeonMapState.currentNodeIndex} / 10</span><h4 class="text-white font-black text-base">Carte interactive</h4></div>${mjUnlocked ? `<div class="flex items-center gap-2"><span class="text-xs text-red-400 font-bold"><i class="fa-solid fa-user-shield"></i> Contrôle MJ :</span><button onclick="mjAdvanceDungeonNode()" class="bg-red-800 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow">Avancer au Nœud Suivant ➔</button></div>` : `<span class="text-xs text-stone-400 italic">🔒 Le MJ pilote la progression</span>`}</div>`;
    dungeonMapState.nodes.forEach((n, i) => { const lvl = n.level; const cur = lvl === dungeonMapState.currentNodeIndex; const vis = lvl <= dungeonMapState.unlockedMaxNode + 1;
        html += `<div class="relative bg-infernal-900 border ${cur ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-infernal-700'} rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 transition-all"><div class="flex items-center gap-3 min-w-[140px]"><div class="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${cur ? 'bg-amber-600 text-white shadow-lg animate-pulse' : (lvl < dungeonMapState.currentNodeIndex ? 'bg-emerald-900 text-emerald-300' : 'bg-infernal-800 text-stone-400 border border-infernal-600')}">${lvl === 10 ? '👑' : lvl}</div><div><h5 class="font-bold text-white text-xs">${lvl === 10 ? 'Boss Final' : 'Nœud ' + lvl}</h5><span class="text-[10px] ${cur ? 'text-amber-400 font-bold' : 'text-stone-400'}">${cur ? '📍 Position Actuelle' : (lvl < dungeonMapState.currentNodeIndex ? 'Visité ✅' : 'À venir')}</span></div></div><div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">`;
        if (!vis) html += `<div class="col-span-full bg-infernal-950 border border-infernal-800 rounded-lg p-3 text-center text-stone-500 text-xs italic">🔒 Brouillard de guerre</div>`;
        else n.choices.forEach(r => { let bc = "bg-stone-800 text-stone-300 border-stone-600"; if (r.category === 'Combat') bc = "bg-red-950 text-red-300 border-red-800"; if (r.category === 'Défi') bc = "bg-amber-950 text-amber-300 border-amber-800"; if (r.category === 'Mystère') bc = "bg-purple-950 text-purple-300 border-purple-800"; if (r.category === 'Spécial') bc = "bg-blue-950 text-blue-300 border-blue-800"; if (r.category === 'Boss') bc = "bg-red-900 text-white border-red-600"; const rt = r.category === 'Combat' ? 'Salle de Combat' : r.category; html += `<div class="bg-infernal-800/90 border ${cur ? 'border-amber-500/80 shadow' : 'border-infernal-600'} rounded-lg p-3 flex flex-col justify-between"><div class="flex justify-between items-start mb-1.5"><span class="text-[10px] px-2 py-0.5 rounded border font-bold ${bc}">${r.category}</span></div><p class="text-xs text-stone-200 font-medium">${rt}</p></div>`; });
        html += `</div></div>`; });
    html += `</div>`; c.innerHTML = html;
}
function mjAdvanceDungeonNode() { if (dungeonMapState.currentNodeIndex < 10) { dungeonMapState.currentNodeIndex++; if (dungeonMapState.currentNodeIndex > dungeonMapState.unlockedMaxNode) dungeonMapState.unlockedMaxNode = dungeonMapState.currentNodeIndex; renderPlayerDungeonMap(); } else alert("Le groupe a atteint le Boss final !"); }
function generateDungeon() {
    const floor = parseInt(document.getElementById('dungeon-floor').value);
    const out = document.getElementById('dungeon-output'); if (!out) return; out.innerHTML = '';
    const wc = [...Array(10).fill('Combat (Facile)'), ...Array(10).fill('Combat (Moyen)'), ...Array(10).fill('Combat (Difficile)'), ...Array(2).fill('Défi'), 'Sacrifice d\'artefact', ...Array(2).fill('Repos'), 'Mystère', ...Array(1).fill('Résurrection')];
    dungeonMapState.currentFloor = floor; dungeonMapState.currentNodeIndex = 1; dungeonMapState.unlockedMaxNode = 1; dungeonMapState.nodes = [];
    let html = `<div class="flex justify-between items-center mb-4 pb-2 border-b border-infernal-700"><div><h4 class="text-xs font-bold text-amber-400">Parcours — Étage ${floor} (Nœud 0 + 10 Nœuds)</h4><p class="text-[11px] text-stone-400">Généré selon les poids officiels.</p></div><span class="text-xs bg-infernal-800 text-stone-300 px-2.5 py-1 rounded border border-infernal-600">Vue MJ</span></div><div class="space-y-3"><div class="bg-blue-950/60 border border-blue-700 rounded-xl p-3 text-xs mb-3"><div class="flex justify-between items-center mb-1"><span class="font-bold text-blue-300 text-sm">🏛️ Nœud 0 : Sanctuaire</span><span class="text-[10px] bg-blue-900 text-white px-2 py-0.5 rounded font-bold">Repos Long</span></div><p class="text-[11px] text-blue-200">Point de départ de l'étage <strong>${floor}</strong>.</p></div>`;
    for (let i = 1; i <= 9; i++) { const rc = Math.floor(Math.random() * 2) + 2; let ch = []; html += `<div class="bg-infernal-900/90 p-3 rounded-xl border border-infernal-700 text-xs"><div class="flex justify-between items-center mb-2"><span class="font-bold text-red-400">Nœud ${i}</span><span class="text-[10px] text-stone-500">${rc} embranchements</span></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">`;
        for (let r = 0; r < rc; r++) { const pc = wc[Math.floor(Math.random() * wc.length)]; let cat = "Combat", det = ""; if (pc.startsWith('Combat')) { cat = "Combat"; const d = pc.includes('Facile')?'Facile':(pc.includes('Moyen')?'Moyen':'Difficile'); det = `Combat ${d} : ${window.CATALOG_COMBATS[d][Math.floor(Math.random()*window.CATALOG_COMBATS[d].length)]}`; } else if (pc === 'Défi') { cat = "Défi"; det = window.CATALOG_DEFIS[Math.floor(Math.random()*window.CATALOG_DEFIS.length)]; } else if (pc === 'Mystère') { cat = "Mystère"; det = window.CATALOG_MYSTERES[Math.floor(Math.random()*window.CATALOG_MYSTERES.length)]; } else if (pc === 'Sacrifice d\'artefact' || pc === 'Repos' || pc === 'Résurrection') { cat = "Spécial"; det = pc === 'Sacrifice d\'artefact' ? window.CATALOG_SPECIALES[0] : (pc === 'Résurrection' ? window.CATALOG_SPECIALES[1] : window.CATALOG_SPECIALES[3]); } else { cat = "Spécial"; det = window.CATALOG_SPECIALES[3]; } ch.push({id:`n${i}_r${r}`,category:cat,desc:det,visited:false}); const iv = i === 1; html += `<div class="bg-infernal-800/80 border border-infernal-600 rounded-lg p-2.5 flex flex-col justify-between"><div class="flex justify-between items-start mb-1"><span class="font-bold text-amber-300 text-[11px]">${cat}</span><span class="text-[9px] bg-infernal-900 px-1.5 py-0.5 rounded text-stone-400">Chemin ${r+1}</span></div><div class="text-[11px] text-stone-200 font-medium mb-2">${det}</div><div class="flex justify-between items-center text-[10px] pt-1.5 border-t border-infernal-700 text-stone-400"><span>Connexion Nœud ${i+1}</span><span class="${iv?'text-emerald-400 font-bold':'text-stone-500'}">${iv?'Visible Joueurs':'Voilé'}</span></div></div>`; }
        dungeonMapState.nodes.push({level:i,choices:ch}); html += `</div></div>`; }
    const bn = window.FLOOR_BOSSES[floor] || "Boss Suprême"; dungeonMapState.nodes.push({level:10,choices:[{id:'n10_boss',category:'Boss',desc:bn,visited:false}]});
    html += `<div class="bg-red-950/70 border border-red-700 rounded-xl p-3.5 text-xs"><div class="flex justify-between items-center mb-1"><span class="font-bold text-red-300 text-sm">👑 Nœud 10 : Boss d'Étage</span><span class="text-[10px] bg-red-900 text-white px-2 py-0.5 rounded font-bold">Obligatoire</span></div><div class="text-white font-bold text-sm mb-1">${bn}</div><p class="text-[11px] text-red-200">Point de convergence de l'étage <strong>${floor}</strong>.</p></div>`;
    out.innerHTML = html;
}

// ===========================
// LOOT : TABLEAUX DE PROBABILITÉS OFFICIELS
// ===========================
const ARTEFACT_PROBS = {
    Facile:   { 1: { "Aucun": 60, "Commun": 30, "Peu commun": 9, "Rare": 0.9, "Épique": 0.09, "Légendaire": 0.01 }, 10: { "Aucun": 20, "Commun": 25, "Peu commun": 25, "Rare": 18, "Épique": 9, "Légendaire": 3 } },
    Moyen:    { 1: { "Aucun": 50, "Commun": 32, "Peu commun": 14, "Rare": 3.5, "Épique": 0.45, "Légendaire": 0.05 }, 10: { "Aucun": 12, "Commun": 22, "Peu commun": 25, "Rare": 23, "Épique": 13, "Légendaire": 5 } },
    Difficile:{ 1: { "Aucun": 40, "Commun": 32, "Peu commun": 20, "Rare": 6, "Épique": 1.8, "Légendaire": 0.2 }, 10: { "Aucun": 5, "Commun": 15, "Peu commun": 25, "Rare": 27, "Épique": 18, "Légendaire": 10 } }
};

const PASSIVE_PROBS = {
    1: { "Commun": 90, "Peu commun": 8, "Rare": 1.5, "Épique": 0.4, "Légendaire": 0.1 },
    10: { "Commun": 10, "Peu commun": 20, "Rare": 30, "Épique": 25, "Légendaire": 15 }
};

function pickRarity(ref1, ref10, floor) {
    const probs = {}; let total = 0;
    for (const k of Object.keys(ref1)) { probs[k] = calcProb(ref1[k], ref10[k], floor); total += probs[k]; }
    const r = Math.random() * total; let acc = 0;
    for (const [k, v] of Object.entries(probs)) { acc += v; if (r <= acc) return k; }
    return Object.keys(probs)[0];
}

function badgeStyle(r) {
    const map = { Commun: 'bg-stone-800 text-stone-300 border-stone-600', 'Peu commun': 'bg-emerald-950 text-emerald-300 border-emerald-700', Rare: 'bg-blue-950 text-blue-300 border-blue-700', Épique: 'bg-purple-950 text-purple-300 border-purple-700', Légendaire: 'bg-amber-950 text-amber-300 border-amber-700' };
    return map[r] || map.Commun;
}
function borderStyle(r) {
    const map = { Commun: 'border-stone-600', 'Peu commun': 'border-emerald-600', Rare: 'border-blue-500', Épique: 'border-purple-500', Légendaire: 'border-amber-500' };
    return map[r] || map.Commun;
}

// ===========================
// TIROIR ARTEFACT (ROULETTE)
// ===========================
function rollLootRoulette() {
    // Anti-double-clic : ignorer si animation en cours
    if (lootAnimating) return;

    const floorEl = document.getElementById('loot-floor-select');
    const diffEl = document.getElementById('loot-difficulty');
    const box = document.getElementById('loot-animation-container');

    if (!floorEl || !diffEl || !box) {
        console.warn('rollLootRoulette: éléments manquants', { floorEl, diffEl, box });
        return;
    }

    const floor = parseInt(floorEl.value);
    const diff = diffEl.value;

    const ref = ARTEFACT_PROBS[diff];
    const rarity = pickRarity(ref[1], ref[10], floor);
    let won = null;
    if (rarity !== "Aucun") {
        const pool = window.ALL_ARTIFACTS.filter(a => a.rarity === rarity);
        if (pool.length) { won = pool[Math.floor(Math.random() * pool.length)]; if (!hubState.foundArtifacts.includes(won.name)) { hubState.foundArtifacts.push(won.name); saveHubState(); } }
    }

    // Construire la piste : 35 items, le gagnant sera exactement au centre (index 17)
    const CENTER_INDEX = 17;
    const items = [];
    for (let i = 0; i < 35; i++) {
        const r = ["Aucun","Commun","Peu commun","Rare","Épique","Légendaire"][Math.floor(Math.random()*6)];
        if (r === "Aucun") {
            items.push({ name: "— Rien —", rarity: "Aucun", effect: "" });
        } else {
            const p = window.ALL_ARTIFACTS.filter(a => a.rarity === r);
            items.push(p.length ? p[Math.floor(Math.random()*p.length)] : window.ALL_ARTIFACTS[0]);
        }
    }
    // Placer le vrai résultat au centre
    if (won) {
        items[CENTER_INDEX] = won;
    } else {
        items[CENTER_INDEX] = { name: "— Rien —", rarity: "Aucun", effect: "" };
    }

    const ITEM_W = 156;
    const OFFSET = CENTER_INDEX * ITEM_W - 430;

    box.innerHTML = `<div class="text-xs text-amber-400 font-bold mb-2 uppercase tracking-wider">Tirage (Étage ${floor} — ${diff})...</div>
    <div class="roulette-container w-full bg-infernal-900 border border-infernal-600 rounded-xl py-6 px-4 relative my-2"><div class="roulette-pointer"></div><div id="roulette-track" class="roulette-track" style="transform:translateX(0)">${items.map(it => `<div class="w-[140px] flex-shrink-0 bg-infernal-800 border ${borderStyle(it.rarity)} rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-lg"><span class="text-[10px] px-2 py-0.5 rounded border ${badgeStyle(it.rarity)} mb-1">${it.rarity}</span><div class="font-black text-white text-xs truncate w-full">${it.name}</div></div>`).join('')}</div></div>
    <div class="text-[11px] text-stone-500 italic mt-2">Roulette magique...</div>`;

    // Verrouiller pendant l'animation
    lootAnimating = true;

    // Animation plus lente (6s) avec courbe d'easing plus dramatique pour la tension
    setTimeout(() => {
        const t = document.getElementById('roulette-track');
        if (t) {
            t.style.transition = 'transform 6s cubic-bezier(0.05, 0.7, 0.1, 1)';
            t.style.transform = `translateX(-${OFFSET}px)`;
        }
    }, 100);

    // Déverrouiller après l'animation + affichage résultat
    setTimeout(() => {
        if (won) {
            box.innerHTML = `<div class="text-center" style="animation: bounceLimited 1.5s ease-out 3;">
                <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">🎉 Artefact Obtenu !</span>
                <h4 class="font-black text-white text-lg mb-1">${won.name}</h4>
                <span class="text-[10px] inline-block px-2.5 py-0.5 rounded border ${badgeStyle(rarity)} mb-2">${rarity}</span>
                <p class="text-xs text-stone-300 text-center mb-3 max-w-md mx-auto">${won.effect}</p>
                <button onclick="rollLootRoulette()" class="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow">Relancer</button>
            </div>`;
        } else {
            box.innerHTML = `<div class="text-center"><span class="text-xs font-bold text-red-400 uppercase tracking-wider">💨 Aucun Artefact</span><p class="text-xs text-stone-400 my-3">Rien trouvé.</p><button onclick="rollLootRoulette()" class="bg-infernal-700 hover:bg-infernal-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition">Réessayer</button></div>`;
        }
        lootAnimating = false; // Déverrouiller
    }, 6200);
}

// ===========================
// COFFRE BOSS (3 PASSIFS)
// ===========================
function rollBossPassives() {
    const floor = parseInt(document.getElementById('boss-floor-select').value);
    const box = document.getElementById('loot-animation-container');
    if (!box) return;

    const rarity = pickRarity(PASSIVE_PROBS[1], PASSIVE_PROBS[10], floor);
    const pool = window.ALL_PASSIVES.filter(p => p.rarity === rarity);
    const picks = []; const copy = [...pool];
    for (let i = 0; i < 3 && copy.length; i++) { const idx = Math.floor(Math.random()*copy.length); picks.push(copy[idx]); copy.splice(idx,1); }
    // NE PAS ajouter à foundPassives ici — seulement celui choisi le sera

    box.innerHTML = `<div class="text-center py-8"><div class="inline-block animate-spin text-amber-400 text-3xl mb-3"><i class="fa-solid fa-chest"></i>📦</div><div class="text-xs text-amber-400 font-bold uppercase tracking-wider">Ouverture Coffre Boss (Étage ${floor})</div><p class="text-xs text-stone-400 mt-1">Tirage de 3 passifs <strong class="text-white">${rarity}</strong>...</p></div>`;
    setTimeout(() => {
        let h = `<div class="w-full"><div class="text-center mb-4"><span class="text-xs font-bold text-amber-400 uppercase tracking-wider">🏆 Coffre Ouvert ! (Rareté : <span class="text-white">${rarity}</span>)</span><p class="text-xs text-stone-300 mt-1">Choisissez l'un des 3 passifs :</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4">`;
        picks.forEach(p => {
            const safeName = p.name.replace(/'/g, "\\'");
            h += `<div class="bg-infernal-900 border ${borderStyle(p.rarity)} rounded-xl p-4 flex flex-col justify-between shadow-xl hover:scale-105 transition"><div><div class="flex justify-between items-start mb-2"><span class="font-bold text-white text-sm">${p.name}</span><span class="text-[10px] px-2 py-0.5 rounded border ${badgeStyle(p.rarity)}">${p.rarity}</span></div><p class="text-xs text-stone-300 mb-4">${p.effect}</p></div><div class="pt-3 border-t border-infernal-800 flex justify-between items-center text-xs"><span class="text-stone-400">Budget : ${p.cost} pt(s)</span><button onclick="chooseBossPassive('${safeName}')" class="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs font-bold transition">Prendre</button></div></div>`;
        });
        h += `</div><div class="text-center mt-6"><button onclick="rollBossPassives()" class="bg-infernal-700 hover:bg-infernal-600 text-stone-300 px-4 py-2 rounded-lg text-xs font-bold transition">Relancer coffre</button></div></div>`;
        box.innerHTML = h;
    }, 2000);
}

// Appelé quand le joueur choisit un des 3 passifs du coffre de boss
function chooseBossPassive(name) {
    if (!hubState.foundPassives.includes(name)) {
        hubState.foundPassives.push(name);
        saveHubState();
    }
    alert(`Passif "${name}" choisi et ajouté au codex (découvert) !`);
    // Re-render le coffre pour permettre de relancer si souhaité
    rollBossPassives();
}

window.onload = loadState;