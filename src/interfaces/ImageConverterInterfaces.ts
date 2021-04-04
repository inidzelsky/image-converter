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
