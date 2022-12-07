// GUN DEFINITIONS
const combineStats = function (arr) {
  try {
    // Build a blank array of the appropiate length
    let data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    arr.forEach(function (component) {
      for (let i = 0; i < data.length; i++) {
        data[i] = data[i] * component[i];
      }
    });
    return {
      reload: data[0],
      recoil: data[1],
      shudder: data[2],
      size: data[3],
      health: data[4],
      damage: data[5],
      pen: data[6],
      speed: data[7],
      maxSpeed: data[8],
      range: data[9],
      density: data[10],
      spray: data[11],
      resist: data[12],
    };
  } catch (err) {
    console.log(err);
    console.log(JSON.stringify(arr));
  }
};
const skillSet = (() => {
  let skcnv = {
    rld: 0,
    pen: 1,
    str: 2,
    dam: 3,
    spd: 4,

    shi: 5,
    atk: 6,
    hlt: 7,
    rgn: 8,
    mob: 9,
  };
  return (args) => {
    let skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let s in args) {
      if (!args.hasOwnProperty(s)) continue;
      skills[skcnv[s]] = Math.round(9 * args[s]);
    }
    return skills;
  };
})();
const setBuild = (build) => {
  let skills = build.split(build.includes("/") ? "/" : "").map((r) => +r);
  if (skills.length !== 10)
    throw new RangeError("Build must be made up of 10 numbers");
  return [6, 4, 3, 5, 2, 9, 0, 1, 8, 7].map((r) => skills[r]);
};

const g = {
  // Gun info here
  trap: [36, 1, 0.1, 0.65, 1, 0.75, 0.5, 5, 1, 1, 1, 15, 3],
  trapB: [36, 1, 0.1, 0.65, 1, 0.75, 0.5, 1.4, 1, 1, 1, 15, 3],
  superdrone: [10, 0.0001, 1, 10, 100, 0.05, 100, 20, 25, 20, 1, 0.1, 1],
  swarm: [30, 0.25, 0.05, 0.35, 0.8, 0.65, 0.75, 4, 1, 1, 1, 5, 1],
  drone: [60, 0.25, 0.1, 0.6, 1.5, 1.25, 1.125, 1.8, 1, 1, 1, 0.1, 1],
  summoner: [0.25, 1, 1, 1.125, 0.35, 0.7, 0.5, 1, 1, 1, 0.8, 1, 1],
  factory: [60, 1, 0.1, 0.7, 1, 0.75, 1, 3, 1, 1, 1, 0.1, 1],
  basic: [24, 2.5, 0.1, 1, 1, 0.75, 1, 4.5, 1, 1, 1, 15, 1],
  destroyDominator: [4, 0, 0.5, 1, 2, 10, 15, 1, 2, 1.25, 10, 0.1, 1.5],
  gunnerDominator: [0.4, 0, 1, 0.5, 1, 0.5, 1, 1.5, 1, 2, 1, 0.1, 1.5],
  trapperDominator: [2, 0, 1, 1.1, 1.25, 0.9, 2, 0.45, 2, 0.7, 1, 0.5, 1.5],
  /***************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
  blank: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  bigger: [1, 1, 1, 1.4, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  smaller: [1, 1, 1, 0.6, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  spam: [1.1, 1, 1, 1.05, 1, 1.1, 1, 0.9, 0.7, 1, 1, 1, 1.05],
  minion: [1, 1, 2, 1, 0.4, 0.4, 1.2, 1, 1, 0.75, 1, 2, 1],
  single: [1, 1, 1, 1, 1.1, 1.1, 1.1, 1, 1, 1.1, 1.5, 0.1, 1],
  sniper: [1.35, 1, 0.25, 1, 1, 0.8, 1.1, 1.5, 1.5, 1, 1.5, 0.2, 1.15],
  rifle: [0.8, 0.8, 1.5, 1, 0.8, 0.8, 0.9, 1, 1, 1, 1, 2, 1],
  assass: [1.65, 1, 0.25, 1, 1.15, 1, 1.1, 1.18, 1.18, 1, 3, 1, 1.3],
  hunter: [1.5, 0.7, 1, 0.95, 1, 0.9, 1, 1.1, 0.8, 1, 1.2, 1, 1.15],
  hunter2: [1, 1, 1, 0.9, 2, 0.5, 1.5, 1, 1, 1, 1.2, 1, 1.1],
  preda: [1.4, 1, 1, 0.8, 1.5, 0.9, 1.2, 0.9, 0.9, 1, 1, 1, 1],
  snake: [0.4, 1, 4, 1, 1.5, 0.9, 1.2, 0.2, 0.35, 1, 3, 6, 0.5],
  sidewind: [1.5, 2, 1, 1, 1.5, 0.9, 1, 0.15, 0.5, 1, 1, 1, 1],
  snakeskin: [0.6, 1, 2, 1, 0.5, 0.5, 1, 1, 0.2, 0.4, 1, 5, 1],
  mach: [0.5, 0.8, 1.7, 1, 0.7, 0.7, 1, 1, 0.8, 1, 1, 2.5, 1],
  blaster: [1, 1.2, 1.25, 1.1, 1.5, 1, 0.6, 0.8, 0.33, 0.6, 0.5, 1.5, 0.8],
  chain: [1.25, 1.33, 0.8, 1, 0.8, 1, 1.1, 1.25, 1.25, 1.1, 1.25, 0.5, 1.1],
  mini: [1.25, 0.6, 1, 0.8, 0.55, 0.45, 1.25, 1.33, 1, 1, 1.25, 0.5, 1.1],
  stream: [1.1, 0.6, 1, 1, 1, 0.65, 1, 1.24, 1, 1, 1, 1, 1],
  shotgun: [8, 0.4, 1, 1.5, 1, 0.4, 0.8, 1.8, 0.6, 1, 1.2, 1.2, 1],
  flank: [1, 1.2, 1, 1, 1.02, 0.81, 0.9, 1, 0.85, 1, 1.2, 1, 1],
  tri: [1, 0.9, 1, 1, 0.9, 1, 1, 0.8, 0.8, 0.6, 1, 1, 1],
  trifront: [1, 0.2, 1, 1, 1, 1, 1, 1.3, 1.1, 1.5, 1, 1, 1],
  thruster: [1, 1.5, 2, 1, 0.5, 0.5, 0.7, 1, 1, 1, 1, 0.5, 0.7],
  auto: /*pure*/ [
    1.8, 0.75, 0.5, 0.8, 0.9, 0.6, 1.2, 1.1, 1, 0.8, 1.3, 1, 1.25,
  ],
  five: [1.15, 1, 1, 1, 1, 1, 1, 1.05, 1.05, 1.1, 2, 1, 1],
  autosnipe: [1, 1, 1, 1.4, 2, 1, 1, 1, 1, 1, 1, 1, 1],
  /***************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
  pound: [2, 2, 1, 1, 1.25, 1.25, 1.25, 1, 1, 1, 1.5, 1, 1.15],
  destroy: [1.75, 2, 0.5, 1, 1.4, 1.5, 1.4, 0.8, 0.8, 1.25, 2, 1, 3],
  anni: [1.1, 1.5, 1, 1, 1.1, 1.1, 1.1, 1, 1, 1, 1, 1, 1],
  hive: [1.5, 0.8, 1, 0.8, 0.7, 0.3, 1, 1, 0.6, 1, 1, 1, 1],
  arty: [1.2, 0.7, 1, 0.9, 1, 1, 1, 1.15, 1.1, 1, 1.5, 1, 1],
  mortar: [1.2, 1, 1, 1, 1.1, 1, 1, 0.8, 0.8, 1, 1, 1, 1],
  spreadmain: [
    0.78125,
    0.25,
    0.5,
    1,
    0.5,
    1,
    1,
    1.5 / 0.78,
    0.9 / 0.78,
    1,
    1,
    1,
    1,
  ],
  spread: [1.5, 1, 0.25, 1, 1, 1, 1, 0.7, 0.7, 1, 1, 0.25, 1],
  skim: [1, 0.8, 0.8, 0.9, 1.35, 0.8, 2, 0.3, 0.3, 1, 1, 1, 1.1],
  twin: [1, 0.5, 0.9, 1, 0.9, 0.7, 1, 1, 1, 1, 1, 1.2, 1],
  bent: [1.1, 1, 0.8, 1, 0.9, 1, 0.8, 1, 1, 1, 0.8, 0.5, 1],
  triple: [1.2, 0.667, 0.9, 1, 0.85, 0.85, 0.9, 1, 1, 1, 1.1, 0.9, 0.95],
  quint: [1.5, 0.667, 0.9, 1, 1, 1, 0.9, 1, 1, 1, 1.1, 0.9, 0.95],
  dual: [2, 1, 0.8, 1, 1.5, 1, 1, 1.3, 1.1, 1, 1, 1, 1.25],
  double: [1, 1, 1, 1, 1, 0.9, 1, 1, 1, 1, 1, 1, 1],
  hewn: [1.25, 1.5, 1, 1, 0.9, 0.85, 1, 1, 0.9, 1, 1, 1, 1],
  puregunner: [
    1, 0.25, 1.5, 1.2, 1.35, 0.25, 1.25, 0.8, 0.65, 1, 1.5, 1.5, 1.2,
  ],
  machgun: [0.66, 0.8, 2, 1, 1, 0.75, 1, 1.2, 0.8, 1, 1, 2.5, 1],
  gunner: [1.25, 0.25, 1.5, 1.1, 1, 0.35, 1.35, 0.9, 0.8, 1, 1.5, 1.5, 1.2],
  power: [1, 1, 0.6, 1.2, 1, 1, 1.25, 2, 1.7, 1, 2, 0.5, 1.5],
  nail: [0.85, 2.5, 1, 0.8, 1, 0.7, 1, 1, 1, 1, 2, 1, 1],
  fast: [1, 1, 1, 1, 1, 1, 1, 1.2, 1, 1, 1, 1, 1],
  turret: [2, 1, 1, 1, 0.8, 0.6, 0.7, 1, 1, 1, 0.1, 1, 1],
  /***************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
  battle: [1, 1, 1, 1, 1.25, 1.15, 1, 1, 0.85, 1, 1, 1, 1.1],
  bees: [1, 1, 1, 1.4, 1.5, 1.5, 1, 2, 1.5, 1, 0.25, 1, 1],
  carrier: [1.5, 1, 1, 1, 1, 0.8, 1, 1.3, 1.2, 1.2, 1, 1, 1],
  hexatrap: [1.3, 1, 1.25, 1, 1, 1, 1, 0.8, 1, 0.5, 1, 1, 1],
  block: [1.1, 2, 0.1, 1.5, 1, 1.25, 1, 1.5, 2.5, 1.25, 1, 1, 1.25],
  construct: [1.3, 1, 1, 0.9, 1.1, 1.3, 1.1, 1, 1.1, 1, 1, 1, 1],
  boomerang: [0.8, 1, 1, 1, 0.5, 0.5, 1, 0.75, 0.75, 1.333, 1, 1, 1],
  over: [1.25, 1, 1, 0.85, 0.7, 0.8, 1, 1, 0.9, 1, 2, 1, 1],
  meta: [1.333, 1, 1, 1, 1, 0.667, 1, 1, 1, 1, 1, 1, 1],
  weak: [2, 1, 1, 1, 0.6, 0.6, 0.8, 0.5, 0.7, 0.25, 0.3, 1, 1],
  master: [3, 1, 1, 0.85, 0.4, 0.6, 0.8, 1, 1, 0.1, 0.5, 1, 1],
  commander: [1.5, 1, 1, 1, 0.8, 0.9, 0.8, 1, 1, 1, 1.5, 1, 1],
  sunchip: [5, 1, 1, 1.4, 0.75, 0.4, 0.6, 1, 1, 1, 0.8, 1, 1],
  babyfactory: [1.5, 1, 1, 1, 1, 1, 1, 1, 1.35, 1, 1, 1, 1],
  lowpower: [1, 1, 2, 1, 0.5, 0.5, 0.7, 1, 1, 1, 1, 0.5, 0.7],
  halfrecoil: [1, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  morerecoil: [1, 1.15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  muchmorerecoil: [1, 1.35, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  lotsmorrecoil: [1, 1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  tonsmorrecoil: [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  doublereload: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  morereload: [0.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  halfreload: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  lessreload: [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  threequartersrof: [1.333, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  morespeed: [1, 1, 1, 1, 1, 1, 1, 1.3, 1.3, 1, 1, 1, 1],
  bitlessspeed: [1, 1, 1, 1, 1, 1, 1, 0.93, 0.93, 1, 1, 1, 1],
  slow: [1, 1, 1, 1, 1, 1, 1, 0.7, 0.7, 1, 1, 1, 1],
  halfspeed: [1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1],
  notdense: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.1, 1, 1],
  halfrange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1],
  fake: [1, 1, 1, 0.00001, 0.0001, 1, 1, 0.00001, 2, 0, 1, 1, 1],
  /***************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
  op: [0.5, 1.3, 1, 1, 4, 4, 4, 3, 2, 1, 5, 2, 1],
  protectorswarm: [5, 0.000001, 1, 1, 100, 1, 1, 1, 1, 0.5, 5, 1, 10],
};

const dfltskl = 9;

// NAMES
const statnames = {
  smasher: 1,
  drone: 2,
  necro: 3,
  swarm: 4,
  trap: 5,
  generic: 6,
};
const gunCalcNames = {
  default: 0,
  bullet: 1,
  drone: 2,
  swarm: 3,
  fixedReload: 4,
  thruster: 5,
  sustained: 6,
  necro: 7,
  trap: 8,
};

// ENTITY DEFINITIONS
exports.genericEntity = {
  NAME: "",
  LABEL: "Unknown Entity",
  TYPE: "unknown",
  DAMAGE_CLASS: 0, // 0: def, 1: food, 2: tanks, 3: obstacles
  DANGER: 0,
  VALUE: 0,
  SHAPE: 0,
  COLOR: 16,
  INDEPENDENT: false,
  CONTROLLERS: ["doNothing"],
  HAS_NO_MASTER: false,
  MOTION_TYPE: "glide", // motor, swarm, chase
  FACING_TYPE: "toTarget", // turnWithSpeed, withMotion, looseWithMotion, toTarget, looseToTarget
  DRAW_HEALTH: false,
  DRAW_SELF: true,
  DAMAGE_EFFECTS: true,
  RATEFFECTS: true,
  MOTION_EFFECTS: true,
  INTANGIBLE: false,
  ACCEPTS_SCORE: true,
  GIVE_KILL_MESSAGE: false,
  CAN_GO_OUTSIDE_ROOM: false,
  HITS_OWN_TYPE: "normal", // hard, repel, never, hardWithBuffer
  DIE_AT_LOW_SPEED: false,
  DIE_AT_RANGE: false,
  CLEAR_ON_MASTER_UPGRADE: false,
  PERSISTS_AFTER_DEATH: false,
  VARIES_IN_SIZE: false,
  HEALTH_WITH_LEVEL: true,
  CAN_BE_ON_LEADERBOARD: true,
  HAS_NO_RECOIL: false,
  AUTO_UPGRADE: "none",
  BUFF_VS_FOOD: false,
  OBSTACLE: false,
  CRAVES_ATTENTION: false,
  NECRO: false,
  UPGRADES_TIER_1: [],
  UPGRADES_TIER_2: [],
  UPGRADES_TIER_3: [],
  SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  LEVEL: 0,
  SKILL_CAP: [
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
  ],
  GUNS: [],
  MAX_CHILDREN: 0,
  BODY: {
    ACCELERATION: 1,
    SPEED: 0,
    HEALTH: 1,
    RESIST: 1,
    SHIELD: 0,
    REGEN: 0,
    DAMAGE: 1,
    PENETRATION: 1,

    RANGE: 0,
    FOV: 1,
    DENSITY: 1,
    STEALTH: 1,
    PUSHABILITY: 1,
    HETERO: 2,
  },
  FOOD: {
    LEVEL: -1,
  },
};

// FOOD
exports.food = {
  TYPE: "food",
  DAMAGE_CLASS: 1,
  CONTROLLERS: ["moveInCircles"],
  HITS_OWN_TYPE: "repel",
  MOTION_TYPE: "drift",
  FACING_TYPE: "turnWithSpeed",
  VARIES_IN_SIZE: true,
  BODY: {
    STEALTH: 30,
    PUSHABILITY: 1,
  },
  DAMAGE_EFFECTS: false,
  RATEFFECTS: false,
  HEALTH_WITH_LEVEL: false,
};

const basePolygonDamage = 1;
const basePolygonHealth = 2;
exports.hugePentagon = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 5,
  },
  LABEL: "Alpha Pentagon",
  VALUE: 15000,
  SHAPE: -5,
  SIZE: 58,
  COLOR: 14,
  BODY: {
    DAMAGE: 2 * basePolygonDamage,
    DENSITY: 80,
    HEALTH: 300 * basePolygonHealth,
    RESIST: Math.pow(1.25, 3),
    SHIELD: 40 * basePolygonHealth,
    REGEN: 0.6,
  },
  DRAW_HEALTH: true,
  GIVE_KILL_MESSAGE: true,
};
exports.bigPentagon = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 4,
  },
  LABEL: "Beta Pentagon",
  VALUE: 2500,
  SHAPE: 5,
  SIZE: 30,
  COLOR: 14,
  BODY: {
    DAMAGE: 2 * basePolygonDamage,
    DENSITY: 30,
    HEALTH: 50 * basePolygonHealth,
    RESIST: Math.pow(1.25, 2),
    SHIELD: 20 * basePolygonHealth,
    REGEN: 0.2,
  },
  DRAW_HEALTH: true,
  GIVE_KILL_MESSAGE: true,
};
exports.pentagon = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 3,
  },
  LABEL: "Pentagon",
  VALUE: 400,
  SHAPE: 5,
  SIZE: 16,
  COLOR: 14,
  BODY: {
    DAMAGE: 1.5 * basePolygonDamage,
    DENSITY: 8,
    HEALTH: 10 * basePolygonHealth,
    RESIST: 1.25,
    PENETRATION: 1.1,
  },
  DRAW_HEALTH: true,
};
exports.triangle = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 2,
  },
  LABEL: "Triangle",
  VALUE: 120,
  SHAPE: 3,
  SIZE: 9,
  COLOR: 2,
  BODY: {
    DAMAGE: basePolygonDamage,
    DENSITY: 6,
    HEALTH: 3 * basePolygonHealth,
    RESIST: 1.15,
    PENETRATION: 1.5,
  },
  DRAW_HEALTH: true,
};
exports.square = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 1,
  },
  LABEL: "Square",
  VALUE: 30,
  SHAPE: 4,
  SIZE: 10,
  COLOR: 13,
  BODY: {
    DAMAGE: basePolygonDamage,
    DENSITY: 4,
    HEALTH: basePolygonHealth,
    PENETRATION: 2,
  },
  DRAW_HEALTH: true,
  INTANGIBLE: false,
};
exports.star = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 6,
  },
  LABEL: "star",
  VALUE: 2000,
  SHAPE: 4,
  SIZE: 10,
  COLOR: 11,
  BODY: {
    DAMAGE: basePolygonDamage,
    DENSITY: 4,
    HEALTH: basePolygonHealth,
    PENETRATION: 2,
  },
  DRAW_HEALTH: true,
  INTANGIBLE: false,
};
exports.superstar = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 7,
  },
  LABEL: "superstar",
  VALUE: 20000,
  SHAPE: 4,
  SIZE: 10,
  COLOR: 1,
  BODY: {
    DAMAGE: basePolygonDamage,
    DENSITY: 8,
    HEALTH: 5000,
    PENETRATION: 4,
  },
  DRAW_HEALTH: true,
  INTANGIBLE: false,
};
exports.egg = {
  PARENT: [exports.food],
  FOOD: {
    LEVEL: 0,
  },
  LABEL: "Egg",
  VALUE: 10,
  SHAPE: 0,
  SIZE: 5,
  COLOR: 6,
  INTANGIBLE: true,
  BODY: {
    DAMAGE: 0,
    DENSITY: 2,
    HEALTH: 0.0011,
    PUSHABILITY: 0,
  },
  DRAW_HEALTH: false,
};

exports.greenpentagon = {
  PARENT: [exports.food],
  LABEL: "Pentagon",
  VALUE: 30000,
  SHAPE: 5,
  SIZE: 16,
  COLOR: 1,
  BODY: {
    DAMAGE: 3,
    DENSITY: 8,
    HEALTH: 200,
    RESIST: 1.25,
    PENETRATION: 1.1,
  },
  DRAW_HEALTH: true,
};
exports.greentriangle = {
  PARENT: [exports.food],
  LABEL: "Triangle",
  VALUE: 7000,
  SHAPE: 3,
  SIZE: 9,
  COLOR: 1,
  BODY: {
    DAMAGE: 1,
    DENSITY: 6,
    HEALTH: 60,
    RESIST: 1.15,
    PENETRATION: 1.5,
  },
  DRAW_HEALTH: true,
};
exports.greensquare = {
  PARENT: [exports.food],
  LABEL: "Square",
  VALUE: 2000,
  SHAPE: 4,
  SIZE: 10,
  COLOR: 1,
  BODY: {
    DAMAGE: 0.5,
    DENSITY: 4,
    HEALTH: 20,
    PENETRATION: 2,
  },
  DRAW_HEALTH: true,
  INTANGIBLE: false,
};

exports.gem = {
  PARENT: [exports.food],
  LABEL: "Gem",
  VALUE: 2000,
  SHAPE: 6,
  SIZE: 5,
  COLOR: 0,
  BODY: {
    DAMAGE: basePolygonDamage / 4,
    DENSITY: 4,
    HEALTH: 10,
    PENETRATION: 2,
    RESIST: 2,
    PUSHABILITY: 0.25,
  },
  DRAW_HEALTH: true,
  INTANGIBLE: false,
};
exports.obstacle = {
  TYPE: "wall",
  DAMAGE_CLASS: 1,
  LABEL: "Rock",
  FACING_TYPE: "turnWithSpeed",
  SHAPE: -9,
  BODY: {
    PUSHABILITY: 0,
    HEALTH: 100,
    SHIELD: 100,
    REGEN: 100,
    DAMAGE: 1,
    RESIST: 100,
    STEALTH: 1,
  },
  VALUE: 0,
  SIZE: 60,
  COLOR: 16,
  VARIES_IN_SIZE: true,
  GIVE_KILL_MESSAGE: true,
  ACCEPTS_SCORE: false,
};
exports.mazeWall = {
  PARENT: [exports.obstacle],
  LABEL: "Wall",
  SHAPE: 4,
};
exports.babyObstacle = {
  PARENT: [exports.obstacle],
  SIZE: 25,
  SHAPE: -7,
  LABEL: "Gravel",
};

// WEAPONS
const wepHealthFactor = 0.5;
const wepDamageFactor = 1.5;
exports.bullet = {
  LABEL: "Bullet",
  TYPE: "bullet",
  ACCEPTS_SCORE: false,
  BODY: {
    PENETRATION: 1,
    SPEED: 3.75,
    RANGE: 90,
    DENSITY: 1.25,
    HEALTH: 0.33 * wepHealthFactor,
    DAMAGE: 4 * wepDamageFactor,
    PUSHABILITY: 0.3,
  },
  FACING_TYPE: "smoothWithMotion",
  CAN_GO_OUTSIDE_ROOM: true,
  HITS_OWN_TYPE: "never",
  // DIE_AT_LOW_SPEED: true,
  DIE_AT_RANGE: true,
};
exports.casing = {
  PARENT: [exports.bullet],
  LABEL: "Shell",
  TYPE: "swarm",
};

exports.swarm = {
  LABEL: "Swarm Drone",
  TYPE: "swarm",
  ACCEPTS_SCORE: false,
  SHAPE: 3,
  MOTION_TYPE: "swarm",
  FACING_TYPE: "smoothWithMotion",
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  CRAVES_ATTENTION: true,
  BODY: {
    ACCELERATION: 3,
    PENETRATION: 1.5,
    HEALTH: 0.35 * wepHealthFactor,
    DAMAGE: 1.5 * wepDamageFactor,
    SPEED: 4.5,
    RESIST: 1.6,
    RANGE: 225,
    DENSITY: 12,
    PUSHABILITY: 0.5,
    FOV: 1.5,
  },
  DIE_AT_RANGE: true,
  BUFF_VS_FOOD: true,
};
exports.BulleT2 = {
  LABEL: "Swarm Drone",
  TYPE: "swarm",
  ACCEPTS_SCORE: false,
  MOTION_TYPE: "swarm",
  FACING_TYPE: "smoothWithMotion",
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  CRAVES_ATTENTION: true,
  BODY: {
    ACCELERATION: 3,
    PENETRATION: 1.5,
    HEALTH: 0.35 * wepHealthFactor,
    DAMAGE: 1.5 * wepDamageFactor,
    SPEED: 4.5,
    RESIST: 1.6,
    RANGE: 225,
    DENSITY: 12,
    PUSHABILITY: 0.5,
    FOV: 1.5,
  },
  DIE_AT_RANGE: true,
  BUFF_VS_FOOD: true,
};
exports.bee = {
  PARENT: [exports.swarm],
  PERSISTS_AFTER_DEATH: true,
  SHAPE: 4,
  LABEL: "Drone",
  HITS_OWN_TYPE: "hardWithBuffer",
};

exports.autoswarm = {
  PARENT: [exports.swarm],
  AI: {
    FARMER: true,
  },
  INDEPENDENT: true,
};

exports.trap = {
  LABEL: "Thrown Trap",
  TYPE: "trap",
  ACCEPTS_SCORE: false,
  SHAPE: -3,
  MOTION_TYPE: "glide", // def
  FACING_TYPE: "turnWithSpeed",
  HITS_OWN_TYPE: "push",
  DIE_AT_RANGE: true,
  BODY: {
    HEALTH: 1 * wepHealthFactor,
    DAMAGE: 1 * wepDamageFactor,
    RANGE: 450,
    DENSITY: 2.5,
    RESIST: 2.5,
    SPEED: 0.001,
  },
};
exports.block = {
  LABEL: "Set Trap",
  PARENT: [exports.trap],
  SHAPE: -4,
  MOTION_TYPE: "motor",
  CONTROLLERS: ["goToMasterTarget"],
  BODY: {
    SPEED: 1,
    DENSITY: 5,
  },
};
exports.boomerang = {
  LABEL: "Boomerang",
  PARENT: [exports.trap],
  CONTROLLERS: ["boomerang"],
  MOTION_TYPE: "motor",
  HITS_OWN_TYPE: "never",
  SHAPE: -5,
  BODY: {
    SPEED: 1.25,
    RANGE: 120,
  },
};

exports.drone = {
  LABEL: "Drone",
  TYPE: "drone",
  ACCEPTS_SCORE: false,
  DANGER: 2,
  CONTROL_RANGE: 0,
  SHAPE: 3,
  MOTION_TYPE: "chase",
  FACING_TYPE: "smoothToTarget",
  CONTROLLERS: [
    "nearestDifferentMaster",
    "canRepel",
    "mapTargetToGoal",
    "hangOutNearMaster",
  ],
  AI: {
    BLIND: true,
  },
  BODY: {
    PENETRATION: 1.2,
    PUSHABILITY: 0.6,
    ACCELERATION: 0.05,
    HEALTH: 1 * wepHealthFactor,
    DAMAGE: 1.5 * wepDamageFactor,
    SPEED: 3.8,
    RANGE: 200,
    DENSITY: 0.03,
    RESIST: 1.5,
    FOV: 0.8,
  },
  HITS_OWN_TYPE: "hard",
  DRAW_HEALTH: false,
  CLEAR_ON_MASTER_UPGRADE: true,
  BUFF_VS_FOOD: true,
};
exports.BulleT1 = {
  LABEL: "Drone",
  TYPE: "drone",
  ACCEPTS_SCORE: false,
  DANGER: 2,
  CONTROL_RANGE: 0,
  SHAPE: 3,
  MOTION_TYPE: "chase",
  FACING_TYPE: "smoothToTarget",
  CONTROLLERS: [
    "nearestDifferentMaster",
    "canRepel",
    "mapTargetToGoal",
    "hangOutNearMaster",
  ],
  AI: {
    BLIND: true,
  },
  BODY: {
    PENETRATION: 1.2,
    PUSHABILITY: 0.6,
    ACCELERATION: 0.05,
    HEALTH: 1 * wepHealthFactor,
    DAMAGE: 1.5 * wepDamageFactor,
    SPEED: 3.8,
    RANGE: 200,
    DENSITY: 0.03,
    RESIST: 1.5,
    FOV: 0.8,
  },
  HITS_OWN_TYPE: "hard",
  DRAW_HEALTH: false,
  CLEAR_ON_MASTER_UPGRADE: true,
  BUFF_VS_FOOD: true,
};
exports.sunchip = {
  PARENT: [exports.drone],
  SHAPE: 4,
  NECRO: true,
  HITS_OWN_TYPE: "hard",
  BODY: {
    FOV: 0.5,
  },
  AI: {
    BLIND: true,
    FARMER: true,
  },
  DRAW_HEALTH: false,
};
exports.autosunchip = {
  PARENT: [exports.sunchip],
  AI: {
    BLIND: true,
    FARMER: true,
  },
  INDEPENDENT: true,
};
exports.gunchip = {
  PARENT: [exports.drone],
  SHAPE: -2,
  NECRO: true,
  HITS_OWN_TYPE: "hard",
  BODY: {
    FOV: 0.5,
  },
  AI: {
    BLIND: true,
    FARMER: true,
  },
  DRAW_HEALTH: false,
};
exports.launcherMissile = {
  PARENT: [exports.bullet],
  LABEL: "Missile",
  INDEPENDENT: true,
  BODY: {
    RANGE: 120,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 6, 1, 0, 0, 180, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 2, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
  ],
};
exports.missile = {
  PARENT: [exports.bullet],
  LABEL: "Missile",
  INDEPENDENT: true,
  BODY: {
    RANGE: 120,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 6, 1, 0, -2, 130, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.5, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [14, 6, 1, 0, 2, 230, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.5, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
  ],
};
exports.spinmissile = {
  PARENT: [exports.bullet],
  LABEL: "Missile",
  INDEPENDENT: true,
  BODY: {
    RANGE: 120,
  },
  FACING_TYPE: "turnWithSpeed",
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [14, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 2, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [14, 8, 1, 0, 0, 180, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 2, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
  ],
};
exports.hypermissile = {
  PARENT: [exports.missile],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 6, 1, 0, -2, 150, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.8, 0.5, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [14, 6, 1, 0, 2, 210, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.5, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [14, 6, 1, 0, -2, 90, 0.5],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.5, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
      },
    },
    {
      POSITION: [14, 6, 1, 0, 2, 270, 0.5],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.5, 1, 0.9, 1, 0.5, 1, 1, 1, 0.3, 10, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
      },
    },
  ],
};
exports.snake = {
  PARENT: [exports.bullet],
  LABEL: "Snake",
  INDEPENDENT: true,
  BODY: {
    RANGE: 120,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.4, 8, 0, 180, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        STAT_CALCULATOR: gunCalcNames.thruster,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.8, 0.8, 0.1, 0.5, 1, 1, 1, 0.25, 1, 0.75, 2, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
      },
    },
    {
      POSITION: [10, 12, 0.8, 8, 0, 180, 0.5],
      PROPERTIES: {
        AUTOFIRE: true,
        NEGATIVE_RECOIL: true,
        STAT_CALCULATOR: gunCalcNames.thruster,
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.8, 0.8, 0.25, 0.75, 1, 1, 1, 0.25, 1, 0.75, 2, 2, 1],
        ]),
        TYPE: [
          exports.bullet,
          {
            PERSISTS_AFTER_DEATH: true,
          },
        ],
      },
    },
  ],
};
exports.hive = {
  PARENT: [exports.bullet],
  LABEL: "Hive",
  BODY: {
    RANGE: 90,
    FOV: 0.5,
  },
  FACING_TYPE: "turnWithSpeed",
  INDEPENDENT: true,
  CONTROLLERS: ["alwaysFire", "nearestDifferentMaster", "targetSelf"],
  AI: {
    NO_LEAD: true,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [7, 9.5, 0.6, 7, 0, 108, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
        TYPE: exports.bee,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 9.5, 0.6, 7, 0, 180, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
        TYPE: exports.bee,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 9.5, 0.6, 7, 0, 252, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
        TYPE: exports.bee,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 9.5, 0.6, 7, 0, 324, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
        TYPE: exports.bee,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 9.5, 0.6, 7, 0, 36, 0.8],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bees]),
        TYPE: exports.bee,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};

// TANK CLASSES
const base = {
  ACCEL: 1.6,
  SPEED: 5.25,
  HEALTH: 20,
  DAMAGE: 3,
  RESIST: 1,
  PENETRATION: 1.05,
  SHIELD: 8,
  REGEN: 0.025,
  FOV: 1,
  DENSITY: 0.5,
};
exports.genericTank = {
  LABEL: "Unknown Class",
  TYPE: "tank",
  DAMAGE_CLASS: 2,
  DANGER: 5,
  MOTION_TYPE: "motor",
  FACING_TYPE: "toTarget",
  SIZE: 12,
  MAX_CHILDREN: 0,
  DAMAGE_EFFECTS: false,
  FROZE: false,
  FREEZE_TIME: (1000 * 5), // 5 seconds
  BURNING: false,
  BURNING_TIME: (1000 * 7), // 7 seconds
  EARTH: false,
  WATER: false,
  WATER_ACCELERATION: 3.5,
  BODY: {
    // def
    ACCELERATION: base.ACCEL,
    SPEED: base.SPEED,
    HEALTH: base.HEALTH,
    DAMAGE: base.DAMAGE,
    PENETRATION: base.PENETRATION,
    SHIELD: base.SHIELD,
    REGEN: base.REGEN,
    FOV: base.FOV,
    DENSITY: base.DENSITY,
    PUSHABILITY: 0.9,
    HETERO: 3,
  },
  GUNS: [],
  TURRETS: [],
  GIVE_KILL_MESSAGE: true,
  DRAW_HEALTH: true,
  HITS_OWN_TYPE: "hardOnlyTanks",
};

let gun = {};

exports.autoTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  BODY: {
    FOV: 0.8,
  },
  COLOR: 16,
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [22, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [1.5, 0.5, 1, 1, 0.8, 0.8, 1.5, 1.25, 1.25, 1, 2, 1, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.machineAutoTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  COLOR: 16,
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 11, 1.3, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.morerecoil,
          g.turret,
          g.mach,
          g.slow,
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.autoSmasherTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  COLOR: 16,
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 6, 1, 0, 5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.morerecoil,
          g.turret,
          g.fast,
          g.mach,
          g.pound,
          g.morereload,
          g.morereload,
        ]),
        TYPE: exports.bullet,
        STAT_CALCULATOR: gunCalcNames.fixedReload,
      },
    },
    {
      POSITION: [20, 6, 1, 0, -5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.morerecoil,
          g.turret,
          g.fast,
          g.mach,
          g.pound,
          g.morereload,
          g.morereload,
        ]),
        TYPE: exports.bullet,
        STAT_CALCULATOR: gunCalcNames.fixedReload,
      },
    },
  ],
};
exports.oldAutoSmasherTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  COLOR: 16,
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 7, 1, 0, -5.75, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.lotsmorrecoil,
          g.morereload,
        ]),
        TYPE: exports.bullet,
        STAT_CALCULATOR: gunCalcNames.fixedReload,
      },
    },
    {
      POSITION: [20, 7, 1, 0, 5.75, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.lotsmorrecoil,
          g.morereload,
        ]),
        TYPE: exports.bullet,
        STAT_CALCULATOR: gunCalcNames.fixedReload,
      },
    },
  ],
};

exports.auto3gun = {
  PARENT: [exports.genericTank],
  LABEL: "",
  BODY: {
    FOV: 3,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [22, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.auto5gun = {
  PARENT: [exports.genericTank],
  LABEL: "",
  BODY: {
    FOV: 3,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [24, 11, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.five]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.heavy3gun = {
  PARENT: [exports.genericTank],
  LABEL: "",
  BODY: {
    FOV: 2,
    SPEED: 0.9,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [22, 14, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.auto]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.masterGun = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  BODY: {
    FOV: 3,
  },
  CONTROLLERS: ["nearestDifferentMaster"],
  COLOR: 16,
  MAX_CHILDREN: 6,
  AI: {
    NO_LEAD: true,
    SKYNET: true,
    FULL_VIEW: true,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [8, 14, 1.3, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.master]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
exports.sniper3gun = {
  PARENT: [exports.genericTank],
  LABEL: "",
  BODY: {
    FOV: 5,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [27, 9, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.auto,
          g.assass,
          g.autosnipe,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5, 9, -1.5, 8, 0, 0, 0],
    },
  ],
};
exports.bansheegun = {
  PARENT: [exports.genericTank],
  LABEL: "",
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: 16,
  INDEPENDENT: true,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [26, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.auto]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.auto4gun = {
  PARENT: [exports.genericTank],
  LABEL: "",
  BODY: {
    FOV: 2,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [16, 4, 1, 0, -3.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.auto,
          g.gunner,
          g.twin,
          g.power,
          g.slow,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16, 4, 1, 0, 3.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.auto,
          g.gunner,
          g.twin,
          g.power,
          g.slow,
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.bigauto4gun = {
  PARENT: [exports.genericTank],
  LABEL: "",
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 5, 1, 0, -4.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.auto,
          g.gunner,
          g.twin,
          g.twin,
          g.power,
          g.doublereload,
          g.power,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [14, 5, 1, 0, 4.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.auto,
          g.gunner,
          g.twin,
          g.twin,
          g.power,
          g.doublereload,
          g.power,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.auto,
          g.gunner,
          g.twin,
          g.twin,
          g.power,
          g.doublereload,
          g.power,
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};

exports.tritrapgun = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 16, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [2, 16, 1.1, 20, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          [2, 1, 1, 0.9, 0.6, 0.8, 0.7, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.block,
      },
    },
  ],
};
exports.smasherBody = {
  LABEL: "",
  CONTROLLERS: ["spin"],
  COLOR: 9,
  SHAPE: 6,
  INDEPENDENT: true,
};
exports.spikeBody = {
  LABEL: "",
  CONTROLLERS: ["spin"],
  COLOR: 9,
  SHAPE: -4,
  INDEPENDENT: true,
};
exports.spikeBody1 = {
  LABEL: "",
  CONTROLLERS: ["fastspin"],
  COLOR: 9,
  SHAPE: 3,
  INDEPENDENT: true,
};
exports.spikeBody2 = {
  LABEL: "",
  CONTROLLERS: ["reversespin"],
  COLOR: 9,
  SHAPE: 3,
  INDEPENDENT: true,
};
exports.megasmashBody = {
  LABEL: "",
  CONTROLLERS: ["spin"],
  COLOR: 9,
  SHAPE: -6,
  INDEPENDENT: true,
};
exports.dominationBody = {
  LABEL: "",
  CONTROLLERS: ["dontTurn"],
  COLOR: 9,
  SHAPE: 600,
  INDEPENDENT: true,
};
exports.baseSwarmTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Protector",
  COLOR: 16,
  BODY: {
    FOV: 2,
  },
  CONTROLLERS: ["nearestDifferentMaster"],
  AI: {
    NO_LEAD: true,
    LIKES_SHAPES: true,
  },
  INDEPENDENT: true,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 4.5, 0.6, 7, 2, 0, 0.15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [5, 4.5, 0.6, 7, -2, 0, 0.15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [5, 4.5, 0.6, 7.5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
        TYPE: [
          exports.swarm,
          {
            INDEPENDENT: true,
            AI: {
              LIKES_SHAPES: true,
            },
          },
        ],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.baseGunTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Protector",
  BODY: {
    FOV: 5,
  },
  ACCEPTS_SCORE: false,
  CONTROLLERS: ["nearestDifferentMaster"],
  INDEPENDENT: true,
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [12, 12, 1, 6, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11, 13, 1, 6, 0, 0, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [7, 13, -1.3, 6, 0, 0, 0],
    },
  ],
};
exports.baseProtector = {
  PARENT: [exports.genericTank],
  LABEL: "Base",
  SIZE: 64,
  DAMAGE_CLASS: 0,
  ACCEPTS_SCORE: false,
  CAN_BE_ON_LEADERBOARD: false,
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    spd: 1,
    str: 1,
    draw_healt: true,
  }),
  BODY: {
    // def
    SPEED: 0,
    HEALTH: 1000,
    DAMAGE: 10,
    PENETRATION: 0.25,
    SHIELD: 10,
    REGEN: 1000,
    FOV: 1,
    PUSHABILITY: 0,
    HETERO: 0,
  },
  //CONTROLLERS: ['nearestDifferentMaster'],
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [25, 0, 0, 0, 360, 0],
      TYPE: exports.dominationBody,
    },
    {
      POSITION: [12, 7, 0, 45, 100, 0],
      TYPE: exports.baseSwarmTurret,
    },
    {
      POSITION: [12, 7, 0, 135, 100, 0],
      TYPE: exports.baseSwarmTurret,
    },
    {
      POSITION: [12, 7, 0, 225, 100, 0],
      TYPE: exports.baseSwarmTurret,
    },
    {
      POSITION: [12, 7, 0, 315, 100, 0],
      TYPE: exports.baseSwarmTurret,
    },
  ],
  GUNS: [
    /***** LENGTH WIDTH ASPECT X Y ANGLE DELAY */ {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 45, 0],
    },
    {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 135, 0],
    },
    {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 225, 0],
    },
    {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 315, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 45, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 135, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 225, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 315, 0],
    },
  ],
};

