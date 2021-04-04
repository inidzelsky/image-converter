import { IImageReader, IImageWriter, IImageData } from './interfaces/ImageConverterInterfaces';

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
