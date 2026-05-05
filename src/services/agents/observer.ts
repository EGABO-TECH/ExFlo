import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { pilotAgent } from "./pilot";
import { HumanMessage } from "@langchain/core/messages";

const ObserverStateAnnotation = Annotation.Root({
  bookingId: Annotation<string>(),
  status: Annotation<"ON_TIME" | "DELAYED" | "CANCELLED" | "UNKNOWN">({
    reducer: (x, y) => y ?? x,
    default: () => "UNKNOWN"
  }),
  itinerary: Annotation<any>(),
  replanned: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false
  }),
});

const checkFlightStatus = async (state: typeof ObserverStateAnnotation.State) => {
    console.log("[Observer] ticking... monitoring flight status for:", state.bookingId);
    
    // Hardcoded logic for demo purposes: if bookingId has 'MOCK_DELAY', trigger replan
    const status = state.bookingId.includes("MOCK_DELAY") ? "DELAYED" : "ON_TIME";
    console.log(`[Observer] Status updated to: ${status}`);
    
    return { status };
};

const replanItinerary = async (state: typeof ObserverStateAnnotation.State) => {
    console.log("[Observer] Disruption detected! Autonomous re-planning initiated...");
    
    const result = await pilotAgent.invoke({
        messages: [new HumanMessage(`The flight for booking ${state.bookingId} is ${state.status}. Please search for alternative flights and stays immediately.`)]
    });
    
    return { 
        replanned: true,
        itinerary: result.messages[result.messages.length - 1].content
    };
};

const observerBuilder = new StateGraph(ObserverStateAnnotation)
  .addNode("monitor", checkFlightStatus)
  .addNode("replan", replanItinerary)
  .addEdge("__start__", "monitor")
  .addConditionalEdges("monitor", (state) => {
      if (state.status === "DELAYED" || state.status === "CANCELLED") {
          return "replan";
      }
      return "end";
  }, { replan: "replan", end: END })
  .addEdge("replan", END);

export const observerAgent = observerBuilder.compile();
