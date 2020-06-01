import ws from 'ws';
import Command from '../command';
import { CommandAndArgs, Position, OldBlockHandling, BLOCK_MAP } from '../type';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { safeLoad } from 'js-yaml';

export const run = async (socket: ws, args: CommandAndArgs) => {
  if (args.Args.length < 1) {
    return;
  }
  const buildingDirectoryPath = path.join(__dirname, 'buildings');
  const buildings = readdirSync(buildingDirectoryPath).filter(value => value.endsWith('.yaml'));
  const buildingName = args.Args[0];
  const buildingFileName = `${buildingName}.yaml`;
  if (buildings.includes(buildingFileName)) {
    const dataText = readFileSync(path.join(buildingDirectoryPath, buildingFileName), 'utf-8');
    const data: string[][] = safeLoad(dataText);
    const basePosition: Position = global.player.Position;
    let y = -1;
    data.forEach(layer => {
      let z = 0;
      layer.forEach(row => {
        const temp = row.match(/.{1,4}/g);
        if (temp) {
          const rowData = new Uint16Array(temp.map(value => parseInt(value, 16)));
          for (let i = 0; i < rowData.length; i += 2) {
            const x = i >> 1;
            const blockID = rowData[i];
            const blockData = rowData[i + 1];
            socket.send(Command.setBlock(basePosition.add(new Position(x, y, z)), BLOCK_MAP[blockID], blockData, OldBlockHandling.Destroy));
          }
        }
        z++;
      });
      y++;
    });
  }
};