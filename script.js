/* ==========================================================================
   GRIDIRON EDGE - WEEK 6 (2026 SEASON) ACTIVE DATA & SCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Switcher
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            themeBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
        });
    }

    // Navigation Active Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

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
   ACTIVE 2026 NFL PLAYERS - WEEK 6 PROJECTIONS & BYE WEEKS
   Week 6 Byes: CIN, DET, MIA, MIN
   ========================================================================== */
const ACTIVE_2026_WEEK6_PLAYERS = [
    { rank: 1, name: "Bijan Robinson", pos: "RB", team: "ATL", matchup: "vs CHI", pprPts: 22.8, stdPts: 18.2, status: "Active" },
    { rank: 2, name: "Josh Allen", pos: "QB", team: "BUF", matchup: "@ LV", pprPts: 25.4, stdPts: 25.4, status: "Active" },
    { rank: 3, name: "CeeDee Lamb", pos: "WR", team: "DAL", matchup: "@ GB", pprPts: 21.6, stdPts: 15.1, status: "Active" },
    { rank: 4, name: "Christian McCaffrey", pos: "RB", team: "SF", matchup: "vs WAS", pprPts: 20.9, stdPts: 16.4, status: "Active" },
    { rank: 5, name: "Puka Nacua", pos: "WR", team: "LAR", matchup: "vs ARI", pprPts: 20.4, stdPts: 14.2, status: "Active" },
    { rank: 6, name: "Kenneth Walker III", pos: "RB", team: "SEA", matchup: "@ DEN", pprPts: 19.8, stdPts: 16.0, status: "Active" },
    { rank: 7, name: "Jaxon Smith-Njigba", pos: "WR", team: "SEA", matchup: "@ DEN", pprPts: 19.1, stdPts: 13.5, status: "Active" },
    { rank: 8, name: "Derrick Henry", pos: "RB", team: "BAL", matchup: "@ CLE", pprPts: 18.9, stdPts: 17.2, status: "Active" },
    { rank: 9, name: "Patrick Mahomes", pos: "QB", team: "KC", matchup: "vs LAC", pprPts: 23.5, stdPts: 23.5, status: "Active" },
    { rank: 10, name: "Travis Kelce", pos: "TE", team: "KC", matchup: "vs LAC", pprPts: 15.8, stdPts: 10.9, status: "Active" },
    { rank: 11, name: "Brock Bowers", pos: "TE", team: "LV", matchup: "vs BUF", pprPts: 19.6, stdPts: 13.1, status: "Active" },
    
    // WEEK 6 2026 BYE WEEK ACTIVE STARTERS (CIN, DET, MIA, MIN)
    { rank: "--", name: "Ja'Marr Chase", pos: "WR", team: "CIN", matchup: "BYE WEEK", pprPts: 0.0, stdPts: 0.0, status: "BYE" },
    { rank: "--", name: "Jahmyr Gibbs", pos: "RB", team: "DET", matchup: "BYE WEEK", pprPts: 0.0, stdPts: 0.0, status: "BYE" },
    { rank: "--", name: "Justin Jefferson", pos: "WR", team: "MIN", matchup: "BYE WEEK", pprPts: 0.0, stdPts: 0.0, status: "BYE" },
    { rank: "--", name: "Jaylen Waddle", pos: "WR", team: "MIA", matchup: "BYE WEEK", pprPts: 0.0, stdPts: 0.0, status: "BYE" }
];

let currentScoringMode = 'ppr';
let currentPosFilter = 'ALL';

function initRankingsPage() {
    const searchInput = document.getElementById('playerSearchInput');
    const posFilterSelect = document.getElementById('posFilterSelect');
    const pprToggleBtn = document.getElementById('pprToggleBtn');

    renderRankings();

    if (searchInput) searchInput.addEventListener('input', () => renderRankings());

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

    let filtered = ACTIVE_2026_WEEK6_PLAYERS.filter(p => {
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
        const isBye = p.status === 'BYE';
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${isBye ? 'BYE' : '#' + (idx + 1)}</strong></td>
            <td>
                <strong>${p.name}</strong> 
                ${isBye ? '<span class="bye-badge">WEEK 6 BYE</span>' : ''}
            </td>
            <td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td>
            <td>${p.team} <span class="matchup-text">(${p.matchup})</span></td>
            <td><strong>${isBye ? '0.0 PPG' : pts.toFixed(1) + ' PPG'}</strong></td>
        `;
        tableBody.appendChild(row);
    });
}

function initDraftPage() {
    const toggleBtn = document.getElementById('sleeperToggleBtn');
    const sleeperBox = document.getElementById('sleeperSecretBox');

    if (toggleBtn && sleeperBox) {
        toggleBtn.addEventListener('click', () => {
            if (sleeperBox.style.display === 'none' || sleeperBox.style.display === '') {
                sleeperBox.style.display = 'block';
                toggleBtn.textContent = '🙈 Hide Week 6 Waiver Target Notes';
            } else {
                sleeperBox.style.display = 'none';
                toggleBtn.textContent = '💡 Reveal Week 6 Waiver Wire Sleepers';
            }
        });
    }
}

function initTradeAnalyzerPage() {
    const analyzeBtn = document.getElementById('analyzeTradeBtn');
    const meterBar = document.getElementById('tradeMeterBar');
    const resultToast = document.getElementById('tradeResultToast');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const teamAVal = parseFloat(document.getElementById('teamAVal').value) || 0;
            const teamBVal = parseFloat(document.getElementById('teamBVal').value) || 0;

            if (teamAVal <= 0 || teamBVal <= 0) {
                alert("⚠️ Please select active players for both sides of the trade!");
                return;
            }

            const total = teamAVal + teamBVal;
            const ratio = (teamAVal / total) * 100;
            const diff = Math.abs(teamAVal - teamBVal);

            if (meterBar) meterBar.style.width = `${ratio}%`;

            let message = '';
            if (diff <= 2.5) {
                message = "⚖️ BALANCED TRADE! Fair deal for both Week 6 managers.";
            } else if (teamAVal > teamBVal) {
                message = `🔥 TEAM A WINS THE DEAL! Team A gains +${diff.toFixed(1)} Week 6 value edge.`;
            } else {
                message = `🔥 TEAM B WINS THE DEAL! Team B gains +${diff.toFixed(1)} Week 6 value edge.`;
            }

            if (resultToast) {
                resultToast.textContent = message;
                resultToast.style.display = 'block';
            }

            alert(`Week 6 Trade Analysis:\n${message}`);
        });
    }
}
