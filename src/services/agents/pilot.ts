import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchFlights, searchStays } from "../booking/duffel";
import { searchActivities } from "../booking/tripadvisor";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { searchFlights, searchStays } from "../booking/duffel";
import { searchActivities } from "../booking/tripadvisor";

// LangChain tools for the AI Pilot
export const bookFlightTool = tool(
  async ({ origin, destination, date }) => {
    return JSON.stringify(await searchFlights(origin, destination, date));
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
    return JSON.stringify(await searchStays(location, checkIn, checkOut));
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
    return JSON.stringify(await searchActivities(location));
  },
  {
    name: "search_tripadvisor_activities",
    description: "Search for local activities and tours using TripAdvisor Content API",
    schema: z.object({
      location: z.string().describe("Location name to search for activities (e.g. Paris, Eiffel Tower)")
    })
  }
);

// Complete Initialization
const tools = [bookFlightTool, bookStayTool, bookActivityTool];

export const pilotAgent = createReactAgent({ 
    llm: new ChatOpenAI({ 
        modelName: "gpt-4o-mini", 
        temperature: 0, 
        openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY || "mock-placeholder-key" 
    }), 
    tools 
});
