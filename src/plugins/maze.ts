import ws from 'ws';
import Command from '../command';
import { Position, Block, OldBlockHandling, CommandAndArgs, Player } from '../type';
import { sleep } from '../common';

export const run = async (socket: ws, args: CommandAndArgs) => {
  const mg = new MazeGenerator(socket, +args.NamedArgs['w'] || 10, +args.NamedArgs['h'] || 10);
  console.log(global.player);
  const basePosition = global.player.Position;
  for (let x: number = 0; x < mg.width; x++) {
    for (let z: number = 0; z < mg.height; z++) {
      socket.send(Command.setBlock(basePosition.add(new Position(x, -1, z)), Block.Bedrock, 0, OldBlockHandling.Destroy));
      await sleep(2);
      switch (mg.maze[x][z]) {
        case PATH_WALL.WALL: {
          socket.send(Command.fill(basePosition.add(new Position(x, 0, z)), basePosition.add(new Position(x, 2, z)), Block.Bedrock, 0, OldBlockHandling.Destroy));
          await sleep(2);
          break;
        }
        case PATH_WALL.PATH: {
          socket.send(Command.fill(basePosition.add(new Position(x, 0, z)), basePosition.add(new Position(x, 2, z)), Block.Air, 0, OldBlockHandling.Destroy));
          await sleep(2);
          break;
        }
      }
    }
  }
};

class MazeGenerator {
  maze: number[][];
  width: number;
  height: number;
  constructor(socket: ws, width: number, height: number) {
    if (height < 5 || width < 5) {
      throw "5未満のサイズでは生成できません";
    }

    if (width % 2 === 0) {
      width++;
    }
    if (height % 2 === 0) {
      height++;
    }

    this.width = width;
    this.height = height;

    this.maze = [];
    for (let x: number = 0; x < width; x++) {
      let temp: number[] = [];
      for (let y: number = 0; y < height; y++) {
        temp.push(0);
      }
      this.maze.push(temp);
    }

    for (let x: number = 0; x < width; x++) {
      for (let y: number = 0; y < height; y++) {
        if ((x === 0) || (y === 0) || (x === width - 1) || (y === height - 1)) {
          this.maze[x][y] = PATH_WALL.WALL;
        } else {
          this.maze[x][y] = PATH_WALL.PATH
        }
      }
    }

    for (let x: number = 2; x < width - 1; x += 2) {
      for (let y: number = 2; y < height - 1; y += 2) {
        this.maze[x][y] = PATH_WALL.WALL;

        while (true) {
          let direction = this.random(0, y == 2 ? 3 : 2);
          let wallX = x;
          let wallY = y;
          switch (direction) {
            case 0: {
              wallX++;
              break;
            }
            case 1: {
              wallY++;
              break;
            }
            case 2: {
              wallX--;
              break;
            }
            case 3: {
              wallY--;
              break;
            }
          }
          if (this.maze[wallX][wallY] !== PATH_WALL.WALL) {
            this.maze[wallX][wallY] = PATH_WALL.WALL;
            break;
          }
        }
      }
    }
  }

  random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

enum PATH_WALL {
  PATH = 0,
  WALL = 1,
}