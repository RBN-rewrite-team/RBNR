import Decimal from 'break_eternity.js';
import type { DecimalSource } from 'break_eternity.js';
import { diff } from "@/core/game-loop"
function exponentialFormat(num: Decimal, precision: number, mantissa = true): string {
  let e = num.log10().floor();
  let m = num.div(Decimal.pow(10, e));
  if (num.gte('ee9')) mantissa = false;
  if (m.toStringWithDecimalPlaces(precision) == (10).toFixed(precision)) {
    m = new Decimal(1);
    e = e.add(1);
  }
  let s = e.gte(1e9)
    ? format(e, 3)
    : e.gte(10000)
      ? commaFormat(e, 0)
      : e.toStringWithDecimalPlaces(0);
  if (mantissa) return m.toStringWithDecimalPlaces(precision) + 'e' + s;
  else return 'e' + s;
}

function commaFormat(num: Decimal, precision: number) {
  if (num === null || num === undefined) return 'NaN';
  if (num.mag < 0.001) return (0).toFixed(precision);
  let init = num.toStringWithDecimalPlaces(precision);
  let portions = init.split('.');
  portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  if (portions.length == 1) return portions[0];
  return portions[0] + '.' + portions[1];
}

function regularFormat(num: Decimal, precision: number) {
  if (num === null || num === undefined) return 'NaN';
  if (num.mag < 0.0001) return (0).toFixed(precision);
  if (num.mag < 0.1 && precision !== 0) precision = Math.max(precision, 4);
  return num.toStringWithDecimalPlaces(precision);
}

export function format(decimal: DecimalSource, precision = 3): string {
  decimal = new Decimal(decimal);
  if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
    return 'NaN';
  }
  if (decimal.sign < 0) return '-' + format(decimal.neg(), precision);
  if (decimal.mag == Number.POSITIVE_INFINITY) return 'Infinity';
  if (decimal.gte('eeee1000')) {
    var slog = decimal.slog();
    if (slog.gte(1e6)) return 'F' + format(slog.floor());
    else
      return (
        Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) +
        'F' +
        commaFormat(slog.floor(), 0)
      );
  } else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision);
  else if (decimal.gte(1e3)) return commaFormat(decimal, 0);
  else if (decimal.gte(0.001)) return regularFormat(decimal, precision);
  else if (decimal.gte('eeee-1000')) return exponentialFormat(decimal, precision);
  else if (decimal.gt(0)) return '1/' + format(decimal.recip());
  else return (0).toFixed(precision);
}

export function formatWhole(decimal: DecimalSource) {
  decimal = new Decimal(decimal);
  if (decimal.gte(1e9)) return format(decimal, 3);
  if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 3);
  return format(decimal, 0);
}

export function formatTime(s: number) {
  if (s < 1) return formatWhole(Math.floor(s * 1000)) + '毫秒';
  else if (s < 60)
    return formatWhole(Math.floor(s)) + '秒' + formatWhole(Math.floor((s % 1) * 1000)) + '毫秒';
  else if (s < 3600)
    return (
      formatWhole(Math.floor(s / 60)) +
      '分' +
      formatWhole(Math.floor(s) % 60) +
      '秒' +
      formatWhole(Math.floor((s % 1) * 1000)) +
      '毫秒'
    );
  else if (s < 86400)
    return (
      formatWhole(Math.floor(s / 3600)) +
      '时' +
      formatWhole(Math.floor(s / 60) % 60) +
      '分' +
      formatWhole(Math.floor(s) % 60) +
      '秒' +
      formatWhole(Math.floor((s % 1) * 1000)) +
      '毫秒'
    );
  else if (s < 31536000)
    return (
      formatWhole(Math.floor(s / 86400) % 365) +
      '天' +
      formatWhole(Math.floor(s / 3600) % 24) +
      '时' +
      formatWhole(Math.floor(s / 60) % 60) +
      '分' +
      formatWhole(Math.floor(s) % 60) +
      '秒' +
      formatWhole(Math.floor((s % 1) * 1000)) +
      '毫秒'
    );
  else
    return (
      formatWhole(Math.floor(s / 31536000)) +
      '年' +
      formatWhole(Math.floor(s / 86400) % 365) +
      '天' +
      formatWhole(Math.floor(s / 3600) % 24) +
      '时' +
      formatWhole(Math.floor(s / 60) % 60) +
      '分' +
      formatWhole(Math.floor(s) % 60) +
      '秒' +
      formatWhole(Math.floor((s % 1) * 1000)) +
      '毫秒'
    );
}

export function formatGain(a: DecimalSource, e: DecimalSource, resourceName: string = '') {
  a = new Decimal(a)
  e = new Decimal(e)
  const FPS = 1000 / (diff || 40)
  const g = Decimal.add(a, e.div(FPS))

  if (g.neq(a)) {
    if (a.gte(Decimal.tetrate(10, 6))) {
      var oom = new Decimal(g).slog(10).sub(new Decimal(a).slog(10)).mul(FPS)
      if (oom.gte(1e-3)) return format(oom) + '数量级<sup>数量级</sup>'
    }

    if (a.gte('ee100')) {
      let tower = Math.floor(new Decimal(a).slog(10).toNumber() - 1.3010299956639813)

      var oom = new Decimal(g).iteratedlog(10, tower).sub(new Decimal(a).iteratedlog(10, tower)).mul(FPS),
        rated = false

      if (oom.gte(1)) rated = true
      else if (tower > 2) {
        tower--
        oom = new Decimal(g).iteratedlog(10, tower).sub(new Decimal(a).iteratedlog(10, tower)).mul(FPS)
        if (oom.gte(1)) rated = true
      }

      if (rated) return format(oom) + '数量级<sup>' + tower + "</sup>"
    }

    if (a.gte(1e100)) {
      const oom = g.div(a).log10().mul(FPS)
      if (oom.gte(1)) return format(oom) + '数量级'
    }
  }

  return format(e) + resourceName
}