exports.minion = {
  PARENT: [exports.genericTank],
  LABEL: "Minion",
  TYPE: "minion",
  DAMAGE_CLASS: 0,
  HITS_OWN_TYPE: "hardWithBuffer",
  FACING_TYPE: "smoothToTarget",
  BODY: {
    FOV: 0.5,
    SPEED: 3,
    ACCELERATION: 0.4,
    HEALTH: 5,
    SHIELD: 0,
    DAMAGE: 1.2,
    RESIST: 1,
    PENETRATION: 1,
    DENSITY: 0.4,
  },
  AI: {
    BLIND: true,
  },
  DRAW_HEALTH: false,
  CLEAR_ON_MASTER_UPGRADE: true,
  GIVE_KILL_MESSAGE: false,
  CONTROLLERS: [
    "nearestDifferentMaster",
    "mapAltToFire",
    "minion",
    "canRepel",
    "hangOutNearMaster",
  ],
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [17, 9, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minion]),
        WAIT_TO_CYCLE: true,
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.pillboxTurret = {
  PARENT: [exports.genericTank],
  LABEL: "",
  COLOR: 16,
  BODY: {
    FOV: 2,
  },
  HAS_NO_RECOIL: true,
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [22, 11, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.minion,
          g.turret,
          g.power,
          g.auto,
          g.notdense,
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.pillbox = {
  LABEL: "Pillbox",
  PARENT: [exports.trap],
  SHAPE: -4,
  MOTION_TYPE: "motor",
  CONTROLLERS: ["goToMasterTarget", "nearestDifferentMaster"],
  INDEPENDENT: true,
  BODY: {
    SPEED: 1,
    DENSITY: 5,
  },
  DIE_AT_RANGE: true,
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [11, 0, 0, 0, 360, 1],
      TYPE: exports.pillboxTurret,
    },
  ],
};
exports.skimturret = {
  PARENT: [exports.genericTank],
  BODY: {
    FOV: base.FOV * 2,
  },
  COLOR: 2,
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  LABEL: "",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [10, 14, -0.5, 9, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.destroy,
          [1, 1, 1, 0.8, 0.8, 0.6, 0.2, 0.4, 0.4, 1, 10, 1, 1],
        ]),
        TYPE: exports.hypermissile,
      },
    },
    {
      POSITION: [17, 15, 1, 0, 0, 0, 0],
    },
  ],
};

function makeAuto(type, name = -1, options = {}) {
  let turret = {
    type: exports.autoTurret,
    size: 10,
    independent: true,
  };
  if (options.type != null) {
    turret.type = options.type;
  }
  if (options.size != null) {
    turret.size = options.size;
  }
  if (options.independent != null) {
    turret.independent = options.independent;
  }

  let output = JSON.parse(JSON.stringify(type));
  let autogun = {
    /********* SIZE X Y ANGLE ARC */
    POSITION: [turret.size, 0, 0, 180, 360, 1],
    TYPE: [
      turret.type,
      {
        CONTROLLERS: ["nearestDifferentMaster"],
        INDEPENDENT: turret.independent,
      },
    ],
  };
  if (type.GUNS != null) {
    output.GUNS = type.GUNS;
  }
  if (type.TURRETS == null) {
    output.TURRETS = [autogun];
  } else {
    output.TURRETS = [...type.TURRETS, autogun];
  }
  if (name == -1) {
    output.LABEL = "Auto-" + type.LABEL;
  } else {
    output.LABEL = name;
  }
  output.DANGER = type.DANGER ? type.DANGER + 1 : 9;
  return output;
}

function makeHybrid(type, name = -1) {
  let output = JSON.parse(JSON.stringify(type));
  let spawner = {
    /********* LENGTH WIDTH ASPECT X Y ANGLE DELAY */
    POSITION: [7, 12, 1.2, 8, 0, 180, 0],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
      TYPE: [
        exports.drone,
        {
          INDEPENDENT: true,
        },
      ],
      AUTOFIRE: true,
      SYNCS_SKILLS: true,
      STAT_CALCULATOR: gunCalcNames.drone,
      WAIT_TO_CYCLE: false,
      MAX_CHILDREN: 3,
    },
  };
  if (type.TURRETS != null) {
    output.TURRETS = type.TURRETS;
  }
  if (type.GUNS == null) {
    output.GUNS = [spawner];
  } else {
    output.GUNS = [...type.GUNS, spawner];
  }
  if (name == -1) {
    output.LABEL = "Hybrid " + type.LABEL;
  } else {
    output.LABEL = name;
  }
  return output;
}

