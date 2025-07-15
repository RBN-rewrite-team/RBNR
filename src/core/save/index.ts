import Decimal from "break_eternity.js"
import {SaveSerializer} from "./serializer"
import {reactive} from "vue"

const SAVEID = "RBN-rewritten"

export interface Player{
  number: Decimal
  lastUpdated: number
  saveCreateTime: number
}

function getInitialPlayerData(): Player {
  return {
    number: new Decimal(0),
    lastUpdated: Date.now(),
    saveCreateTime: Date.now(),
  }
}

function rewriteDecimalValues(pl: any){
  for (const key in pl){
    if (typeof pl[key] === "string") {
      if (!Decimal.isNaN(pl[key])) {
        pl[key] = new Decimal(pl[key])
      }
    } else if (typeof pl[key] === "object") {
      rewriteDecimalValues(pl[key])
    }
  }
}

export let player: Player = getInitialPlayerData();

export function loadSaves() {
  player = getInitialPlayerData();
  const saveContent = localStorage.getItem(SAVEID);
  if (saveContent) {
    let deserialized = SaveSerializer.deserialize(saveContent);
    rewriteDecimalValues(deserialized);
    Object.assign(player, deserialized);
  }
  player = reactive(player);
}

export function save(){
  localStorage.setItem(SAVEID, SaveSerializer.serialize(player))
}
