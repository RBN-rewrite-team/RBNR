import { player } from './save';

// prettier-ignore
const news = [
{id: "news3", text: "I tried to make an incremental game with AI. As a result, bugs are more than features."},
{id: "news5", text: "<img src='baixie.png' /><img src='baixie.png' /><img src='baixie.png' />"},
{id: "news16", text: "AD16 mod 2 = 1"},
{id: "news17", text: "Did you know? Bourgain proved Δ(x)=O(x^517/1648+ε), but it's wrong. You can think about him if you do your maths wrong."},
{id: "news31", text: "Phy Soc is the last layer of this game."},
{id: "news35", text: "The first one is always <i>free</i> fake."},
{id: "news43", text: "<b>Big paniç</b>"},
{id: "news54", text: "Vorona said: antiest-booster gainest"},
{id: "news65", text: "IMR is back"},
{id: "news68", text: "LHO=(ω→ω→LRO)_2"},
{id: "news74", text: "Update after 5^5 hours"},
{id: "news79", text: "Darkest night, I'll confront you here"},
{id: "news80", text: "Make anything(except bad things) great again"},
{id: "news91", text: "Don't you already have two of these?"}
] as const satisfies {
    id: string;
    text: string;
    unlocked?(): boolean;
    dynamic?: boolean;
    reset?: () => void;
    onClick?: () => string | undefined;
}[];
export default news;