exports.basic = {
  PARENT: [exports.genericTank],
  LABEL: "Basic",
  COLOR: "#031E33",
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
        LABEL: "", // def
        STAT_CALCULATOR: 0, // def
        WAIT_TO_CYCLE: false, // def
        AUTOFIRE: false, // def
        SYNCS_SKILLS: false, // def
        MAX_CHILDREN: 0, // def
        ALT_FIRE: false, // def
        NEGATIVE_RECOIL: false, // def
      },
    },
  ],
};
exports.BasiC = {
  PARENT: [exports.genericTank],
  LABEL: "Basic2",
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, -5, 0, 0],
      MAX_CHILDREN: 10,
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.BulleT1,
        LABEL: "", // def
        STAT_CALCULATOR: 0, // def
        WAIT_TO_CYCLE: false, // def
        AUTOFIRE: false, // def
        SYNCS_SKILLS: false, // def
        ALT_FIRE: false, // def
        NEGATIVE_RECOIL: false, // def
        MAX_CHILDREN: 5,
      },
    },
    {
      POSITION: [18, 8, 1, 5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.BulleT1,
        LABEL: "", // def
        STAT_CALCULATOR: 0, // def
        WAIT_TO_CYCLE: false, // def
        AUTOFIRE: false, // def
        SYNCS_SKILLS: false, // def
        MAX_CHILDREN: 5, // def
        ALT_FIRE: false, // def
        NEGATIVE_RECOIL: false, // def
      },
    },
  ],
};
exports.Extaner = {
  PARENT: [exports.genericTank],
  LABEL: "Extaner",
  SHAPE: 4,
  COLOR: 13,
  SIZE: 25,
  MAX_CHILDREN: 50,
  BROADCAST_MESSAGE: "!Extaner just apeared, be carefully!",
  SPEED: base.SPEED * 3.5,
  FOV: base.FOV * 5,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [3.5, 8.65, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [3.5, 8.65, 1.2, 8, 0, 270, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [3.5, 8.65, 1.2, 8, 0, 180, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
  ],
};
exports.testbed = {
  PARENT: [exports.genericTank],
  LABEL: "TESTBED",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.seniorTester = {
  PARENT: [exports.genericTank],
  LABEL: "Senior Tester",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.developer = {
  PARENT: [exports.genericTank],
  LABEL: "Developer",
  LEVEL: -1,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.spectator = {
  PARENT: [exports.genericTank],
  LABEL: "spectator",
  TYPE: "spectator",
  DAMAGE_CLASS: 1, // 0: def, 1: food, 2: tanks, 3: obstacles
  HITS_OWN_TYPE: "never",
  INTANGIBLE: true,
  DANGER: -9999, // make it so that *nothing* will ever attack it
  BODY: {
    RESIST: 2,
    REGEN: 9e99,
    HEALTH: 9e99,
    DAMAGE: -1,
    DENSITY: 1,
    PUSHABILITY: 0,
    SPEED: base.SPEED * 3.5,
    FOV: base.FOV * 4,
  },
  ALPHA: 0.2,
  SKILL: setBuild("9999999999"),
};
exports.betaTanks = {
  PARENT: [exports.genericTank],
  LABEL: "Beta Tanks",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.Horn = {
  PARENT: [exports.genericTank],
  LABEL: "Horn",
  COLOR: "#3CA4CB",
  SIZE: 12,
  SHAPE: 0,
  FOV: base.FOV * 5,
  GUNS: [
    {
      POSITION: [16.615, 6.4, 1, 0, 0, 0.196, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [10, 0, 0.001, 1, 1, 0.52, 1, 5.4, 1, 3, 1, 30000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [33.231, 6.4, 1, 0, 0, 0.061, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [10, 0, 0.001, 1, 1, 0.52, 1, 10.8, 1, 3, 1, 30000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [66.462, 6.4, 1, 0, 0, 0.058, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [10, 0, 0.001, 1, 1, 0.52, 1, 21.6, 1, 3, 1, 30000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.bosses = {
  PARENT: [exports.genericTank],
  LABEL: "Bosses",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.heavy_guard = {
  PARENT: [exports.genericTank],
  LABEL: "Heavy-Guard",
  COLOR: "#3CA4CB",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [20.769, 14.4, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [300, 10, 0.001, 1, 1, 1.24, 1, 2.25, 1, 2.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13.846, 4.8, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [2.308, 4.8, 1.3, 13.846, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [
            80, 1, 0.001, 0.45, 0.6, 0.6, 1.25, 2.25, 0.8, 2.5, 1.25, 0.00001,
            1,
          ],
        ]),
        TYPE: exports.trap,
      },
    },
  ],
};

exports.holy_cow = {
  PARENT: [exports.genericTank],
  LABEL: "Holy Cow",
  COLOR: "#999999",
  SIZE: 0.5,
  SHAPE: 0,
  BODY: {
    FOV: 2,
  },
  GUNS: [
    {
      POSITION: [1.385, 1.6, 1, -27.692, 0, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -27.692, -2.769, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -27.692, -5.538, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -24.923, -5.538, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -22.154, -5.538, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -22.154, -2.769, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -19.385, -5.538, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -16.615, -5.538, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -16.615, -2.769, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -16.615, 0, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -11.077, 0, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -11.077, -2.769, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -11.077, -5.538, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -5.538, -5.538, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -5.538, -2.769, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -5.538, 0, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -2.769, 0, 0, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -5.538, 0, 180, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -5.538, 2.769, 180, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -5.538, 5.538, 180, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -8.308, 2.769, 180, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -11.077, 0, 180, 0],
    },
    {
      POSITION: [1.385, 1.6, 1, -11.077, 5.538, 180, 0],
    },
    {
      POSITION: [18, 8, 1, 15.231, 0, 0, 0.033],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 27.692, 0, 352.5, 0.067],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 27.692, 0, 7.5, 0.067],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, 0, 15, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.15, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, 0, 345, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.15, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 27.692, 16.962, 337.5, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.15, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 27.692, -16.962, 22.5, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.15, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, -16.962, 15, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, 16.962, 345, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, 16.962, 315, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, -16.962, 45, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, 0, 357, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 33.923, 0, 3, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 3.15, 1, 0.2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 0, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 352.5, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 7.5, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 345, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 15, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 22.5, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 337.5, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 330, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [2.769, 0, 1, 42.092, 0, 30, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 8, 1, 5.85, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.VVA_14 = {
  PARENT: [exports.genericTank],
  LABEL: "VVA-14",
  COLOR: "#555555",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [30.769, 8.75, 2.7, -82, 0, 180, 0],
    },
    {
      POSITION: [4.923, 2.8, 2.7, -88.923, 0, 180, 0],
    },
    {
      POSITION: [138.462, 30.4, 1, -48.462, 0, 180, 0],
    },
    {
      POSITION: [110.769, 19.2, 1, -27.692, -22.154, 180, 0],
    },
    {
      POSITION: [110.769, 19.2, 1, -27.692, 22.154, 180, 0],
    },
    {
      POSITION: [62.308, 19.2, 1, -27.692, 22.154, 351, 0],
    },
    {
      POSITION: [62.308, 19.2, 1, -27.692, -22.154, 10.5, 0],
    },
    {
      POSITION: [110.769, 19.2, 1, -27.692, -22.154, 180, 0],
    },
    {
      POSITION: [110.769, 19.2, 1, -27.692, 22.154, 180, 0],
    },
    {
      POSITION: [31.154, 14.4, 1, -2.077, 34.615, 270, 0],
    },
    {
      POSITION: [31.154, 14.4, 1, -2.077, -34.615, 90, 0],
    },
    {
      POSITION: [21.462, 7.2, 1, -49.846, -11.077, 180, 0],
    },
    {
      POSITION: [29.077, 6.4, 1, -44.308, 87.231, 90, 0],
    },
    {
      POSITION: [29.077, 6.4, 1, -44.308, -87.231, 270, 0],
    },
    {
      POSITION: [131.538, 12.8, 1, -90, 36, 0, 0],
    },
    {
      POSITION: [131.538, 12.8, 1, -90, -36, 0, 0],
    },
    {
      POSITION: [24.615, 3.85, 2.7, -68.154, -36, 180, 0],
    },
    {
      POSITION: [24.615, 3.85, 2.7, -68.154, 36, 180, 0],
    },
    {
      POSITION: [27.692, 3.85, 2.7, -118, 36, 0, 0],
    },
    {
      POSITION: [27.692, 3.85, 2.7, -118, -36, 0, 0],
    },
    {
      POSITION: [27.692, 9.8, 2.7, 28.769, -83.077, 262.5, 0],
    },
    {
      POSITION: [27.692, 9.8, 2.7, 28.769, 83.077, 97.5, 0],
    },
    {
      POSITION: [131.538, 12.8, 1, -90, -36, 0, 0],
    },
    {
      POSITION: [131.538, 12.8, 1, -90, 36, 0, 0],
    },
    {
      POSITION: [27.692, 3.85, 2.7, -118, 36, 0, 0],
    },
    {
      POSITION: [27.692, 3.85, 2.7, -118, -36, 0, 0],
    },
    {
      POSITION: [77.538, 30.4, 1, -38.769, -38.769, 270, 0],
    },
    {
      POSITION: [27.692, 8, 1, 34.615, -6.923, 180, NaN],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.65, 0.001, 1, 1, 3.2, 1, 45, 1, 0.05, 1, 3000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [27.692, 8, 1, 34.615, 6.923, 180, NaN],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.65, 0.001, 1, 1, 3.2, 1, 45, 1, 0.05, 1, 3000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [9.231, 4.9, 2.7, 30.154, 6.923, 180, NaN],
    },
    {
      POSITION: [9.231, 4.9, 2.7, 30.154, -6.923, 180, NaN],
    },
    {
      POSITION: [61.538, 10.5, 2.7, -102.769, -34.615, 270, NaN],
    },
    {
      POSITION: [61.538, 10.5, 2.7, -102.769, 34.615, 90, NaN],
    },
    {
      POSITION: [22.154, 2.4, 1, 24.923, -106.615, 180, NaN],
    },
    {
      POSITION: [22.154, 2.4, 1, 24.923, 106.615, 180, NaN],
    },
    {
      POSITION: [8.615, 5.6, 2.7, -115.231, 34.615, 90, NaN],
    },
    {
      POSITION: [8.615, 5.6, 2.7, -115.231, -34.615, 270, NaN],
    },
    {
      POSITION: [6.923, 8, 1, 20.769, -34.615, 180, NaN],
    },
    {
      POSITION: [6.923, 8, 1, 20.769, 34.615, 180, NaN],
    },
    {
      POSITION: [6.923, 8, 1, 48.462, 38.769, 180, NaN],
    },
    {
      POSITION: [6.923, 8, 1, 48.462, -38.769, 180, NaN],
    },
    {
      POSITION: [9.692, 6.4, 1, -22.154, -5.538, 0, 0],
    },
    {
      POSITION: [9.692, 6.4, 1, -22.154, 5.538, 0, 0],
    },
    {
      POSITION: [9.692, 6.4, 1, -5.538, 5.538, 0, 0],
    },
    {
      POSITION: [9.692, 6.4, 1, -5.538, -5.538, 0, 0],
    },
    {
      POSITION: [9.692, 6.4, 1, 11.077, -5.538, 0, 0],
    },
    {
      POSITION: [9.692, 6.4, 1, 11.077, 5.538, 0, 0],
    },
    {
      POSITION: [8.308, 4.8, 1, 27.692, 4.154, 0, 0],
    },
    {
      POSITION: [8.308, 4.8, 1, 27.692, -4.154, 0, 0],
    },
    {
      POSITION: [2.769, 1.6, 1, 41.538, 0, 0, 0],
    },
    {
      POSITION: [16.615, 6.4, 1, -27.692, -49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, -27.692, 49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, -33.231, 49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, -33.231, -49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, -38.769, -49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, -38.769, 49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, -44.308, 49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, -44.308, -49.846, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 108, 1, 0.4, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [61.538, 10.5, 2.7, -102.769, 34.615, 90, 0],
    },
    {
      POSITION: [61.538, 10.5, 2.7, -102.769, -34.615, 270, 0],
    },
    {
      POSITION: [9.846, 5.6, 2.7, 27.385, -34.615, 270, 0],
    },
    {
      POSITION: [9.846, 5.6, 2.7, 27.385, 34.615, 90, 0],
    },
    {
      POSITION: [6.923, 8, 1, 44.308, 34.615, 180, 0],
    },
    {
      POSITION: [6.923, 8, 1, 44.308, -34.615, 180, 0],
    },
    {
      POSITION: [0.277, 0.32, 1, 20.769, 20.769, 180, 1],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 21.046, 20.769, 180, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, 20.769, -20.769, 180, 1],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 21.046, -20.769, 180, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, 15.231, -20.769, 180, 1.1],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 15.508, -20.769, 180, 1.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, 15.231, 20.769, 180, 1.1],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 15.508, 20.769, 180, 1.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, 9.692, 20.769, 180, 1.2],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 9.969, 20.769, 180, 1.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, 9.692, -20.769, 180, 1.2],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 9.969, -20.769, 180, 1.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, 4.154, -20.769, 180, 1.3],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 4.431, -20.769, 180, 1.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, 4.154, 20.769, 180, 1.3],
    },
    {
      POSITION: [0.046, 0.32, 1.3, 4.431, 20.769, 180, 1.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, -1.385, 20.769, 180, 1.4],
    },
    {
      POSITION: [0.046, 0.32, 1.3, -1.108, 20.769, 180, 1.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0.277, 0.32, 1, -1.385, -20.769, 180, 1.4],
    },
    {
      POSITION: [0.046, 0.32, 1.3, -1.108, -20.769, 180, 1.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 0.45, 0.6, 48, 1.25, 2.7, 0.8, 1, 1.25, 1000000, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 270, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 72, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 0, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 72, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 90, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 72, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 180, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 72, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 240, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 81, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 300, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 81, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 0, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 81, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 60, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 81, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 120, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 81, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 180, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 81, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 225, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 270, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 315, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 0, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 45, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 90, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 135, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, 0, 180, 1.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [100, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12.308, 2.45, 2.7, 41.231, 0, 180, 1.6],
    },
    {
      POSITION: [18, 6.4, 1, 52.615, 0, 180, 1.6],
    },
  ],
};
exports.castle = {
  PARENT: [exports.genericTank],
  LABEL: "Castle",
  COLOR: "#555555",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [83.077, 96, 1, -41.538, 0, 180, 0],
    },
    {
      POSITION: [41.538, 96, 1, 13.846, 0, 315, 0],
    },
    {
      POSITION: [41.538, 96, 1, 13.846, 0, 45, 0],
    },
    {
      POSITION: [41.538, 96, 1, 13.846, 0, 135, 0],
    },
    {
      POSITION: [41.538, 96, 1, 13.846, 0, 225, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -80.615, 0, 315, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -80.615, 0, 45, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -80.615, 0, 135, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -80.615, 0, 225, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, 40.154, 180, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, 40.154, 270, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, 40.154, 0, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, 40.154, 90, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, -40.154, 270, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, -40.154, 0, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, -40.154, 90, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -64, -40.154, 180, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, 55.385, 225, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, 55.385, 315, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, 55.385, 45, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, 55.385, 135, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, -55.385, 315, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, -55.385, 45, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, -55.385, 135, 0],
    },
    {
      POSITION: [6.154, 3.5, 2.7, -25.231, -55.385, 225, 0],
    },
    {
      POSITION: [18.462, 3.5, 2.7, -33.538, -55.385, 315, 0],
    },
    {
      POSITION: [18.462, 3.5, 2.7, -33.538, -55.385, 45, 0],
    },
    {
      POSITION: [18.462, 3.5, 2.7, -33.538, -55.385, 135, 0],
    },
    {
      POSITION: [18.462, 3.5, 2.7, -33.538, -55.385, 225, 0],
    },
    {
      POSITION: [41.538, 6.4, 1, -20.769, -41.538, 270, 0],
    },
    {
      POSITION: [41.538, 6.4, 1, -20.769, -41.538, 0, 0],
    },
    {
      POSITION: [41.538, 6.4, 1, -20.769, -41.538, 90, 0],
    },
    {
      POSITION: [41.538, 6.4, 1, -20.769, -41.538, 180, 0],
    },
    {
      POSITION: [41.538, 96, 1, -41.538, -55.385, 315, 0],
    },
    {
      POSITION: [41.538, 96, 1, -41.538, -55.385, 45, 0],
    },
    {
      POSITION: [41.538, 96, 1, -41.538, -55.385, 135, 0],
    },
    {
      POSITION: [41.538, 96, 1, -41.538, -55.385, 225, 0],
    },
    {
      POSITION: [27.692, 7.2, 1, 27.692, 0, 315, 0],
    },
    {
      POSITION: [27.692, 7.2, 1, 27.692, 0, 45, 0],
    },
    {
      POSITION: [27.692, 7.2, 1, 27.692, 0, 135, 0],
    },
    {
      POSITION: [27.692, 7.2, 1, 27.692, 0, 225, 0],
    },
    {
      POSITION: [13.846, 7.2, 1, 41.538, 0, 315, 0],
    },
    {
      POSITION: [13.846, 7.2, 1, 41.538, 0, 45, 0],
    },
    {
      POSITION: [13.846, 7.2, 1, 41.538, 0, 135, 0],
    },
    {
      POSITION: [13.846, 7.2, 1, 41.538, 0, 225, 0],
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 45, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 135, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 225, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 225, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 315, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 315, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 42.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 42.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 132.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 132.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 222.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 222.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 312.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 312.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 47.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 47.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 137.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 137.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 227.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 227.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 52.615, 0, 317.5, 0],
    },
    {
      POSITION: [1.846, 3.2, 1.3, 63.692, 0, 317.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 0.45, 0.6, 12, 1.25, 2.7, 0.8, 2.5, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [5.538, 4.2, 2.7, 52.308, 0, 315, 0],
    },
    {
      POSITION: [5.538, 4.2, 2.7, 52.308, 0, 45, 0],
    },
    {
      POSITION: [5.538, 4.2, 2.7, 52.308, 0, 135, 0],
    },
    {
      POSITION: [5.538, 4.2, 2.7, 52.308, 0, 225, 0],
    },
    {
      POSITION: [27.692, 12.8, 1, -11.077, 0, 185, 0],
    },
    {
      POSITION: [27.692, 6.4, 1, -13.846, 41.538, 270, 0],
    },
  ],
};

exports.single = {
  PARENT: [exports.genericTank],
  LABEL: "Single",
  //CONTROLLERS: ['nearestDifferentMaster'],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [19, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.single]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
    },
  ],
};

let smshskl = 12; //13;
exports.smash = {
  PARENT: [exports.genericTank],
  LABEL: "Smasher",
  DANGER: 6,
  BODY: {
    FOV: base.FOV * 1.05,
    DENSITY: base.DENSITY * 2,
  },
  TURRETS: [
    {
      /** SIZE X Y ANGLE ARC */
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: exports.smasherBody,
    },
  ],
  IS_SMASHER: true,
  SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
  STAT_NAMES: statnames.smasher,
};
exports.megasmash = {
  PARENT: [exports.genericTank],
  LABEL: "Mega-Smasher",
  DANGER: 7,
  BODY: {
    SPEED: base.speed * 1.05,
    FOV: base.FOV * 1.1,
    DENSITY: base.DENSITY * 4,
  },
  IS_SMASHER: true,
  SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
  STAT_NAMES: statnames.smasher,
  TURRETS: [
    {
      /** SIZE X Y ANGLE ARC */
      POSITION: [24, 0, 0, 0, 360, 0],
      TYPE: exports.megasmashBody,
    },
  ],
};
exports.spike = {
  PARENT: [exports.genericTank],
  LABEL: "Spike",
  DANGER: 7,
  BODY: {
    SPEED: base.speed * 0.9,
    DAMAGE: base.DAMAGE * 1.1,
    FOV: base.FOV * 1.05,
    DENSITY: base.DENSITY * 2,
  },
  IS_SMASHER: true,
  SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
  STAT_NAMES: statnames.smasher,
  TURRETS: [
    {
      /** SIZE X Y ANGLE ARC */
      POSITION: [20.5, 0, 0, 0, 360, 0],
      TYPE: exports.spikeBody,
    },
    {
      POSITION: [20.5, 0, 0, 120, 360, 0],
      TYPE: exports.spikeBody,
    },
    {
      POSITION: [20.5, 0, 0, 240, 360, 0],
      TYPE: exports.spikeBody,
    },
  ],
};
exports.weirdspike = {
  PARENT: [exports.genericTank],
  LABEL: "Spike",
  DANGER: 7,
  BODY: {
    DAMAGE: base.DAMAGE * 1.15,
    FOV: base.FOV * 1.05,
    DENSITY: base.DENSITY * 1.5,
  },
  IS_SMASHER: true,
  SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
  STAT_NAMES: statnames.smasher,
  TURRETS: [
    {
      /** SIZE X Y ANGLE ARC */
      POSITION: [20.5, 0, 0, 0, 360, 0],
      TYPE: exports.spikeBody1,
    },
    {
      POSITION: [20.5, 0, 0, 180, 360, 0],
      TYPE: exports.spikeBody2,
    },
  ],
};
exports.autosmash = makeAuto(exports.smash, "Auto-Smasher", {
  type: exports.autoSmasherTurret,
  size: 11,
});
exports.autosmash.SKILL_CAP = [
  smshskl,
  smshskl,
  smshskl,
  smshskl,
  smshskl,
  smshskl,
  smshskl,
  smshskl,
  smshskl,
  smshskl,
];

exports.twin = {
  PARENT: [exports.genericTank],
  LABEL: "Twin",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 8, 1, 0, 5.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: exports.bullet,
      },
    },
    {
      /* LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.gunner = {
  PARENT: [exports.genericTank],
  LABEL: "Gunner",
  DANGER: 6,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.cyclone = {
  PARENT: [exports.genericTank],
  LABEL: "Cyclone",
  DANGER: 6,
  GUNS: [],
};
for (let i = 0; i < 12; i++)
  exports.cyclone.GUNS.push({
    POSITION: [16, 3.5, 1, 0, 0, (360 / 12) * i, i % 2 === 0 ? 0.5 : 0],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
      TYPE: exports.bullet,
    },
  });
exports.machinegunner = {
  PARENT: [exports.genericTank],
  LABEL: "Machine Gunner",
  DANGER: 6,
  BODY: {
    SPEED: base.SPEED * 0.9,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 3, 4.0, -3, 5, 0, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.puregunner,
          g.machgun,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [14, 3, 4.0, -3, -5, 0, 0.8],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.puregunner,
          g.machgun,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [14, 3, 4.0, 0, 2.5, 0, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.puregunner,
          g.machgun,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [14, 3, 4.0, 0, -2.5, 0, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.puregunner,
          g.machgun,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [14, 3, 4.0, 3, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.puregunner,
          g.machgun,
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.autogunner = makeAuto(exports.gunner);
exports.nailgun = {
  PARENT: [exports.genericTank],
  LABEL: "Nailgun",
  DANGER: 7,
  BODY: {
    FOV: base.FOV * 1.1,
    SPEED: base.SPEED * 0.9,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.twin,
          g.nail,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.twin,
          g.nail,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 2, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.twin,
          g.nail,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
    },
  ],
};

exports.double = {
  PARENT: [exports.genericTank],
  LABEL: "Double Twin",
  DANGER: 6,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 8, 1, 0, 5.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, 5.5, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.tripletwin = {
  PARENT: [exports.genericTank],
  LABEL: "Triple Twin",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 8, 1, 0, 5.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, 5.5, 120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, -5.5, 120, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, 5.5, 240, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, -5.5, 240, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.double]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.autodouble = makeAuto(exports.double, "Auto-Double");
exports.split = {
  PARENT: [exports.genericTank],
  LABEL: "Hewn Double",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [19, 8, 1, 0, 5.5, 25, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          g.double,
          g.hewn,
          g.morerecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, -5.5, -25, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          g.double,
          g.hewn,
          g.morerecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, 5.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.double,
          g.hewn,
          g.morerecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.double,
          g.hewn,
          g.morerecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, 5.5, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double, g.hewn]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.double, g.hewn]),
        TYPE: exports.bullet,
      },
    },
  ],
};

exports.bent = {
  PARENT: [exports.genericTank],
  LABEL: "Triple Shot",
  DANGER: 6,
  BODY: {
    SPEED: base.SPEED * 0.9,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [19, 8, 1, 0, -2, -20, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, 2, 20, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.bentdouble = {
  PARENT: [exports.genericTank],
  LABEL: "Bent Double",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [19, 8, 1, 0, -1, -25, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, 1, 25, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, -1, 155, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, 1, -155, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [22, 8, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.double]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.penta = {
  PARENT: [exports.genericTank],
  LABEL: "Penta Shot",
  DANGER: 7,
  BODY: {
    SPEED: base.SPEED * 0.85,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [16, 8, 1, 0, -3, -30, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 3, 30, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, -2, -15, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, 2, 15, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.benthybrid = makeHybrid(exports.bent, "Bent Hybrid");

exports.triple = {
  PARENT: [exports.genericTank],
  DANGER: 6,
  BODY: {
    FOV: base.FOV * 1.05,
  },
  LABEL: "Triplet",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, 1, 0, 5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 10, 1, 0, -5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [21, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.quint = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  BODY: {
    FOV: base.FOV * 1.1,
  },
  LABEL: "Quintuplet",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [16, 10, 1, 0, -5, 0, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16, 10, 1, 0, 5, 0, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 10, 1, 0, -3, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 10, 1, 0, 3, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [22, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.quint]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.dual = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  BODY: {
    ACCEL: base.ACCEL * 0.8,
    FOV: base.FOV * 1.1,
  },
  LABEL: "Dual",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 7, 1, 0, 5.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowpower]),
        TYPE: exports.bullet,
        LABEL: "Small",
      },
    },
    {
      POSITION: [18, 7, 1, 0, -5.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowpower]),
        TYPE: exports.bullet,
        LABEL: "Small",
      },
    },
    {
      POSITION: [16, 8.5, 1, 0, 5.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16, 8.5, 1, 0, -5.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual]),
        TYPE: exports.bullet,
      },
    },
  ],
};

exports.sniper = {
  PARENT: [exports.genericTank],
  LABEL: "Sniper",
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    FOV: base.FOV * 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [24, 8.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.rifle = {
  PARENT: [exports.genericTank],
  LABEL: "Rifle",
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    FOV: base.FOV * 1.225,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 10.5, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [24, 7, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.assassin = {
  PARENT: [exports.genericTank],
  DANGER: 6,
  LABEL: "Assassin",
  BODY: {
    ACCELERATION: base.ACCEL * 0.6,
    SPEED: base.SPEED * 0.85,
    FOV: base.FOV * 1.4,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [27, 8.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 8, 0, 0, 0],
    },
  ],
};
exports.ranger = {
  PARENT: [exports.genericTank],
  LABEL: "Ranger",
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.5,
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.5,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [32, 8.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 8, 0, 0, 0],
    },
  ],
};
exports.autoass = makeAuto(exports.assassin, "");

exports.hunter = {
  PARENT: [exports.genericTank],
  LABEL: "Hunter",
  DANGER: 6,
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.25,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [24, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [21, 12, 1, 0, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.preda = {
  PARENT: [exports.genericTank],
  LABEL: "Predator",
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    SPEED: base.SPEED * 0.85,
    FOV: base.FOV * 1.3,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [24, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.hunter,
          g.hunter2,
          g.hunter2,
          g.preda,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [21, 12, 1, 0, 0, 0, 0.15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.hunter,
          g.hunter2,
          g.preda,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 16, 1, 0, 0, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.poach = makeHybrid(exports.hunter, "Poacher");
exports.sidewind = {
  PARENT: [exports.genericTank],
  LABEL: "Sidewinder",
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.3,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [10, 11, -0.5, 14, 0, 0, 0],
    },
    {
      POSITION: [21, 12, -1.1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewind]),
        TYPE: exports.snake,
        STAT_CALCULATOR: gunCalcNames.sustained,
      },
    },
  ],
};

exports.director = {
  PARENT: [exports.genericTank],
  LABEL: "Director",
  STAT_NAMES: statnames.drone,
  DANGER: 5,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 8,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
exports.manager = {
  PARENT: [exports.genericTank],
  LABEL: "Manager",
  STAT_NAMES: statnames.drone,
  DANGER: 5,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 8,
  SHAPE: 10,
  INVISIBLE: [0.08, 0.03],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
exports.master = {
  PARENT: [exports.genericTank],
  LABEL: "Master",
  STAT_NAMES: statnames.drone,
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    FOV: base.FOV * 1.15,
  },
  FACING_TYPE: "autospin",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.master]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 6,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.master]),
        TYPE: [
          exports.drone,
          {
            BODY: { FOV: 2 },
            INDEPENDENT: true,
          },
        ],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 6,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 240, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.master]),
        TYPE: [
          exports.drone,
          {
            BODY: { FOV: 1 },
            INDEPENDENT: true,
          },
        ],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 6,
      },
    },
  ],
};
exports.autoMaster = makeAuto(exports.master);
exports.quasar = {
  PARENT: [exports.genericTank],
  LABEL: "Quasar",
  STAT_NAMES: statnames.drone,
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    FOV: base.FOV * 1.15,
  },
  FACING_TYPE: "autospin",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.master,
          [2, 1, 1, 1, 0.8, 0.6, 0.8, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 5,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 72, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.master,
          [2, 1, 1, 1, 0.8, 0.6, 0.8, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: [
          exports.drone,
          {
            BODY: { FOV: 2 },
            INDEPENDENT: true,
          },
        ],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 5,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 72 * 2, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.master,
          [2, 1, 1, 1, 0.8, 0.6, 0.8, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: [
          exports.drone,
          {
            BODY: { FOV: 1 },
            INDEPENDENT: true,
          },
        ],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 5,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 72 * 3, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.master,
          [2, 1, 1, 1, 0.8, 0.6, 0.8, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 5,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 72 * 4, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.master,
          [2, 1, 1, 1, 0.8, 0.6, 0.8, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: [
          exports.drone,
          {
            BODY: { FOV: 2 },
            INDEPENDENT: true,
          },
        ],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 5,
      },
    },
  ],
};
exports.commander = {
  PARENT: [exports.genericTank],
  LABEL: "Commander",
  STAT_NAMES: statnames.drone,
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    FOV: base.FOV * 1.15,
  },
  FACING_TYPE: "autospin",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.master, g.commander]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 4,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.master, g.commander]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 4,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 300, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.master, g.commander]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        MAX_CHILDREN: 4,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
        TYPE: [
          exports.swarm,
          {
            CONTROLLERS: ["canRepel"],
          },
        ],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 0, 120, 1 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
        TYPE: [
          exports.swarm,
          {
            CONTROLLERS: ["canRepel"],
          },
        ],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 0, 240, 2 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
        TYPE: [
          exports.swarm,
          {
            CONTROLLERS: ["canRepel"],
          },
        ],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};

exports.overseer = {
  PARENT: [exports.genericTank],
  LABEL: "Overseer",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 8,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
  ],
};
exports.phantom = {
  PARENT: [exports.genericTank],
  LABEL: "Phantom",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  SHAPE: 10,
  MAX_CHILDREN: 8,
  INVISIBLE: [0.08, 0.03],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
  ],
};
exports.overlord = {
  PARENT: [exports.genericTank],
  LABEL: "Overlord",
  DANGER: 7,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 8,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
  ],
};
exports.overtrap = {
  PARENT: [exports.genericTank],
  LABEL: "Overtrapper",
  DANGER: 7,
  STAT_NAMES: statnames.generic,
  BODY: {
    ACCELERATION: base.ACCEL * 0.6,
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 11, 1.2, 8, 0, 125, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 3,
      },
    },
    {
      POSITION: [6, 11, 1.2, 8, 0, 235, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 3,
      },
    },
    {
      POSITION: [14, 8, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 8, 1.5, 14, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.banshee = {
  PARENT: [exports.genericTank],
  LABEL: "Banshee",
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.5,
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.1,
  },
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [10, 8, 0, 0, 80, 0],
      TYPE: exports.bansheegun,
    },
    {
      POSITION: [10, 8, 0, 120, 80, 0],
      TYPE: exports.bansheegun,
    },
    {
      POSITION: [10, 8, 0, 240, 80, 0],
      TYPE: exports.bansheegun,
    },
  ],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 11, 1.2, 8, 0, 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 2,
      },
    },
    {
      POSITION: [6, 11, 1.2, 8, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 2,
      },
    },
    {
      POSITION: [6, 11, 1.2, 8, 0, 300, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 2,
      },
    },
  ],
};
exports.autoover = makeAuto(exports.overseer);
exports.overgunner = {
  PARENT: [exports.genericTank],
  LABEL: "Overgunner",
  DANGER: 7,
  STAT_NAMES: statnames.generic,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 11, 1.2, 8, 0, 125, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 3,
      },
    },
    {
      POSITION: [6, 11, 1.2, 8, 0, 235, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta]),
        TYPE: exports.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 3,
      },
    },
    {
      POSITION: [19, 2, 1, 0, -2.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.twin,
          g.slow,
          g.flank,
          g.lotsmorrecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.twin,
          g.slow,
          g.flank,
          g.lotsmorrecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, 0, 0],
    },
  ],
};

function makeSwarmSpawner(guntype) {
  return {
    PARENT: [exports.genericTank],
    LABEL: "",
    BODY: {
      FOV: 2,
    },
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: 16,
    AI: {
      NO_LEAD: true,
      SKYNET: true,
      FULL_VIEW: true,
    },
    GUNS: [
      {
        /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
        POSITION: [14, 15, 0.6, 14, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: guntype,
          TYPE: exports.swarm,
          STAT_CALCULATOR: gunCalcNames.swarm,
        },
      },
    ],
  };
}
exports.cruiserGun = makeSwarmSpawner(combineStats([g.swarm]));
exports.cruiser = {
  PARENT: [exports.genericTank],
  LABEL: "Cruiser",
  DANGER: 6,
  FACING_TYPE: "locksFacing",
  STAT_NAMES: statnames.swarm,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    FOV: base.FOV * 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, -4, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.battleship = {
  PARENT: [exports.genericTank],
  LABEL: "Battleship",
  DANGER: 7,
  STAT_NAMES: statnames.swarm,
  FACING_TYPE: "locksFacing",
  BODY: {
    ACCELERATION: base.ACCEL,
    FOV: base.FOV * 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [7, 7.5, 0.6, 7, 4, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
        LABEL: "Guided",
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, -4, 90, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: [exports.autoswarm],
        STAT_CALCULATOR: gunCalcNames.swarm,
        LABEL: "Autonomous",
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 4, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: [exports.autoswarm],
        STAT_CALCULATOR: gunCalcNames.swarm,
        LABEL: "Autonomous",
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, -4, 270, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.battle]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
        LABEL: "Guided",
      },
    },
  ],
};
exports.carrier = {
  PARENT: [exports.genericTank],
  LABEL: "Carrier",
  DANGER: 7,
  STAT_NAMES: statnames.swarm,
  FACING_TYPE: "locksFacing",
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    FOV: base.FOV * 1.3,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 2, 40, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, -2, -40, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.autocruiser = makeAuto(exports.cruiser);
exports.fortress = {
  PARENT: [exports.genericTank],
  LABEL: "Fortress", //'Palisade',
  DANGER: 7,
  STAT_NAMES: statnames.generic,
  BODY: {
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: [
          exports.swarm,
          {
            CONTROLLERS: ["canRepel"],
          },
        ],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 0, 120, 1 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: [
          exports.swarm,
          {
            CONTROLLERS: ["canRepel"],
          },
        ],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 0, 240, 2 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: [
          exports.swarm,
          {
            CONTROLLERS: ["canRepel"],
          },
        ],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [14, 9, 1, 0, 0, 60, 0],
    },
    {
      POSITION: [4, 9, 1.5, 14, 0, 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [14, 9, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [4, 9, 1.5, 14, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [14, 9, 1, 0, 0, 300, 0],
    },
    {
      POSITION: [4, 9, 1.5, 14, 0, 300, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.halfrange, g.slow]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

exports.underseer = {
  PARENT: [exports.genericTank],
  LABEL: "Underseer",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  SHAPE: 4,
  MAX_CHILDREN: 14,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5, 12, 1.2, 8, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
  ],
};
exports.summoner2 = {
  PARENT: [exports.genericTank],
  LABEL: "Summoner",
  SHAPE: 4,
  GUNS: (() => {
    var gs = [];
    for (let i = 0; i < 4; i++) {
      gs.push({
        POSITION: [5, 12, 1.2, 8, 0, (360 * i) / 4, Math.random() * 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
          TYPE: exports.sunchip,
          MAX_CHILDREN: 4,
        },
      });
    }
    return gs;
  })(),
};
exports.necromancer = {
  PARENT: [exports.genericTank],
  LABEL: "Necromancer",
  DANGER: 7,
  STAT_NAMES: statnames.necro,
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.15,
  },
  SHAPE: 4,
  FACING_TYPE: "autospin",
  MAX_CHILDREN: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5, 12, 1.2, 8, 0, 270, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5, 12, 1.2, 8, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5, 12, 1.2, 8, 0, 180, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
  ],
};
exports.Necromancer = {
  PARENT: [exports.genericTank],
  LABEL: "Level Up",
  DANGER: 7,
  STAT_NAMES: statnames.necro,
  BODY: {
    ACCELERATION: base.ACCEL * 0.8,
    SPEED: base.SPEED * 1.5,
    FOV: base.FOV * 2,
  },
  SHAPE: 4,
  MAX_CHILDREN: 80,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5, 12, 1.2, 8, 0, 270, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5, 12, 1.2, 8, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5, 12, 1.2, 8, 0, 180, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
  ],
};
exports.maleficitor = {
  PARENT: [exports.genericTank],
  LABEL: "Maleficitor",
  DANGER: 7,
  STAT_NAMES: statnames.necro,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.85,
    FOV: base.FOV * 1.1,
  },
  SHAPE: 4,
  MAX_CHILDREN: 20,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [5, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.sunchip,
          [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
        ]),
        TYPE: [
          exports.sunchip,
          {
            INVISIBLE: [0.06, 0.03],
          },
        ],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
  ],
};

exports.lilfact = {
  PARENT: [exports.genericTank],
  LABEL: "Spawner",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    SPEED: base.SPEED * 0.8,
    ACCELERATION: base.ACCEL * 0.5,
    FOV: 1.1,
  },
  GUNS: [
    {
      /**** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
    },
    {
      POSITION: [1, 12, 1, 15, 0, 0, 0],
      PROPERTIES: {
        MAX_CHILDREN: 4,
        SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
        TYPE: exports.minion,
        STAT_CALCULATOR: gunCalcNames.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
      },
    },
    {
      POSITION: [3.5, 12, 1, 8, 0, 0, 0],
    },
  ],
};
exports.autoSpawner = makeAuto(exports.lilfact);
exports.factory = {
  PARENT: [exports.genericTank],
  LABEL: "Factory",
  DANGER: 7,
  STAT_NAMES: statnames.drone,
  BODY: {
    SPEED: base.SPEED * 0.8,
    FOV: 1.1,
  },
  MAX_CHILDREN: 6,
  GUNS: [
    {
      /**** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 11, 1, 10.5, 0, 0, 0],
    },
    {
      POSITION: [2, 14, 1, 15.5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory]),
        TYPE: exports.minion,
        STAT_CALCULATOR: gunCalcNames.drone,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
      },
    },
    {
      POSITION: [4, 14, 1, 8, 0, 0, 0],
    },
  ],
};

exports.machine = {
  PARENT: [exports.genericTank],
  LABEL: "Machine Gun",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [12, 10, 1.4, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.spray = {
  PARENT: [exports.genericTank],
  LABEL: "Sprayer",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [23, 7, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.lowpower,
          g.mach,
          g.morerecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12, 10, 1.4, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.sprayTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Sprayer",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [23, 7, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12, 10, 1.4, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};

exports.mini = {
  PARENT: [exports.genericTank],
  LABEL: "Minigun",
  DANGER: 6,
  BODY: {
    FOV: 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [20, 8, 1, 0, 0, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.stream = {
  PARENT: [exports.genericTank],
  LABEL: "Streamliner",
  DANGER: 7,
  BODY: {
    FOV: 1.3,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [25, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [23, 8, 1, 0, 0, 0, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [21, 8, 1, 0, 0, 0, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 8, 1, 0, 0, 0, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [17, 8, 1, 0, 0, 0, 0.8],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.hybridmini = makeHybrid(exports.mini, "Cropduster");
exports.minitrap = {
  PARENT: [exports.genericTank],
  DANGER: 6,
  LABEL: "Barricade",
  STAT_NAMES: statnames.trap,
  BODY: {
    FOV: 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [24, 8, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 8, 1.3, 22, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 8, 1.3, 18, 0, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 8, 1.3, 14, 0, 0, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

exports.pound = {
  PARENT: [exports.genericTank],
  DANGER: 5,
  BODY: {
    ACCELERATION: base.ACCEL * 0.8,
  },
  LABEL: "Pounder",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 12, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.eagle = {
  PARENT: [exports.genericTank],
  LABEL: "Eagle",
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.8,
    FOV: base.FOV * 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 12, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound]),
        TYPE: exports.bullet,
        ALT_FIRE: true,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 210, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};
exports.destroy = {
  PARENT: [exports.genericTank],
  DANGER: 6,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
  },
  LABEL: "Destroyer",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [21, 14, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.anni = {
  PARENT: [exports.genericTank],
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
  },
  LABEL: "Annihilator",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.hiveshooter = {
  PARENT: [exports.genericTank],
  DANGER: 6,
  LABEL: "Swarmer",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 14, -1.2, 5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy]),
        TYPE: exports.hive,
      },
    },
    {
      POSITION: [15, 12, 1, 5, 0, 0, 0],
    },
  ],
};
exports.hybrid = makeHybrid(exports.destroy, "Hybrid");
exports.multishot = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Multishot",
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
  },
  GUNS: [
    /***** LENGTH WIDTH ASPECT X Y ANGLE DELAY */ {
      POSITION: [4, 3, 1, 11, -3, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [1, 3, 1, 13, 1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [1, 2, 1, 13, 2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [1, 2, 1, 13, -2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [10, 11, 1, 6, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.fake]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [8, 11, -1.3, 4, 0, 0, 0],
    },
  ],
};
exports.autoMulti = makeAuto(exports.multishot);
exports.shotgun2 = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Shotgun",
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
  },
  GUNS: [
    /***** LENGTH WIDTH ASPECT X Y ANGLE DELAY */ {
      POSITION: [4, 3, 1, 11, -3, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4, 3, 1, 11, 3, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4, 4, 1, 13, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [1, 4, 1, 12, -1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [1, 4, 1, 11, 1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [1, 3, 1, 13, -1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [1, 3, 1, 13, 1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [1, 2, 1, 13, 2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [1, 2, 1, 13, -2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [15, 14, 1, 6, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.fake]),
        TYPE: exports.casing,
      },
    },
    {
      POSITION: [8, 14, -1.3, 4, 0, 0, 0],
    },
  ],
};

exports.builder = {
  PARENT: [exports.genericTank],
  DANGER: 6,
  LABEL: "Builder",
  STAT_NAMES: statnames.trap,
  BODY: {
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 12, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [2, 12, 1.1, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block]),
        TYPE: exports.block,
      },
    },
  ],
};
exports.engineer = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Engineer",
  STAT_NAMES: statnames.trap,
  BODY: {
    SPEED: base.SPEED * 0.75,
    FOV: base.FOV * 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 11, 1, 10.5, 0, 0, 0],
    },
    {
      POSITION: [3, 14, 1, 15.5, 0, 0, 0],
    },
    {
      POSITION: [2, 14, 1.3, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.pillbox,
        SYNCS_SKILLS: true,
      },
    },
    {
      POSITION: [4, 14, 1, 8, 0, 0, 0],
    },
  ],
};
exports.construct = {
  PARENT: [exports.genericTank],
  LABEL: "Constructor",
  STAT_NAMES: statnames.trap,
  DANGER: 3,
  BODY: {
    ACCELERATION: base.ACCEL * 0.5,
    SPEED: base.SPEED * 0.7,
    FOV: base.FOV * 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 18, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [2, 18, 1.2, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct]),
        TYPE: exports.block,
      },
    },
  ],
};
exports.autobuilder = makeAuto(exports.builder);
exports.conq = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Conqueror",
  STAT_NAMES: statnames.trap,
  BODY: {
    SPEED: base.SPEED * 0.8,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [21, 14, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 14, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [2, 14, 1.1, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block]),
        TYPE: exports.block,
      },
    },
  ],
};
exports.bentboomer = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Bent Boomer",
  STAT_NAMES: statnames.trap,
  BODY: {
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [8, 10, 1, 8, -2, -35, 0],
    },
    {
      POSITION: [8, 10, 1, 8, 2, 35, 0],
    },
    {
      POSITION: [2, 10, 1.3, 16, -2, -35, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block, g.fast, g.twin]),
        TYPE: exports.boomerang,
      },
    },
    {
      POSITION: [2, 10, 1.3, 16, 2, 35, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block, g.fast, g.twin]),
        TYPE: exports.boomerang,
      },
    },
  ],
};
exports.boomer = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Boomer",
  STAT_NAMES: statnames.trap,
  FACING_TYPE: "locksFacing",
  BODY: {
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 10, 1, 14, 0, 0, 0],
    },
    {
      POSITION: [6, 10, -1.5, 7, 0, 0, 0],
    },
    {
      POSITION: [2, 10, 1.3, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block, g.boomerang]),
        TYPE: exports.boomerang,
      },
    },
  ],
};
exports.megaboomer = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Mega Boomer",
  STAT_NAMES: statnames.trap,
  FACING_TYPE: "locksFacing",
  BODY: {
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [19, 13, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [6, 13, -1.25, 6, 0, 0, 0],
    },
    {
      POSITION: [2, 13, 1.3, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          g.boomerang,
          [1.75, 2, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1, 10, 1, 1],
        ]),
        TYPE: exports.boomerang,
      },
    },
  ],
};
exports.autoboomer = makeAuto(exports.boomer);
exports.quadtrapper = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Quadtrapper",
  STAT_NAMES: statnames.trap,
  BODY: {
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.15,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 6, 1, 0, 0, 45, 0],
    },
    {
      POSITION: [2, 6, 1.1, 14, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          [1, 1, 1, 1, 0.6, 0.6, 0.6, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.block,
      },
    },
    {
      POSITION: [14, 6, 1, 0, 0, 135, 0],
    },
    {
      POSITION: [2, 6, 1.1, 14, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          [1, 1, 1, 1, 0.6, 0.6, 0.6, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.block,
      },
    },
    {
      POSITION: [14, 6, 1, 0, 0, 225, 0],
    },
    {
      POSITION: [2, 6, 1.1, 14, 0, 225, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          [1, 1, 1, 1, 0.6, 0.6, 0.6, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.block,
      },
    },
    {
      POSITION: [14, 6, 1, 0, 0, 315, 0],
    },
    {
      POSITION: [2, 6, 1.1, 14, 0, 315, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          [1, 1, 1, 1, 0.6, 0.6, 0.6, 1, 1, 1, 1, 1, 1],
        ]),
        TYPE: exports.block,
      },
    },
  ],
};
exports.PlaneB = {
  PARENT: [exports.genericTank],
  LABEL: "Plane",
  COLOR: "#555555",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [30.769, 4.9, 2.7, -82, 0, 180, 0],
    },
    {
      POSITION: [3.077, 1.54, 2.7, -86.154, 0, 180, 0],
    },
    {
      POSITION: [48.462, 17.6, 1, -48.462, 0, 180, 0],
    },
    {
      POSITION: [48.462, 17.6, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [48.462, 17.6, 1, 48.462, 0, 180, 0],
    },
    {
      POSITION: [27.692, 17.6, 1, 96.923, 0, 180, 0],
    },
    {
      POSITION: [152.308, 38.4, 1, -60.923, 0, 262.5, 0],
    },
    {
      POSITION: [152.308, 38.4, 1, -60.923, 0, 97.5, 0],
    },
    {
      POSITION: [48.462, 12.8, 1, 0, -96.923, 262.5, 0],
    },
    {
      POSITION: [48.462, 12.8, 1, 0, 96.923, 97.5, 0],
    },
    {
      POSITION: [8.615, 25.9, 2.7, -14.846, 0, 270, 0],
    },
    {
      POSITION: [8.615, 25.9, 2.7, -14.846, 0, 90, 0],
    },
    {
      POSITION: [4.308, 11.9, 2.7, -10.692, -96.923, 270, 0],
    },
    {
      POSITION: [4.308, 11.9, 2.7, -10.692, 96.923, 90, 0],
    },
    {
      POSITION: [11.077, 3.2, 1, 0, -27.692, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, 0, 27.692, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -5.538, 27.692, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -5.538, -27.692, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -11.077, -27.692, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -11.077, 27.692, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [60, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -16.615, -55.385, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -16.615, 55.385, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -22.154, 55.385, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [11.077, 3.2, 1, -22.154, -55.385, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -22.154, 55.385, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -22.154, -55.385, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 1, 1, 12, 1, 90, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12.462, 0.8, 1, 0, 27.692, 0, 15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 2.4, 1, 83.25, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12.462, 0.8, 1, 0, -27.692, 0, 15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 2.4, 1, 83.25, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12.462, 0.8, 1, -16.615, -55.385, 0, 15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 2.4, 1, 83.25, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12.462, 0.8, 1, -16.615, 55.385, 0, 15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 2.4, 1, 83.25, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 5.6, 1, -16.615, 55.385, 0, 15],
    },
    {
      POSITION: [16.615, 5.6, 1, -16.615, -55.385, 0, 15],
    },
    {
      POSITION: [16.615, 5.6, 1, 0, -27.692, 0, 15],
    },
    {
      POSITION: [16.615, 5.6, 1, 0, 27.692, 0, 15],
    },
    {
      POSITION: [7.385, 1.05, 2.7, -19.692, -27.692, 180, 15],
    },
    {
      POSITION: [7.385, 1.05, 2.7, -19.692, 27.692, 180, 15],
    },
    {
      POSITION: [7.385, 1.05, 2.7, -1.6920000000000002, 55.385, 180, 15],
    },
    {
      POSITION: [7.385, 1.05, 2.7, -1.6920000000000002, -55.385, 180, 15],
    },
    {
      POSITION: [16.615, 0.8, 1, -5.538, -27.692, 0, 15],
    },
    {
      POSITION: [16.615, 0.8, 1, -5.538, 27.692, 0, 15],
    },
    {
      POSITION: [13.846, 5.6, 1, 8.308, 55.385, 180, 15],
    },
    {
      POSITION: [13.846, 5.6, 1, 8.308, -55.385, 180, 15],
    },
    {
      POSITION: [33.231, 5.6, 1, 0, -27.692, 180, 15],
    },
    {
      POSITION: [33.231, 5.6, 1, 0, 27.692, 180, 15],
    },
    {
      POSITION: [14.769, 1.75, 2.7, -47.385, 27.692, 0, 15],
    },
    {
      POSITION: [14.769, 1.75, 2.7, -47.385, -27.692, 0, 15],
    },
    {
      POSITION: [152.308, 38.4, 1, -60.923, 0, 262.5, 15],
    },
    {
      POSITION: [152.308, 38.4, 1, -60.923, 0, 97.5, 15],
    },
    {
      POSITION: [9.231, 28, 2.7, -15.538, 0, 90, 15],
    },
    {
      POSITION: [9.231, 28, 2.7, -15.538, 0, 270, 15],
    },
    {
      POSITION: [2.462, 2.8, 2.7, 68.923, 0, 253, 15],
    },
    {
      POSITION: [2.462, 2.8, 2.7, 68.923, 0, 107, 15],
    },
    {
      POSITION: [96.923, 6.4, 1, -27.692, -6.923, 180, 15],
    },
    {
      POSITION: [96.923, 6.4, 1, -27.692, 6.923, 180, 15],
    },
    {
      POSITION: [12.308, 1.75, 2.7, -40.462, 6.923, 180, 15],
    },
    {
      POSITION: [12.308, 1.75, 2.7, -40.462, -6.923, 180, 15],
    },
    {
      POSITION: [55.385, 6.4, 1, -27.692, 0, 180, 15],
    },
    {
      POSITION: [12.462, 5.6, 1, -49.846, 0, 180, 15],
    },
    {
      POSITION: [15.385, 2.45, 2.7, -43.231, 0, 180, 15],
    },
    {
      POSITION: [5.538, 0.8, 1, -7.615, -124.615, 270, 15],
    },
    {
      POSITION: [5.538, 0.8, 1, -7.615, 124.615, 90, 15],
    },
    {
      POSITION: [5.538, 0.8, 1, 110.769, 0, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 1, 0.001, 1, 1, 1.2, 1, 36, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.artillery = {
  PARENT: [exports.genericTank],
  DANGER: 6,
  LABEL: "Artillery",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [17, 3, 1, 0, -6, -7, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
        TYPE: exports.bullet,
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [17, 3, 1, 0, 6, 7, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
        TYPE: exports.bullet,
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [19, 12, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]),
        TYPE: exports.bullet,
        LABEL: "Heavy",
      },
    },
  ],
};
exports.mortar = {
  PARENT: [exports.genericTank],
  LABEL: "Mortar",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [13, 3, 1, 0, -8, -7, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
        TYPE: exports.bullet,
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [13, 3, 1, 0, 8, 7, 0.8],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
        TYPE: exports.bullet,
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [17, 3, 1, 0, -6, -7, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
        TYPE: exports.bullet,
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [17, 3, 1, 0, 6, 7, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
        TYPE: exports.bullet,
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [19, 12, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]),
        TYPE: exports.bullet,
        LABEL: "Heavy",
      },
    },
  ],
};
exports.launcher = {
  PARENT: [exports.genericTank],
  BODY: {
    FOV: base.FOV * 1.15,
  },
  LABEL: "Launcher",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [10, 9.5, -0.5, 9, 0, 0, 0],
    },
    {
      POSITION: [17, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          [1, 1, 1, 0.8, 1, 1, 1, 0.4, 0.4, 1, 10, 1, 1],
        ]),
        TYPE: exports.launcherMissile,
        STAT_CALCULATOR: gunCalcNames.sustained,
      },
    },
  ],
};
exports.autoLauncher = makeAuto(exports.launcher);
exports.skimmer = {
  PARENT: [exports.genericTank],
  BODY: {
    FOV: base.FOV * 1.15,
  },
  LABEL: "Skimmer",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [10, 14, -0.5, 9, 0, 0, 0],
    },
    {
      POSITION: [17, 15, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.destroy,
          [1, 1, 1, 0.8, 0.8, 0.8, 0.8, 0.4, 0.4, 1, 10, 1, 1],
        ]),
        TYPE: exports.missile,
        STAT_CALCULATOR: gunCalcNames.sustained,
      },
    },
  ],
};
exports.spinner = {
  PARENT: [exports.genericTank],
  BODY: {
    FOV: base.FOV * 1.1,
  },
  LABEL: "Twister",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [10, 13, -0.5, 9, 0, 0, 0],
    },
    {
      POSITION: [17, 14, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.destroy,
          [1, 1, 1, 0.8, 0.8, 0.8, 0.8, 0.4, 0.4, 1, 10, 1, 1],
        ]),
        TYPE: exports.spinmissile,
        STAT_CALCULATOR: gunCalcNames.sustained,
      },
    },
  ],
};
exports.spread = {
  PARENT: [exports.genericTank],
  LABEL: "Spreadshot",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [13, 4, 1, 0, -0.8, -75, 5 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [14.5, 4, 1, 0, -1.0, -60, 4 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [16, 4, 1, 0, -1.6, -45, 3 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [17.5, 4, 1, 0, -2.4, -30, 2 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [19, 4, 1, 0, -3.0, -15, 1 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [13, 4, 1, 0, 0.8, 75, 5 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [14.5, 4, 1, 0, 1.0, 60, 4 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [16, 4, 1, 0, 1.6, 45, 3 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [17.5, 4, 1, 0, 2.4, 30, 2 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [19, 4, 1, 0, 3.0, 15, 1 / 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          g.twin,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Spread",
      },
    },
    {
      POSITION: [13, 10, 1.3, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.spreadmain,
          g.spread,
        ]),
        TYPE: exports.bullet,
        LABEL: "Pounder",
      },
    },
  ],
};

exports.flank = {
  PARENT: [exports.genericTank],
  LABEL: "Flank Guard",
  BODY: {
    SPEED: base.SPEED * 1.1,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 240, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.hexa = {
  PARENT: [exports.genericTank],
  LABEL: "Hexa Tank",
  DANGER: 6,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 240, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 60, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 300, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.octo = {
  PARENT: [exports.genericTank],
  LABEL: "Octo Tank",
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 45, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 135, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 225, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 315, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.trapper = {
  PARENT: [exports.genericTank],
  LABEL: "Trapper",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [15, 7, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [3, 7, 1.7, 15, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.megatrapper = {
  PARENT: [exports.genericTank],
  LABEL: "Mega Trapper",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [15, 10, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [3, 10, 1.7, 15, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          [1.75, 2, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1, 10, 1, 1],
        ]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.gigatrapper = {
  PARENT: [exports.genericTank],
  LABEL: "Giga Trapper",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [15, 13, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [3, 13, 1.7, 15, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          [2.5, 3, 1, 1, 3, 0.6, 3, 1, 1, 1, 10, 1, 10],
        ]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.automegatrapper = makeAuto(exports.megatrapper);
exports.autoTrapper = makeAuto(exports.trapper);
exports.tritrapper = {
  PARENT: [exports.genericTank],
  LABEL: "Tri-Trapper",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [15, 7, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [3, 7, 1.7, 15, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [15, 7, 1, 0, 0, 120, 0],
    },
    {
      POSITION: [3, 7, 1.7, 15, 0, 120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [15, 7, 1, 0, 0, 240, 0],
    },
    {
      POSITION: [3, 7, 1.7, 15, 0, 240, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.autotritrap = makeAuto(exports.tritrapper);
exports.woof = {
  PARENT: [exports.genericTank],
  LABEL: "Woof",
  COLOR: "#555555",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [16.615, 6.4, 1, 0, -27.692, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, -5.538, -22.154, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, -16.615, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 5.538, -16.615, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, -5.538, -11.077, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, -5.538, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 5.538, -5.538, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, -5.538, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 5.538, 5.538, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, 5.538, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, -5.538, 11.077, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, -5.538, 16.615, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, 22.154, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 5.538, 22.154, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, 16.615, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, 11.077, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 5.538, 33.231, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, 33.231, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, -5.538, 38.769, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, -5.538, 44.308, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, 49.846, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 5.538, 49.846, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, 44.308, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, 38.769, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, 60.923, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, 66.462, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 11.077, 72, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 5.538, 60.923, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, 60.923, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, -5.538, 60.923, 270, 0],
    },
    {
      POSITION: [5.538, 6.4, 1, 0, 66.462, 270, 0],
    },
    {
      POSITION: [0, 0, 1, 24.923, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, 2.769, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 5.538, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 5.538, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, 8.308, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 11.077, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 11.077, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 11.077, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 16.615, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 19.385, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 22.154, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 22.154, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, 19.385, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, 16.615, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 13.846, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 13.846, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 24.923, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 24.923, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, 27.692, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, 30.462, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 33.231, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 33.231, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 30.462, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 27.692, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 36, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, 36, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 36, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, 36, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 38.769, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, 41.538, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 24.923, 38.769, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 0.8, 1, 0.009, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 0, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 2.769, -22.154, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 5.538, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 5.538, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 8.308, -22.154, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 11.077, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 11.077, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 11.077, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 16.615, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 19.385, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 22.154, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 19.385, -22.154, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 16.615, -22.154, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 13.846, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 13.846, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 27.692, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, -22.154, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 33.231, -22.154, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 36, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 36, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 33.231, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 30.462, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 41.538, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 44.308, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 47.077, -30.462, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 41.538, -27.692, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 41.538, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 41.538, -22.154, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 44.308, -24.923, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -30.462, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -30.462, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -30.462, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -24.923, 2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -19.385, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -19.385, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -13.846, 2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -8.308, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -8.308, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, -8.308, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 8.308, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 13.846, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 2.769, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 2.769, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 8.308, 2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 13.846, 2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 19.385, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 19.385, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 30.462, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 30.462, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 36, 2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 41.538, 2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 47.077, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 47.077, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 41.538, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 36, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 58.154, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 63.692, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 69.231, -13.846, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 58.154, -8.308, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 58.154, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 63.692, -2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [4.154, 4.8, 1, 58.154, 2.769, 0, 0.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [80, 0, 0.001, 1, 1, 4, 1, 18, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.heptatrap = (() => {
  let a = 360 / 7,
    d = 1 / 7;
  return {
    PARENT: [exports.genericTank],
    LABEL: "Hepta-Trapper",
    DANGER: 7,
    BODY: {
      SPEED: base.SPEED * 0.8,
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: [
      {
        /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
        POSITION: [15, 7, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, a, 4 * d],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, a, 4 * d],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 2 * a, 1 * d],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 2 * a, 1 * d],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 3 * a, 5 * d],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 3 * a, 5 * d],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 4 * a, 2 * d],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 4 * a, 2 * d],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 5 * a, 6 * d],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 5 * a, 6 * d],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 6 * a, 3 * d],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 6 * a, 3 * d],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
  };
})();
exports.hexatrap = makeAuto(
  {
    PARENT: [exports.genericTank],
    LABEL: "Hexa-Trapper",
    DANGER: 7,
    BODY: {
      SPEED: base.SPEED * 0.8,
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: [
      {
        /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
        POSITION: [15, 7, 1, 0, 0, 0, 0],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 60, 0.5],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 60, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 120, 0],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 120, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 180, 0.5],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 180, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 240, 0],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 240, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
      {
        POSITION: [15, 7, 1, 0, 0, 300, 0.5],
      },
      {
        POSITION: [3, 7, 1.7, 15, 0, 300, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
          TYPE: exports.trap,
          STAT_CALCULATOR: gunCalcNames.trap,
        },
      },
    ],
  },
  "Hexa-Trapper"
);

exports.tri = {
  PARENT: [exports.genericTank],
  LABEL: "Tri-Angle",
  BODY: {
    HEALTH: base.HEALTH * 0.8,
    SHIELD: base.SHIELD * 0.8,
    DENSITY: base.DENSITY * 0.6,
  },
  DANGER: 6,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.trifront,
          g.tonsmorrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: "Front",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 210, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};
exports.booster = {
  PARENT: [exports.genericTank],
  LABEL: "Booster",
  BODY: {
    HEALTH: base.HEALTH * 0.6,
    SHIELD: base.SHIELD * 0.6,
    DENSITY: base.DENSITY * 0.2,
  },
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.trifront,
          g.muchmorerecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: "Front",
      },
    },
    {
      POSITION: [13, 8, 1, 0, -1, 135, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [13, 8, 1, 0, 1, 225, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 145, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 215, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};
exports.fighter = {
  PARENT: [exports.genericTank],
  LABEL: "Fighter",
  BODY: {
    DENSITY: base.DENSITY * 0.6,
  },
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
        TYPE: exports.bullet,
        LABEL: "Front",
      },
    },
    {
      POSITION: [16, 8, 1, 0, -1, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
        TYPE: exports.bullet,
        LABEL: "Side",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 1, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
        TYPE: exports.bullet,
        LABEL: "Side",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 210, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};
exports.brutalizer = {
  PARENT: [exports.genericTank],
  LABEL: "Surfer",
  BODY: {
    DENSITY: base.DENSITY * 0.6,
  },
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
        TYPE: exports.bullet,
        LABEL: "Front",
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, -1, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: [exports.autoswarm],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, 1, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm]),
        TYPE: [exports.autoswarm],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 210, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};
exports.bomber = {
  PARENT: [exports.genericTank],
  LABEL: "Bomber",
  BODY: {
    DENSITY: base.DENSITY * 0.6,
  },
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.trifront]),
        TYPE: exports.bullet,
        LABEL: "Front",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 130, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri]),
        TYPE: exports.bullet,
        LABEL: "Wing",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 230, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri]),
        TYPE: exports.bullet,
        LABEL: "Wing",
      },
    },
    {
      POSITION: [14, 8, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [4, 8, 1.5, 14, 0, 180, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.morerecoil]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.autotri = makeAuto(exports.tri);
exports.autotri.BODY = {
  SPEED: base.SPEED,
};
exports.falcon = {
  PARENT: [exports.genericTank],
  LABEL: "Falcon",
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 0.8,
    FOV: base.FOV * 1.2,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [27, 8.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.assass,
          g.lessreload,
        ]),
        TYPE: exports.bullet,
        LABEL: "Assassin",
        ALT_FIRE: true,
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 8, 0, 0, 0],
    },
    {
      POSITION: [16, 8, 1, 0, 0, 150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 210, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flank,
          g.tri,
          g.thruster,
          g.halfrecoil,
        ]),
        TYPE: exports.bullet,
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};

exports.auto3 = {
  PARENT: [exports.genericTank],
  LABEL: "Auto-3",
  DANGER: 6,
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [11, 8, 0, 0, 190, 0],
      TYPE: exports.auto3gun,
    },
    {
      POSITION: [11, 8, 0, 120, 190, 0],
      TYPE: exports.auto3gun,
    },
    {
      POSITION: [11, 8, 0, 240, 190, 0],
      TYPE: exports.auto3gun,
    },
  ],
};
exports.auto5 = {
  PARENT: [exports.genericTank],
  LABEL: "Auto-5",
  DANGER: 7,
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [11, 8, 0, 0, 190, 0],
      TYPE: exports.auto5gun,
    },
    {
      POSITION: [11, 8, 0, 72, 190, 0],
      TYPE: exports.auto5gun,
    },
    {
      POSITION: [11, 8, 0, 144, 190, 0],
      TYPE: exports.auto5gun,
    },
    {
      POSITION: [11, 8, 0, 216, 190, 0],
      TYPE: exports.auto5gun,
    },
    {
      POSITION: [11, 8, 0, 288, 190, 0],
      TYPE: exports.auto5gun,
    },
  ],
};
exports.heavy3 = {
  BODY: {
    SPEED: base.SPEED * 0.95,
  },
  PARENT: [exports.genericTank],
  LABEL: "Mega-3",
  DANGER: 7,
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [14, 8, 0, 0, 190, 0],
      TYPE: exports.heavy3gun,
    },
    {
      POSITION: [14, 8, 0, 120, 190, 0],
      TYPE: exports.heavy3gun,
    },
    {
      POSITION: [14, 8, 0, 240, 190, 0],
      TYPE: exports.heavy3gun,
    },
  ],
};
exports.architect = {
  LABEL: "Architect",
  BODY: {
    SPEED: base.SPEED * 1.1,
  },
  PARENT: [exports.genericTank],
  DANGER: 6,
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [12, 8, 0, 0, 190, 0],
      TYPE: exports.tritrapgun,
    },
    {
      POSITION: [12, 8, 0, 120, 190, 0],
      TYPE: exports.tritrapgun,
    },
    {
      POSITION: [12, 8, 0, 240, 190, 0],
      TYPE: exports.tritrapgun,
    },
  ],
};
exports.sniper3 = {
  PARENT: [exports.genericTank],
  DANGER: 7,
  LABEL: "Sniper-3",
  BODY: {
    ACCELERATION: base.ACCEL * 0.6,
    SPEED: base.SPEED * 0.8,
    FOV: base.FOV * 1.25,
  },
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [13, 8, 0, 0, 170, 0],
      TYPE: exports.sniper3gun,
    },
    {
      POSITION: [13, 8, 0, 120, 170, 0],
      TYPE: exports.sniper3gun,
    },
    {
      POSITION: [13, 8, 0, 240, 170, 0],
      TYPE: exports.sniper3gun,
    },
  ],
};
exports.auto4 = {
  PARENT: [exports.genericTank],
  DANGER: 5,
  LABEL: "Auto-4",
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [13, 6, 0, 45, 160, 0],
      TYPE: exports.auto4gun,
    },
    {
      POSITION: [13, 6, 0, 135, 160, 0],
      TYPE: exports.auto4gun,
    },
    {
      POSITION: [13, 6, 0, 225, 160, 0],
      TYPE: exports.auto4gun,
    },
    {
      POSITION: [13, 6, 0, 315, 160, 0],
      TYPE: exports.auto4gun,
    },
  ],
};

