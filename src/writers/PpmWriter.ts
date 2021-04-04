import { writeFile } from 'fs/promises';
import { IImageWriter, IImageData } from '../ImageConverter';

class PpmWriter implements IImageWriter {
  public async write(imageData: IImageData, output: string): Promise<void> {
    const { width, height, pixels } = imageData;
    const ppmHeader = new PpmHeader(width.toString(), height.toString());
    const pixelData = this.formPixelData(pixels, width);

    const ppmFile = ppmHeader.formHeader() + pixelData;
    await this.writePpm(output, ppmFile);
  }

  private formPixelData(pixels: number[][], pixelsInRowCount: number): string {
    let pixelData = '\n';
    let currentPixelInRow = 0;


    for (const pixel of pixels) {
      const [r, g, b] = pixel;

      pixelData += `${r} ${g} ${b}  `;
      if (++currentPixelInRow === pixelsInRowCount) {
        pixelData += '\n';
        currentPixelInRow = 0;
      }
    }

    return pixelData;
  }

  private async writePpm(output: string, ppmFile: string): Promise<void> {
    try {
      await writeFile(output, ppmFile, 'utf-8');
    } catch (err) {
      throw new Error('Could not write .ppm file');
    }
  }
}

class PpmHeader {
  private readonly _ppmFormat: string;
  private readonly _imageWidth: string;
  private readonly _imageHeight: string;
  private readonly _M: string;

  constructor(imageWidth: string, imageHeight: string) {
    this._ppmFormat = 'P3';
    this._imageWidth = imageWidth;
    this._imageHeight = imageHeight;
    this._M = '255';
  }

  public formHeader() {
    return this._ppmFormat + '\n' +
      this._imageWidth + ' ' + this._imageHeight + ' ' + this._M;
  }
}

export default PpmWriter;
