// Game State
let player = { hp: 3, maxHp: 3, xp: 0, level: 1, coins: 0, score: 0 };
let stats = { correct: 0, wrong: 0, startTime: 0, timeTaken: 0, maxCombo: 0 };
let gameState = {
    unlockedWorld: 0, currentWorld: 0, currentQuestion: 0, timer: 30, timerInterval: null,
    answered: false, combo: 0, inBossFight: false, currentBossHp: 0
};

// Worlds & Questions Data Structure
const worlds = [
    {
        id: 0, name: "Logic Castle", icon: "🧠", topic: "Logic & Proofs",
        questions: [
            { type: "mcq", q: "If P → Q is true and P is true, what follows?", options: ["Q is true","Q is false","P is false","Nothing"], answer: 0, hint: "Modus Ponens rule.", explanation: "By Modus Ponens, P → Q together with P gives Q." },
            { type: "tf", q: "True or False: The contrapositive of P → Q is ¬Q → ¬P.", answer: "True", hint: "Flip the variables and negate both.", explanation: "The contrapositive is always logically equivalent, forming ¬Q → ¬P." },
            { type: "input", q: "If P is False and Q is True, what is the boolean value of P OR Q? (Type 'True' or 'False')", answer: "True", hint: "OR is true if at least one is true.", explanation: "OR (∨) is true when at least one of the propositions is true." }
        ],
        boss: {
            name: "Lord Logic", icon: "🧛", hp: 2, maxHp: 2,
            questions: [
                { type: "mcq", q: "Which connective is false only when both inputs are true?", options: ["OR","AND","NAND","XOR"], answer: 2, hint: "It is the exact opposite of AND.", explanation: "NAND is false only when both inputs are true." },
                { type: "match", q: "Match the rules of inference:", pairs: [{left: "P, P→Q ∴ Q", right: "Modus Ponens"}, {left: "¬Q, P→Q ∴ ¬P", right: "Modus Tollens"}], options: ["Modus Ponens", "Modus Tollens", "Addition"], hint: "Tollens uses negation.", explanation: "Modus Ponens derives the consequence, Tollens negates the antecedent." }
            ]
        }
    },
    {
        id: 1, name: "Set Forest", icon: "🔵", topic: "Set Theory",
        questions: [
            { type: "input", q: "A={1,2,3}, B={3,4}. Write elements of A ∩ B (e.g. 3):", answer: "3", hint: "Intersection means elements in BOTH sets.", explanation: "The only common element between A and B is 3." },
            { type: "tf", q: "The power set of a set with 3 elements has 9 elements.", answer: "False", hint: "Formula is 2^n.", explanation: "Power set size is 2^n. 2^3 = 8, not 9." },
            { type: "mcq", q: "Which operation removes elements of B from A?", options: ["A ∩ B","A ∪ B","A − B","A × B"], answer: 2, hint: "Difference operation.", explanation: "The set difference A - B contains elements in A but not in B." }
        ],
        boss: {
            name: "Set Sorcerer", icon: "🧙‍♂️", hp: 2, maxHp: 2,
            questions: [
                { type: "match", q: "Match the Set Notations:", pairs: [{left: "A ∪ B", right: "Union"}, {left: "A ∩ B", right: "Intersection"}, {left: "A ⊆ B", right: "Subset"}], options: ["Union", "Intersection", "Subset", "Superset"], hint: "∪ looks like a U for Union.", explanation: "∪ is Union, ∩ is Intersection, ⊆ means Subset." },
                { type: "input", q: "If |A|=4 and |B|=5, and they are disjoint, what is |A∪B|?", answer: "9", hint: "Just add them since they are disjoint.", explanation: "Since A ∩ B is empty, |A∪B| = |A| + |B| = 4 + 5 = 9." }
            ]
        }
    },
    {
        id: 2, name: "Relation Ruins", icon: "🔗", topic: "Relations",
        questions: [
            { type: "mcq", q: "A relation R is reflexive when:", options: ["aRa for every a","aRb implies bRa","aRb for every a,b","aRb and bRc imply aRc"], answer: 0, hint: "Reflects onto itself.", explanation: "Reflexive means every element is related to itself (aRa)." },
            { type: "tf", q: "A POSET relation must be Reflexive, Antisymmetric, and Transitive.", answer: "True", hint: "Remember RAT.", explanation: "A Partial Order Set (POSET) requires Reflexivity, Antisymmetry, and Transitivity." },
            { type: "input", q: "If relation R is symmetric, and (x, y) is in R, what must also be in R? (Format: (y, x))", answer: "(y, x)", hint: "Swap the variables.", explanation: "Symmetry means if aRb exists, bRa must also exist." }
        ],
        boss: {
            name: "Relation Phantom", icon: "👻", hp: 2, maxHp: 2,
            questions: [
                { type: "mcq", q: "Which diagram commonly represents a POSET?", options: ["Hasse diagram","Pie chart","Truth table","Venn diagram"], answer: 0, hint: "Named after Helmut Hasse.", explanation: "A Hasse diagram is used to represent finite partially ordered sets." },
                { type: "tf", q: "An Equivalence relation is Reflexive, Symmetric, and Transitive.", answer: "True", hint: "RST stands for Equivalence.", explanation: "Equivalence relations divide sets into equivalence classes using RST properties." }
            ]
        }
    },
    {
        id: 3, name: "Combinatorics Mine", icon: "🎲", topic: "Counting",
        questions: [
            { type: "input", q: "How many ways can 4 different books be arranged? (Calculate 4!)", answer: "24", hint: "4 × 3 × 2 × 1", explanation: "4! = 4 × 3 × 2 × 1 = 24." },
            { type: "mcq", q: "How many ways can 2 students be selected from 5? (Order doesn't matter)", options: ["10","20","5","25"], answer: 0, hint: "Use Combination formula C(n,k).", explanation: "C(5,2) = 5! / (2!(5-2)!) = 10." },
            { type: "tf", q: "Placing n+1 objects into n boxes guarantees at least one box has 2 objects.", answer: "True", hint: "Pigeonhole principle.", explanation: "This is the classic definition of the Pigeonhole Principle." }
        ],
        boss: {
            name: "Combo King", icon: "👹", hp: 2, maxHp: 2,
            questions: [
                { type: "input", q: "Calculate 5! (Factorial)", answer: "120", hint: "5 * 4 * 3 * 2 * 1", explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120." },
                { type: "match", q: "Match counting principles:", pairs: [{left: "Order matters", right: "Permutation"}, {left: "Order doesn't matter", right: "Combination"}], options: ["Permutation", "Combination", "Probability"], hint: "Permutations lock things in order.", explanation: "Permutations are ordered arrangements, Combinations are unordered selections." }
            ]
        }
    },
    {
        id: 4, name: "Graph Tower", icon: "🕸️", topic: "Graph Theory",
        questions: [
            { type: "mcq", q: "A connected graph has an Euler circuit when:", options: ["Every vertex has odd degree","Every vertex has even degree","Exactly two vertices are odd","It has no edges"], answer: 1, hint: "You need to enter and leave every node.", explanation: "Euler's theorem states a connected graph has an Euler circuit if and only if every vertex has an even degree." },
            { type: "input", q: "A tree with n vertices contains how many edges? (Formula with n)", answer: "n-1", hint: "Subtract 1.", explanation: "By definition, a tree with n vertices always has exactly n - 1 edges." },
            { type: "graph", q: "Click the nodes that have an ODD degree (number of edges).", 
              nodes: [ {id:"A",x:150,y:40,edges:["B","C"]}, {id:"B",x:70,y:140,edges:["A","C","D"]}, {id:"C",x:230,y:140,edges:["A","B","D"]}, {id:"D",x:150,y:230,edges:["B","C"]} ], 
              answer: ["B", "C"], hint: "Count the lines connected to each node.", explanation: "Nodes B and C connect to 3 edges each (an odd degree)." }
        ],
        boss: {
            name: "Graph Dragon", icon: "🐉", hp: 2, maxHp: 2,
            questions: [
                { type: "tf", q: "A Hamiltonian path visits every EDGE exactly once.", answer: "False", hint: "Euler vs Hamiltonian.", explanation: "Euler visits every EDGE once. Hamiltonian visits every VERTEX exactly once." },
                { type: "graph", q: "Select the nodes to form the ONLY valid Eulerian path endpoints in this graph.", 
                  nodes: [ {id:"X",x:50,y:100,edges:["Y"]}, {id:"Y",x:150,y:50,edges:["X","Z","W"]}, {id:"Z",x:250,y:100,edges:["Y","W"]}, {id:"W",x:150,y:150,edges:["Y","Z"]} ], 
                  answer: ["X", "W"], hint: "Endpoints of an Eulerian path must have an odd degree.", explanation: "Nodes X (degree 1) and W (degree 3) are the only nodes with odd degrees." }
            ]
        }
    },
    {
        id: 5, name: "The Void", icon: "😈", topic: "Final Exam",
        questions: [], // No normal questions
        boss: {
            name: "MATH OMEGA", icon: "👾", hp: 3, maxHp: 3,
            questions: [
                { type: "input", q: "If a graph has 6 vertices of degree 3, how many edges does it have?", answer: "9", hint: "Sum of degrees = 2 * Edges", explanation: "Sum of degrees = 6 * 3 = 18. Since every edge adds 2 to the sum, Edges = 18 / 2 = 9." },
                { type: "tf", q: "The empty set ∅ is a subset of EVERY set.", answer: "True", hint: "Universal property of sets.", explanation: "By definition, the empty set is a subset of all possible sets." },
                { type: "mcq", q: "Which of these grows the fastest?", options: ["n^2", "n!", "2^n", "n log n"], answer: 1, hint: "Factorial growth is massive.", explanation: "Factorial (n!) grows asymptotically faster than polynomials or exponentials like 2^n." }
            ]
        }
    }
];

// --- Utilities ---
const getRankTitle = (lvl) => ["Beginner", "Logic Learner", "Math Explorer", "Math Warrior", "Math Master"][Math.min(lvl-1, 4)];
const getEl = id => document.getElementById(id);

// --- Initialization ---
function startGame() {
    getEl("startScreen").classList.add("hidden");
    getEl("mapScreen").classList.remove("hidden");
    stats.startTime = Date.now();
    updateMap();
    updateHUD();
}

function updateHUD() {
    getEl("level").innerText = player.level;
    getEl("rankTitle").innerText = getRankTitle(player.level);
    getEl("xp").innerText = player.xp;
    getEl("score").innerText = player.score;
    getEl("hp").innerText = player.hp;
    getEl("coins").innerText = player.coins;
}

function addXP(amount) {
    player.xp += amount;
    let oldLevel = player.level;
    player.level = player.xp >= 1000 ? 5 : player.xp >= 500 ? 4 : player.xp >= 250 ? 3 : player.xp >= 100 ? 2 : 1;
    if(player.level > oldLevel) alert(`🎉 LEVEL UP! You are now a Level ${player.level} ${getRankTitle(player.level)}!`);
    updateHUD();
}

function toggleShop() {
    getEl("shopModal").classList.toggle("hidden");
}

function buyItem(type, cost) {
    if(player.coins >= cost) {
        player.coins -= cost;
        if(type === 'life') { player.hp++; }
        if(type === 'time') { gameState.timer += 20; getEl("timer").innerText = gameState.timer; }
        if(type === 'skip') { checkAnswer(true); toggleShop(); return; }
        updateHUD();
        alert("Item purchased!");
    } else alert("Not enough coins! Earn more by answering quickly and correctly.");
}

// --- Map Logic ---
function updateMap() {
    let mapLines = document.querySelectorAll(".map-line");
    worlds.forEach((w, i) => {
        let node = getEl("node" + i);
        node.className = "map-node";
        if(i < gameState.unlockedWorld) { node.classList.add("completed"); if(mapLines[i]) mapLines[i].classList.add("completed"); }
        else if(i === gameState.unlockedWorld) node.classList.add("unlocked");
        else node.classList.add("locked");
        
        if(i === 5) node.classList.add("final-boss-node");
    });
    
    // Move Avatar
    let activeNode = getEl("node" + Math.min(gameState.unlockedWorld, 5));
    activeNode.appendChild(getEl("playerAvatar"));
}

function enterWorld(i) {
    if(i > gameState.unlockedWorld) return;
    gameState.currentWorld = i;
    gameState.currentQuestion = 0;
    gameState.inBossFight = false;
    getEl("mapScreen").classList.add("hidden");
    getEl("gameScreen").classList.remove("hidden");
    loadQuestion();
}

// --- Game Logic ---
function loadQuestion() {
    clearInterval(gameState.timerInterval);
    gameState.answered = false;
    gameState.timer = 30;
    getEl("feedback").classList.add("hidden");
    getEl("nextBtn").disabled = true;
    
    let w = worlds[gameState.currentWorld];
    
    // Check if entering boss fight
    if(!gameState.inBossFight && gameState.currentQuestion >= w.questions.length) {
        gameState.inBossFight = true;
        gameState.currentQuestion = 0;
        gameState.currentBossHp = w.boss.hp;
        getEl("bossHud").classList.remove("hidden");
        getEl("bossName").innerText = w.boss.name;
        getEl("bossIcon").innerText = w.boss.icon;
        updateBossHP();
    }
    
    let q = gameState.inBossFight ? w.boss.questions[gameState.currentQuestion] : w.questions[gameState.currentQuestion];
    
    getEl("worldBadge").textContent = `WORLD ${gameState.currentWorld+1} • ${w.topic}`;
    getEl("worldTitle").textContent = w.icon + " " + w.name;
    let totalQ = gameState.inBossFight ? w.boss.questions.length : w.questions.length;
    let prefix = gameState.inBossFight ? "⚔️ Boss Phase " : "Question ";
    getEl("questionNumber").textContent = prefix + (gameState.currentQuestion+1) + " / " + totalQ;
    getEl("questionText").textContent = q.q;
    getEl("progressBar").style.width = ((gameState.currentQuestion) / totalQ * 100) + "%";
    
    renderInputArea(q);
    startTimer();
}

function updateBossHP() {
    let w = worlds[gameState.currentWorld];
    let pct = (gameState.currentBossHp / w.boss.maxHp) * 100;
    getEl("bossHpFill").style.width = pct + "%";
}

// --- Input Rendering ---
let selectedGraphNodes = [];

function renderInputArea(q) {
    let area = getEl("questionArea");
    let html = "";
    selectedGraphNodes = [];
    
    if(q.type === "mcq") {
        html = `<div class="options-grid">`;
        q.options.forEach((opt, i) => {
            html += `<button class="option-btn" onclick="submitMCQ(${i}, this)">${opt}</button>`;
        });
        html += `</div>`;
    } else if (q.type === "tf") {
        html = `<div class="options-grid">
                  <button class="option-btn" onclick="submitTF('True', this)">True</button>
                  <button class="option-btn" onclick="submitTF('False', this)">False</button>
                </div>`;
    } else if (q.type === "input") {
        html = `<div class="text-input-container">
                  <input type="text" id="textInputAns" class="text-input" placeholder="Type your answer here..." autocomplete="off">
                  <button class="primary-btn" onclick="submitTextInput()">Submit</button>
                </div>`;
    } else if (q.type === "match") {
        html = `<div class="match-grid">`;
        q.pairs.forEach((p, i) => {
            html += `<div class="match-row">
                        <div class="match-left">${p.left}</div>
                        <select id="matchSelect_${i}" class="match-select">
                            <option value="">-- Select Match --</option>
                            ${q.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                     </div>`;
        });
        html += `</div><br><button class="primary-btn" onclick="submitMatch()">Submit Matches</button>`;
    } else if (q.type === "graph") {
        html = `<div class="graph-container">
                  <svg width="300" height="280" class="graph-svg">`;
        
        // Render Edges
        q.nodes.forEach(n => {
            n.edges.forEach(eTarget => {
                let target = q.nodes.find(x => x.id === eTarget);
                html += `<line x1="${n.x}" y1="${n.y}" x2="${target.x}" y2="${target.y}" stroke="#666" stroke-width="3"/>`;
            });
        });
        
        // Render Nodes
        q.nodes.forEach(n => {
            html += `<circle cx="${n.x}" cy="${n.y}" r="22" fill="#1e2a4f" stroke="#fff" stroke-width="2" class="graph-node" id="gn_${n.id}" onclick="toggleGraphNode('${n.id}')"/>`;
            html += `<text x="${n.x}" y="${n.y+6}" fill="white" font-size="16" font-weight="bold" text-anchor="middle" pointer-events="none">${n.id}</text>`;
        });
        
        html += `</svg><br><button class="primary-btn" onclick="submitGraph()">Submit Selection</button></div>`;
    }
    area.innerHTML = html;
}

// --- Submit Handlers ---
const getCurrentQ = () => gameState.inBossFight ? worlds[gameState.currentWorld].boss.questions[gameState.currentQuestion] : worlds[gameState.currentWorld].questions[gameState.currentQuestion];

function submitMCQ(idx, btn) {
    if(gameState.answered) return;
    document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
    let correct = (idx === getCurrentQ().answer);
    if(btn) btn.classList.add(correct ? "correct" : "wrong");
    checkAnswer(correct);
}

function submitTF(val, btn) {
    if(gameState.answered) return;
    document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
    let correct = (val === getCurrentQ().answer);
    if(btn) btn.classList.add(correct ? "correct" : "wrong");
    checkAnswer(correct);
}

function submitTextInput() {
    if(gameState.answered) return;
    let val = getEl("textInputAns").value.trim().toLowerCase();
    getEl("textInputAns").disabled = true;
    checkAnswer(val === getCurrentQ().answer.toLowerCase());
}

function submitMatch() {
    if(gameState.answered) return;
    let q = getCurrentQ();
    let correct = true;
    q.pairs.forEach((p, i) => {
        let sel = getEl("matchSelect_"+i);
        sel.disabled = true;
        if(sel.value !== p.right) correct = false;
    });
    checkAnswer(correct);
}

function toggleGraphNode(id) {
    if(gameState.answered) return;
    let idx = selectedGraphNodes.indexOf(id);
    let circ = getEl("gn_"+id);
    if(idx > -1) { selectedGraphNodes.splice(idx, 1); circ.classList.remove("selected"); }
    else { selectedGraphNodes.push(id); circ.classList.add("selected"); }
}

function submitGraph() {
    if(gameState.answered) return;
    let q = getCurrentQ();
    let correct = q.answer.length === selectedGraphNodes.length && q.answer.every(a => selectedGraphNodes.includes(a));
    checkAnswer(correct);
}

function useHint() {
    if(player.coins >= 20 && !gameState.answered) {
        player.coins -= 20;
        updateHUD();
        let fb = getEl("feedback");
        fb.classList.remove("hidden", "correct-feedback", "wrong-feedback");
        fb.innerHTML = `💡 <strong>Hint:</strong> ${getCurrentQ().hint}`;
    } else if (player.coins < 20) {
        alert("Not enough coins for a hint!");
    }
}

// --- Answer Resolution ---
function startTimer() {
    getEl("timer").innerText = gameState.timer;
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        getEl("timer").innerText = gameState.timer;
        if(gameState.timer <= 0) checkAnswer(false); // Time out = wrong
    }, 1000);
}

