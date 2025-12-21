import { addNotify } from '@/components/notify';
import Decimal from 'break_eternity.js';
import { reactive, markRaw } from 'vue';

function isInvalid(x: Decimal) {
  return x.isNan() || !x.isFinite() || x.lt(0)
}

function isStrictInvalid(x: Decimal) {
  return x.isNan() || !x.isFinite()
}

const reactiveCache = new WeakMap<object, any>();

const allowNegativePath = ["player.nonrecu.spentTheories", "player.backup.nonrecu.spentTheories"]

function deepValidateObject(obj: any, path: string[] = []): boolean {
  if (obj === null || typeof obj !== 'object') {
    return true;
  }

  if (obj.__v_checked) {
    return true;
  }

  try {
    Object.defineProperty(obj, '__v_checked', {
      value: true,
      writable: false,
      configurable: true,
      enumerable: false
    });
  } catch {
    return true;
  }

  try {
    if (obj instanceof Decimal) {
      if (isInvalid(obj)) {
        if (allowNegativePath.includes(path.join('.'))) return !isStrictInvalid(obj)
        console.error(`Invalid Dec., path: ${path.join('.') || 'player'}`);
        console.error('Value:', obj.toString());
        return false;
      }
      return true;
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (!deepValidateObject(obj[i], [...path, `[${i}]`])) {
          return false;
        }
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key.startsWith('__v_')) continue;
          
          if (!deepValidateObject(obj[key], [...path, key])) {
            return false;
          }
        }
      }
    }

    return true;
  } finally {
    try {
      delete obj.__v_checked;
    } catch {
    }
  }
}

function createValidatedReactiveProxy(target: any, path: string = ''): any {
  if (reactiveCache.has(target)) {
    return reactiveCache.get(target);
  }

  if (target === null || typeof target !== 'object' || target instanceof Decimal) {
    return target;
  }

  if (target.__v_isReactive && target.__v_isValidated) {
    return target;
  }

  const reactiveTarget = reactive(target);

  Object.defineProperty(reactiveTarget, '__v_isValidated', {
    value: true,
    writable: false,
    configurable: true,
    enumerable: false
  });

  const proxy = new Proxy(reactiveTarget, {
    get(target, key, receiver) {
      if (key === '__v_raw') return target;
      if (key === '__v_isReactive') return true;
      if (key === '__v_isValidated') return true;

      const value = Reflect.get(target, key, receiver);

      if (value instanceof Decimal) {
        return markRaw(value);
      }

      if (value !== null && typeof value === 'object') {
        return createValidatedReactiveProxy(value, path ? `${path}.${String(key)}` : String(key));
      }

      return value;
    },

    set(target, key, value, receiver) {
      const keyStr = String(key);
      const currentPath = path ? `${path}.${keyStr}` : keyStr;

      let isValid = true;
      
      if (value instanceof Decimal) {
        if (isInvalid(value)) {
          if (!(allowNegativePath.includes(currentPath) && !isStrictInvalid(value))) {
            console.error(`Invalid Decimal at path: ${currentPath}`);
            console.error('Value:', value.toString());
            console.trace();
			addNotify(`Invalid Dec., path: ${currentPath}, value: ${value.toString()}`)
            return false;
          }
        }
      } else if (value !== null && typeof value === 'object') {
        if (!deepValidateObject(value, [currentPath])) {
			addNotify(`Invalid object at path: ${currentPath}`)
          console.error(`Invalid object at path: ${currentPath}`);
          console.trace();
          return false;
        }
      }

      let processedValue = value;
      
      if (value instanceof Decimal) {
        processedValue = markRaw(value);
      } else if (value !== null && typeof value === 'object') {
        processedValue = createValidatedReactiveProxy(value, currentPath);
      }

      const result = Reflect.set(target, key, processedValue, receiver);
      
      if (result && processedValue !== null && typeof processedValue === 'object') {
        reactiveCache.set(value, processedValue);
      }
      
      return result;
    },

    defineProperty(target, key, descriptor) {
      if (descriptor.value !== undefined) {
        const keyStr = String(key);
        const currentPath = path ? `${path}.${keyStr}` : keyStr;
        const value = descriptor.value;

        if (value instanceof Decimal) {
          if (isInvalid(value)) {
            if (!(allowNegativePath.includes(currentPath) && !isStrictInvalid(value))){
			addNotify(`Invalid Decimal in defineProperty at path: ${currentPath}, value: ${value.toString()}`)
            console.error(`Invalid Decimal in defineProperty at path: ${currentPath}`);
            return false;}
          }
          descriptor.value = markRaw(value);
        } else if (value !== null && typeof value === 'object') {
          if (!deepValidateObject(value, [currentPath])) {
			addNotify(`Invalid object in defineProperty at path: ${currentPath}`)
            console.error(`Invalid object in defineProperty at path: ${currentPath}`);
            return false;
          }
          descriptor.value = createValidatedReactiveProxy(value, currentPath);
        }
      }

      return Reflect.defineProperty(target, key, descriptor);
    },

    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      
      return result;
    }
  });

  const processExistingProperties = (obj: any, currentPath: string) => {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        if (item !== null && typeof item === 'object') {
          const itemPath = `${currentPath}[${i}]`;
          obj[i] = createValidatedReactiveProxy(item, itemPath);
        }
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && !key.startsWith('__v_')) {
          const value = obj[key];
          if (value !== null && typeof value === 'object' && !(value instanceof Decimal)) {
            const itemPath = currentPath ? `${currentPath}.${key}` : key;
            obj[key] = createValidatedReactiveProxy(value, itemPath);
          }
        }
      }
    }
  };

  processExistingProperties(reactiveTarget, path);

  reactiveCache.set(target, proxy);
  reactiveCache.set(reactiveTarget, proxy);

  return proxy;
}

export function createDeepValidatedReactive<T>(obj: T): T {
  if (!deepValidateObject(obj, ['player'])) {
    console.error('Initial object contains invalid values!');
    throw new Error('Initial object contains invalid Decimal values');
  }

  return createValidatedReactiveProxy(obj, "player") as T;
}
