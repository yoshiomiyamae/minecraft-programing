import ws from 'ws';
import Command from '../command';
import { CommandAndArgs, TargetSelector, Enchant, Commands } from '../type';

export const run = async (socket: ws, args: CommandAndArgs) => {
  if (args.Args.length < 1) {
    socket.send(Command.say('Need to pass a tool type. Pickaxe: p, Shovel: s, Axe: a'));
    socket.send(Command.say('enchant [p | s | a]'));
    return;
  }
  switch (args.Args[0]) {
    case 'p':
    case 's':
    case 'a': {
      socket.send(Command.enchant(TargetSelector.Self, Enchant.Efficiency, 5));
      socket.send(Command.enchant(TargetSelector.Self, Enchant.Fortune, 3));
      socket.send(Command.enchant(TargetSelector.Self, Enchant.Unbreaking, 3));
      socket.send(Command.enchant(TargetSelector.Self, Enchant.Mending, 1));
      break;
    }
  }
};
