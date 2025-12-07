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
{
    id: "a131",
    text:
      `Warning - We have just been informed that there is a chance of infection with a mind-virus of the Basilisk
      type, similar to the infamous winking parrot. This particular example is known as 'Fractal Disease Type III'.
      This is believed to cause a 'crashing' of the mind, similar to a computer crash, due to the mathematical
      complexity of the image causing mathematical ideas that the mind can't comprehend, a Gondelian shock input
      eventually leading to crashing through Gondelian spoilers. All who have researched it have eventually died
      the same way, so it is impossible to tell exactly, but this is the common belief. Regardless, with the
      introduction of 'design' mode, as well as reports of it's spontaneous appearance, sufficient repetition
      of this mode's appearance may lead to an image forming in the mind similar to 'Fractal Disease Type III'.
      With this in mind, we have some suggestions if you find yourself plagued with it. First, refresh immediately
      and see if that fixes the issue. If not, navigate to options, and change the theme from design to literally
      anything else. And above all else, Godspeed. We can't afford to lose anymore viewers.`
  },
  {
    id: "a132",
    text: "If I have bad English, I'll study English until I have good English."
  },
  {
    id: "a133",
    text:
      `Someone once told me that antimatter is gonna roll me. I ain't the sharpest atom in the shed. WELL, the
      tubes start coming and they don't stop coming...`
  },
  
  {
    id: "l71",
    text: "Other languages await... I need to become a programmer",
  },
] as const satisfies {
    id: string;
    text: string;
    unlocked?(): boolean;
    dynamic?: boolean;
    reset?: () => void;
    onClick?: () => string | undefined;
}[];
export default news;
