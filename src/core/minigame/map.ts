import { WallGameObject, type GameObject } from './game-object';
const WGO = () => new WallGameObject();
const PLACEHOLDER = null;
export type SingleMap = {
	map: (GameObject | null)[][];
	spawnpoint: [number, number];
};
// prettier-ignore
export const maps: SingleMap[] = [
    {
        map: [
            new Array(26).fill(null).map(()=>WGO()),
            [WGO(), null,null,null,null,WGO(),null,null,null,WGO(),null,null,null,null,PLACEHOLDER, WGO(),null,PLACEHOLDER,WGO(),PLACEHOLDER,null,WGO()],
            [WGO(), null, WGO(), WGO(), null, WGO(), WGO(), WGO()]
        ],
        spawnpoint: [1,1]
    }
];
