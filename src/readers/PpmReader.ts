import { IImageReader, IImageData } from '../interfaces/ImageConverterInterfaces';
import { Utilities } from '../utilities/Utilities';

import { access, readFile } from 'fs/promises';

class PpmReader implements IImageReader {
  public async read(source: string): Promise<IImageData> {
    const ppmRaw: string = await this.readPpm(source);
    const values = ppmRaw
      .trim()
      .split(/\s/g)
      .filter((el: string) => el.length);

    const [imageWidth, imageHeight, M] = this.parseHeaders(values.slice(0, 4));
    const pixels = this.parsePixels(values.slice(4));

    return { width: imageWidth, height: imageHeight, pixels };
  }

  private async readPpm(filepath: string): Promise<string> {
    // Check file exists
    try {
      await access(filepath);
    } catch (err) {
      throw new Error('Image does not exist');
    }

    // Read file
    try {
      const fileRaw = await readFile(filepath, 'utf-8');
      return fileRaw;
    } catch (err) {
      throw new Error('Error while reading the image');
    }
  }

  parseHeaders(
    headersRaw: string[]
  ): [number, number, number] {
    const [rawP, rawWidth, rawHeight, rawM] = headersRaw;
    if (rawP !== 'P3') throw new Error('Ppm reader supports only P3 format');
    return [Number(rawWidth), Number(rawHeight), Number(rawM)];
  }

  parsePixels(
    pixelsRaw: string[]
  ): number[][] {
    const spectres: number[] = pixelsRaw.map(Number);
    const pixels: number[][] = Utilities.splitByNumber(spectres, 3);
    return pixels;
  }
}

export default PpmReader;

