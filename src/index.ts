import * as path from "path";
import { parse } from 'ts-command-line-args';
import { ICommandLineArgs, CommandLineArgsConfig } from "./interfaces/CommandLineInterfaces";

import { IImageReader, IImageWriter } from './interfaces/ImageConverterInterfaces';
import ImageConverter from './ImageConverter';

import PpmReader from './readers/PpmReader';
import BmpReader from './readers/BmpReader';

import PpmWriter from './writers/PpmWriter';
import BmpWriter from './writers/BmpWriter';

(async () => {
  try {
    const args: ICommandLineArgs = parse<ICommandLineArgs>(CommandLineArgsConfig);
    const { source, goalFormat } = args;

    let reader: IImageReader;
    let writer: IImageWriter;

    // Choose reader
    if (/.+\.ppm$/.test(source)) {
      reader = new PpmReader();
    } else if (/.+\.bmp$/.test(source)) {
      reader = new BmpReader();
    } else {
      return console.error('Unknown input file format. Allowed only .bmp and .ppm formats');
    }

    // Choose writer
    switch (goalFormat) {
      case 'bmp':
        writer = new BmpWriter();
        break;
      case 'ppm':
        writer = new PpmWriter();
        break;
      default:
        return console.error('Unknown target format. Allowed only .bmp and .ppm formats');
    }

    // Set output filepath
    const output = args.output ? args.output : args.source.slice(0, args.source.lastIndexOf('.')).concat(`.${args.goalFormat}`);

    const imageConverter = new ImageConverter(reader, writer);
    await imageConverter.convert(path.join(__dirname, '..', args.source), path.join(__dirname, '..', output));
  } catch (err) {
    console.error(err.message);
  }
})();




