import { player } from './save';

// prettier-ignore
const news = [
{id: "newsen1", text: "I tried to make an incremental game with AI. As a result, bugs are more than features."},
{id: "newsen2", text: "<img src='baixie.png' /><img src='baixie.png' /><img src='baixie.png' />"},
{id: "newsen3", text: "AD16 mod 2 = 1"},
{id: "newsen4", text: "Did you know? Bourgain proved Δ(x)=O(x^517/1648+ε), but it's wrong.Think about him if you do your maths wrong."},
{id: "newsen5", text: "Phy Soc is the last layer of this game."},
{id: "newsen6", text: "The first one is always <i>free</i> fake."},
{id: "newsen7", text: "<b>Big paniç</b>"},
{id: "newsen8", text: "Vorona said: antiest-booster gainest"},
{id: "newsen9", text: "IMR is back"},
{id: "newsen10", text: "LHO=(ω→ω→LRO)_2"},
{id: "newsen11", text: "Update after 5^5 hours"},
{id: "newsen12", text: "Darkest night, I'll confront you here"},
{id: "newsen13", text: "P¤1-t2~u~ér.2-_/io~/5é &-cnh-"},
{id: "newsen14", text: "Don't you already have two of these?"},
{id: 'newsen15', text: "37 users in this group, they'll become 37 corpse tomorrow...No, 3.7×10<sup>9</sup>."},
{id: "newsen16", text: "<span style=\"color: rgb(0, 225, 255)\">After <b>F1.7977e308</b> of mass gain will softcap^8 mass gain!</span>"},
{id: "newsen17", text:"你好"}
] as const satisfies {
    id: string;
    text: string;
    unlocked?(): boolean;
    dynamic?: boolean;
    reset?: () => void;
    onClick?: () => string | undefined;
}[];
export default news;
