import Notations from '@veryrrdefine/powiainanum-notations';
import type { PowiainaNumSource } from 'powiaina_num.js';
import PowiainaNum from 'powiaina_num.js';
const fghjnotation = new Notations.FGHJNotation();
export function formatP(x: PowiainaNumSource, prec: number = 4) {
	return fghjnotation.format(new PowiainaNum(x), prec);
}
