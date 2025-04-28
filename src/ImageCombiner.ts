import UPNG from "upng-js";

class ImageCombiner {
  private blendPixel(
    bgR: number,
    bgG: number,
    bgB: number,
    bgA: number,
    fgR: number,
    fgG: number,
    fgB: number,
    fgA: number,
  ): [number, number, number, number] {
    const alphaF = fgA / 255;
    const alphaB = bgA / 255;
    const outA = alphaF + alphaB * (1 - alphaF);
    if (outA < 1e-6) return [0, 0, 0, 0];

    const outR = Math.round(
      (fgR * alphaF + bgR * alphaB * (1 - alphaF)) / outA,
    );
    const outG = Math.round(
      (fgG * alphaF + bgG * alphaB * (1 - alphaF)) / outA,
    );
    const outB = Math.round(
      (fgB * alphaF + bgB * alphaB * (1 - alphaF)) / outA,
    );
    const outAlpha = Math.round(outA * 255);
    return [outR, outG, outB, outAlpha];
  }

  private blendImage(base: Uint8Array, overlay: Uint8Array) {
    for (let i = 0; i < base.length; i += 4) {
      const [bgR, bgG, bgB, bgA] = [
        base[i],
        base[i + 1],
        base[i + 2],
        base[i + 3],
      ];
      const [fgR, fgG, fgB, fgA] = [
        overlay[i],
        overlay[i + 1],
        overlay[i + 2],
        overlay[i + 3],
      ];
      const [r, g, b, a] = this.blendPixel(
        bgR,
        bgG,
        bgB,
        bgA,
        fgR,
        fgG,
        fgB,
        fgA,
      );
      base[i] = r;
      base[i + 1] = g;
      base[i + 2] = b;
      base[i + 3] = a;
    }
  }

  public combine(buffers: ArrayBuffer[]): ArrayBuffer {
    const images = buffers.map((buffer) => UPNG.decode(buffer));
    const width = images[0].width;
    const height = images[0].height;
    for (let i = 1; i < images.length; i++) {
      const image = images[i];
      if (image.width !== width || image.height !== height) {
        throw new Error("All images must have the same dimensions");
      }
    }
    const rgbas = images.map((image) => new Uint8Array(UPNG.toRGBA8(image)[0]));
    const combined = rgbas[0];
    for (let i = 1; i < rgbas.length; i++) {
      this.blendImage(combined, rgbas[i]);
    }
    return UPNG.encode([combined.buffer], width, height, 0);
  }
}

export default new ImageCombiner();
