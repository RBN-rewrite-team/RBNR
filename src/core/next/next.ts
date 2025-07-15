import {player} from "../save";

export const NEXT = {
	doNext(){
		player.number = player.number.add(1);
	},
	autoNextPerSecond(){
		let base = new Decimal(0);
		return base;
	},
};