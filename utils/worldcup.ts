import { Match } from "@/interfaces/match";
import { Stage, StageId, StageName } from "@/interfaces/worldcupMatch";

const MINIMUM_POINTS_TO_CLASIFY = 4;

const STAGES = {
  1: { id: StageId.GROUP_1, name: StageName.GROUP_1 },
  2: { id: StageId.GROUP_2, name: StageName.GROUP_2 },
  3: { id: StageId.GROUP_3, name: StageName.GROUP_3 },
  4: { id: StageId.ROUND_OF_16, name: StageName.ROUND_OF_16 },
  5: { id: StageId.QUARTER_FINAL, name: StageName.QUARTER_FINAL },
  6: { id: StageId.SEMI_FINAL, name: StageName.SEMI_FINAL },
  7: { id: StageId.FINAL, name: StageName.FINAL },
};

export function getNextWorldCupStage(
  lastWorldcupMatch: Match | null,
  lastMatches: Match[]
): Stage {
  if (!lastWorldcupMatch || !lastWorldcupMatch.stage_id)
    return { id: StageId.GROUP_1, name: StageName.GROUP_1 };
  if (lastWorldcupMatch.stage_id === StageId.GROUP_3) {
    const points = lastMatches.reduce((total, match) => {
      switch (match.result) {
        case "w":
          return total + 3;
        case "d":
          return total + 1;
        case "l":
          return total;
      }
    }, 0);

    if (points >= MINIMUM_POINTS_TO_CLASIFY) {
      return STAGES[StageId.ROUND_OF_16];
    }

    return STAGES[StageId.GROUP_1];
  }

  return changeStage(lastWorldcupMatch.stage_id, lastWorldcupMatch.result);
}

export function changeStage(stage: StageId, result: Match["result"]): Stage {
  switch (stage) {
    case StageId.GROUP_1:
      return STAGES[StageId.GROUP_2];
    case StageId.GROUP_2:
      return STAGES[StageId.GROUP_3];
    case StageId.GROUP_3:
      return STAGES[StageId.ROUND_OF_16];
    case StageId.ROUND_OF_16:
      return result === "w" || (result === "d" && Math.random() > 0.5)
        ? STAGES[StageId.QUARTER_FINAL]
        : STAGES[StageId.GROUP_1];
    case StageId.QUARTER_FINAL:
      return result === "w" || (result === "d" && Math.random() > 0.5)
        ? STAGES[StageId.SEMI_FINAL]
        : STAGES[StageId.GROUP_1];
    case StageId.SEMI_FINAL:
      return result === "w" || (result === "d" && Math.random() > 0.5)
        ? STAGES[StageId.FINAL]
        : STAGES[StageId.GROUP_1];
    default:
      return STAGES[StageId.GROUP_1];
  }
}

export function getStageNameById(stageId: StageId): StageName {
  return STAGES[stageId]?.name ?? STAGES[StageId.GROUP_1].name;
}
