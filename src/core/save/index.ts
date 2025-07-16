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
  };
  buyables: {
    '11': Decimal;
  };
  automationCD: {
    next: number;
  };
  currentTab: number
}

function getInitialPlayerData(): Player {
  return {
    number: zero,
    totalNumber: zero,
    lastUpdated: Date.now(),
    saveCreateTime: Date.now(),
    upgrades: {
      '11': false,
      '12': false,
      '13': false,
    },
    buyables: {
      '11': zero,
    },
    automationCD: {
      next: 0,
    },
    currentTab: 0
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
      loadFromString(saveContent)
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
