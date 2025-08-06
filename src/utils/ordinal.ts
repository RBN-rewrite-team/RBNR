import Decimal from 'break_eternity.js'
import {formatWhole} from './format'
import { displayOrd } from "../lib/ordinal/index.ts"

export const OrdinalUtils = {
  numberToOrdinal(x: Decimal, base: Decimal): string {
    return displayOrd(x, base)
  },
}