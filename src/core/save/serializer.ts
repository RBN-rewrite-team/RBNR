import type {Player} from ".";

export class SaveSerializer {
  static serialize(pl: Player) {
    return btoa(JSON.stringify(pl))
  } 
  static deserialize(pl: string): any {
    return JSON.parse(atob(pl));
  }
}
