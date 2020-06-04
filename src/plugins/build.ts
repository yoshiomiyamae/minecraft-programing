import ws from "ws";
import Command from "../command";
import {
  CommandAndArgs,
  Position,
  OldBlockHandling,
  BLOCK_MAP,
  EntityType,
  ENTITY_MAP,
} from "../type";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { safeLoad } from "js-yaml";
import { sleep } from "../common";

export const run = async (socket: ws, args: CommandAndArgs) => {
  if (args.Args.length < 1) {
    return;
  }
  const buildingDirectoryPath = path.join(__dirname, "buildings");
  const buildings = readdirSync(buildingDirectoryPath).filter((value) =>
    value.endsWith(".yaml")
  );
  const buildingName = args.Args[0];
  const buildingFileName = `${buildingName}.yaml`;
  if (buildings.includes(buildingFileName)) {
    const dataText = readFileSync(
      path.join(buildingDirectoryPath, buildingFileName),
      "utf-8"
    );
    const data: BuildingData = safeLoad(dataText);
    const basePosition = global.player.Position;
    const phaseCount = data.building.length;
    for (let phaseNumber = 0; phaseNumber < phaseCount; phaseNumber++) {
      const phase = data.building[phaseNumber];
      const layerCount = phase.length;
      for (let y = data.information.startY - 1; y < layerCount; y++) {
        const layer = phase[y - data.information.startY + 1];
        if (layer) {
          const rowCount = layer.length;
          for (let z = 0; z < rowCount; z++) {
            const row = layer[z].replace(/\s+/g, "");
            const temp = row.match(/.{1,4}/g);
            if (temp) {
              const rowData = new Uint16Array(
                temp.map((value) => parseInt(value, 16))
              );
              for (let i = 0; i < rowData.length; i += 2) {
                const x = -(i >> 1);
                const blockID = rowData[i];
                const blockData = rowData[i + 1];
                if (phaseNumber === 0 || blockID !== 0) {
                  socket.send(
                    Command.setBlock(
                      basePosition.add(new Position(x, y, z)),
                      BLOCK_MAP[blockID],
                      blockData,
                      OldBlockHandling.Destroy
                    )
                  );
                  await sleep(10);
                }
              }
            }
          }
        }
      }
      await sleep(100);
    }
    const layerCount = data.entity.length;
    for (let y = data.information.startY - 1; y < layerCount; y++) {
      const layer = data.entity[y - data.information.startY + 1];
      if (layer) {
        const rowCount = layer.length;
        for (let z = 0; z < rowCount; z++) {
          const row = layer[z].replace(/\s+/g, "");
          const temp = row.match(/.{1,2}/g);
          if (temp) {
            const rowData = new Uint8Array(
              temp.map((value) => parseInt(value, 16))
            );
            for (let i = 0; i < rowData.length; i++) {
              const x = -i;
              const entityID = rowData[i];
              if (entityID !== 0) {
                console.log(
                  Command.summon(
                    ENTITY_MAP[entityID],
                    basePosition.add(new Position(x, y, z))
                  ));
                socket.send(
                  Command.summon(
                    ENTITY_MAP[entityID],
                    basePosition.add(new Position(x, y, z))
                  )
                );
              }
              await sleep(10);
            }
          }
        }
      }
    }
  }
};

interface BuildingData {
  information: BuildingInformation;
  building: Building;
  entity: Entity;
}

interface BuildingInformation {
  startY: number;
}

type Building = string[][][];
type Entity = string[][];
