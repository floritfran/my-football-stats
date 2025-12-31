export interface Stage {
  id: StageId;
  name: StageName;
}

export enum StageId {
  GROUP_1 = 1,
  GROUP_2 = 2,
  GROUP_3 = 3,
  ROUND_OF_16 = 4,
  QUARTER_FINAL = 5,
  SEMI_FINAL = 6,
  FINAL = 7,
}

export enum StageName {
  GROUP_1 = "Grupos 1",
  GROUP_2 = "Grupos 2",
  GROUP_3 = "Grupos 3",
  ROUND_OF_16 = "Octavos de final",
  QUARTER_FINAL = "Cuartos de final",
  SEMI_FINAL = "Semifinal",
  FINAL = "Final",
}

export interface Worldcup {
  id: number;
  stage: Stage;
  updated_at: number;
}