exports.flanktrap = {
  PARENT: [exports.genericTank],
  LABEL: "Trap Guard",
  STAT_NAMES: statnames.generic,
  DANGER: 6,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [20, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13, 8, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [4, 8, 1.7, 13, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.guntrap = {
  PARENT: [exports.genericTank],
  LABEL: "Gunner Trapper",
  DANGER: 7,
  STAT_NAMES: statnames.generic,
  BODY: {
    FOV: base.FOV * 1.25,
  },
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [19, 2, 1, 0, -2.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.twin,
          g.tonsmorrecoil,
          g.lotsmorrecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.power,
          g.twin,
          g.tonsmorrecoil,
          g.lotsmorrecoil,
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [13, 11, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [4, 11, 1.7, 13, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.fast, g.halfrecoil]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.bushwhack = {
  PARENT: [exports.genericTank],
  LABEL: "Bushwhacker",
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    FOV: base.FOV * 1.2,
  },
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [24, 8.5, 1, 0, 0, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [21, 8.5, 1, 0, 0, 0, 0.666],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8.5, 1, 0, 0, 0, 0.999],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.mini]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13, 8.5, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [4, 8.5, 1.7, 13, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.snipeGuard = {
  PARENT: [exports.genericTank],
  LABEL: "Snipe Guard",
  BODY: {
    ACCELERATION: base.ACCEL * 0.7,
    FOV: base.FOV * 1.2,
  },
  DANGER: 7,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [24, 8.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13, 8.5, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [4, 8.5, 1.7, 13, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

// NPCS:
exports.crasher = {
  TYPE: "crasher",
  LABEL: "Crasher",
  COLOR: 5,
  SHAPE: 3,
  SIZE: 5,
  VARIES_IN_SIZE: true,
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  AI: {
    NO_LEAD: true,
  },
  BODY: {
    SPEED: 5,
    ACCEL: 0.01,
    HEALTH: 0.5,
    DAMAGE: 5,
    PENETRATION: 2,
    PUSHABILITY: 0.5,
    DENSITY: 10,
    RESIST: 2,
  },
  MOTION_TYPE: "motor",
  FACING_TYPE: "smoothWithMotion",
  HITS_OWN_TYPE: "hard",
  HAS_NO_MASTER: true,
  DRAW_HEALTH: true,
};
exports.sentry = {
  PARENT: [exports.genericTank],
  TYPE: "crasher",
  LABEL: "Sentry",
  DANGER: 3,
  COLOR: 5,
  SHAPE: 3,
  SIZE: 10,
  SKILL: skillSet({
    rld: 0.5,
    dam: 0.8,
    pen: 0.8,
    str: 0.1,
    spd: 1,
    atk: 0.5,
    hlt: 0,
    shi: 0,
    rgn: 0.7,
    mob: 0,
  }),
  VALUE: 1500,
  VARIES_IN_SIZE: true,
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  AI: {
    NO_LEAD: true,
  },
  BODY: {
    FOV: 0.5,
    ACCEL: 0.006,
    DAMAGE: base.DAMAGE * 2,
    SPEED: base.SPEED * 0.5,
  },
  MOTION_TYPE: "motor",
  FACING_TYPE: "smoothToTarget",
  HITS_OWN_TYPE: "hard",
  HAS_NO_MASTER: true,
  DRAW_HEALTH: true,
  GIVE_KILL_MESSAGE: true,
};
exports.trapTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  INDEPENDENT: false,
  CONTROLLERS: ["nearestDifferentMaster"],
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [16, 14, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 14, 1.8, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.lowpower,
          g.fast,
          g.halfreload,
        ]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.sentrySwarm = {
  PARENT: [exports.sentry],
  DANGER: 3,
  GUNS: [
    {
      POSITION: [7, 14, 0.6, 7, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.morerecoil]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.sentryGun = makeAuto(exports.sentry, "Sentry", {
  type: exports.heavy3gun,
  size: 12,
});
exports.sentryTrap = makeAuto(exports.sentry, "Sentry", {
  type: exports.trapTurret,
  size: 12,
});

exports.miniboss = {
  PARENT: [exports.genericTank],
  TYPE: "miniboss",
  DANGER: 6,
  SKILL: skillSet({
    rld: 0.7,
    dam: 0.5,
    pen: 0.8,
    str: 0.8,
    spd: 0.2,
    atk: 0.3,
    hlt: 1,
    shi: 0.7,
    rgn: 0.7,
    mob: 0,
  }),
  LEVEL: 45,
  CONTROLLERS: ["nearestDifferentMaster", "minion", "canRepel"],
  AI: {
    NO_LEAD: true,
  },
  FACING_TYPE: "autospin",
  HITS_OWN_TYPE: "hard",
  BROADCAST_MESSAGE: "A visitor has left!",
};
function bossStats(options = {}) {
  if (!options.health) options.health = 1;
  if (!options.damage) options.damage = 1;
  if (!options.speed) options.speed = 1;
  if (!options.fov) options.fov = 1;
  return {
    HEALTH: base.HEALTH * 15 * options.health,
    DAMAGE: base.DAMAGE * 1.5 * options.damage,
    SPEED: base.SPEED * 0.1 * options.speed,
    DENSITY: 500,
    FOV: base.FOV * 1.125 * options.fov,
    SHIELD: base.SHIELD * 0.75,
  };
}
exports.crasherSpawner = {
  PARENT: [exports.genericTank],
  LABEL: "Spawned",
  STAT_NAMES: statnames.drone,
  CONTROLLERS: ["nearestDifferentMaster"],
  COLOR: 5,
  INDEPENDENT: true,
  AI: {
    chase: true,
  },
  MAX_CHILDREN: 4,
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak]),
        TYPE: [
          exports.drone,
          {
            LABEL: "Crasher",
            VARIES_IN_SIZE: true,
            DRAW_HEALTH: true,
          },
        ],
        SYNCS_SKILLS: true,
        AUTOFIRE: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
exports.elite = {
  PARENT: [exports.miniboss],
  LABEL: "Elite Crasher",
  COLOR: 5,
  SHAPE: 3,
  SIZE: 30,
  VARIES_IN_SIZE: true,
  VALUE: 150000,
  BODY: bossStats(),
  SPEED: 1.564,
};
exports.elite_destroyer = {
  PARENT: [exports.elite],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [5, 16, 1, 6, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.pound,
          g.destroy,
          g.power,
        ]),
        TYPE: exports.bullet,
        LABEL: "Devastator",
      },
    },
    {
      POSITION: [5, 16, 1, 6, 0, 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.pound,
          g.destroy,
          g.power,
        ]),
        TYPE: exports.bullet,
        LABEL: "Devastator",
      },
    },
    {
      POSITION: [5, 16, 1, 6, 0, -60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.pound,
          g.destroy,
          g.power,
        ]),
        TYPE: exports.bullet,
        LABEL: "Devastator",
      },
    },
  ],
  TURRETS: [
    {
      /********* SIZE X Y ANGLE ARC */
      POSITION: [11, 0, 0, 180, 360, 0],
      TYPE: [exports.crasherSpawner],
      INDEPENDENT: false,
      CONTROLLERS: ["doNothing"],
    },
    {
      POSITION: [11, 0, 0, 60, 360, 0],
      TYPE: [exports.crasherSpawner],
      INDEPENDENT: false,
      CONTROLLERS: ["doNothing"],
    },
    {
      POSITION: [11, 0, 0, -60, 360, 0],
      TYPE: [exports.crasherSpawner],
      INDEPENDENT: false,
      CONTROLLERS: ["doNothing"],
    },
    {
      POSITION: [11, 0, 0, 0, 360, 1],
      TYPE: [
        exports.bigauto4gun,
        {
          INDEPENDENT: false,
          controllers: ["doNothing"],
          COLOR: 5,
        },
      ],
    },
  ],
};
exports.elite_gunner = {
  PARENT: [exports.elite],
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [14, 16, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [4, 16, 1.5, 14, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.power, g.power]),
        TYPE: [
          exports.pillbox,
          {
            INDEPENDENT: true,
          },
        ],
      },
    },
    {
      POSITION: [6, 14, -2, 2, 0, 60, 0],
    },
    {
      POSITION: [6, 14, -2, 2, 0, 300, 0],
    },
  ],
  AI: {
    NO_LEAD: false,
  },
  TURRETS: [
    {
      /********* SIZE X Y ANGLE ARC */
      POSITION: [14, 8, 0, 60, 180, 0],
      TYPE: [exports.auto4gun],
    },
    {
      POSITION: [14, 8, 0, 300, 180, 0],
      TYPE: [exports.auto4gun],
    },
  ],
};
exports.elite_sprayer = {
  PARENT: [exports.elite],
  AI: {
    NO_LEAD: false,
  },
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [14, 6, 0, 180, 190, 0],
      TYPE: [
        exports.sprayTurret,
        {
          COLOR: 5,
        },
      ],
    },
    {
      POSITION: [14, 6, 0, 60, 190, 0],
      TYPE: [
        exports.sprayTurret,
        {
          COLOR: 5,
        },
      ],
    },
    {
      POSITION: [14, 6, 0, -60, 190, 0],
      TYPE: [
        exports.sprayTurret,
        {
          COLOR: 5,
        },
      ],
    },
  ],
};
exports.elite_battleship = {
  PARENT: [exports.elite],
  VALUE: 300000,
  GUNS: [],
  TURRETS: [
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [5, 8, 0, 0, 360, 1],
      TYPE: exports.auto3gun,
    },
    {
      POSITION: [5, 8, 0, 120, 360, 1],
      TYPE: exports.auto3gun,
    },
    {
      POSITION: [5, 8, 0, 240, 360, 1],
      TYPE: exports.auto3gun,
    },
  ],
};
for (let i = 0; i < 3; i++)
  exports.elite_battleship.GUNS.push(
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [4, 7, 0.6, 7, 0, (360 / 3) * i + 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          [3, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
        ]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [4, 7, 0.6, 7, -8, (360 / 3) * i + 60, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          [1.5, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
        ]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [4, 7, 0.6, 7, 8, (360 / 3) * i + 60, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          [1.5, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
        ]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    }
  );

exports.palisade = (() => {
  let props = {
    SHOOT_SETTINGS: combineStats([
      g.factory,
      g.pound,
      g.halfreload,
      g.halfreload,
    ]),
    TYPE: exports.minion,
    STAT_CALCULATOR: gunCalcNames.drone,
    AUTOFIRE: true,
    MAX_CHILDREN: 1,
    SYNCS_SKILLS: true,
    WAIT_TO_CYCLE: true,
  };
  return {
    PARENT: [exports.miniboss],
    LABEL: "Rogue Palisade",
    COLOR: 17,
    SHAPE: 6,
    SIZE: 30,
    VALUE: 500000,
    BODY: bossStats({
      health: 2,
      speed: 0.5,
    }),
    GUNS: [
      {
        /**** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
        POSITION: [4, 6, -1.6, 8, 0, 0, 0],
        PROPERTIES: props,
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 60, 0],
        PROPERTIES: props,
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 120, 0],
        PROPERTIES: props,
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 180, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, g.pound]),
          TYPE: exports.minion,
          STAT_CALCULATOR: gunCalcNames.drone,
          AUTOFIRE: true,
          MAX_CHILDREN: 1,
          SYNCS_SKILLS: true,
          WAIT_TO_CYCLE: true,
        },
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 240, 0],
        PROPERTIES: props,
      },
      {
        POSITION: [4, 6, -1.6, 8, 0, 300, 0],
        PROPERTIES: props,
      },
    ],
    TURRETS: [
      {
        /* SIZE X Y ANGLE ARC */
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: exports.trapTurret,
      },
      {
        POSITION: [5, 10, 0, 90, 110, 0],
        TYPE: exports.trapTurret,
      },
      {
        POSITION: [5, 10, 0, 150, 110, 0],
        TYPE: exports.trapTurret,
      },
      {
        POSITION: [5, 10, 0, 210, 110, 0],
        TYPE: exports.trapTurret,
      },
      {
        POSITION: [5, 10, 0, 270, 110, 0],
        TYPE: exports.trapTurret,
      },
      {
        POSITION: [5, 10, 0, 330, 110, 0],
        TYPE: exports.trapTurret,
      },
    ],
  };
})();
exports.skimboss = {
  PARENT: [exports.miniboss],
  LABEL: "Elite Skimmer",
  SIZE: 30,
  VALUE: 500000,
  BODY: bossStats(),
  SHAPE: 3,
  COLOR: 2,
  FACING_TYPE: "autospin",
  TURRETS: [
    {
      /* SIZE X Y ANGLE ARC */
      POSITION: [15, 5, 0, 60, 170, 0],
      TYPE: exports.skimturret,
    },
    {
      POSITION: [15, 5, 0, 180, 170, 0],
      TYPE: exports.skimturret,
    },
    {
      POSITION: [15, 5, 0, 300, 170, 0],
      TYPE: exports.skimturret,
    },
  ],
};
exports.hexagon = {
  PARENT: [exports.genericTank],
  LABEL: "Hexagonic Defender Hexagon",
  GIVE_KILL_MESSAGE: true,
  NAME: "Hexagonic Defender Hexagon",
  SHAPE: 6,
  COLOR: 2,
  VALUE: 8000,
  BODY: {
    HEALTH: 15,
    DAMAGE: 2,
    DENSITY: 3,
  },
  DRAW_HEALTH: true,
};
exports.gianthexagon = {
  PARENT: [exports.genericTank],
  LABEL: "Hexagonic Defender Giant Hexagon",
  GIVE_KILL_MESSAGE: true,
  NAME: "Hexagonic Defender Giant Hexagon",
  SHAPE: 6,
  COLOR: 2,
  VALUE: 64000,
  BODY: {
    HEALTH: 25,
    DAMAGE: 4,
    DENSITY: 3,
  },
  DRAW_HEALTH: true,
};
exports.hexagontrap = {
  PARENT: [exports.trap],
  LABEL: "Hexagon Trap",
  SHAPE: 6,
  BODY: {
    HEALTH: 10,
    DAMAGE: 2,
    DENSITY: 2,
  },
  DRAW_HEALTH: true,
};
exports.hexagonictrapper = {
  PARENT: [exports.genericTank],
  LABEL: "Hexagon Defender",
  SHAPE: 6,
  SIZE: 40,
  FACING_TYPE: "autospin",
  SKILL: setBuild("9999999999"),
  BODY: {
    HEALTH: 2500,
    DAMAGE: 5,
    SPEED: 1.35,
  },
  GUNS: (() => {
    var gs = [];
    for (let i = 0; i < 6; i++) {
      gs.push({
        POSITION: [13, 6, 1.2, 0, 0, (360 * i) / 6, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trapB, g.halfreload, g.halfreload]),
          TYPE: exports.hexagontrap,
          AUTOFIRE: true,
        },
      });
      gs.push({
        POSITION: [5, 10, 1, 0, 0, (360 * i) / 6, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            g.basic,
            g.halfreload,
            g.halfreload,
            g.halfreload,
            g.halfreload,
            g.halfreload,
            g.smaller,
            g.smaller,
          ]),
          TYPE: exports.hexagon,
          AUTOFIRE: true,
        },
      });
    }
    gs.push({
      POSITION: [5, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.halfreload,
          g.halfreload,
          g.halfreload,
          g.halfreload,
          g.halfreload,
          g.halfreload,
          g.halfreload,
          g.bigger,
          g.bigger,
        ]),
        TYPE: exports.gianthexagon,
        AUTOFIRE: true,
      },
    });
    return gs;
  })(),
};
exports.summoner = {
  PARENT: [exports.miniboss],
  LABEL: "Summoner",
  DANGER: 15,
  SHAPE: 4,
  COLOR: 13,
  SIZE: 30,
  MAX_CHILDREN: 32,
  FACING_TYPE: "autospin",
  VALUE: 300000,
  BODY: bossStats(),
  HEALT: base.HEALT * 60,
  FOV: base.FOV * 3,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [3.5, 8.65, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [3.5, 8.65, 1.2, 8, 0, 270, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [3.5, 8.65, 1.2, 8, 0, 180, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
        TYPE: exports.sunchip,
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    },
  ],
};
exports.nestKeeper = {
  PARENT: [exports.miniboss],
  LABEL: "Nest Keeper",
  SHAPE: 5,
  SIZE: 25,
  COLOR: 14,
  VARIES_IN_SIZE: true,
  VALUE: 500000,
  BODY: bossStats({
    health: 1.5,
    speed: 0.75,
  }),
  GUNS: [],
  TURRETS: [
    {
      POSITION: [7, 0, 0, 360, 360, 1],
      TYPE: [
        exports.boomer,
        {
          COLOR: 14,
        },
      ],
    },
  ],
};
exports.nestKeeperAutoTurret = JSON.parse(JSON.stringify(exports.auto4gun));
for (let gun of exports.nestKeeperAutoTurret.GUNS)
  gun.PROPERTIES.SHOOT_SETTINGS = combineStats([
    g.basic,
    g.twin,
    [2, 1, 1, 1, 0.6, 0.6, 0.6, 1, 1, 1, 1, 1, 1],
  ]);
for (let i = 0; i < 5; i++) {
  exports.nestKeeper.GUNS.push({
    /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
    POSITION: [4.5, 8, 1.25, 8, 0, (360 * i) / 5 + 36, Math.random()],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
      TYPE: [exports.drone, { BODY: { FOV: 5 } }],
      MAX_CHILDREN: 2,
      STAT_CALCULATOR: gunCalcNames.drone,
    },
  });
  exports.nestKeeper.TURRETS.push({
    POSITION: [9, 9, 0, (360 * i) / 5, 180, 0],
    TYPE: [
      exports.nestKeeperAutoTurret,
      {
        COLOR: 14,
      },
    ],
  });
}
exports.celestialTrapTurret = {
  PARENT: [exports.genericTank],
  LABEL: "Turret",
  INDEPENDENT: false,
  COLOR: 16,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [16, 14, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 14, 1.8, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          [4, 1, 1, 1, 2, 1, 1, 1, 1, 1, 10, 1, 1],
        ]),
        TYPE: exports.trap,
        STAT_CALCULATOR: gunCalcNames.trap,
        AUTOFIRE: false,
      },
    },
  ],
};
let celestialTrapTurretArray = [];
for (let i = 0; i < 9; i++) {
  celestialTrapTurretArray.push({
    POSITION: [6, 9, 0, i * (360 / 9) + 360 / 9 / 2, 0, 0],
    TYPE: [
      exports.celestialTrapTurret,
      {
        CONTROLLERS: ["doNothing"],
      },
    ],
  });
}
// you can name the turret in the exports.
exports.testCelestialTurret1 = {
  PARENT: [exports.autoTurret],
  LABEL: "", // you can add label if needing
  GUNS: (() => {
    var gs = []; // you can name gs what you want
    exports.twin.GUNS.forEach((e) => {
      gs.push({
        POSITION: [
          e.POSITION[0],
          e.POSITION[1],
          e.POSITION[2],
          e.POSITION[3],
          e.POSITION[4],
          e.POSITION[5],
          e.POSITION[6],
        ],
        PROPERTIES: e.PROPERTIES,
      });
    });
    return gs;
  })(),
}; // check the turret
exports.testCelestialbody1 = {
  PARENT: [exports.genericTank],
  LABEL: "",
  CONTROLLERS: ["spin"],
  SHAPE: 5,
  COLOR: 0,
  TURRETS: (() => {
    var tr = [];
    for (let i = 0.5; i < 5; i++) {
      tr.push({
        POSITION: [8, 8, 0, (360 * i) / 5, 180, 0],
        TYPE: exports.testCelestialTurret1,
      });
    }
    return tr;
  })(),
};
exports.testCelestialbody2 = {
  PARENT: [exports.genericTank],
  LABEL: "",
  CONTROLLERS: ["reversespin"],
  SHAPE: 7,
  COLOR: 0,
  MAX_CHILDREN: 21,
  GUNS: (() => {
    var gs = [];
    for (let i = 0.5; i < 7; i++) {
      gs.push({
        POSITION: [11, 6, 1.2, 0, 0, (360 * i) / 7, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.drone, g.over]),
          TYPE: [exports.drone, { INDEPENDENT: true }],
        },
      });
    }
    return gs;
  })(),
};
// is there a celestial parent?
exports.testCelestial = {
  PARENT: [exports.miniboss],
  NAME: "",
  LABEL: "Celestial",
  SHAPE: 9,
  VALUE: 1000000,
  COLOR: 0,
  BODY: {
    HEALTH: base.HEALTH * 15 * 3,
    DAMAGE: base.DAMAGE * 4,
  },
  SIZE: 40,
  TURRETS: [
    ...celestialTrapTurretArray,
    {
      POSITION: [15, 0, 0, 0, 360, 1],
      TYPE: exports.testCelestialbody2,
    },
    {
      POSITION: [9.5, 0, 0, 0, 360, 1],
      TYPE: exports.testCelestialbody1,
    },
  ],
};
exports.paladinSunchipBody = {
  PARENT: [exports.genericTank],
  LABEL: "Paladin Sunchip",
  SHAPE: 7,
  SIZE: 10,
  BODY: {
    FOV: 100,
  },
  CONTROLLERS: ["doNothing"],
  MAX_CHILDREN: 28,
  GUNS: [],
};
for (let i = 0; i < 7; i++)
  exports.paladinSunchipBody.GUNS.push({
    /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
    POSITION: [4, 6.5, 1.2, 7.5, 0, (360 / 7) * i + 360 / 14, 0],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([g.drone, g.summoner]),
      TYPE: [
        exports.sunchip,
        {
          INDEPENDENT: false,
          ALT_FIRE: false,
          BODY: {
            FOV: 5,
          },
        },
      ],
      AUTOFIRE: false,
      SYNCS_SKILLS: false,
      STAT_CALCULATOR: gunCalcNames.necro,
    },
  });
