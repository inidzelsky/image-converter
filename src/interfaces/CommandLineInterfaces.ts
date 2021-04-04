import { ArgumentConfig } from "ts-command-line-args";

export interface ICommandLineArgs {
  source: string;
  goalFormat: string;
  output?: string;
}

export const CommandLineArgsConfig: ArgumentConfig<ICommandLineArgs> = {
  source: String,
  goalFormat: String,
  output: { type: String, optional: true }
};
