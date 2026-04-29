// Mock TripAdvisor Content API Client

export const searchActivities = async (locationQuery: string) => {
  // `https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=${locationQuery}`
  console.log(`Searching activities for ${locationQuery} using TripAdvisor`);
  
  return [
    {
       id: "tour_1",
       name: "Eiffel Tour Guided Access",
       media: ["https://placehold.co/600x400/png?text=Eiffel+Tour"],
       price: "50 USD",
       latitude: 48.8584,
       longitude: 2.2945 // Eiffel Tower coordinates
    },
    {
       id: "tour_2",
       name: "Louvre Museum Pass",
       media: ["https://placehold.co/600x400/png?text=Louvre+Museum"],
       price: "35 USD",
       latitude: 48.8606,
       longitude: 2.3376 // Louvre coordinates
    }
  ];
}
