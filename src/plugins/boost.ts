import ws from 'ws';
import Command from '../command';
import { CommandAndArgs, TargetSelector, Effect } from '../type';

export const run = async (socket: ws, args: CommandAndArgs) => {
  socket.send(Command.effect(TargetSelector.Self, Effect.Clear));
  socket.send(Command.effect(TargetSelector.Self, Effect.Speed, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.Haste, 1000000, 1));
  socket.send(Command.effect(TargetSelector.Self, Effect.Strength, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.InstantHealth, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.JumpBoost, 1000000, 2));
  socket.send(Command.effect(TargetSelector.Self, Effect.Regeneration, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.Resistance, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.FireResistance, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.WaterBreathing, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.NightVision, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.HealthBoost, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.Absorption, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.Saturation, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.Luck, 1000000, 8));
  socket.send(Command.effect(TargetSelector.Self, Effect.ConduitPower, 1000000, 8));
};
