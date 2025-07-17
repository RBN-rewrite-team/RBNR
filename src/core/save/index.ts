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
  firstResetBit: number;
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
    firstResetBit: 0
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

export function deepCopyProps(source: any, target: any) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // 如果源对象的属性是对象或数组，则递归复制
      if (
        typeof source[key] === 'object' &&
        !(source[key] instanceof Decimal) &&
        source[key] !== null
      ) {
        // 如果目标对象没有这个属性，或者属性是null，则创建一个新的
        if (
          !target.hasOwnProperty(key) ||
          target[key] == null ||
          Array.isArray(source[key]) !== Array.isArray(target[key])
        ) {
          target[key] = Array.isArray(source[key]) ? [] : {}
        }
        // 递归复制属性
        deepCopyProps(source[key], target[key])
      } else {
        // 如果属性不是对象或数组，则直接复制
        target[key] = source[key]
      }
    }
  }
}
export let player: Player = getInitialPlayerData();

export function loadFromString(saveContent: string) {
  let deserialized = saveSerializer.deserialize(saveContent);
  rewriteDecimalValues(deserialized);
  deepCopyProps(deserialized, player);
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
