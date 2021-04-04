export interface IImageData {
  width: number;
  height: number;
  pixels: number[][];
}

export interface IImageReader {
  read(source: string): Promise<IImageData>;
}

export interface IImageWriter {
  write(imageData: IImageData, output: string): Promise<void>;
}

class ImageConverter {
  private _imageReader: IImageReader;
  private _imageWriter: IImageWriter;

  constructor(imageReader: IImageReader, imageWriter: IImageWriter) {
    this._imageReader = imageReader;
    this._imageWriter = imageWriter;
  }

  public async convert(source: string, output: string): Promise<void> {
    const imageData = await this._imageReader.read(source);
    await this._imageWriter.write(imageData, output);
  }
}

export default ImageConverter;
