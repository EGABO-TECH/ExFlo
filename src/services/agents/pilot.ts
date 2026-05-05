import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchFlights, searchStays } from "../booking/duffel";
import { searchActivities } from "../booking/tripadvisor";
import { StateGraph, END, MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { PilotStateAnnotation, PilotPhase } from "./state";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

// ---------------------------------------------------------------------------
// 1. Existing Tools (Orchestration Phase)
// ---------------------------------------------------------------------------
export const bookFlightTool = tool(
  async ({ origin, destination, date }) => {
    try {
        return JSON.stringify(await searchFlights(origin, destination, date));
    } catch (e) {
        console.warn("Duffel API failed, using mock flight data.");
        return JSON.stringify([
            { id: "fl_mock_1", airline: "Mock Airlines", departure: origin, arrival: destination, price: "450.00" }
        ]);
    }
  },
  {
    name: "search_duffel_flights",
    description: "Search for flights using Duffel API given origin, destination, and departure date",
    schema: z.object({
      origin: z.string().describe("IATA code of origin (e.g. LHR)"),
      destination: z.string().describe("IATA code of destination (e.g. CDG)"),
      date: z.string().describe("Date in YYYY-MM-DD format"),
    })
  }
);

export const bookStayTool = tool(
  async ({ location, checkIn, checkOut }) => {
    try {
        return JSON.stringify(await searchStays(location, checkIn, checkOut));
    } catch (e) {
        console.warn("Duffel Stay API failed, using mock hotel data.");
        return JSON.stringify([
            { id: "ht_mock_1", name: `${location} Grand Mock Hotel`, price: "800.00", media: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'] }
        ]);
    }
  },
  {
    name: "search_duffel_stays",
    description: "Search for hotels/stays using Duffel API",
    schema: z.object({
      location: z.string().describe("City or airport code (e.g. Paris)"),
      checkIn: z.string().describe("Check-in Date in YYYY-MM-DD format"),
      checkOut: z.string().describe("Check-out Date in YYYY-MM-DD format"),
    })
  }
);

export const bookActivityTool = tool(
  async ({ location }) => {
    try {
        return JSON.stringify(await searchActivities(location));
    } catch (e) {
        console.warn("TripAdvisor API failed, using mock activity data.");
        return JSON.stringify([
            { id: "tour_mock_1", name: `Mock ${location} City Tour`, price: "120.00", media: ['https://images.unsplash.com/photo-1533669955142-6a73332af4db'] }
        ]);
    }
  },
  {
    name: "search_tripadvisor_activities",
    description: "Search for local activities and tours using TripAdvisor Content API",
    schema: z.object({
      location: z.string().describe("Location name to search for activities (e.g. Paris, Eiffel Tower)")
    })
  }
);

// ---------------------------------------------------------------------------
// 2. New Tools (Reality Check & Logistics Phases)
// ---------------------------------------------------------------------------
export const estimateBudgetTool = tool(
    async ({ destination }) => {
        // MOCK DATA for budget estimation
        const baseCost = Math.floor(Math.random() * 1000) + 500;
        return JSON.stringify({
            destination,
            estimatedAverageCostUSD: baseCost,
            message: `The estimated average cost for a trip to ${destination} is around $${baseCost} USD.`
        });
    },
    {
        name: "estimate_trip_budget",
        description: "Get an estimated budget for a trip to a specific destination.",
        schema: z.object({
            destination: z.string().describe("The destination city or country.")
        })
    }
);

export const checkVisaAndHealthTool = tool(
    async ({ originCountry, destinationCountry }) => {
        // MOCK DATA for Sherpa API / Visa Checks
        return JSON.stringify({
            visaRequired: destinationCountry.toLowerCase() !== originCountry.toLowerCase(),
            healthRequirements: ["Yellow Fever Certificate Recommended", "COVID-19 vaccination proof not required"],
            links: ["https://travel.state.gov", "https://apply.joinsherpa.com/"]
        });
    },
    {
        name: "check_visa_health_requirements",
        description: "Check visa and health/vaccine requirements for traveling between two countries.",
        schema: z.object({
            originCountry: z.string().describe("The traveler's origin country."),
            destinationCountry: z.string().describe("The destination country.")
        })
    }
);

// ---------------------------------------------------------------------------
// 3. LLM Setup & Mock Interceptor
// ---------------------------------------------------------------------------
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || "mock-placeholder-key";

const llm = new ChatOpenAI({ 
    modelName: "gpt-4o-mini", 
    temperature: 0, 
    openAIApiKey: apiKey 
});

const tools = [bookFlightTool, bookStayTool, bookActivityTool, estimateBudgetTool, checkVisaAndHealthTool];
const llmWithTools = llm.bindTools(tools);

const invokeLLM = async (messages: BaseMessage[], useTools = false) => {
    // If no real API key is provided, intercept and simulate the LLM's brain
    if (apiKey === "mock-placeholder-key") {
        await new Promise(r => setTimeout(r, 1000)); // Simulate thinking
        
        const sysMsg = messages.find(m => m._getType() === "system")?.content as string || "";
        const lastHuman = messages.slice().reverse().find(m => m._getType() === "human")?.content as string || "";
        
        if (sysMsg.includes("DISCOVERY")) {
            if (!lastHuman) return new AIMessage("Where would you like to go?");
            return new AIMessage(`DESTINATION_LOCKED: ${lastHuman}\nFantastic choice! Let's plan a trip to ${lastHuman}.`);
        }
        if (sysMsg.includes("REALITY CHECK")) {
            const numbers = lastHuman.match(/\d+/g);
            if (!numbers) return new AIMessage("Could you please tell me your budget for this trip?");
            
            const budget = parseInt(numbers.join(""), 10);
            if (budget < 1000) return new AIMessage("That budget might be a bit too low for a premium experience. Could we adjust it?");
            return new AIMessage(`BUDGET_APPROVED: ${budget}\nYour budget of $${budget} looks perfect! Let me check the logistics.`);
        }
        if (sysMsg.includes("LOGISTICS")) {
            return new AIMessage("LOGISTICS_APPROVED\nGood news: No special visas are required for your trip!");
        }
        if (sysMsg.includes("ORCHESTRATION")) {
            return new AIMessage("ORCHESTRATION_COMPLETE\nI've orchestrated the entire journey.");
        }
        if (sysMsg.includes("SCHEDULING")) {
            return new AIMessage("Everything is set. Here is your final itinerary!");
        }
        return new AIMessage("I am Ashley, how can I help?");
    }
    
    // Use real OpenAI
    if (useTools) return await llmWithTools.invoke(messages);
    return await llm.invoke(messages);
};

// ---------------------------------------------------------------------------
// 4. Graph Nodes (The 5 Phases)
// ---------------------------------------------------------------------------

// Phase 1: Discovery
const discoveryNode = async (state: typeof PilotStateAnnotation.State) => {
    const sysMsg = new SystemMessage(
        `You are Ashley, a high-end AI Travel Concierge. 
        Your current phase is DISCOVERY.
        Chat with the user to discover where they want to go. 
        If they have decided on a destination, explicitly output: "DESTINATION_LOCKED: [Destination Name]".
        Otherwise, ask clarifying questions to help them decide.`
    );
    
    const response = await invokeLLM([sysMsg, ...state.messages]);
    const responseText = response.content as string;
    
    let destination = state.destination;
    let newPhase = state.phase;
    
    if (responseText.includes("DESTINATION_LOCKED:")) {
        const match = responseText.match(/DESTINATION_LOCKED:\s*(.*)/);
        if (match) {
            destination = match[1].replace(/[^a-zA-Z0-9 ]/g, "").trim();
            newPhase = PilotPhase.REALITY_CHECK;
        }
    }
    
    return {
        messages: [response],
        destination,
        phase: newPhase,
        uiState: { aiResponse: responseText.replace(/DESTINATION_LOCKED:.*\n?/g, "") }
    };
};

// Phase 2: Reality Check (Budget)
const realityCheckNode = async (state: typeof PilotStateAnnotation.State) => {
    const sysMsg = new SystemMessage(
        `You are Ashley, a high-end AI Travel Concierge.
        Your current phase is REALITY CHECK.
        The user wants to go to ${state.destination}.
        You need to know their budget. If you don't know it, ask for it.
        If they provide a budget, use the 'estimate_trip_budget' tool to see if it's realistic.
        If realistic, tell them it looks good and explicitly output: "BUDGET_APPROVED: [Amount]".
        If not realistic, suggest alternatives and wait for their response.`
    );
    
    const response = await invokeLLM([sysMsg, ...state.messages], true);
    
    // Handle tool calls if the LLM decided to estimate budget
    if (response.tool_calls && response.tool_calls.length > 0) {
        const toolCall = response.tool_calls[0];
        if (toolCall.name === "estimate_trip_budget") {
            const result = await estimateBudgetTool.invoke(toolCall.args);
            const toolMsg = { role: "tool", content: result, tool_call_id: toolCall.id, name: toolCall.name };
            const finalResponse = await invokeLLM([sysMsg, ...state.messages, response, toolMsg]);
            
            let newPhase = state.phase;
            let budget = state.budget;
            const text = finalResponse.content as string;
            
            if (text.includes("BUDGET_APPROVED:")) {
                newPhase = PilotPhase.LOGISTICS;
                const match = text.match(/BUDGET_APPROVED:\s*(\d+)/);
                if (match) budget = parseInt(match[1], 10);
            }
            
            return {
                messages: [response, toolMsg, finalResponse],
                phase: newPhase,
                budget,
                uiState: { aiResponse: text.replace(/BUDGET_APPROVED:.*\n?/g, "") }
            };
        }
    }
    
    // If no tool calls, just process text
    let newPhase = state.phase;
    let budget = state.budget;
    const text = response.content as string;
    
    if (text.includes("BUDGET_APPROVED:")) {
        newPhase = PilotPhase.LOGISTICS;
        const match = text.match(/BUDGET_APPROVED:\s*(\d+)/);
        if (match) budget = parseInt(match[1], 10);
    }
    
    return {
        messages: [response],
        phase: newPhase,
        budget,
        uiState: { aiResponse: text.replace(/BUDGET_APPROVED:.*\n?/g, "") }
    };
};

// Phase 3: Logistics & Compliance
const logisticsNode = async (state: typeof PilotStateAnnotation.State) => {
    const sysMsg = new SystemMessage(
        `You are Ashley, an AI Travel Concierge. Phase: LOGISTICS.
        Destination: ${state.destination}. Budget: ${state.budget}.
        Use the 'check_visa_health_requirements' tool to check requirements for the destination (assume origin is USA for now if unknown).
        Present the requirements and links to the user.
        Explicitly output: "LOGISTICS_APPROVED" once you have shown them the info.`
    );
    
    const response = await invokeLLM([sysMsg, ...state.messages], true);
    
    if (response.tool_calls && response.tool_calls.length > 0) {
        const toolCall = response.tool_calls[0];
        if (toolCall.name === "check_visa_health_requirements") {
            const result = await checkVisaAndHealthTool.invoke(toolCall.args);
            const toolMsg = { role: "tool", content: result, tool_call_id: toolCall.id, name: toolCall.name };
            const finalResponse = await invokeLLM([sysMsg, ...state.messages, response, toolMsg]);
            
            const text = finalResponse.content as string;
            let newPhase = state.phase;
            if (text.includes("LOGISTICS_APPROVED")) {
                newPhase = PilotPhase.ORCHESTRATION;
            }
            
            return {
                messages: [response, toolMsg, finalResponse],
                phase: newPhase,
                logisticsInfo: JSON.parse(result),
                uiState: { aiResponse: text.replace(/LOGISTICS_APPROVED.*\n?/g, "") }
            };
        }
    }
    
    const text = response.content as string;
    let newPhase = state.phase;
    if (text.includes("LOGISTICS_APPROVED")) {
        newPhase = PilotPhase.ORCHESTRATION;
    }
    
    return {
        messages: [response],
        phase: newPhase,
        uiState: { aiResponse: text.replace(/LOGISTICS_APPROVED.*\n?/g, "") }
    };
};

// Phase 4: Orchestration (Booking Engine)
const orchestrationNode = async (state: typeof PilotStateAnnotation.State) => {
    const sysMsg = new SystemMessage(
        `You are Ashley, AI Pilot. Phase: ORCHESTRATION.
        You must build the itinerary for ${state.destination}.
        Use the search_duffel_flights, search_duffel_stays, and search_tripadvisor_activities tools.
        Call all necessary tools.
        Once you have results, output: "ORCHESTRATION_COMPLETE"`
    );
    
    const response = await invokeLLM([sysMsg, ...state.messages], true);
    
    if (response.tool_calls && response.tool_calls.length > 0) {
        const toolMessages = [];
        for (const call of response.tool_calls) {
            let result = "";
            if (call.name === "search_duffel_flights") result = await bookFlightTool.invoke(call.args);
            else if (call.name === "search_duffel_stays") result = await bookStayTool.invoke(call.args);
            else if (call.name === "search_tripadvisor_activities") result = await bookActivityTool.invoke(call.args);
            
            toolMessages.push({ role: "tool", content: result, tool_call_id: call.id, name: call.name });
        }
        
        const finalResponse = await invokeLLM([sysMsg, ...state.messages, response, ...toolMessages]);
        const text = finalResponse.content as string;
        
        let newPhase = state.phase;
        if (text.includes("ORCHESTRATION_COMPLETE")) {
            newPhase = PilotPhase.SCHEDULING;
        }
        
        return {
            messages: [response, ...toolMessages, finalResponse],
            phase: newPhase,
            uiState: { aiResponse: text.replace(/ORCHESTRATION_COMPLETE.*\n?/g, "") }
        };
    }
    
    const text = response.content as string;
    let newPhase = state.phase;
    if (text.includes("ORCHESTRATION_COMPLETE")) {
        newPhase = PilotPhase.SCHEDULING;
    }
    
    return {
        messages: [response],
        phase: newPhase,
        uiState: { aiResponse: text.replace(/ORCHESTRATION_COMPLETE.*\n?/g, "") }
    };
};

// Phase 5: Scheduling
const schedulingNode = async (state: typeof PilotStateAnnotation.State) => {
    const sysMsg = new SystemMessage(
        `You are Ashley. Phase: SCHEDULING.
        Compile the final itinerary from the conversation history.
        Summarize the bookings, total cost, and present the final plan nicely.
        Do not output any phase transition keywords, just present the final itinerary to the user.`
    );
    
    const response = await invokeLLM([sysMsg, ...state.messages]);
    
    return {
        messages: [response],
        phase: PilotPhase.FINISHED,
        uiState: { aiResponse: response.content }
    };
};

// ---------------------------------------------------------------------------
// 5. Graph Definition & Routing
// ---------------------------------------------------------------------------
const routeByPhase = (state: typeof PilotStateAnnotation.State) => {
    switch (state.phase) {
        case PilotPhase.DISCOVERY: return "discovery";
        case PilotPhase.REALITY_CHECK: return "reality_check";
        case PilotPhase.LOGISTICS: return "logistics";
        case PilotPhase.ORCHESTRATION: return "orchestration";
        case PilotPhase.SCHEDULING: return "scheduling";
        case PilotPhase.FINISHED: return END;
        default: return "discovery";
    }
};

const pilotGraph = new StateGraph(PilotStateAnnotation)
    .addNode("discovery", discoveryNode)
    .addNode("reality_check", realityCheckNode)
    .addNode("logistics", logisticsNode)
    .addNode("orchestration", orchestrationNode)
    .addNode("scheduling", schedulingNode)
    // All nodes loop back to a router that checks the current phase
    .addEdge("__start__", "discovery") // Initial entry
    
    // We use conditional edges to route after every node execution based on the phase
    .addConditionalEdges("discovery", routeByPhase)
    .addConditionalEdges("reality_check", routeByPhase)
    .addConditionalEdges("logistics", routeByPhase)
    .addConditionalEdges("orchestration", routeByPhase)
    .addConditionalEdges("scheduling", routeByPhase);

export const pilotAgent = pilotGraph.compile({ checkpointer: new MemorySaver() });

