import { Player } from "./src/type";

declare global {
  namespace NodeJS {
    interface Global {
      player: Player
    }
  }
}