import { pilotAgent } from "../services/agents/pilot";
import { HumanMessage } from "@langchain/core/messages";

export class BookingController {
  static async simulateDuffelFlight(destination: string) {
    return {
      type: 'flight',
      title: `Direct Flight to ${destination}`,
      details: 'SkyFlow Orchestrated • Zero-friction connection',
      price: Math.floor(Math.random() * 400 + 300),
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=100&w=400&auto=format&fit=crop'
    };
  }

  static async simulateTripAdvisorHotel(destination: string) {
    const images = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=100&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-c6a482ddc276?q=100&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=100&w=400&auto=format&fit=crop'
    ];
    return {
      type: 'hotel',
      title: `${destination} Grand Resort & Spa`,
      details: 'StayBot Verified • 5 Nights',
      price: Math.floor(Math.random() * 800 + 400),
      image: images[Math.floor(Math.random() * images.length)]
    };
  }

  static async simulateLocalGuideTour(destination: string) {
    return {
      type: 'activity', 
      title: `${destination} Cultural Expedition`,
      details: 'Local Guide Verified Experience',
      price: Math.floor(Math.random() * 150 + 50),
      image: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?q=100&w=400&auto=format&fit=crop'
    };
  }

  /**
   * Represents the Unified Booking Engine orchestrating multiple API endpoints cleanly.
   * Calculates dynamic pricing and pulls rich media URLs by proxying through the LangChain AI Pilot.
   */
  static async planTrip(prompt: string) {
    try {
        // 1. Invoke LangChain AI Pilot to process the user's prompt
        const result = await pilotAgent.invoke({
            messages: [new HumanMessage(prompt)]
        });

        const items: any[] = [];
        let total = 0;

        // 2. Extract orchestrated items from Tool Messages sent back from Duffel/TripAdvisor
        for (const msg of result.messages) {
          if (msg._getType() === "tool") {
            try {
               const parsed = JSON.parse(msg.content);
               const arr = Array.isArray(parsed) ? parsed : [parsed];
               
               arr.forEach(item => {
                   // Map Duffel flight (has airline)
                   if (item.airline) {
                       const numericPrice = parseInt((item.price || "0").toString().replace(/\D/g, '')) || 400;
                       items.push({
                           type: 'flight',
                           title: `${item.airline} Flight`,
                           details: `${item.departure} ➔ ${item.arrival}`,
                           price: numericPrice,
                           image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=100&w=400&auto=format&fit=crop'
                       });
                       total += numericPrice;
                   } 
                   // Map Duffel stay or TripAdvisor activity (has name, media array)
                   else if (item.name && item.media) {
                       const numericPrice = parseInt((item.price || "0").toString().replace(/\D/g, '')) || 200;
                       items.push({
                           type: item.id?.startsWith("tour") ? 'activity' : 'hotel',
                           title: item.name,
                           details: `Verified Booking`,
                           price: numericPrice,
                           image: item.media[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=100&w=400'
                       });
                       total += numericPrice;
                   }
               });
            } catch (e) {
               console.log("Failed to parse tool content", msg.content);
            }
          }
        }

        // 3. Fallback if no tools called
        if (items.length === 0) {
            items.push(await this.simulateDuffelFlight("Destination"));
            items.push(await this.simulateTripAdvisorHotel("Destination"));
            total = items.reduce((acc, curr) => acc + curr.price, 0);
        }

        // 4. Extract final AI response
        let aiResponse = "";
        const lastMsg = result.messages[result.messages.length - 1];
        if (lastMsg && lastMsg._getType() === "ai") {
            aiResponse = lastMsg.content;
        }

        return { items, total, aiResponse };
    } catch (error) {
        console.error("AI Pilot Orchestration failed, using fallback models.", error);
        // Fallback multi-modal orchestration 
        const [flight1, hotel, activity, flight2] = await Promise.all([
          this.simulateDuffelFlight("Destination"),
          this.simulateTripAdvisorHotel("Destination"),
          this.simulateLocalGuideTour("Destination"),
          this.simulateDuffelFlight('Return')
        ]);

        const items = [flight1, hotel, activity, flight2];
        const total = items.reduce((acc, curr) => acc + curr.price, 0);

        return { items, total, aiResponse: "I encountered an error connecting to the AI Oracle, but I've assembled a fallback itinerary for you!" };
    }
  }
}
