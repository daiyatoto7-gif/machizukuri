function log(msg, isError = false) {
    const el = document.getElementById('debug-log');
    if (!el) return;
    const line = document.createElement('div');
    line.textContent = `> ${msg}`;
    if (isError) {
        line.className = 'error-msg';
        el.style.display = 'block';
        console.error(msg);
    } else {
        console.log(msg);
    }
    el.appendChild(line);

function showToast(msg) {
    const t = document.getElementById('toast-notification');
    t.innerText = msg;
    t.style.display = 'none';
    void t.offsetWidth; // trigger reflow
    t.style.display = 'block';
}

window.onerror = function (message, source, lineno, colno, error) {
    log(`Global Error: ${message} at line ${lineno}`, true);

function formatTimeShort(s) { if (s < 60) return `${Math.floor(s)}s`; if (s < 3600) return `${Math.floor(s / 60)}m`; return `${Math.floor(s / 3600)}h`; }
function formatTime(s) {
    s = Math.floor(s);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    if (d > 0) return `${d}日${h}時間${m}分${sec}秒`;
    if (h > 0) return `${h}時間${m}分${sec}秒`;
    if (m > 0) return `${m}分${sec}秒`;
    return `${sec}秒`;
}

function getNextRankXP(r) {

function getBuildingEffectHtml(type, level, nextLevel = null, isAscended = false) {
    const b = BUILDINGS[type];
    let html = "";

    // Helper to generate text for a single level
    // Note: If nextLevel is passed, we check if WE are transitioning to ascended?
    // Usually nextLevel is for current state -> next state.
    // If currently Ascended, nextLevel is Ascended L+1.
    // If Normal Lv.30, nextLevel could be Ascended Lv.1? 
    // The UI usually calls this for "Next Level" preview in the upgrade panel.
    // If we are showing the Ascension preview, we might call this with isAscended=true.

    const getEffectText = (lvl, asc) => {
        if (lvl === 0) return "効果なし";

        if (asc && ASCENSION_BASE_STATS[type]) {
            // Ascended Logic
            const baseProd = ASCENSION_BASE_STATS[type].prod;
            let parts = [];
            for (let r in baseProd) {
                // Formula: Base * 1.10^(L-1)
                const val = baseProd[r] * Math.pow(1.10, lvl - 1);
                const icon = (r == 'money' ? '💰' : r == 'food' ? '🌾' : r == 'wood' ? '🌲' : r == 'stone' ? '🪨' : r == 'iron' ? '🔩' : '💧');
                parts.push(`${icon}${val.toFixed(1)}/s`);
            }
            return parts.length ? parts.join(' ') : '効果なし';
        }

        if (type === 'well') {
            // 水生産 + 農場バフ
            const buffVal = 1.3 + (lvl - 1) * 0.03;
            let parts = [`隣接畑x${buffVal.toFixed(2)}`];

            // 水生産
            if (b.prod.water) {
                const waterVal = b.prod.water * lvl * Math.pow(1.05, lvl - 1);
                parts.push(`💧${waterVal.toFixed(1)}/s`);
            }
            return parts.join(' / ');
        } else if (type === 'clocktower') {
            // 2.0 + (lvl-1)*0.1
            const val = 2.0 + (lvl - 1) * 0.1;
            return `全体速度 +${val.toFixed(1)}%`;
        } else if (type === 'inn') {
            // お金生産 + 条件
            // const val = b.prod.money * lvl * Math.pow(1.05, lvl - 1);
            // Innの計算式: b.prod.money=60.
            const val = 60 * lvl * Math.pow(1.05, lvl - 1);
            return `💰${val.toFixed(1)}/s <span style="font-size:0.8em">(要:市場&民家)</span>`;
        } else if (type === 'bank') {
            // 1.27 + lvl * 0.03
            const val = 1.27 + (lvl * 0.03);
            return `金産・金貯 x${val.toFixed(2)}`;
        } else if (type === 'granary') {
            const val = 1.27 + (lvl * 0.03);
            return `食産・食貯 x${val.toFixed(2)}`;
        } else if (type === 'lumber_hub') {
            const val = 1.27 + (lvl * 0.03);
            return `木産・木貯 x${val.toFixed(2)}`;
        } else if (type === 'masonry_hub') {
            const val = 1.27 + (lvl * 0.03);
            return `石産・石貯 x${val.toFixed(2)}`;
        } else if (type === 'directorate') {
            // Time Reduction
            const rate = b.prod.time_reduction * Math.pow(1.10, lvl - 1); // 10% growth per level
            const capHours = 8;
            const maxRedSec = rate * capHours * 3600;
            return `⏳短縮: ${rate.toFixed(2)}倍速 (最大: ${formatTime(maxRedSec)}/8h)`;
        } else {
            // 一般生産施設
            let parts = [];
            for (let r in b.prod) {
                if (b.prod[r] > 0) {
                    const val = b.prod[r] * lvl * Math.pow(1.05, lvl - 1);
                    const icon = (r == 'money' ? '💰' : r == 'food' ? '🌾' : r == 'wood' ? '🌲' : r == 'stone' ? '🪨' : r == 'iron' ? '🔩' : '💧');
                    parts.push(`${icon}${val.toFixed(1)}/s`);
                }
            }
            return parts.length ? parts.join(' ') : '効果なし';
        }
    };

    const currText = getEffectText(level, isAscended);

    if (nextLevel !== null) {
        const nextText = getEffectText(nextLevel, isAscended);
        // 変更部分を強調
        // "Current -> Next" とする
        return `<div>${currText} <span style="color:#2ecc71; font-weight:bold;">➞ ${nextText}</span></div>`;
    } else {
        return `<div>${currText}</div>`;
    }
}
