import { v4 } from 'uuid';
import { CommandAndArgs } from './type';
export const uuidGenerator = v4;

export const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

export const parseCommand = (command: string) => {
  const args = command.split(' ');
  if (args) {
    let output: CommandAndArgs = {
      Command: <string>args.shift(),
      NamedArgs: {},
      Args: [],
    };
    let previousArg = '';
    args.forEach(arg => {
      console.log(arg);
      if (!previousArg && arg.startsWith('-')) {
        previousArg = arg.substring(1);
      } else if (previousArg && !arg.startsWith('-')) {
        output.NamedArgs[previousArg] = arg;
        previousArg = '';
      } else if (previousArg) {
        output.Args.push(previousArg);
        previousArg = arg.substring(1);
      } else {
        output.Args.push(arg);
      }
    });
    if (previousArg) {
      output.Args.push(previousArg);
    }

    return output;
  } else {
    return null;
  }
}