exports.celestialHive = {
  PARENT: [exports.bullet],
  LABEL: "Hive",
  BODY: {
    RANGE: 90,
    FOV: base.FOV * 20,
  },
  FACING_TYPE: "turnWithSpeed",
  INDEPENDENT: false,
  GUNS: [],
};
for (let i = 0; i < 5; i++)
  exports.celestialHive.GUNS.push({
    /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
    POSITION: [7, 9.5, 0.6, 7, 0, (360 / 5) * i, (1 / 5) * i],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([
        g.swarm,
        g.hive,
        g.bees,
        [0.5, 1, 1, 1, 3, 1.5, 3, 1.5, 1.5, 1, 10, 1, 1],
      ]),
      TYPE: exports.bee,
      AUTOFIRE: true,
      STAT_CALCULATOR: gunCalcNames.swarm,
    },
  });
exports.paladinSwarmer = {
  PARENT: [exports.genericTank],
  CONTROLLERS: ["doNothing"],
  BODY: {
    FOV: base.FOV * 20,
  },
  INDEPENDENT: false,
  LABEL: "Swarmer",
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [14, 14, -1.2, 5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.destroy,
          [1.5, 1, 1, 1, 2, 2, 2.5, 1, 1, 1.25, 1, 1, 1],
        ]),
        TYPE: exports.celestialHive,
      },
    },
    {
      POSITION: [15, 12, 1, 5, 0, 0, 0],
    },
  ],
};
exports.paladinSwarmerBody = {
  PARENT: [exports.genericTank],
  LABEL: "Paladin Swarmer",
  SHAPE: 5,
  SKILL: setBuild("5555550555"),
  BODY: {
    FOV: base.FOV * 20,
  },
  SIZE: 10,
  CONTROLLERS: ["doNothing"],
  INDEPENDENT: false,
  TURRETS: [
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [9, 8, 0, 180, 360, 0],
      TYPE: exports.paladinSwarmer,
    },
    {
      POSITION: [9, 8, 0, 108, 360, 0],
      TYPE: exports.paladinSwarmer,
    },
    {
      POSITION: [9, 8, 0, 35, 360, 0],
      TYPE: exports.paladinSwarmer,
    },
    {
      POSITION: [9, 8, 0, -35, 360, 0],
      TYPE: exports.paladinSwarmer,
    },
    {
      POSITION: [9, 8, 0, -108, 360, 0],
      TYPE: exports.paladinSwarmer,
    },
  ],
};
exports.paladin = {
  PARENT: [exports.miniboss],
  LABEL: "Celestial",
  NAME: "Paladin",
  COLOR: 14,
  SHAPE: 9,
  SIZE: 40,
  VARIES_IN_SIZE: false,
  VALUE: 1000000,
  BODY: bossStats({
    health: 3,
    speed: 0.5,
    FOV: base.FOV * 20,
  }),
  SKILL: setBuild("9999999998"),
  TURRETS: [
    ...celestialTrapTurretArray,
    {
      POSITION: [15, 0, 0, 0, 360, 1],
      TYPE: [
        exports.paladinSunchipBody,
        {
          COLOR: 14,
        },
      ],
    },
    {
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: [
        exports.paladinSwarmerBody,
        {
          COLOR: 14,
        },
      ],
    },
  ],
};
exports.freyjaCruiserTurret = {
  PARENT: [exports.genericTank],
  LABEL: "",
  DANGER: 6,
  INDEPENDENT: false,
  CONTROLLERS: ["doNothing"],
  STAT_NAMES: statnames.swarm,
  BODY: {
    FOV: 20,
  },
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [7, 7.5, 0.6, 7, 4, 360, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          [3, 0, 1, 1, 3, 5, 1, 1, 1, 1, 10, 1, 1],
        ]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [7, 7.5, 0.6, 7, -4, 360, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          [3, 0, 1, 1, 3, 5, 1, 1, 1, 1, 10, 1, 1],
        ]),
        TYPE: exports.swarm,
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.freyjaCruiserBody = {
  PARENT: [exports.genericTank],
  LABEL: "Freyja Swarm",
  SHAPE: 7,
  SIZE: 10,
  FOV: 20,
  SKILL: setBuild("5555550555"),
  CONTROLLERS: ["doNothing"],
  TURRETS: [
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [8, 9, 0, (360 * 3.5) / 7, 360, 0],
      TYPE: exports.freyjaCruiserTurret,
    },
    {
      POSITION: [8, 9, 0, (360 * 2.5) / 7, 360, 0],
      TYPE: exports.freyjaCruiserTurret,
    },
    {
      POSITION: [8, 9, 0, (360 * 1.5) / 7, 360, 0],
      TYPE: exports.freyjaCruiserTurret,
    },
    {
      POSITION: [8, 9, 0, (360 * 0.5) / 7, 360, 0],
      TYPE: exports.freyjaCruiserTurret,
    },
    {
      POSITION: [8, 9, 0, (-360 * 0.5) / 7, 360, 0],
      TYPE: exports.freyjaCruiserTurret,
    },
    {
      POSITION: [8, 9, 0, (-360 * 1.5) / 7, 360, 0],
      TYPE: exports.freyjaCruiserTurret,
    },
    {
      POSITION: [8, 9, 0, (-360 * 2.5) / 7, 360, 0],
      TYPE: exports.freyjaCruiserTurret,
    },
  ],
};
exports.freyjaGunnerBody = {
  PARENT: [exports.genericTank],
  LABEL: "Freyja Gunner",
  SHAPE: 5,
  SKILL: setBuild("5555555555"),
  SIZE: 10,
  CONTROLLERS: ["doNothing"],
  INDEPENDENT: false,
  TURRETS: [
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [10, 8, 0, 180, 360, 0],
      TYPE: exports.auto4gun,
    },
    {
      POSITION: [10, 8, 0, 108, 360, 0],
      TYPE: exports.auto4gun,
    },
    {
      POSITION: [10, 8, 0, 35, 360, 0],
      TYPE: exports.auto4gun,
    },
    {
      POSITION: [10, 8, 0, -35, 360, 0],
      TYPE: exports.auto4gun,
    },
    {
      POSITION: [10, 8, 0, -108, 360, 0],
      TYPE: exports.auto4gun,
    },
  ],
};
exports.freyja = {
  PARENT: [exports.miniboss],
  LABEL: "Celestial",
  NAME: "Freyja",
  COLOR: 1,
  SHAPE: 9,
  SIZE: 40,
  VARIES_IN_SIZE: false,
  VALUE: 1000000,
  BODY: bossStats({
    health: 3,
    speed: 0.5,
  }),
  SKILL: setBuild("9999999998"),
  TURRETS: [
    ...celestialTrapTurretArray,
    {
      POSITION: [15, 0, 0, 0, 360, 1],
      TYPE: [
        exports.freyjaCruiserBody,
        {
          COLOR: 1,
        },
      ],
    },
    {
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: [
        exports.freyjaGunnerBody,
        {
          COLOR: 1,
        },
      ],
    },
  ],
};
exports.zaphkielDroneBody = {
  PARENT: [exports.genericTank],
  LABEL: "Zaphkiel Drone",
  SHAPE: 7,
  SIZE: 10,
  BODY: {
    FOV: 10,
  },
  CONTROLLERS: ["doNothing"],
  MAX_CHILDREN: 28,
  GUNS: [],
};
for (let i = 0; i < 7; i++)
  exports.zaphkielDroneBody.GUNS.push({
    /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
    POSITION: [4, 6.5, 1.2, 7.5, 0, (360 / 7) * i + 360 / 14, 0],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([
        g.drone,
        [0.7, 1, 1, 1, 1, 1, 1.2, 1, 1, 1, 1, 1, 1],
      ]),
      TYPE: [
        exports.drone,
        {
          INDEPENDENT: false,
          BODY: {
            FOV: 2.5,
          },
        },
      ],
      AUTOFIRE: false,
      SYNCS_SKILLS: true,
      STAT_CALCULATOR: gunCalcNames.drone,
    },
  });
