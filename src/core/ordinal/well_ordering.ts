import { Upgrade, UpgradeWithEffect } from '../upgrade';
import { Buyable } from '../buyable';
import { getCurrency, Currencies } from '../currencies';
import { format, formatWhole } from '@/utils/format';
import { upgrades, buyables } from '../mechanic';
import Decimal from 'break_eternity.js';
import { player } from '../save';

export const WellOrderingBuyables = [] as const