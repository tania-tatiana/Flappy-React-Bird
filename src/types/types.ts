export type GameState = "START" | "PLAYING" | "GAMEOVER";

export interface PipeType {
  x: number;
  topHeight: number;
  passed: boolean;
}
