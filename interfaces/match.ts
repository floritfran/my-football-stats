import { StageId } from "./worldcupMatch";

export interface Match {
  id: number;
  result: "w" | "l" | "d";
  date: number;
  goals: number;
  asists: number;
  shirt: "black" | "white";
  worldcup_id?: number;
  stage_id?: StageId;
}
