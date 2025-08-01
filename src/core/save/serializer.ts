import { deflate, inflate } from 'pako';

export const saveSerializer = {
	encoder: new TextEncoder(),
	decoder: new TextDecoder(),
	startString: 'RBNSaveFile',
	endString: 'EndOfSaveFile',
	steps: [
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
			deserialize: (x: string) => x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
		},
		{
			serialize: (x: string) => saveSerializer.startString + x + saveSerializer.endString,
			deserialize: (x: string) =>
				x.slice(saveSerializer.startString.length, -saveSerializer.endString.length),
		},
	],
	serialize(s: any) {
		return this.steps.reduce((x, f) => f.serialize(x), s);
	},
	deserialize(s: any) {
		return this.steps.reduceRight((x, f) => f.deserialize(x), s);
	},
} as const;