function checkAnswer(isCorrect) {
    if(gameState.answered) return;
    gameState.answered = true;
    clearInterval(gameState.timerInterval);
    getEl("nextBtn").disabled = false;
    
    let q = getCurrentQ();
    let fb = getEl("feedback");
    fb.classList.remove("hidden", "correct-feedback", "wrong-feedback");
    
    if(isCorrect) {
        stats.correct++;
        gameState.combo++;
        stats.maxCombo = Math.max(stats.maxCombo, gameState.combo);
        
        let multiplier = gameState.combo >= 10 ? 5 : (gameState.combo >= 5 ? 3 : (gameState.combo >= 3 ? 2 : 1));
        let earned = 20 * multiplier;
        player.score += earned;
        player.coins += 10;
        addXP(20 * multiplier);
        
        fb.classList.add("correct-feedback");
        fb.innerHTML = `✅ <strong>Correct!</strong> +${earned} pts<br><strong>Instructions on how to solve:</strong> ${q.explanation}`;
        
        if(gameState.inBossFight) {
            gameState.currentBossHp--;
            updateBossHP();
            getEl("bossIcon").classList.add("shake");
            setTimeout(() => getEl("bossIcon").classList.remove("shake"), 400);
        }
    } else {
        stats.wrong++;
        gameState.combo = 0;
        player.hp--;
        fb.classList.add("wrong-feedback");
        fb.innerHTML = `❌ <strong>Incorrect!</strong><br><strong>Instructions on how to solve:</strong> ${q.explanation}`;
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 400);
    }
    
    updateComboMeter();
    updateHUD();
}

