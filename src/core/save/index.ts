import Decimal from 'break_eternity.js';
import { saveSerializer } from './serializer';
import { reactive } from 'vue';

const SAVEID = 'RBN-rewritten';

const zero = new Decimal(0);

export interface Player {
  number: Decimal;
  totalNumber: Decimal;
  lastUpdated: number;
  saveCreateTime: number;
  upgrades: {
    '11': boolean;
    '12': boolean;
    '13': boolean;
    '21': boolean;
    '22': boolean;
    '23': boolean;
    '24': boolean;
    '25': boolean;
    '26': boolean;
  };
  buyables: {
    '11': Decimal;
    '21': Decimal;
  };
  buyable11More: Decimal;
  automationCD: {
    successor: number;
  };
  currentTab: number;
  addpower: Decimal;
  totalAddpower: Decimal;
}

function getInitialPlayerData(): Player {
  return {
    number: zero,
    totalNumber: zero,
    lastUpdated: Date.now(),
    saveCreateTime: Date.now(),
    addpower: zero,
    upgrades: {
      '11': false,
      '12': false,
      '13': false,
      '21': false,
      '22': false,
      '23': false,
      '24': false,
      '25': false,
      '26': false,
    },
    buyables: {
      '11': zero,
      '21': zero,
    },
    buyable11More: zero,
    automationCD: {
      successor: 0,
    },
    currentTab: 0,
    totalAddpower: zero,
  };
}

function rewriteDecimalValues(pl: any) {
  for (const key in pl) {
    if (typeof pl[key] === 'string') {
      if (!Decimal.isNaN(pl[key])) {
        pl[key] = new Decimal(pl[key]);
      }
    } else if (typeof pl[key] === 'object') {
      rewriteDecimalValues(pl[key]);
    }
  }
}

export let player: Player = getInitialPlayerData();

export function loadFromString(saveContent: string) {
  let deserialized = saveSerializer.deserialize(saveContent);
  rewriteDecimalValues(deserialized);
  Object.assign(player, deserialized);
}

export function loadSaves() {
  player = getInitialPlayerData();
  const saveContent = localStorage.getItem(SAVEID);
  try {
    if (saveContent) {
      loadFromString(saveContent);
    }
  } catch {
    console.error('Cannot load save');
  }
  player = reactive(player);
}

export function save() {
  localStorage.setItem(SAVEID, saveSerializer.serialize(player));
}

export function hardReset() {
  player = getInitialPlayerData();
  save();
  location.reload();
}
