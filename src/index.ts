import { ArgumentConfig, parse } from 'ts-command-line-args';

import PpmReader from './readers/PpmReader';
import BmpReader from './readers/BmpReader';

import PpmWriter from './writers/PpmWriter';
import BmpWriter from './writers/BmpWriter';

import ImageConverter, {IImageReader, IImageWriter} from './ImageConverter';

interface ICommandLineArgs {
  source: string;
  goalFormat: string;
  output?: string;
}

const CommandLineArgsConfig: ArgumentConfig<ICommandLineArgs> = {
  source: String,
  goalFormat: String,
  output: { type: String, optional: true }
};

(async () => {
  const args: ICommandLineArgs = parse<ICommandLineArgs>(CommandLineArgsConfig);

  let reader: IImageReader;
  let writer: IImageWriter;

  // Choose reader
  if (/.+\.ppm$/.test(args.source)) {
    reader = new PpmReader();
  } else if (/.+\.bmp$/.test(args.source)) {
    reader = new BmpReader();
  } else {
    return console.error('Unknown input file format. Allowed only .bmp and .ppm formats');
  }

  // Choose writer
  switch (args.goalFormat) {
    case 'bmp':
      writer = new BmpWriter();
      break;
    case 'ppm':
      writer = new PpmWriter();
      break;
    default:
      return console.error('Unknown target format. Allowed only .bmp and .ppm formats');
  }

  const output = args.output ? args.output : args.source.slice(0, args.source.lastIndexOf('.')).concat(`.${args.goalFormat}`);

  const imageConverter = new ImageConverter(reader, writer);
  await imageConverter.convert(args.source, output);
})();




