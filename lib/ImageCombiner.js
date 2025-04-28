import { Resvg } from "@resvg/resvg-wasm";
class ImageCombiner {
    arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    combine(width, height, pngBuffers, textOptions) {
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
        pngBuffers.forEach((buffer) => {
            const base64String = this.arrayBufferToBase64(buffer);
            svg +=
                `<image href="data:image/png;base64,${base64String}" x="0" y="0" width="${width}" height="${height}" />`;
        });
        if (textOptions) {
            const { fontBytes, x, y, text } = textOptions;
            svg += `<style>
  @font-face {
    font-family: "customFont";
    src: url('data:font/woff2;base64,${btoa(String.fromCharCode(...fontBytes))}') format("woff2");
  }
  text { font-family:"customFont"; font-size:${textOptions.fontSize}px; fill:${textOptions.color}; }
</style>`;
            svg +=
                `<text x="${x}" y="${y}" dominant-baseline="central" text-anchor="middle">${text}</text>`;
        }
        svg += "</svg>";
        const resvg = new Resvg(svg, !textOptions ? { fitTo: { mode: "width", value: width } } : {
            fitTo: { mode: "width", value: width },
            font: {
                fontBuffers: [textOptions.fontBytes],
                defaultFontFamily: "customFont",
                loadSystemFonts: false,
            },
        });
        return resvg.render().asPng();
    }
}
export default new ImageCombiner();
//# sourceMappingURL=ImageCombiner.js.map