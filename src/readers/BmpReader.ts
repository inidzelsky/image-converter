import { IImageReader, IImageData } from '../ImageConverter';
import {Hex, Utilities} from '../utilities/Utilities';
import { access, readFile } from "fs/promises";


class BmpReader implements IImageReader {
  public async read(source: string): Promise<IImageData> {
    const bmpRaw = await this.readBmp(source);
    const [imageWidth, imageHeight, pixelDataOffset] = this.parseHeaders(bmpRaw);
    const pixels = this.parsePixels(bmpRaw.slice(pixelDataOffset * 2), imageWidth);

    return { width: imageWidth, height: imageHeight, pixels };
  }

  private async readBmp(filepath: string): Promise<string> {
    // Check filename format

    if (!/.+\.bmp$/.test(filepath))
      throw new Error('File is not in .bmp format');

    // Check file exists

    try {
      await access(filepath);
    } catch (err) {
      throw new Error('Image does not exist');
    }

    // Read file

    try {
      const fileRaw = await readFile(filepath, 'hex');
      return fileRaw;
    } catch (err) {
      throw new Error('Error while reading the image');
    }
  }

  private parseHeaders(bmpRaw: string): [number, number, number] {
    const bitsPerPixel: number = Hex.littleEndianToDecimal(bmpRaw.slice(56, 60));
    if (bitsPerPixel !== 32)
      throw new Error(`Converter supports only 32-bit .bmp files, but not ${bitsPerPixel}`);

    const pixelDataOffset: number = Hex.littleEndianToDecimal(bmpRaw.slice(20, 28));
    const imageWidth: number = Hex.littleEndianToDecimal(bmpRaw.slice(36, 44));
    const imageHeight = Hex.littleEndianToDecimal(bmpRaw.slice(44, 52));

    return [imageWidth, imageHeight, pixelDataOffset];
  }

  private parsePixels(pixelsRaw: string, pixelsInRowCount: number): number[][] {
    const hexSpectres = Utilities.splitByNumber(pixelsRaw.split(''), 2).map(hs => hs.join(''));
    const hexPixels = Utilities.splitByNumber(hexSpectres, 4);
    const reversedPixels: number[][] = hexPixels.map((hp: string[]) => {
      const [bHex, gHex, rHex] = hp;
      const r = Hex.littleEndianToDecimal(rHex);
      const g = Hex.littleEndianToDecimal(gHex);
      const b = Hex.littleEndianToDecimal(bHex);

      return [r, g, b];
    });

    const pixels = Utilities.splitByNumber(reversedPixels, pixelsInRowCount).reverse().flat();
    return pixels;
  }
}

export default BmpReader;
