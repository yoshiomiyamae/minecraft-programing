import ws from "ws";
import command, { commandBuilder } from "../command";
import {
  CommandAndArgs,
  Position,
  OldBlockHandling,
  BLOCK_MAP,
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
                    command.setBlock(
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
                  command.summon(
                    ENTITY_MAP[entityID],
                    basePosition.add(new Position(x, y, z))
                  ));
                socket.send(
                  command.summon(
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

    for (let i = 0; i < data.agent.action.length; i++) {
      for (let j = 0; j < data.agent.inventory.length; j++) {
        const itemInformation = data.agent.inventory[j];
        socket.send(
          command.agentSetItem(
            j + 1,
            itemInformation.itemName,
            itemInformation.count,
            itemInformation.dataValue
          )
        );
      }
      await sleep(100);
      const actionInformation = data.agent.action[i];
      socket.send(
        command.agentTp(
          basePosition.add(new Position(
            -actionInformation.where.x,
            actionInformation.where.y - data.information.startY,
            actionInformation.where.z
          )),
          actionInformation.where.yRot
        )
      )
      await sleep(100);
      socket.send(commandBuilder(`agent ${actionInformation.what}`));
      await sleep(100);
    }
  }
};

interface BuildingData {
  information: BuildingInformation;
  building: Building;
  entity: Entity;
  agent: Agent;
}

interface BuildingInformation {
  startY: number;
}

type Building = string[][][];
type Entity = string[][];

interface Agent {
  inventory: ItemInformation[];
  action: ActionInformation[];
}

interface ItemInformation {
  itemName: string;
  count: number;
  dataValue: number;
}

interface ActionInformation {
  where: LocationInformation;
  what: string;
}

interface LocationInformation {
  x: number;
  y: number;
  z: number;
  yRot: number;
}