exports.zaphkielSkimmer = {
  PARENT: [exports.genericTank],
  CONTROLLERS: ["doNothing"],
  BODY: {
    FOV: base.FOV * 1,
  },
  LABEL: "Skimmer",
  DANGER: 7,
  INDEPENDENT: false,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [10, 14, -0.5, 9, 0, 0, 0],
    },
    {
      POSITION: [17, 15, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.destroy,
          [1, 1, 1, 1, 1.5, 1, 1, 1, 1, 2, 1, 1, 1],
        ]),
        TYPE: exports.hypermissile,
        STAT_CALCULATOR: gunCalcNames.sustained,
      },
    },
  ],
};
exports.zaphkielSkimmerBody = {
  PARENT: [exports.genericTank],
  LABEL: "Zaphkiel Skimmer",
  SHAPE: 5,
  SIZE: 10,
  CONTROLLERS: ["doNothing"],
  SKILL: setBuild("5555555555"),
  INDEPENDENT: false,
  TURRETS: [
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [9, 8, 0, 180, 360, 0],
      TYPE: exports.zaphkielSkimmer,
    },
    {
      POSITION: [9, 8, 0, 108, 360, 0],
      TYPE: exports.zaphkielSkimmer,
    },
    {
      POSITION: [9, 8, 0, 35, 360, 0],
      TYPE: exports.zaphkielSkimmer,
    },
    {
      POSITION: [9, 8, 0, -35, 360, 0],
      TYPE: exports.zaphkielSkimmer,
    },
    {
      POSITION: [9, 8, 0, -108, 360, 0],
      TYPE: exports.zaphkielSkimmer,
    },
  ],
};
exports.zaphkiel = {
  PARENT: [exports.miniboss],
  LABEL: "Celestial",
  NAME: "Zaphkiel",
  COLOR: 2,
  SHAPE: 9,
  SIZE: 40,
  VARIES_IN_SIZE: false,
  VALUE: 1000000,
  BODY: bossStats({
    health: 3,
    speed: 0.5,
  }),
  SKILL: setBuild("9999999998"),
  TURRETS: [
    ...celestialTrapTurretArray,
    {
      POSITION: [15, 0, 0, 0, 360, 1],
      TYPE: [
        exports.zaphkielDroneBody,
        {
          COLOR: 2,
        },
      ],
    },
    {
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: [
        exports.zaphkielSkimmerBody,
        {
          COLOR: 2,
        },
      ],
    },
  ],
};

