declare class ImageCombiner {
    private arrayBufferToBase64;
    combine(width: number, height: number, pngBuffers: ArrayBuffer[], textOptions?: {
        fontBytes: Uint8Array;
        x: number;
        y: number;
        text: string;
        fontSize: number;
        color: string;
    }): Uint8Array<ArrayBufferLike>;
}
declare const _default: ImageCombiner;
export default _default;
//# sourceMappingURL=ImageCombiner.d.ts.map