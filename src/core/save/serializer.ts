import { deflate, inflate } from 'pako'

export interface SaveSerializer {
  encoder: TextEncoder
  decoder: TextDecoder
  startString: string
  endString: string
  steps: {
    serialize: (x: any) => any
    deserialize: (x: any) => any
  }[]
  serialize: (s: any) => any
  deserialize: (s: any) => any
}

export const saveSerializer: SaveSerializer = {
  encoder: new TextEncoder(),
  decoder: new TextDecoder(),
  startString: 'RBNSaveFile',
  endString: 'EndOfSaveFile',
  steps: [
    {
      serialize: (x) => JSON.stringify(x),
      deserialize: (x) => JSON.parse(x),
    },
    {
      serialize: (x) => saveSerializer.encoder.encode(x),
      deserialize: (x) => saveSerializer.decoder.decode(x),
    },
    {
      serialize: (x) => deflate(x),
      deserialize: (x) => inflate(x),
    },
    {
      serialize: function (x: Uint8Array): string {
        return Array.from(x)
          .map((byte: number) => String.fromCharCode(byte))
          .join('')
      },
      deserialize: function (x: string): Uint8Array {
        return Uint8Array.from(Array.from(x).map((char: string) => char.charCodeAt(0)))
      },
    },
    {
      serialize: (x) => btoa(x),
      deserialize: (x) => atob(x),
    },
    {
      serialize: (x) =>
        x.replace(/=+$/g, '').replace(/0/g, '0a').replace(/\+/g, '0b').replace(/\//g, '0c'),
      deserialize: (x) => x.replace(/0b/g, '+').replace(/0c/g, '/').replace(/0a/g, '0'),
    },
    {
      serialize: (x) => saveSerializer.startString + x + saveSerializer.endString,
      deserialize: (x) =>
        x.slice(saveSerializer.startString.length, -saveSerializer.endString.length),
    },
  ],
  serialize(s) {
    return this.steps.reduce((x, f) => f.serialize(x), s)
  },
  deserialize(s) {
    return this.steps.reduceRight((x, f) => f.deserialize(x), s)
  },
}
