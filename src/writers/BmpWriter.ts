import { writeFile } from 'fs/promises';
import { IImageWriter, IImageData } from '../ImageConverter';
import { Hex, Utilities } from '../utilities/Utilities';

interface IBmpHeader {
  formHeader(): string;
}

class BmpWriter implements IImageWriter {
  public async write(imageData: IImageData, output: string): Promise<void> {
    const { width, height, pixels } = imageData;
    const bmpFileHeader = new BmpFileHeader('00000000');
    const bmpInfoHeader = new BmpInfoHeader(
      Hex.decimalToLittleEndian(width, 8),
      Hex.decimalToLittleEndian(height, 8)
    );

    const bmpPixelData = this.formPixelData(pixels, width);

    const bmpFile = bmpFileHeader.formHeader() + bmpInfoHeader.formHeader() + bmpPixelData;
    await this.writeBmp(output, bmpFile);
  }

  private formPixelData(pixels: number[][], pixelsInRowCount: number): string {
    const hexPixels = pixels.map((pixel: number[]) => {
      const [r, g, b] = pixel;
      const hexR = Hex.decimalToLittleEndian(r, 2);
      const hexG = Hex.decimalToLittleEndian(g, 2);
      const hexB = Hex.decimalToLittleEndian(b, 2);
      const hexAlpha = Hex.decimalToLittleEndian(0, 2);

      return ''.concat(hexB, hexG, hexR, hexAlpha);
    });

    const hexPixelsRows = Utilities.splitByNumber(hexPixels, pixelsInRowCount);
    return hexPixelsRows.reverse().flat().join('');
  }

  private async writeBmp(
    filepath: string,
    bmpFile: string
  ): Promise<void> {
    try {
      await writeFile(filepath, bmpFile, 'hex');
    } catch (err) {
      throw new Error('Cannot write .bmp file');
    }
  }
}

// TODO Enter valid file size value
class BmpFileHeader implements IBmpHeader {
  private readonly _fileType: string;
  private readonly _fileSize: string;
  private readonly _reserved: string;
  private readonly _pixelDataOffset: string;

  constructor(fileSize: string) {
    this._fileType = '424d';
    this._fileSize = fileSize;
    this._reserved = '0000';
    this._pixelDataOffset = '36000000';
  }

  public formHeader(): string {
    return ''.concat(
      this._fileType,
      this._fileSize,
      this._reserved,
      this._reserved,
      this._pixelDataOffset
    );
  }
}

class BmpInfoHeader implements IBmpHeader {
  private readonly _headerSize: string;
  private readonly _imageWidth: string;
  private readonly _imageHeight: string;
  private readonly _planes: string;
  private readonly _bitsPerPixel: string;
  private readonly _compression: string;
  private readonly _imageSize: string;
  private readonly _xPixelsPerMeter: string;
  private readonly _yPixelsPerMeter: string;
  private readonly _totalColors: string;
  private readonly _importantColors: string;

  constructor(imageWidth: string, imageHeight: string) {
    this._headerSize = '28000000';
    this._imageWidth = imageWidth;
    this._imageHeight = imageHeight;
    this._planes = '0100';
    this._bitsPerPixel = '2000'
    this._compression = '00000000';
    this._imageSize = '00000000';
    this._xPixelsPerMeter = '00000000';
    this._yPixelsPerMeter = '00000000';
    this._totalColors = '00000000';
    this._importantColors = '00000000';
  }


  public formHeader(): string {
    return ''.concat(
      this._headerSize,
      this._imageWidth,
      this._imageHeight,
      this._planes,
      this._bitsPerPixel,
      this._compression,
      this._imageSize,
      this._xPixelsPerMeter,
      this._yPixelsPerMeter,
      this._totalColors,
      this._importantColors
    );
  }
}

export default BmpWriter;
