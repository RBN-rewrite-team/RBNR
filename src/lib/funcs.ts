import type Decimal from 'break_eternity.js';

export function unwrapDecimalValue(x: Decimal | (() => Decimal)): Decimal {
	if (typeof x == 'function') {
		return x();
	}

	return x;
}

export function numberToChinese(e: number): string {
  if ("" == (e = (e = e.toString().replace(/,/g, "")).replace(/^0+/, ""))) return "零";
  if (isNaN(e)) return "错误：不是数字";
  var r = "";
  e.length > 1 && (0 == e.indexOf("-") && (e = e.replace("-", ""), r = "负"), 0 == e.indexOf("+") && (e = e.replace("+", "")));
  var t, n, a, l, i, u, m, c, g, h, f, o = "",
    p = "",
    x = "undefined" == typeof maxDec || null == maxDec || Number(maxDec) < 0 || Number(maxDec) > 5;
  if ((n = e.split(".")).length > 1) {
    o = n[0], p = n[1], x && (maxDec = p.length > 5 ? 5 : p.length);
    var b = Number("0." + p);
    b *= Math.pow(10, maxDec), b = Math.round(Math.abs(b));
    var N = (b /= Math.pow(10, maxDec)).toString().split(".");
    1 == Number(N[0]) && (o = (Number(o) + 1).toString()), p = N.length > 1 ? N[1] : ""
  } else o = e, p = "", x && (maxDec = 0);
  if (o.length > 44) return "错误：数值过大！";
  if (a = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九"), l = new Array("", "十", "百", "千"), i = new Array("", "万", "亿", "兆", "京", "垓", "杼", "穰", "沟", "涧", "正"), t = "", Number(o) > 0)
    for (u = 0, m = 0; m < o.length; m++) h = (c = o.length - m - 1) / 4, f = c % 4, "0" == (g = o.substr(m, 1)) ? u++ : (u > 0 && (t += a[0]), u = 0, t += a[Number(g)] + l[f]), 0 == f && u < 4 && (t += i[h]);
  return (t = "" + r + t).replace("一十", "十")
}
