import { deflate, inflate } from 'pako';

function simpleEncrypt(data: Uint8Array, key: string): Uint8Array {
	const keyBytes = new TextEncoder().encode(key);
	return new Uint8Array(data.map((byte, index) => byte ^ keyBytes[index % keyBytes.length]));
}

function simpleDecrypt(data: Uint8Array, key: string): Uint8Array {
	return simpleEncrypt(data, key);
}

type SerializeStep = {
	serialize: (x: any) => any;
	deserialize: (x: any) => any;
};

export const saveSerializer = {
	encoder: new TextEncoder(),
	decoder: new TextDecoder(),

	legacyStartString: 'RBNSaveFile',
	newStartString: 'RBNRNewSaveFileFormat',
	newStartStringV2: 'RBNRNewSaveFileFormatV2', // 新版本标识
	endString: 'EndOfSaveFile',

	encryptionKey: 'The Encryption Key to encrypt the save!!!bxbxbx',

	// 新版步骤（使用有问题的混淆函数，保持兼容）
	newSteps: [
		{
			serialize: (x: object | unknown[] | string): string => JSON.stringify(x),
			deserialize: (x: string): any => JSON.parse(x),
		},
		{
			serialize: (x: string): Uint8Array => saveSerializer.encoder.encode(x),
			deserialize: (x: Uint8Array): string => saveSerializer.decoder.decode(x),
		},
		{
			serialize: (x: Uint8Array): Uint8Array => deflate(x),
			deserialize: (x: Uint8Array): Uint8Array => inflate(x),
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
		// 数据混淆（旧版，有问题的实现，保持兼容）
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
			serialize: (x: string): string => btoa(x),
			deserialize: (x: string): string => atob(x),
		},
		{
			serialize: (x: string): string =>
				x.replace(/=+$/g, '').replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
			deserialize: (x: string): string =>
				x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
		},
		{
			serialize: (x: string): string => saveSerializer.newStartString + x + saveSerializer.endString,
			deserialize: (x: string): string =>
				x.slice(saveSerializer.newStartString.length, -saveSerializer.endString.length),
		},
	] as SerializeStep[],
	
	newStepsV2: [
		{
			serialize: (x: object | unknown[] | string): string => JSON.stringify(x),
			deserialize: (x: string): any => JSON.parse(x),
		},
		{
			serialize: (x: string): Uint8Array => saveSerializer.encoder.encode(x),
			deserialize: (x: Uint8Array): string => saveSerializer.decoder.decode(x),
		},
		{
			serialize: (x: Uint8Array): Uint8Array => deflate(x),
			deserialize: (x: Uint8Array): Uint8Array => inflate(x),
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
		// 数据混淆（新版，使用XOR确保可逆）
		{
			serialize: function (x: Uint8Array): Uint8Array {
				const result = new Uint8Array(x.length);
				for (let i = 0; i < x.length; i++) {
					result[i] = x[i] ^ ((i * 7 + 13) & 0xFF);
				}
				return result;
			},
			deserialize: function (x: Uint8Array): Uint8Array {
				const result = new Uint8Array(x.length);
				for (let i = 0; i < x.length; i++) {
					result[i] = x[i] ^ ((i * 7 + 13) & 0xFF);
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
			serialize: (x: string): string => btoa(x),
			deserialize: (x: string): string => atob(x),
		},
		{
			serialize: (x: string): string =>
				x.replace(/=+$/g, '').replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
			deserialize: (x: string): string =>
				x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
		},
		{
			serialize: (x: string): string => saveSerializer.newStartStringV2 + x + saveSerializer.endString,
			deserialize: (x: string): string =>
				x.slice(saveSerializer.newStartStringV2.length, -saveSerializer.endString.length),
		},
	] as SerializeStep[],
	
	legacySteps: [
		{
			serialize: (x: object | unknown[] | string): string => JSON.stringify(x),
			deserialize: (x: string): any => JSON.parse(x),
		},
		{
			serialize: (x: string): Uint8Array => saveSerializer.encoder.encode(x),
			deserialize: (x: Uint8Array): string => saveSerializer.decoder.decode(x),
		},
		{
			serialize: (x: Uint8Array): Uint8Array => deflate(x),
			deserialize: (x: Uint8Array): Uint8Array => inflate(x),
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
			serialize: (x: string): string => btoa(x),
			deserialize: (x: string): string => atob(x),
		},
		{
			serialize: (x: string): string =>
				x.replace(/=+$/g, '').replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
			deserialize: (x: string): string =>
				x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
		},
		{
			serialize: (x: string): string =>
				saveSerializer.legacyStartString + x + saveSerializer.endString,
			deserialize: (x: string): string =>
				x.slice(saveSerializer.legacyStartString.length, -saveSerializer.endString.length),
		},
	] as SerializeStep[],

	serialize(s: any): string {
		return this.newStepsV2.reduce((x: any, f: SerializeStep) => f.serialize(x), s) as string;
	},

	// 反序列化时自动检测版本
	deserialize(s: any): any {
		if (typeof s === 'string') {
			if (s.startsWith(saveSerializer.newStartStringV2)) {
				return this.newStepsV2.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
			} else if (s.startsWith(saveSerializer.newStartString)) {
				return this.newSteps.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
			} else if (s.startsWith(saveSerializer.legacyStartString)) {
				return this.legacySteps.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
			}
		}
		throw new Error('无法识别的存档格式');
	},

	getSaveVersion(s: string): 'legacy' | 'new' | 'newV2' | 'unknown' {
		if (s.startsWith(saveSerializer.newStartStringV2)) return 'newV2';
		if (s.startsWith(saveSerializer.newStartString)) return 'new';
		if (s.startsWith(saveSerializer.legacyStartString)) return 'legacy';
		return 'unknown';
	},

	// 升级任何旧版本到最新版V2
	upgradeLegacySave(legacySave: string): string {
		const version = this.getSaveVersion(legacySave);
		let data;
		
		if (version === 'legacy') {
			data = this.legacySteps.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), legacySave);
		} else if (version === 'new') {
			data = this.newSteps.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), legacySave);
		} else {
			throw new Error('无法升级未知格式的存档');
		}
		
		return this.newStepsV2.reduce((x: any, f: SerializeStep) => f.serialize(x), data) as string;
	},
} as const;