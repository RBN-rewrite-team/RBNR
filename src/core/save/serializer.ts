import { deflate, inflate } from 'pako';

function simpleEncrypt(data: Uint8Array, key: string): Uint8Array {
	const keyBytes = new TextEncoder().encode(key);
	return new Uint8Array(data.map((byte, index) => byte ^ keyBytes[index % keyBytes.length]));
}

function simpleDecrypt(data: Uint8Array, key: string): Uint8Array {
	return simpleEncrypt(data, key);
}

export const saveSerializer = {
	encoder: new TextEncoder(),
	decoder: new TextDecoder(),

	legacyStartString: 'RBNSaveFile',
	newStartString: 'RBNRNewSaveFileFormat',
	endString: 'EndOfSaveFile',

	encryptionKey: 'The Encryption Key to encrypt the save!!!bxbxbx',

	newSteps: [
		{
			serialize: (x: object | unknown[] | string) => JSON.stringify(x),
			deserialize: (x: string) => JSON.parse(x),
		},
		{
			serialize: (x: string) => saveSerializer.encoder.encode(x),
			deserialize: (x: Uint8Array) => saveSerializer.decoder.decode(x),
		},
		{
			serialize: (x: Uint8Array) => deflate(x),
			deserialize: (x: Uint8Array) => inflate(x),
		},
		// 数据加密
		{
			serialize: function (x: Uint8Array): Uint8Array {
				return simpleEncrypt(x, saveSerializer.encryptionKey);
			},
			deserialize: function (x: Uint8Array): Uint8Array {
				return simpleDecrypt(x, saveSerializer.encryptionKey);
			},
		},
		// 数据混淆
		{
			serialize: function (x: Uint8Array): Uint8Array {
				const result = new Uint8Array(x.length);
				for (let i = 0; i < x.length; i++) {
					const newPos = (i * 7 + 13) % x.length;
					result[newPos] = x[i];
				}
				return result;
			},
			deserialize: function (x: Uint8Array): Uint8Array {
				const result = new Uint8Array(x.length);
				for (let i = 0; i < x.length; i++) {
					const originalPos = (i * 7 + 13) % x.length;
					result[i] = x[originalPos];
				}
				return result;
			},
		},
		{
			serialize: function (x: Uint8Array): string {
				return Array.from(x)
					.map((byte: number) => String.fromCharCode(byte))
					.join('');
			},
			deserialize: function (x: string): Uint8Array {
				return Uint8Array.from(Array.from(x).map((char: string) => char.charCodeAt(0)));
			},
		},
		{
			serialize: (x: string) => btoa(x),
			deserialize: (x: string) => atob(x),
		},
		{
			serialize: (x: string) =>
				x.replace(/=+$/g, '').replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
			deserialize: (x: string) =>
				x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
		},
		{
			serialize: (x: string) => saveSerializer.newStartString + x + saveSerializer.endString,
			deserialize: (x: string) =>
				x.slice(saveSerializer.newStartString.length, -saveSerializer.endString.length),
		},
	],
	legacySteps: [
		{
			serialize: (x: object | unknown[] | string) => JSON.stringify(x),
			deserialize: (x: string) => JSON.parse(x),
		},
		{
			serialize: (x: string) => saveSerializer.encoder.encode(x),
			deserialize: (x: Uint8Array) => saveSerializer.decoder.decode(x),
		},
		{
			serialize: (x: Uint8Array) => deflate(x),
			deserialize: (x: Uint8Array) => inflate(x),
		},
		{
			serialize: function (x: Uint8Array): string {
				return Array.from(x)
					.map((byte: number) => String.fromCharCode(byte))
					.join('');
			},
			deserialize: function (x: string): Uint8Array {
				return Uint8Array.from(Array.from(x).map((char: string) => char.charCodeAt(0)));
			},
		},
		{
			serialize: (x: string) => btoa(x),
			deserialize: (x: string) => atob(x),
		},
		{
			serialize: (x: string) =>
				x.replace(/=+$/g, '').replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
			deserialize: (x: string) =>
				x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
		},
		{
			serialize: (x: string) =>
				saveSerializer.legacyStartString + x + saveSerializer.endString,
			deserialize: (x: string) =>
				x.slice(saveSerializer.legacyStartString.length, -saveSerializer.endString.length),
		},
	],

	serialize(s: any) {
		return this.newSteps.reduce((x, f) => f.serialize(x), s);
	},

	deserialize(s: any) {
		if (typeof s === 'string') {
			if (s.startsWith(saveSerializer.newStartString)) {
				return this.newSteps.reduceRight((x, f) => f.deserialize(x), s);
			} else if (s.startsWith(saveSerializer.legacyStartString)) {
				return this.legacySteps.reduceRight((x, f) => f.deserialize(x), s);
			}
		}
		throw new Error('无法识别的存档格式');
	},

	getSaveVersion(s: string): 'legacy' | 'new' | 'unknown' {
		if (s.startsWith(saveSerializer.newStartString)) return 'new';
		if (s.startsWith(saveSerializer.legacyStartString)) return 'legacy';
		return 'unknown';
	},

	upgradeLegacySave(legacySave: string): string {
		const data = this.legacySteps.reduceRight((x, f) => f.deserialize(x), legacySave);
		return this.newSteps.reduce((x, f) => f.serialize(x), data);
	},
} as const;