function updateComboMeter() {
    let cm = getEl("comboMeter");
    if(gameState.combo >= 3) {
        cm.classList.remove("hidden");
        getEl("comboValue").innerText = gameState.combo + (gameState.combo >= 10 ? " (MEGA COMBO!)" : "");
    } else {
        cm.classList.add("hidden");
    }
}

function nextQuestion() {
    if(player.hp <= 0) {
        gameOver();
        return;
    }
    
    let w = worlds[gameState.currentWorld];
    let totalQ = gameState.inBossFight ? w.boss.questions.length : w.questions.length;
    
    gameState.currentQuestion++;
    
    if (gameState.inBossFight && gameState.currentBossHp <= 0) {
        worldComplete(); // Defeated boss
    } else if (gameState.inBossFight && gameState.currentQuestion >= totalQ) {
        gameOver(); // Ran out of boss questions before defeating it
    } else if (!gameState.inBossFight && gameState.currentQuestion >= totalQ) {
        loadQuestion(); // Transitions into boss fight automatically
    } else {
        loadQuestion(); // Next normal or boss question
    }
}

function worldComplete() {
    gameState.unlockedWorld = Math.max(gameState.unlockedWorld, gameState.currentWorld + 1);
    getEl("gameScreen").classList.add("hidden");
    getEl("bossHud").classList.add("hidden");
    
    if(gameState.currentWorld === 5) {
        showDashboard(); // Beat final boss!
    } else {
        alert("🎉 Boss Defeated! You've cleared the world and unlocked the next one!");
        getEl("mapScreen").classList.remove("hidden");
        updateMap();
    }
}

