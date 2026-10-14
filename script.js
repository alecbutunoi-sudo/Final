/* ==========================================================================
   GRIDIRON EDGE - GLOBAL JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Switcher Interactivity
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            themeBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
        });
    }

    // 2. Active Page Highlighting in Menu
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // 3. Initialize Specific Page Features
    if (document.getElementById('playerTableBody')) {
        initRankingsPage();
    }
    if (document.getElementById('tradeForm')) {
        initTradeAnalyzerPage();
    }
    if (document.getElementById('sleeperToggleBtn')) {
        initDraftPage();
    }
});

/* ==========================================================================
   PAGE 1: RANKINGS & LIVE SEARCH INTERACTIVITY
   ========================================================================== */
const PLAYERS_DATA = [
    { rank: 1, name: "Christian McCaffrey", pos: "RB", team: "SF", pprPts: 22.4, stdPts: 18.1 },
    { rank: 2, name: "CeeDee Lamb", pos: "WR", team: "DAL", pprPts: 21.8, stdPts: 15.2 },
    { rank: 3, name: "Tyreek Hill", pos: "WR", team: "MIA", pprPts: 21.2, stdPts: 15.9 },
    { rank: 4, name: "Breece Hall", pos: "RB", team: "NYJ", pprPts: 19.5, stdPts: 14.8 },
    { rank: 5, name: "Ja'Marr Chase", pos: "WR", team: "CIN", pprPts: 19.1, stdPts: 13.9 },
    { rank: 6, name: "Bijan Robinson", pos: "RB", team: "ATL", pprPts: 18.7, stdPts: 14.1 },
    { rank: 7, name: "Travis Kelce", pos: "TE", team: "KC", pprPts: 16.4, stdPts: 11.2 },
    { rank: 8, name: "Josh Allen", pos: "QB", team: "BUF", pprPts: 24.2, stdPts: 24.2 },
    { rank: 9, name: "Patrick Mahomes", pos: "QB", team: "KC", pprPts: 22.1, stdPts: 22.1 },
    { rank: 10, name: "Sam LaPorta", pos: "TE", team: "DET", pprPts: 14.8, stdPts: 10.1 }
];

let currentScoringMode = 'ppr';
let currentPosFilter = 'ALL';

function initRankingsPage() {
    const searchInput = document.getElementById('playerSearchInput');
    const posFilterSelect = document.getElementById('posFilterSelect');
    const pprToggleBtn = document.getElementById('pprToggleBtn');

    renderRankings();

    if (searchInput) {
        searchInput.addEventListener('input', () => renderRankings());
    }

    if (posFilterSelect) {
        posFilterSelect.addEventListener('change', (e) => {
            currentPosFilter = e.target.value;
            renderRankings();
        });
    }

    if (pprToggleBtn) {
        pprToggleBtn.addEventListener('click', () => {
            currentScoringMode = currentScoringMode === 'ppr' ? 'std' : 'ppr';
            pprToggleBtn.textContent = currentScoringMode === 'ppr' ? 'Mode: PPR Scoring' : 'Mode: Standard Scoring';
            renderRankings();
        });
    }
}

function renderRankings() {
    const tableBody = document.getElementById('playerTableBody');
    const searchVal = (document.getElementById('playerSearchInput')?.value || '').toLowerCase();
    
    if (!tableBody) return;

    let filtered = PLAYERS_DATA.filter(p => {
        const matchesName = p.name.toLowerCase().includes(searchVal) || p.team.toLowerCase().includes(searchVal);
        const matchesPos = currentPosFilter === 'ALL' || p.pos === currentPosFilter;
        return matchesName && matchesPos;
    });

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No players match your search criteria.</td></tr>`;
        return;
    }

    filtered.forEach((p, idx) => {
        const pts = currentScoringMode === 'ppr' ? p.pprPts : p.stdPts;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${idx + 1}</strong></td>
            <td><strong>${p.name}</strong></td>
            <td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td>
            <td>${p.team}</td>
            <td><strong>${pts.toFixed(1)} PPG</strong></td>
        `;
        tableBody.appendChild(row);
    });
}

/* ==========================================================================
   PAGE 2: DRAFT KIT SHOW/HIDE INSIGHTS INTERACTIVITY
   ========================================================================== */
function initDraftPage() {
    const toggleBtn = document.getElementById('sleeperToggleBtn');
    const sleeperBox = document.getElementById('sleeperSecretBox');

    if (toggleBtn && sleeperBox) {
        toggleBtn.addEventListener('click', () => {
            if (sleeperBox.style.display === 'none' || sleeperBox.style.display === '') {
                sleeperBox.style.display = 'block';
                toggleBtn.textContent = '🙈 Hide Secret Sleeper Picks';
            } else {
                sleeperBox.style.display = 'none';
                toggleBtn.textContent = '💡 Show Secret Sleeper Picks';
            }
        });
    }
}

/* ==========================================================================
   PAGE 3: TRADE ANALYZER INTERACTIVITY WITH FAIRNESS METER
   ========================================================================== */
function initTradeAnalyzerPage() {
    const analyzeBtn = document.getElementById('analyzeTradeBtn');
    const meterBar = document.getElementById('tradeMeterBar');
    const resultToast = document.getElementById('tradeResultToast');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const teamAVal = parseFloat(document.getElementById('teamAVal').value) || 0;
            const teamBVal = parseFloat(document.getElementById('teamBVal').value) || 0;

            if (teamAVal <= 0 || teamBVal <= 0) {
                alert("⚠️ Please select or enter valid player values for both teams!");
                return;
            }

            const total = teamAVal + teamBVal;
            const ratio = (teamAVal / total) * 100;
            const diff = Math.abs(teamAVal - teamBVal);

            if (meterBar) {
                meterBar.style.width = `${ratio}%`;
            }

            let message = '';
            if (diff <= 3) {
                message = "⚖️ EXCELLENT TRADE! This deal is perfectly balanced for both fantasy managers.";
            } else if (teamAVal > teamBVal) {
                message = `🔥 TEAM A WINS THE TRADE! Team A gains +${diff.toFixed(1)} value edge.`;
            } else {
                message = `🔥 TEAM B WINS THE TRADE! Team B gains +${diff.toFixed(1)} value edge.`;
            }

            if (resultToast) {
                resultToast.textContent = message;
                resultToast.style.display = 'block';
            }

            alert(`Trade Analyzed!\n${message}`);
        });
    }
}
