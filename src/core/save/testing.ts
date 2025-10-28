import { sha256 } from 'js-sha256';

const code = '4a8bb172d4f075b03461c7e1d25ad35be5d2d5e83ddf5fdeaec81d51e56360c4';
const code2 = '81be4713dd7648632e7a7f6bd6cd730c811c6ef188c9adec9ed5a95f2c42c09a';
const salt = 'UkyBXtFiY0jL8ghg';

export function isTester() {
	const testcode = localStorage.getItem('testcode') ?? '';
	return sha256(salt.slice(0, 8) + testcode + salt.slice(8)) === code;
}

export function isDeveloper() {
	const devcode = localStorage.getItem('developercode') ?? '';
	return sha256(devcode) == code2;
}
