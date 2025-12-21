import Decimal from 'break_eternity.js';
import { reactive, shallowReactive } from 'vue';

function isInvalid(x: Decimal) {
  return x.isNan() || !x.isFinite() || x.lt(0);
}

const proxyCache = new WeakMap<object, any>();

function createProxy(target: any): any {
  if (proxyCache.has(target)) {
    return proxyCache.get(target);
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === '__v_raw' || key === '__v_isReactive') {
        return Reflect.get(target, key, receiver);
      }
      
      const value = Reflect.get(target, key, receiver);
      
      if (value instanceof Decimal) {
        return value;
      }
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        if (value.__v_isReactive) {
          return value;
        }
        return createProxy(value);
      }
      
      return value;
    },
    set(target, key, value, receiver) {
      if (value instanceof Decimal && isInvalid(value)) {
        console.error(`The game find something suspicious is writing invalid value`);
        console.error(`Target: `, target, `, Key:`, key);
        console.error(
          'If you see this, it means the game may meet problems and needs to checked',
        );
        console.error(value.toString());
        console.trace();
        return true;
      }

      let processedValue = value;
      if (value !== null && typeof value === 'object' && !(value instanceof Decimal)) {
        if (!value.__v_isReactive) {
          processedValue = createProxy(value);
        }
      }

      const result = Reflect.set(target, key, processedValue, receiver);
      
      if (processedValue !== value && processedValue !== null && typeof processedValue === 'object') {
        proxyCache.delete(processedValue);
      }
      
      return result;
    },
  });

  proxyCache.set(target, proxy);
  return proxy;
}

export function createDeepValidatedReactive<T>(obj: T): T {
  const reactiveObj = reactive(obj as object);
  
  return createProxy(reactiveObj);
}
