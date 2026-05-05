import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export const PilotPhase = {
  DISCOVERY: "DISCOVERY",
  REALITY_CHECK: "REALITY_CHECK",
  LOGISTICS: "LOGISTICS",
  ORCHESTRATION: "ORCHESTRATION",
  SCHEDULING: "SCHEDULING",
  FINISHED: "FINISHED",
} as const;

export type PilotPhaseType = typeof PilotPhase[keyof typeof PilotPhase];

export const PilotStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  phase: Annotation<PilotPhaseType>({
    reducer: (x, y) => y ?? x,
    default: () => PilotPhase.DISCOVERY,
  }),
  destination: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  budget: Annotation<number | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  logisticsInfo: Annotation<any>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  itineraryItems: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  uiState: Annotation<any>({
    reducer: (x, y) => y ?? x, // Last write wins, used to send immediate responses to UI
    default: () => null,
  }),
});
