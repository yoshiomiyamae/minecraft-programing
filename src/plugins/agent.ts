import ws from 'ws';
import Command from '../command';
import { CommandAndArgs, Commands, Direction } from '../type';

export const run = async (socket: ws, args: CommandAndArgs) => {
  if (args.Args.length >= 1) {
    switch (args.Args[0]) {
      case 'move': {
        socket.send(Command.agentMove(args.Args[1]));
        break;
      }
      case 'comehere': {
        socket.send(Command.agentTp());
        break;
      }
    }
  }
};