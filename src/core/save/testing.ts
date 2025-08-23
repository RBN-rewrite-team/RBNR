import { sha256 } from 'js-sha256';

let code = "4a8bb172d4f075b03461c7e1d25ad35be5d2d5e83ddf5fdeaec81d51e56360c4"

const salt = "UkyBXtFiY0jL8ghg"

export function isTester() {
  const testcode = localStorage.getItem("testcode") ?? ""
  return sha256(salt.slice(0,8)+testcode+salt.slice(8)) === code
}