exports.dominator = {
  PARENT: [exports.genericTank],
  LABEL: "Dominator",
  DANGER: 10,
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    str: 1,
    spd: 1,
  }),
  LEVEL: 100,
  BODY: {
    HEALTH: base.HEALTH * 40,
    DAMAGE: base.DAMAGE * 0.75,
    FOV: 2,
    PUSHABILITY: 0,
    SHIELD: base.SHIELD * 2.5,
    DENSITY: 100,
  },
  CONTROLLERS: ["nearestDifferentMaster"],
  DISPLAY_NAME: true,
  SIZE: 52.5,
  TURRETS: [
    {
      POSITION: [22, 0, 0, 0, 360, 0],
      TYPE: exports.dominationBody,
    },
  ],
  CAN_BE_ON_LEADERBOARD: true,
  GIVE_KILL_MESSAGE: true,
  ACCEPTS_SCORE: true,
  DOMTIME: false,
};
exports.destroyerDominator = {
  LABEL: "Dominator",
  PARENT: [exports.dominator],
  GUNS: [
    {
      POSITION: [15.85, 8.5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyDominator]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0],
    },
  ],
};

exports.gunnerDominator = {
  LABEL: "Dominator",
  PARENT: [exports.dominator],
  SKILL: skillSet({
    rld: 1.5,
    dam: 5,
    pen: 10,
    str: 1,
    spd: 1,
  }),
  GUNS: [
    {
      POSITION: [14.25, 3, 1, 0, -2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [14.25, 3, 1, 0, 2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [15.85, 3, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0],
    },
  ],
};
exports.trapperDominator = {
  LABEL: "Dominator",
  PARENT: [exports.dominator],
  GUNS: [
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 0, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 45, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 90, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 135, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 180, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 225, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 225, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 270, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [3.5, 3.75, 1, 8, 0, 315, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 315, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: exports.trap,
      },
    },
  ],
};
let mothershipProperties = {
  MAX_CHILDREN: 2,
  SHOOT_SETTINGS: combineStats([
    g.drone,
    g.over,
    [1, 1, 1, 1, 1, 0.9, 2.5, 1, 1, 1, 10, 1, 1],
  ]),
  TYPE: exports.drone,
  AUTOFIRE: true,
  SYNCS_SKILLS: true,
  STAT_CALCULATOR: gunCalcNames.drone,
  WAIT_TO_CYCLE: false,
};
let mothershipAutoProperties = {
  MAX_CHILDREN: 2,
  SHOOT_SETTINGS: combineStats([
    g.drone,
    g.over,
    [1, 1, 1, 1, 0.5, 0.75, 2.5, 1, 1, 1, 10, 1, 1],
  ]),
  TYPE: [
    exports.drone,
    {
      AI: {
        skynet: false,
      },
      INDEPENDENT: true,
      BODY: {
        FOV: 2,
      },
    },
  ],
  AUTOFIRE: true,
  SYNCS_SKILLS: true,
  STAT_CALCULATOR: gunCalcNames.drone,
  WAIT_TO_CYCLE: false,
};
exports.mothership = {
  PARENT: [exports.genericTank],
  LABEL: "Mothership",
  DANGER: 10,
  CRAVES_ATTENTION: true,
  SIZE: 55,
  SHAPE: 16,
  STAT_NAMES: statnames.drone,
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    str: 1,
    spd: 0,
    atk: 1,
    hlt: 1,
    shi: 1,
    rgn: 1,
    mob: 1,
  }),
  VALUE: 500000,
  BODY: bossStats({
    health: 1.5,
    speed: 0.8,
    FOV: base.FOV * 5,
  }),
  GUNS: [
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 22.5, 1],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 45, 0.0625],
      PROPERTIES: mothershipAutoProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 67.5, 0.9375],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 90, 0.125],
      PROPERTIES: mothershipAutoProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 112.5, 0.875],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 135, 0.1875],
      PROPERTIES: mothershipAutoProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 157.5, 0.8125],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 180, 0.25],
      PROPERTIES: mothershipAutoProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 202.5, 0.75],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 225, 0.3125],
      PROPERTIES: mothershipAutoProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 247.5, 0.6875],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 270, 0.375],
      PROPERTIES: mothershipAutoProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 292.5, 0.625],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 315, 0.4375],
      PROPERTIES: mothershipAutoProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 337.5, 0.5625],
      PROPERTIES: mothershipProperties,
    },
    {
      POSITION: [4.3, 3.1, 1.2, 8, 0, 360, 0.5],
      PROPERTIES: mothershipAutoProperties,
    },
  ],
};
exports.fallenCloser = {
  PARENT: [exports.genericTank],
  LABEL: "Fallen Arena Closer",
  COLOR: 16,
  SIZE: 300,
  BODY: {
    HEALTH: 10000,
    REGEN: 1000,
    DAMAGE: base.DAMAGE * 999,
    SPEED: base.SPEED * 50,
    RANGE: 9999999500,
    FOV: base.FOV * 5,
  },

  SKILL: setBuild("9999999999"),
  DRAW_HEALTH: true,
  CONTROLLERS: ["nearestDifferentMaster", "minion"],
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [16, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        /*************************************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.1, 0.1, 1, 10, 5, 10, 3, 1.5, 10, 10, 0.1, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.fallencloser = {
  PARENT: [exports.genericTank],
  LABEL: "Fallen Arena Closer",
  COLOR: 16,
  SIZE: 125,
  BODY: {
    HEALTH: 9e99,
    REGEN: 1000,
    DAMAGE: base.DAMAGE * 9e99,
    SPEED: base.SPEED * 50,
    RANGE: 9999999500,
    FOV: base.FOV * 5,
  },

  SKILL: setBuild("9999999999"),
  DRAW_HEALTH: true,
  CONTROLLERS: ["nearestDifferentMaster", "minion"],
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [16, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        /*************************************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.1, 0.1, 1, 1, 20, 2, 3, 1.5, 10, 10, 0.1, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.arenaCloser = {
  PARENT: [exports.genericTank],
  LABEL: "Arena Closer",
  COLOR: 3,
  SIZE: 80,
  BODY: {
    HEALTH: 1000,
    REGEN: 100,
    DAMAGE: base.DAMAGE * 8,
    SPEED: base.SPEED * 3,
    RANGE: 110,
    FOV: base.FOV * 2,
  },

  SKILL: setBuild("9999999999"),
  DRAW_HEALTH: true,
  CONTROLLERS: ["nearestDifferentMaster", "minion"],
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [16, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        /*************************************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.1, 0.1, 1, 50, 50, 50, 1, 1.5, 10, 10, 0.1, 9e99],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.ArenaCloser = {
  PARENT: [exports.genericTank],
  LABEL: "Arena Closer",
  COLOR: 3,
  SIZE: 15,
  BODY: {
    HEALTH: 10000,
    REGEN: base.REGEN * 100,
    DAMAGE: base.DAMAGE * 0.5,
    SPEED: base.SPEED * 3,
    RANGE: 110,
    FOV: base.FOV * 1.8,
  },

  SKILL: setBuild("9999999999"),
  DRAW_HEALTH: true,
  CONTROLLERS: ["nearestDifferentMaster", "minion"],
  BROADCAST_MESSAGE: "!Arena closed. No players may join!",
  GUNS: [
    {
      POSITION: [16, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        /*************************************** RELOAD RECOIL SHUDDER SIZE HEALTH DAMAGE PEN SPEED MAX RANGE DENSITY SPRAY RESIST */
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.5, 0.1, 0.1, 1, 1, 20, 2, 3, 1.5, 10, 10, 0.1, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.raptor = {
  PARENT: [exports.genericTank],
  LABEL: "Raptor",
  COLOR: "#555555",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [69.231, 4.8, 1, -76.154, 0, 180, 0],
    },
    {
      POSITION: [11.077, 3.2, 1, 0, 8.308, 225, 0],
    },
    {
      POSITION: [11.077, 3.2, 1, 0, -8.308, 135, 0],
    },
    {
      POSITION: [16.615, 3.2, 1, 4.154, -13.846, 172.5, 0],
    },
    {
      POSITION: [16.615, 3.2, 1, 4.154, 13.846, 187.5, 0],
    },
    {
      POSITION: [76.154, 32, 1, -27.692, -27.692, 270, 0],
    },
    {
      POSITION: [76.154, 32, 1, -27.692, 27.692, 90, 0],
    },
    {
      POSITION: [34.615, 9.6, 1, -38.769, -19.385, 7.5, 0],
    },
    {
      POSITION: [34.615, 9.6, 1, -38.769, 19.385, 352.5, 0],
    },
    {
      POSITION: [34.615, 9.6, 1, 8.308, 0, 232.5, 0],
    },
    {
      POSITION: [34.615, 9.6, 1, 8.308, 0, 127.5, 0],
    },
    {
      POSITION: [8.308, 3.2, 1, -16.615, -9.692, 97.5, 0],
    },
    {
      POSITION: [8.308, 3.2, 1, -16.615, 9.692, 262.5, 0],
    },
    {
      POSITION: [24.923, 9.6, 1, -33.231, 41.538, 90, 0],
    },
    {
      POSITION: [24.923, 9.6, 1, -33.231, -41.538, 270, 0],
    },
    {
      POSITION: [55.385, 14.4, 1, 23.538, -13.846, 210, 0],
    },
    {
      POSITION: [55.385, 14.4, 1, 23.538, 13.846, 150, 0],
    },
    {
      POSITION: [34.615, 2.4, 1, -48.462, 0, 180, 0],
    },
    {
      POSITION: [24.923, 9.6, 1, -33.231, 41.538, 90, 0],
    },
    {
      POSITION: [62.308, 4, 1, -6.923, 4.154, 180, NaN],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 9, 1, 0.05, 1, 2000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, -4.154, 180, NaN],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 9, 1, 0.05, 1, 2000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, -4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 9, 1, 0.05, 1, 2000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, 4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 9, 1, 0.05, 1, 2000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, 4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 9.9, 1, 0.05, 1, 2000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, -4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 9.9, 1, 0.05, 1, 2000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, -4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 10.8, 1, 0.05, 1, 3000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, 4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 10.8, 1, 0.05, 1, 3000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, 4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 13.5, 1, 0.05, 1, 6000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, -4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 13.5, 1, 0.05, 1, 6000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, -4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 14.4, 1, 0.05, 1, 15000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [62.308, 4, 1, -6.923, 4.154, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.1, 0.001, 1, 1, 0.24, 1, 14.4, 1, 0.05, 1, 15000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, -6.923, 6.231, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0.1, 0.001, 1, 1, 2.4, 1, 83.7, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, -6.923, -6.231, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0.1, 0.001, 1, 1, 2.4, 1, 83.7, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -12.462, -11.077, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -12.462, 11.077, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -15.231, -11.077, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -15.231, 11.077, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, -11.077, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, 11.077, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, -11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, -11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99.45, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, -11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99.9, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, -11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 100.35, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, 11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, 11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99.45, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, 11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 99.9, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, -9.692, 11.077, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [200, 0.1, 0.001, 1, 1, 16, 1, 100.35, 1, 1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [55.385, 6.4, 1, -6.923, -4.154, 180, 0.5],
    },
    {
      POSITION: [55.385, 6.4, 1, -6.923, 4.154, 180, 0.5],
    },
    {
      POSITION: [55.385, 6.4, 1, -6.923, 0, 180, 0.5],
    },
    {
      POSITION: [27.692, 4.8, 1, 0, -9.692, 180, 0.5],
    },
    {
      POSITION: [27.692, 4.8, 1, 0, 9.692, 180, 0.5],
    },
    {
      POSITION: [11.077, 4.8, 1, 0, 6.923, 232.5, 0.5],
    },
    {
      POSITION: [11.077, 4.8, 1, 0, -6.923, 135, 0.5],
    },
    {
      POSITION: [28.385, 7.2, 1, -31.154, -15.231, 0, 0.5],
    },
    {
      POSITION: [28.385, 7.2, 1, -31.154, 15.231, 0, 0.5],
    },
    {
      POSITION: [16.615, 4.8, 1, -1.385, -5.538, 127.5, 0.5],
    },
    {
      POSITION: [16.615, 4.8, 1, -1.385, 5.538, 232.5, 0.5],
    },
    {
      POSITION: [9.692, 3.2, 1, 11.077, -11.077, 157.5, 0.5],
    },
    {
      POSITION: [9.692, 3.2, 1, 11.077, 11.077, 202.5, 0.5],
    },
    {
      POSITION: [11.077, 6.4, 1, -5.538, 5.538, 270, 0.5],
    },
    {
      POSITION: [27.692, 6.4, 1, -11.077, 11.077, 232.5, 0.5],
    },
    {
      POSITION: [27.692, 6.4, 1, -11.077, -11.077, 127.5, 0.5],
    },
    {
      POSITION: [33.231, 16, 1, -5.538, 33.231, 90, 0.5],
    },
    {
      POSITION: [24.923, 9.6, 1, -33.231, -41.538, 270, 0.5],
    },
    {
      POSITION: [8.308, 3.2, 1, 49.846, -4.154, 180, 0.5],
    },
    {
      POSITION: [8.308, 3.2, 1, 49.846, 4.154, 180, 0.5],
    },
    {
      POSITION: [19.385, 5.6, 1, -27.692, -15.231, 0, 0.5],
    },
    {
      POSITION: [19.385, 5.6, 1, -27.692, 15.231, 0, 0.5],
    },
    {
      POSITION: [41.538, 4.8, 1, 0, -3.462, 180, 0.5],
    },
    {
      POSITION: [41.538, 4.8, 1, 0, 3.462, 180, 0.5],
    },
    {
      POSITION: [24.923, 5.6, 1, -13.846, 0, 232.5, 0.5],
    },
    {
      POSITION: [24.923, 5.6, 1, -13.846, 0, 127.5, 0.5],
    },
    {
      POSITION: [24.923, 5.6, 1, -6.923, 9, 180, 0.5],
    },
    {
      POSITION: [24.923, 5.6, 1, -6.923, -9, 180, 0.5],
    },
    {
      POSITION: [11.077, 5.6, 1, -20.769, 16.615, 112.5, 0.5],
    },
    {
      POSITION: [11.077, 5.6, 1, -20.769, -16.615, 247.5, 0.5],
    },
    {
      POSITION: [4.154, 1.6, 1, -2.077, -8.308, 270, 0.5],
    },
    {
      POSITION: [4.154, 1.6, 1, -2.077, -13.846, 270, 0.5],
    },
    {
      POSITION: [12.462, 2.4, 1, -19.385, 8.308, 15, 0.5],
    },
    {
      POSITION: [12.462, 2.4, 1, -19.385, -8.308, 345, 0.5],
    },
    {
      POSITION: [27.692, 5.6, 1, 2.769, 0, 180, 0.5],
    },
    {
      POSITION: [12.462, 6.4, 1, -8.308, 0, 180, 0.5],
    },
    {
      POSITION: [5.538, 6.4, 1, -8.308, -5.538, 180, 0.5],
    },
    {
      POSITION: [5.538, 6.4, 1, -8.308, 5.538, 180, 0.5],
    },
    {
      POSITION: [0, 0, 1, 49.846, 0, 225, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 1.76, 1, 0, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [0, 0, 1, 49.846, 0, 135, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 1.76, 1, 0, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.Warrior = {
  PARENT: [exports.genericTank],
  LABEL: "Warrior",
  COLOR: "#2581A2",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.017],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.033],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.05],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.067],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 0, 1.083],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 90, 1.083],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.083],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 270, 1.083],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [120, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.011],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.022],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.033],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.044],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 330, 1.056],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 30, 1.056],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 90, 1.056],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 150, 1.056],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 210, 1.056],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 270, 1.056],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [180, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.008],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.017],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.025],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.033],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 0, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 315, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 0, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 45, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 90, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 135, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 180, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 225, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 270, 1.042],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [240, 10, 0.001, 1, 1, 3.6, 1, 9, 1, 0.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 337.5, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [370, 0, 0.001, 1, 1, 9.6, 1, 7.2, 1, 2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 22.5, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [370, 0, 0.001, 1, 1, 9.6, 1, 7.2, 1, 2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 15, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [370, 0, 0.001, 1, 1, 9.6, 1, 7.2, 1, 2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 352.5, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [370, 0, 0.001, 1, 1, 9.6, 1, 7.2, 1, 2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [370, 0, 0.001, 1, 1, 9.6, 1, 7.2, 1, 2, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 210, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.4, 0.001, 1, 1, 1.6, 1, 31.5, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 150, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.4, 0.001, 1, 1, 1.6, 1, 31.5, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 270, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 1.6, 1, 31.5, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 90, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 1.6, 1, 31.5, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [8.308, 3.2, 1, 0, 0, 0, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 1.6, 1, 31.5, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 5.6, 1, 7.2, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 5.6, 1, 7.2, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [12, 2, 0.001, 1, 1, 5.6, 1, 5.4, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [12, 2, 0.001, 1, 1, 5.6, 1, 5.4, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 210, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [12, 2, 0.001, 1, 1, 5.6, 1, 5.4, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 150, 0.167],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [12, 2, 0.001, 1, 1, 5.6, 1, 5.4, 1, 0.75, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [27.692, 6.4, 1, -5.538, 0, 330, 0.167],
    },
    {
      POSITION: [27.692, 6.4, 1, -5.538, 0, 30, 0.167],
    },
    {
      POSITION: [27.692, 6.4, 1, -5.538, 2.769, 225, 0.167],
    },
    {
      POSITION: [27.692, 6.4, 1, -5.538, -2.769, 135, 0.167],
    },
    {
      POSITION: [27.692, 6.4, 1, -5.538, 0, 285, 0.167],
    },
    {
      POSITION: [27.692, 6.4, 1, -5.538, 0, 75, 0.167],
    },
    {
      POSITION: [22.154, 4.8, 1, -2.769, 0, -170, 0.167],
    },
    {
      POSITION: [22.154, 4.8, 1, -2.769, 0, 170, 0.167],
    },
    {
      POSITION: [16.615, 4.8, 1, 0, 0, 247.5, 25],
    },
    {
      POSITION: [16.615, 4.8, 1, 0, 0, 112.5, 25],
    },
    {
      POSITION: [16.615, 4.8, 1, 0, 0, 180, 25],
    },
    {
      POSITION: [16.615, 4.8, 1, 0, 0, 247.5, 25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [20, 20, 0.001, 1, 1, 3.2, 1, 7.2, 1, 0.1, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13.846, 3.2, 1, 0, 0, 210, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.5, 0.001, 1, 1, 0.8, 1, 54, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13.846, 3.2, 1, 0, 0, 150, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.5, 0.001, 1, 1, 0.8, 1, 54, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13.846, 3.2, 1, 0, 0, 247.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.5, 0.001, 1, 1, 0.8, 1, 54, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [13.846, 3.2, 1, 0, 0, 112.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0.5, 0.001, 1, 1, 0.8, 1, 54, 1, 0.05, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.dual_jet = {
  PARENT: [exports.genericTank],
  LABEL: "Dual Jet",
  COLOR: "#555555",
  SIZE: 12,
  SHAPE: 0,
  GUNS: [
    {
      POSITION: [55.385, 32, 1, -27.692, 0, 0, 0],
    },
    {
      POSITION: [110.769, 24, 1, -41.538, 11.769, 0, 0],
    },
    {
      POSITION: [110.769, 24, 1, -41.538, -11.769, 0, 0],
    },
    {
      POSITION: [27.692, 9.6, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [10, 0, 0.001, 1, 1, 2.4, 1, 27, 1, 1.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [27.692, 9.6, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [8, 0, 0.001, 1, 1, 2.4, 1, 27, 1, 1.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [27.692, 9.6, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [6, 0, 0.001, 1, 1, 2.4, 1, 27, 1, 1.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [27.692, 9.6, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [4, 0, 0.001, 1, 1, 2.4, 1, 27, 1, 1.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [27.692, 9.6, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 2.4, 1, 27, 1, 1.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [22.154, 6.4, 1, -19.385, 0, 0, 0],
    },
    {
      POSITION: [27.692, 9.6, 1, -8.308, -15.231, 0, 0],
    },
    {
      POSITION: [27.692, 9.6, 1, -8.308, 15.231, 0, 0],
    },
    {
      POSITION: [27.692, 12.8, 1, -13.846, 16.615, 0, 0],
    },
    {
      POSITION: [27.692, 12.8, 1, -13.846, -16.615, 0, 0],
    },
    {
      POSITION: [55.385, 64, 1, -13.846, 0, 90, 0],
    },
    {
      POSITION: [55.385, 64, 1, -13.846, 0, 270, 0],
    },
    {
      POSITION: [41.538, 48, 1, -6.923, -27.692, 270, 0],
    },
    {
      POSITION: [41.538, 48, 1, -6.923, 27.692, 90, 0],
    },
    {
      POSITION: [27.692, 32, 1, -6.923, -27.692, 270, 0],
    },
    {
      POSITION: [27.692, 32, 1, -6.923, 27.692, 90, 0],
    },
    {
      POSITION: [13.846, 16, 1, 0, 13.846, 90, 0],
    },
    {
      POSITION: [13.846, 16, 1, 0, -13.846, 270, 0],
    },
    {
      POSITION: [13.846, 16, 1, 0, 0, 240, 0],
    },
    {
      POSITION: [13.846, 16, 1, 0, 0, 112.5, 0],
    },
    {
      POSITION: [13.846, 16, 1, 1.385, 2.769, 285, 0],
    },
    {
      POSITION: [13.846, 16, 1, 1.385, -2.769, 67.5, 0],
    },
    {
      POSITION: [13.846, 3.2, 1, -19.385, 0, 0, 0],
    },
    {
      POSITION: [16.615, 3.2, 1, 9.692, -5.538, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 1.2, 1, 27, 1, 1.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [16.615, 3.2, 1, 9.692, 5.538, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [2, 0, 0.001, 1, 1, 1.2, 1, 27, 1, 1.5, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [7.385, 4.2, 2.7, 24.615, 0, 307.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [10, 0, 0.001, 1.54, 1.02, 1.2, 1, 27, 0.9, 1.5, 2, 0.00001, 1],
        ]),
        TYPE: exports.drone,
      },
    },
    {
      POSITION: [7.385, 4.2, 2.7, 24.615, 0, 52.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [10, 0, 0.001, 1.54, 1.02, 1.2, 1, 27, 0.9, 1.5, 2, 0.00001, 1],
        ]),
        TYPE: exports.drone,
      },
    },
    {
      POSITION: [16.615, 6.4, 1, 16.615, 0, 180, 0],
    },
    {
      POSITION: [2.769, 6.4, 1.3, 33.23, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [40, 0, 0.001, 0.45, 0.6, 4, 1.25, 2.25, 0.8, 0.75, 1.25, 0.00001, 1],
        ]),
        TYPE: exports.trap,
      },
    },
    {
      POSITION: [12.462, 3.2, 1, 13.846, 0, 180, 0],
    },
    {
      POSITION: [12.462, 3.2, 1, 13.846, 0, 180, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 3, 0.001, 1, 1, 0.008, 1, 36, 1, 0.05, 1, 50000, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -11.077, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -16.615, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -22.154, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -27.692, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -33.231, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -38.769, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -44.308, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -49.846, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, -55.385, 67.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 11.077, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 16.615, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 22.154, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 27.692, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 33.231, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 38.769, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 44.308, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 49.846, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 22.154, 55.385, 292.5, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 0, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, -5.538, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, -11.077, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, -16.615, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, -22.154, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, -27.692, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, -33.231, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, -38.769, 300, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 0, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 5.538, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 11.077, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 16.615, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 22.154, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 27.692, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 33.231, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
    {
      POSITION: [5.538, 3.2, 1, 20.769, 38.769, 60, Infinity],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          [0, 0, 0.001, 1, 1, 0.52, 1, 0, 1, 0, 1, 0.00001, 1],
        ]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.jet = {
  PARENT: [exports.minion],
  LABEL: "Jet",
  //SHAPE: 'M -1 -2 L 3 0 L 3 0 L -1 2 L -2 2 L -1 0 L -1 0 L -2 -2 L -1 -2',
  GUNS: [
    {
      POSITION: [1, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.puregunner]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.jetspawner = {
  PARENT: [exports.genericTank],
  LABEL: "Jet Spawner",
  //SHAPE: 'M -2 1 L -2 -1 L 2 -1 L 2 1 L -2 1',
  GUNS: [
    {
      POSITION: [1, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory]),
        TYPE: exports.jet,
        MAX_CHILDREN: 5,
      },
    },
  ],
};

exports.ElementalShooter = {
    PARENT: [exports.genericTank],
    LABEL: "Elemental Shooter",
    COLOR: "#3CA4CB",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 0, 0.04],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 2, 1, 3.6, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 3.2, 1, 0, 0, 0, 0.04],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 2, 1, 3.15, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 3.2, 1, 0, 0, 0, 0.04],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 2, 1, 2.7, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 3.2, 1, 0, 0, 0, 0.04],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 2, 1, 2.25, 1, 1.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.067],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 7.2, 1, 0.4, 1, 15000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.067],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 7.2, 1, 0.4, 1, 15000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.067],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 7.2, 1, 0.4, 1, 15000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.067],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 6.3, 1, 0.7, 1, 25000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.067],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 6.3, 1, 0.7, 1, 25000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.067],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 6.3, 1, 0.7, 1, 25000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.033],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 0, 0.001, 1, 1, 2, 1, 9, 1, 0.5, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [18, 3.2, 1, 0, 0, 0, 0.033],
        },
        {
            POSITION: [3, 3.2, 1.3, 18, 0, 0, 0.033],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 0, 0.001, 0.45, 0.6, 2, 1.25, 8.1, 0.8, 0.5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [18, 3.2, 1, 0, 0, 0, 0.033],
        },
        {
            POSITION: [3, 3.2, 1.3, 18, 0, 0, 0.033],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 0, 0.001, 0.45, 0.6, 2, 1.25, 7.2, 0.8, 0.5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [18, 3.2, 1, 0, 0, 0, 0.033],
        },
        {
            POSITION: [3, 3.2, 1.3, 18, 0, 0, 0.033],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [60, 0, 0.001, 0.45, 0.6, 2, 1.25, 6.3, 0.8, 0.5, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.033],
        },
        {
            POSITION: [8, 3.5, 2.7, 8, 0, 300, 0.033],
        },
        {
            POSITION: [8, 3.5, 2.7, 8, 0, 60, 0.033],
        },
    ],
};
exports.FireballCaster = {
    PARENT: [exports.genericTank],
    LABEL: "Fireball Caster ",
    COLOR: "#CF2023",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [12.308, 6.3, 2.7, 8, 0, 0, 0],
        },
        {
            POSITION: [27.692, 6.4, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2.769, 1.6, 1, 0, -5.538, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, 0, 5.538, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, 5.538, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, 4.154, -4.154, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, 4.154, 4.154, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -5.538, 4.154, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -5.538, -4.154, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -8.308, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -5.538, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 1.2, 1, 3.6, 1, 2, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -5.538, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 0.4, 1, 3.15, 1, 2, 1, 5000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -5.538, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 0.4, 1, 2.7, 1, 2, 1, 5000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -5.538, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 0.4, 1, 2.25, 1, 2, 1, 5000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [2.769, 1.6, 1, -5.538, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [50, 0, 0.001, 1, 1, 0.4, 1, 1.8, 1, 2, 1, 5000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [10.462, 4.2, 2.7, 8, 0, 247.5, 0],
        },
        {
            POSITION: [10.462, 4.2, 2.7, 8, 0, 112.5, 0],
        },
    ],
};
exports.ToxicSpewer = {
    PARENT: [exports.genericTank],
    LABEL: "Toxic Spewer",
    COLOR: "#9BFF05",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3.231, 6.4, 1.3, 19.385, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 1.4, 1.25, 4.5, 0.8, 0.5, 1.25, 45000, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3.231, 6.4, 1.3, 19.385, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 1.4, 1.25, 4.95, 0.8, 0.5, 1.25, 45000, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3.231, 6.4, 1.3, 19.385, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 1.4, 1.25, 3.6, 0.8, 0.6, 1.25, 45000, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3.231, 6.4, 1.3, 19.385, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 1.4, 1.25, 5.4, 0.8, 0.4, 1.25, 45000, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3.231, 6.4, 1.3, 19.385, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [20, 0, 0.001, 0.45, 0.6, 1.4, 1.25, 5.85, 0.8, 0.5, 1.25, 45000, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 5.85, 1, 0.5, 1, 30000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 5.4, 1, 0.55, 1, 30000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [30, 0, 0.001, 1, 1, 1.6, 1, 3.6, 1, 0.5, 1, 30000, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 330, 0],
        },
        {
            POSITION: [19.385, 6.4, 1, 0, 0, 30, 0],
        },
        {
            POSITION: [8.615, 2.8, 2.7, 8, 0, 180, 0],
        },
    ],
};
exports.IceGlazer = {
    PARENT: [exports.genericTank],
    LABEL: "Ice Glazer",
    COLOR: "#70D9FF",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 1, 1, 0.8, 1, 10.8, 1, 0.4, 1, 0.00001, 1]
                ]),
                TYPE: exports.bullet
            },
        },
        {
            POSITION: [16.615, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2.769, 8, 1.3, 16.615, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 0.45, 0.6, 0.6, 1.25, 10.8, 0.8, 0.4, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [16.615, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2.769, 8, 1.3, 16.615, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 0.45, 0.6, 0.6, 1.25, 9, 0.8, 0.4, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [16.615, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2.769, 8, 1.3, 16.615, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 0.45, 0.6, 0.6, 1.25, 7.2, 0.8, 0.4, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [16.615, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2.769, 8, 1.3, 16.615, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    [10, 0, 0.001, 0.45, 0.6, 0.6, 1.25, 5.4, 0.8, 0.4, 1.25, 0.00001, 1]
                ]),
                TYPE: exports.trap
            },
        },
        {
            POSITION: [16.615, 8, 1, 0, 0, 300, 0],
        },
        {
            POSITION: [16.615, 8, 1, 0, 0, 67.5, 0],
        },
        {
            POSITION: [7.385, 3.5, 2.7, -11.385000000000002, 0, 75, 0],
        },
        {
            POSITION: [7.385, 3.5, 2.7, -11.385000000000002, 0, 285, 0],
        },
    ],
};

exports.boat = {
  PARENT: [exports.genericTank],
  LABEL: "Battle Boat",
  //SHAPE: 'M -2 -1 A 1 1 0 0 0 -2 1 L 2 1 A 1 1 0 0 0 2 -1 L -2 -1',
  TURRETS: [
    {
      POSITION: [6, 0, 0, 0, 360, 1],
      TYPE: [exports.autoTurret, { PARENT: [exports.twin] }],
    },
    {
      POSITION: [6, 12, 0, 0, 360, 1],
      TYPE: [
        exports.autoTurret,
        { PARENT: [exports.flank] },
        { AUTOFIRE: true, CONTROLLERS: ["reversespin"] },
      ],
    },
    {
      POSITION: [6, -12, 0, 0, 360, 1],
      TYPE: exports.jetspawner,
    },
  ],
};
exports.misc = {
  PARENT: [exports.genericTank],
  LABEL: "Misc",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.misc2 = {
  PARENT: [exports.genericTank],
  LABEL: "Misc Page 2",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.misc3 = {
  PARENT: [exports.genericTank],
  LABEL: "Misc Page 3",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.misc4 = {
  PARENT: [exports.genericTank],
  LABEL: "Misc Page 4",
  GUNS: [
    {
      /*** LENGTH WIDTH ASPECT X Y ANGLE DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: exports.bullet,
      },
    },
  ],
};
exports.bot = {
  AUTO_UPGRADE: "random",
  TYPE: "BOOOOT",
  FACING_TYPE: "looseToTarget",
  BODY: {
    SIZE: 11,
  },
  //COLOR: 17,
  NAME: "ai_",
  CONTROLLERS: [
    "nearestDifferentMaster",
    "mapAltToFire",
    "bot",
    "fleeAtLowHealth",
  ],
  AI: {
    STRAFE: true,
  },
};
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS
// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS// PREMIUM UPGRADE PATHS

exports.bosses.UPGRADES_TIER_1 = [
  exports.fallencloser,
  exports.elite_destroyer,
  exports.elite_gunner,
  exports.hexagonictrapper,
  exports.elite_sprayer,
  exports.elite_battleship,
  exports.nestKeeper,
  exports.palisade,
  exports.skimboss,
  exports.summoner,
  exports.paladin,
  exports.freyja,
  exports.zaphkiel,
  exports.testCelestial,
];
exports.ElementalShooter.UPGRADES_TIER_1 = [
  exports.FireballCaster,
  exports.ToxicSpewer,
  exports.IceGlazer,
]


exports.testbed.UPGRADES_TIER_1 = [
  exports.betaTanks,
  exports.spectator,
  exports.basic,
];
exports.betaTanks.UPGRADES_TIER_1 = [
  exports.misc,
  exports.bosses
];
exports.seniorTester.UPGRADES_TIER_1 = [
  exports.testbed,
  exports.misc
];
exports.developer.UPGRADES_TIER_1 = [
  exports.betaTanks,
  exports.bosses,
  exports.misc,
  exports.spectator,
];


exports.misc.UPGRADES_TIER_1 = [ // full (12/12)
  exports.misc2,
  exports.PlaneB,
  exports.destroyerDominator,
  exports.boat,
  exports.gunnerDominator,
  exports.trapperDominator,
  exports.mothership,
  exports.arenaCloser,
  exports.baseProtector,
  exports.Extaner,
  exports.testCelestialTurret1,
  exports.fallenCloser,
];

exports.misc2.UPGRADES_TIER_1 = [ // not full (9/12)
  exports.misc3,
  exports.raptor,
  exports.Warrior,
  exports.heavy_guard,
  exports.dual_jet,
  exports.holy_cow,
  exports.castle,
  exports.VVA_14,
  exports.ElementalShooter
];

exports.misc3.UPGRADES_TIER_1 = [ // not full (3/12)
  exports.misc4,
  exports.woof,
  exports.Horn
];

exports.misc4.UPGRADES_TIER_1 = [ // not full (0/12)
  
];
// UPGRADE PATHS// UPGRADE PATHS// UPGRADE PATHS
// UPGRADE PATHS// UPGRADE PATHS// UPGRADE PATHS
// UPGRADE PATHS// UPGRADE PATHS// UPGRADE PATHS
// UPGRADE PATHS// UPGRADE PATHS// UPGRADE PATHS
// UPGRADE PATHS// UPGRADE PATHS// UPGRADE PATHS
// UPGRADE PATHS// UPGRADE PATHS// UPGRADE PATHS

exports.basic.UPGRADES_TIER_1 = [
  exports.twin,
  exports.sniper,
  exports.machine,
  exports.flank,
  exports.director,
  exports.pound,
  exports.trapper,
];
exports.basic.UPGRADES_TIER_3 = [
  exports.single,
  exports.spectator,
  exports.BasiC,
];

exports.basic.UPGRADES_TIER_2 = [exports.smash];
exports.smash.UPGRADES_TIER_3 = [
  exports.megasmash,
  exports.spike,
  exports.autosmash,
];

exports.twin.UPGRADES_TIER_2 = [
  exports.double,
  exports.bent,
  exports.gunner,
  exports.hexa,
];
exports.twin.UPGRADES_TIER_3 = [exports.dual];
exports.double.UPGRADES_TIER_3 = [
  exports.tripletwin,
  exports.split,
  exports.autodouble,
  exports.bentdouble,
];
exports.bent.UPGRADES_TIER_3 = [
  exports.penta,
  exports.spread,
  exports.benthybrid,
  exports.bentdouble,
  exports.triple,
];
exports.gunner.UPGRADES_TIER_3 = [
  exports.autogunner,
  exports.nailgun,
  exports.auto4,
  exports.machinegunner,
  exports.cyclone,
];

exports.sniper.UPGRADES_TIER_2 = [
  exports.assassin,
  exports.hunter,
  exports.mini,
  exports.builder,
  exports.flanktrap,
  exports.rifle,
];
exports.assassin.UPGRADES_TIER_3 = [exports.ranger, exports.falcon];
exports.hunter.UPGRADES_TIER_3 = [
  exports.preda,
  exports.poach,
  exports.sidewind,
];
exports.builder.UPGRADES_TIER_3 = [
  exports.construct,
  exports.autobuilder,
  exports.engineer,
  exports.conq,
];

exports.machine.UPGRADES_TIER_2 = [
  exports.destroy,
  exports.artillery,
  exports.mini,
  exports.gunner,
];
exports.machine.UPGRADES_TIER_3 = [exports.spray];
exports.destroy.UPGRADES_TIER_3 = [
  exports.anni,
  exports.hybrid,
  exports.construct,
  exports.shotgun2,
];
exports.artillery.UPGRADES_TIER_3 = [
  exports.mortar,
  exports.spread,
  exports.skimmer,
];
exports.mini.UPGRADES_TIER_3 = [
  exports.stream,
  exports.nailgun,
  exports.hybridmini,
];

exports.flank.UPGRADES_TIER_2 = [
  exports.hexa,
  exports.tri,
  exports.auto3,
  exports.flanktrap,
];
exports.flank.UPGRADES_TIER_3 = [];
exports.tri.UPGRADES_TIER_3 = [
  exports.fighter,
  exports.booster,
  exports.falcon,
  exports.bomber,
  exports.autotri,
  exports.brutalizer,
];
exports.hexa.UPGRADES_TIER_3 = [
  exports.octo,
  exports.hexatrap,
  exports.cyclone,
  exports.heptatrap,
];
exports.auto3.UPGRADES_TIER_3 = [
  exports.auto5,
  exports.heavy3,
  exports.auto4,
  exports.sniper3,
  exports.architect,
];
exports.flanktrap.UPGRADES_TIER_3 = [
  exports.bushwhack,
  exports.snipeGuard,
  exports.guntrap,
  exports.fortress,
  exports.bomber,
];

exports.director.UPGRADES_TIER_2 = [
  exports.overseer,
  exports.cruiser,
  exports.underseer,
  exports.lilfact,
  exports.manager,
  exports.master,
];
exports.master.UPGRADES_TIER_3 = [
  exports.commander,
  exports.quasar,
  exports.autoMaster,
];
exports.manager.UPGRADES_TIER_3 = [exports.phantom, exports.maleficitor];
exports.lilfact.UPGRADES_TIER_3 = [exports.factory, exports.autoSpawner];
exports.overseer.UPGRADES_TIER_3 = [
  exports.overlord,
  exports.overtrap,
  exports.overgunner,
  exports.autoover,
  exports.banshee,
];
exports.underseer.UPGRADES_TIER_3 = [
  exports.necromancer,
  exports.maleficitor,
  exports.summoner2,
];
exports.cruiser.UPGRADES_TIER_3 = [
  exports.carrier,
  exports.battleship,
  exports.fortress,
  exports.autocruiser,
];

exports.pound.UPGRADES_TIER_2 = [
  exports.destroy,
  exports.artillery,
  exports.multishot,
  exports.launcher,
];
exports.pound.UPGRADES_TIER_3 = [exports.eagle];
exports.launcher.UPGRADES_TIER_3 = [
  exports.skimmer,
  exports.sidewind,
  exports.spinner,
  exports.autoLauncher,
];
exports.multishot.UPGRADES_TIER_3 = [exports.shotgun2, exports.autoMulti];

exports.trapper.UPGRADES_TIER_2 = [
  exports.megatrapper,
  exports.autoTrapper,
  exports.tritrapper,
  exports.flanktrap,
  exports.builder,
  exports.boomer,
];
exports.trapper.UPGRADES_TIER_3 = [exports.minitrap];
exports.tritrapper.UPGRADES_TIER_3 = [
  exports.hexatrap,
  exports.heptatrap,
  exports.autotritrap,
  exports.quadtrapper,
  exports.architect,
];
exports.autoTrapper.UPGRADES_TIER_3 = [
  exports.autotritrap,
  exports.automegatrapper,
  exports.autobuilder,
  exports.autoboomer,
];
exports.megatrapper.UPGRADES_TIER_3 = [
  exports.gigatrapper,
  exports.construct,
  exports.megaboomer,
  exports.automegatrapper,
];
exports.boomer.UPGRADES_TIER_3 = [
  exports.bentboomer,
  exports.megaboomer,
  exports.autoboomer,
];

exports.smash.UPGRADES_TIER_3 = [
  exports.megasmash,
  exports.spike,
  exports.autosmash,
];

exports.twin.UPGRADES_TIER_2 = [
  exports.double,
  exports.bent,
  exports.triple,
  exports.hexa,
];
exports.double.UPGRADES_TIER_3 = [exports.tripletwin, exports.autodouble];
exports.bent.UPGRADES_TIER_3 = [exports.penta, exports.benthybrid];
exports.triple.UPGRADES_TIER_3 = [exports.quint];

exports.sniper.UPGRADES_TIER_2 = [
  exports.assassin,
  exports.overseer,
  exports.hunter,
  exports.builder,
];
exports.assassin.UPGRADES_TIER_3 = [exports.ranger];
exports.overseer.UPGRADES_TIER_3 = [
  exports.overlord,
  exports.battleship,
  exports.overtrap,
  exports.necromancer,
  exports.factory,
  exports.fortress,
];
exports.hunter.UPGRADES_TIER_3 = [exports.preda, exports.poach];
exports.builder.UPGRADES_TIER_3 = [exports.construct, exports.autobuilder];

exports.machine.UPGRADES_TIER_2 = [
  exports.destroy,
  exports.gunner,
  exports.artillery,
];
exports.destroy.UPGRADES_TIER_3 = [exports.anni, exports.hybrid];
exports.gunner.UPGRADES_TIER_3 = [
  exports.autogunner,
  exports.mortar,
  exports.stream,
];
exports.artillery.UPGRADES_TIER_3 = [
  exports.mortar,
  exports.spread,
  exports.skimmer,
];
exports.machine.UPGRADES_TIER_3 = [exports.spray];

exports.flank.UPGRADES_TIER_2 = [
  exports.hexa,
  exports.tri,
  exports.auto3,
  exports.flanktrap,
];
exports.hexa.UPGRADES_TIER_3 = [exports.octo];
exports.tri.UPGRADES_TIER_3 = [
  exports.booster,
  exports.fighter,
  exports.bomber,
  exports.autotri,
];
exports.auto3.UPGRADES_TIER_3 = [exports.auto5, exports.heavy3];
exports.flanktrap.UPGRADES_TIER_3 = [
  exports.guntrap,
  exports.fortress,
  exports.bomber,
];