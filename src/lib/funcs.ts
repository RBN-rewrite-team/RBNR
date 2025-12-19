import type Decimal from 'break_eternity.js';

export function unwrapDecimalValue(x: Decimal | (() => Decimal)): Decimal {
	if (typeof x == 'function') {
		return x();
	}

	return x;
}

const CHINESE_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const SMALL_UNITS = ['', '十', '百', '千'];
const LARGE_UNITS = ['', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极'];
const MAX_INTEGER_LENGTH = 52;
const DEFAULT_MAX_DECIMALS = 3;

export function numberToChinese(num: number): string {
  let numberStr = num.toLocaleString().replace(/,/g, '').replace(/^0+/, '');
  
  if (numberStr === '') return '零';
  if (isNaN(Number(numberStr))) throw new Error('不是数字');
  
  let sign = '';
  if (numberStr.length > 1) {
    if (numberStr.startsWith('-')) {
      numberStr = numberStr.substring(1);
      sign = '负';
    } else if (numberStr.startsWith('+')) {
      numberStr = numberStr.substring(1);
    }
  }
  
  const parts = numberStr.split('.');
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? parts[1] : '';
  
  if (decimalPart) {
    let maxDecimals = DEFAULT_MAX_DECIMALS;
    if (decimalPart.length > maxDecimals) {
      maxDecimals = Math.min(decimalPart.length, DEFAULT_MAX_DECIMALS);
    }
    
    const decimalNumber = Number('0.' + decimalPart);
    const roundedDecimal = Math.round(decimalNumber * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
    const roundedParts = roundedDecimal.toString().split('.');
    
    if (Number(roundedParts[0]) === 1) {
      integerPart = (Number(integerPart) + 1).toString();
    }
    
    decimalPart = roundedParts.length > 1 ? roundedParts[1] : '';
  }
  
  if (integerPart.length > MAX_INTEGER_LENGTH) {
    throw new Error('数值过大！');
  }
  
  let chineseNumber = '';
  let zeroCount = 0;
  
  for (let i = 0; i < integerPart.length; i++) {
    const digitChar = integerPart.charAt(i);
    const digitValue = Number(digitChar);
    const positionFromRight = integerPart.length - i - 1;
    
    const largeUnitIndex = Math.floor(positionFromRight / 4);
    const smallUnitIndex = positionFromRight % 4;
    
    if (digitValue === 0) {
      zeroCount++;
    } else {
      if (zeroCount > 0) {
        chineseNumber += CHINESE_DIGITS[0];
      }
      zeroCount = 0;
      
      chineseNumber += CHINESE_DIGITS[digitValue] + SMALL_UNITS[smallUnitIndex];
    }
    
    if (smallUnitIndex === 0 && zeroCount < 4) {
      chineseNumber += LARGE_UNITS[largeUnitIndex];
    }
  }
  
  let result = sign + chineseNumber;
  
  result = result.replace(/^一十/, '十');
  
  result = result.replace(/零+/g, '零');
  
  if (result === '' || result === sign) {
    return sign + '零';
  }
  
  return result;
}