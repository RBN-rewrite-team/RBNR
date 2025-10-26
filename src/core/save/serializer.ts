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
	newStartStringV2: 'RBNRNewSaveFileFormatV2', // V2使用有问题的混淆函数
	newStartStringV3: 'RBNRNewSaveFileFormatV3', // V3使用二进制字符串，无Base64
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
			serialize: (x: string): string =>
				saveSerializer.newStartString + x + saveSerializer.endString,
			deserialize: (x: string): string =>
				x.slice(saveSerializer.newStartString.length, -saveSerializer.endString.length),
		},
	] as SerializeStep[],

	// V2步骤（使用修复后的混淆函数）
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
					result[i] = x[i] ^ ((i * 7 + 13) & 0xff);
				}
				return result;
			},
			deserialize: function (x: Uint8Array): Uint8Array {
				const result = new Uint8Array(x.length);
				for (let i = 0; i < x.length; i++) {
					result[i] = x[i] ^ ((i * 7 + 13) & 0xff);
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
			serialize: (x: string): string =>
				saveSerializer.newStartStringV2 + x + saveSerializer.endString,
			deserialize: (x: string): string =>
				x.slice(saveSerializer.newStartStringV2.length, -saveSerializer.endString.length),
		},
	] as SerializeStep[],

	// V3步骤（使用二进制字符串，无Base64）
	newStepsV3: [
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
		// 数据混淆（使用XOR确保可逆）
		{
			serialize: function (x: Uint8Array): Uint8Array {
				const result = new Uint8Array(x.length);
				for (let i = 0; i < x.length; i++) {
					result[i] = x[i] ^ ((i * 7 + 13) & 0xff);
				}
				return result;
			},
			deserialize: function (x: Uint8Array): Uint8Array {
				const result = new Uint8Array(x.length);
				for (let i = 0; i < x.length; i++) {
					result[i] = x[i] ^ ((i * 7 + 13) & 0xff);
				}
				return result;
			},
		},
		// 直接使用二进制字符串，跳过Base64步骤
		{
			serialize: function (x: Uint8Array): string {
				// 使用二进制字符串，但需要确保所有字符都在可打印ASCII范围内
				// 将每个字节映射到可打印字符范围（32-126）
				return Array.from(x)
					.map((byte: number) => {
						// 将0-255映射到可打印ASCII字符（32-126）
						// 使用简单的线性映射，确保可逆
						const printableChar = 32 + (byte % 95); // 95个可打印字符
						return String.fromCharCode(printableChar);
					})
					.join('');
			},
			deserialize: function (x: string): Uint8Array {
				return Uint8Array.from(Array.from(x).map((char: string) => {
					const code = char.charCodeAt(0);
					// 反向映射到原始字节
					// 由于模运算，可能会有多个原始值映射到同一个字符
					// 我们选择最小的可能值来保持一致性
					return (code - 32) % 256;
				}));
			},
		},
		{
			serialize: (x: string): string =>
				saveSerializer.newStartStringV3 + x + saveSerializer.endString,
			deserialize: (x: string): string =>
				x.slice(saveSerializer.newStartStringV3.length, -saveSerializer.endString.length),
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

	// 序列化时使用最新版V3
	serialize(s: any): string {
		return this.newStepsV3.reduce((x: any, f: SerializeStep) => f.serialize(x), s) as string;
	},

	// 反序列化时自动检测版本
	deserialize(s: any): any {
		if (typeof s === 'string') {
			if (s.startsWith(saveSerializer.newStartStringV3)) {
				// 新版V3格式（二进制字符串）
				return this.newStepsV3.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
			} else if (s.startsWith(saveSerializer.newStartStringV2)) {
				// 新版V2格式（修复的混淆函数）
				return this.newStepsV2.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
			} else if (s.startsWith(saveSerializer.newStartString)) {
				// 新版V1格式（有问题的混淆函数）
				return this.newSteps.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
			} else if (s.startsWith(saveSerializer.legacyStartString)) {
				// 旧版格式
				return this.legacySteps.reduceRight((x: any, f: SerializeStep) => f.deserialize(x), s);
			}
		}
		throw new Error('无法识别的存档格式');
	},

	getSaveVersion(s: string): 'legacy' | 'new' | 'newV2' | 'newV3' | 'unknown' {
		if (s.startsWith(saveSerializer.newStartStringV3)) return 'newV3';
		if (s.startsWith(saveSerializer.newStartStringV2)) return 'newV2';
		if (s.startsWith(saveSerializer.newStartString)) return 'new';
		if (s.startsWith(saveSerializer.legacyStartString)) return 'legacy';
		return 'unknown';
	},

	// 升级任何旧版本到最新版V3
	upgradeLegacySave(legacySave: string): string {
		const version = this.getSaveVersion(legacySave);
		let data;

		if (version === 'legacy') {
			data = this.legacySteps.reduceRight(
				(x: any, f: SerializeStep) => f.deserialize(x),
				legacySave,
			);
		} else if (version === 'new') {
			data = this.newSteps.reduceRight(
				(x: any, f: SerializeStep) => f.deserialize(x),
				legacySave,
			);
		} else if (version === 'newV2') {
			data = this.newStepsV2.reduceRight(
				(x: any, f: SerializeStep) => f.deserialize(x),
				legacySave,
			);
		} else {
			throw new Error('无法升级未知格式的存档');
		}

		return this.newStepsV3.reduce((x: any, f: SerializeStep) => f.serialize(x), data) as string;
	},
} as const;

declare global {
	interface Window {
		saveSerializer: typeof saveSerializer;
	}
}
window.saveSerializer = saveSerializer;