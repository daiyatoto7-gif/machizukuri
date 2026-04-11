const CONFIG = {
    initialGridSize: 5,
    fps: 30,
    autoSaveInterval: 10000,
    initialUnlocked: [6, 7, 8, 11, 12, 13],
    storageHours: 8,
    collectCooldown: 30000,
    initialMaxBuilders: 4
};

const BUILDINGS = {
    house: { name: "民家", icon: "🏠", desc: "住民が住む家。お金を生産します。", prod: { money: 2 }, cost: { money: 20, food: 10 }, baseTime: 2000 },
    farm: { name: "畑", icon: "🌾", desc: "作物を育てます。食料を生産します。", prod: { food: 2 }, cost: { money: 30, wood: 10 }, baseTime: 2000 },
    lumber: { name: "伐採所", icon: "🌲", desc: "木を切り出します。木材を生産します。", prod: { wood: 1 }, cost: { money: 50, food: 20 }, baseTime: 3000 },
    quarry: { name: "採石場", icon: "🪨", desc: "石を切り出します。石材を生産します。", prod: { stone: 1 }, cost: { money: 100, food: 50, wood: 50 }, baseTime: 4000 },
    mine: { name: "鉱山", icon: "🔩", desc: "地下資源を掘ります。鉄を生産します。", prod: { iron: 1 }, cost: { money: 200, food: 100, wood: 100, stone: 50 }, baseTime: 5000 },
    market: { name: "市場", icon: "⚖️", desc: "交易を行います。大量のお金を生産します。", prod: { money: 10 }, cost: { money: 500, food: 200, wood: 200, stone: 50 }, baseTime: 6000 },
    blacksmith: { name: "鍛冶屋", icon: "⚔️", desc: "武具を作ります。お金と鉄を生産します。", prod: { money: 5, iron: 2 }, cost: { money: 800, food: 300, wood: 300, stone: 200, iron: 100 }, baseTime: 7000 },

    // 新規追加施設 (コストは民家Lv12相当 x 10倍)
    well: {
        name: "井戸", icon: "💧",
        desc: "【農業支援】水を生産します。隣接する「畑」の生産効率をアップさせます(Lv1: 1.3倍)。",
        prod: { water: 5 },
        cost: { money: 30000, food: 10000, wood: 10000, stone: 5000, iron: 2000 },
        baseTime: 100000
    },
    inn: {
        name: "宿屋", icon: "🏨",
        desc: "【商業ハブ】「市場」と「民家」の両方に隣接すると稼働し、多額のお金を生産します。",
        prod: { money: 60 }, // 条件付き高生産 (※生産量はそのまま)
        cost: { money: 30000, food: 10000, wood: 10000, stone: 5000, iron: 2000 },
        baseTime: 120000
    },
    clocktower: {
        name: "鐘楼", icon: "🔔",
        desc: "【全体加速】時を告げる鐘の音。全施設の生産速度を2%加速します(LvUPで+0.6%)。",
        prod: {}, // 直接生産なし(全体バフ)
        cost: { money: 100000, food: 50000, wood: 50000, stone: 20000, iron: 10000 },
        baseTime: 200000
    },
    forest: {
        name: "竹林", icon: "🎍",
        desc: "【林業】静寂な竹林。2マス占有(1x2)。伐採所が隣接すると生産量+20%。",
        prod: { wood: 15 },
        cost: { money: 100000, food: 40000, wood: 10000, water: 10000 },
        baseTime: 300000,
        w: 1, h: 2 // 1x2 size
    },
    bank: {
        name: "金庫", icon: "🪙",
        desc: "【金融】財宝を保管する蔵。お金の生産施設(民家/市場/鍛冶屋/宿屋)の生産量と、お金の貯蔵上限を増やします(Lv1: 1.3倍)。",
        prod: {}, // 特殊効果
        cost: { money: 500000, wood: 200000, stone: 200000, iron: 100000 },
        baseTime: 500000
    },
    granary: {
        name: "穀倉", icon: "🛖",
        desc: "【農業】食料の生産施設(畑)の生産量と、食料の貯蔵上限を増やします(Lv1: 1.3倍)。",
        prod: {},
        cost: { money: 600000, wood: 240000, stone: 240000, iron: 120000 },
        baseTime: 600000
    },
    lumber_hub: {
        name: "製材所", icon: "🪵",
        desc: "【工業】木材の生産施設(伐採所/森林)の生産量と、木材の貯蔵上限を増やします(Lv1: 1.3倍)。",
        prod: {},
        cost: { money: 700000, wood: 280000, stone: 280000, iron: 140000 },
        baseTime: 700000
    },
    stone_plant: {
        name: "石材加工場", icon: "🏭",
        desc: "【工業】お金・食料・木材を消費して、大量の石材を生産します。稼働スイッチ式。",
        prod: { stone: 20 }, // 4x spec
        consume: { money: 50, food: 20, wood: 20 },
        cost: { money: 2000000, wood: 500000, iron: 100000 },
        baseTime: 86400000 // 24 hours
    },
    masonry_hub: {
        name: "石匠工房", icon: "🧱",
        desc: "【工業】伝説の石工たちが集う工房。高度な石材管理技術により、全採石場の生産効率を高めます(Lv1: 1.3倍)。",
        prod: {},
        cost: { money: 8000000, food: 3000000, wood: 3000000, stone: 5000000, iron: 1500000 },
        baseTime: 129600000 // 36 hours
    },
    directorate: {
        name: "造営司", icon: "📜",
        desc: "【国家事業】工部直轄の建設指揮所。指示書(時間短縮力)を溜め、タップで工事中の全施設の時間を短縮します(Lv1: 8hごとに3h12m短縮)。",
        prod: { time_reduction: 0.4 }, // Base efficiency 40% (0.4s/s)
        cost: { money: 5000000, food: 2000000, wood: 2000000, stone: 1500000, iron: 500000 }, // Stone 1.5M, Iron 0.5M
        baseTime: 93600000 // 26 hours
    }
};

const BUILDING_KEYS = Object.keys(BUILDINGS);
const LIMIT_START_INDEX = BUILDING_KEYS.indexOf('market');

// --- Ascension System Constants ---
// Based on Normal Lv.30 stats * 0.6
const ASCENSION_BASE_STATS = {
    house: {
        prod: { money: 150 },
        cost: { money: 240000000, food: 120000000 },
        time: 18000000 // ~5h
    },
    farm: {
        prod: { food: 150 },
        cost: { money: 360000000, wood: 120000000 },
        time: 18000000 // ~5h
    },
    lumber: {
        prod: { wood: 75 },
        cost: { money: 600000000, food: 240000000 },
        time: 27000000 // ~7.5h
    }
};

// --- Helper: Check if building is ascended ---
function isAscended(tile) {
    return tile && tile.ascended;
}

// --- Helper: Get Name with Suffix ---
function getBuildingName(type, ascended) {
    const b = BUILDINGS[type];
    if (!b) return '';
    return ascended ? `${b.name} <span style="color:#e74c3c; font-weight:bold;">&lt;傑&gt;</span>` : b.name;
}

for (let k in BUILDINGS) {
    const b = BUILDINGS[k];
    for (let r of ['money', 'food', 'wood', 'stone', 'iron', 'water']) {
        if (!b.prod[r]) b.prod[r] = 0;
        if (!b.cost[r]) b.cost[r] = 0;
    }
}
