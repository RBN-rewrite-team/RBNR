import Decimal from "break_eternity.js"
import {saveSerializer} from "./serializer"
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
  try{
    if (saveContent) {
      let deserialized = saveSerializer.deserialize(saveContent);
      rewriteDecimalValues(deserialized);
      Object.assign(player, deserialized);
    }
  } catch {
    console.error("Cannot load save")
  }
  player = reactive(player);
}

export function save(){
  localStorage.setItem(SAVEID, saveSerializer.serialize(player))
}