function gameOver() {
    getEl("gameScreen").classList.add("hidden");
    alert("💀 You ran out of HP or failed the Boss Fight! Returning to map...");
    player.hp = player.maxHp;
    updateHUD();
    getEl("mapScreen").classList.remove("hidden");
    updateMap();
}

// --- Dashboard ---
function showDashboard() {
    stats.timeTaken = Math.floor((Date.now() - stats.startTime) / 1000);
    let acc = (stats.correct / (stats.correct + stats.wrong)) * 100 || 0;
    
    getEl("dashboardScreen").classList.remove("hidden");
    getEl("mapScreen").classList.add("hidden");
    
    getEl("dashScore").innerText = player.score;
    getEl("dashRank").innerText = getRankTitle(player.level);
    getEl("dashCorrect").innerText = stats.correct;
    getEl("dashWrong").innerText = stats.wrong;
    getEl("dashAcc").innerText = acc.toFixed(1) + "%";
    getEl("dashTime").innerText = stats.timeTaken + "s";
    getEl("dashWorlds").innerText = gameState.unlockedWorld + "/6";
    getEl("dashCombo").innerText = "x" + stats.maxCombo;
}

function restartGame() {
    player = { hp: 3, maxHp: 3, xp: 0, level: 1, coins: 0, score: 0 };
    stats = { correct: 0, wrong: 0, startTime: Date.now(), timeTaken: 0, maxCombo: 0 };
    gameState = { unlockedWorld: 0, currentWorld: 0, currentQuestion: 0, timer: 30, timerInterval: null, answered: false, combo: 0, inBossFight: false, currentBossHp: 0 };
    
    getEl("dashboardScreen").classList.add("hidden");
    updateHUD();
    getEl("mapScreen").classList.remove("hidden");
    updateMap();
}
