import { player } from './save';

// prettier-ignore
const news = [
{id: "newsen1", text: "I tried to make an incremental game with AI. As a result, bugs are more than features."},
{id: "newsen2", text: "<img src='baixie.png' /><img src='baixie.png' /><img src='baixie.png' />"},
{id: "newsen3", text: "AD16 mod 2 = 1"},
{id: "newsen4", text: "<span style='color: #7289da; background: rgba(250,166,26,0.2); cursor: text;'>@everyone</span>"},
{id: "newsen5", text: "Phy Soc is the last layer of this game."},
{id: "newsen6", text: "The first one is always <i>free</i> fake."},
{id: "newsen8", text: "Vorona said: antiest-booster gainest"},
{id: "newsen9", text: "IMR is back"},
{id: "newsen10", text: "LHO=(ω→ω→LRO)_2"},
{id: "newsen11", text: "Update after 5^5 hours"},
{id: "newsen14", text: "Don't you already have two of these?"},
{id: "newsen16", text: "<span style=\"color: rgb(0, 225, 255)\">After <b>F1.7977e308</b> of mass gain will softcap^8 mass gain!</span>"},

] as const satisfies {
    id: string;
    text: string;
    unlocked?(): boolean;
    dynamic?: boolean;
    reset?: () => void;
    onClick?: () => string | undefined;
}[];
export default news;
