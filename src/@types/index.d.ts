import { Player } from "../type";

declare global {
  namespace NodeJS {
    interface Global {
      player: Player
    }
  }
}