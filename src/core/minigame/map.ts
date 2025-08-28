import { WallGameObject, type GameObject } from './game-object';
const WGO = () => new WallGameObject();
const PLACEHOLDER = null;
export type SingleMap = {
	map: (GameObject | null)[][];
	spawnpoint: [number, number];
};
function convertStringToMap(x: string, slots?: GameObject[]) {
	let map = [];
	let placeholdercount = 0;
	for (let i = 0; i < x.length; i++) {
		if (x[i] == 'W') {
			map.push(WGO());
		}
		if (x[i] == '0') {
			map.push(null);
		}
		if (x[i] == 'P') {
			map.push(slots?.[placeholdercount++] ?? null);
		}
	}
	return map;
}
// prettier-ignore
export const maps: SingleMap[] = [
    {
        map: [
            convertStringToMap('WWWWWWWWWWWWWWWWWWWWWWWWWW'),
            convertStringToMap('W0000W000W0000PW0PWP0W000W'),
            convertStringToMap('W0WW0WWW0W0W0WWW0W0W0W0P0W'),
            convertStringToMap('W0W000000W0W000W00P00W0P0W'),
            convertStringToMap('W0WWWWWW0W0W0P0W0WPW0W000W'),
            
            convertStringToMap('W00PWW000WPW000WWWPWWWWPWW'),
            convertStringToMap('WWWWWW0WWWWWW0WW00000W0P0W'),
            convertStringToMap('W00000000000000WPW0W0P000W'),
            convertStringToMap('W0WWWWWWWWWWWWWW0W0W0WWWWW'),
            convertStringToMap('W0W000W000P00PPWPW0W00P00P'),
            
            convertStringToMap('W0W0P0W0W0WWPWWWPW0W0WWWWW'),
            convertStringToMap('W0W00000W0WW0WWWPW0W00000W'),
            convertStringToMap('W0WWWWWWW0WW0WWW0W0WWWW00W'),
            convertStringToMap('W0WP0000P0WW0WWWPW0000000W'),
            convertStringToMap('WPWWWWWWW0WWPWWWPWWWWWWW0P'),
            
            convertStringToMap('WWWWWWWWW0WWWWWWPPPPPPWP0W'),
            convertStringToMap('WWWWWWWWWWWWWWWWWWWWWWWWWW'),
        ],
        spawnpoint: [1,1]
    }
];
