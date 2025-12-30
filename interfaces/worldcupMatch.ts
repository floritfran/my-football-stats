export enum Stage {
  GROUP_1 = 1,
  GROUP_2 = 2,
  GROUP_3 = 3,
  ROUND_OF_16 = 4,
  QUARTER_FINAL = 5,
  SEMI_FINAL = 6,
  FINAL = 7,
}

export interface Worldcup {
  id: number;
  stage: Stage;
  updated_at: number;
}
