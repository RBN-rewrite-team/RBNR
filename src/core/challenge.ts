import {feature} from "./global"
import {MULTI_CHALS} from "./multiplication/challenges";
export interface SingleChallenge {
  name: string;
  descEasy: string;
  descHard: string;


}
export const CHALLENGE: {
  resetFunctions: (()=>void)[];
  challenges: SingleChallenge[][]
} = {
  resetFunctions: [
    function() {
      feature.MULTIPLICATION.reset(true);
    }
  ],
  challenges: [
    MULTI_CHALS
  ] as const,
}
