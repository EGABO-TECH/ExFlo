import { Duffel } from '@duffel/api';

// Initialize Duffel Client
// Note: In a real app, the access token should be in environment variables
export const duffel = new Duffel({
  token: import.meta.env.VITE_DUFFEL_TOKEN || 'mock_duffel_token',
});

// Mock function for searching flights
export const searchFlights = async (origin: string, destination: string, departureDate: string) => {
  console.log(`Searching flights on Duffel API for ${origin} to ${destination} on ${departureDate}`);
  try {
    // Return mock data for the UI
    return [
      {
        id: "flt_123",
        airline: "Blue Airways",
        price: "450 USD",
        departure: origin,
        arrival: destination,
        date: departureDate
      }
    ];
  } catch (error) {
    console.error("Duffel Flight Search Error:", error);
    return null;
  }
};

// Mock function for searching hotel stays
export const searchStays = async (location: string, checkIn: string, checkOut: string) => {
  console.log(`Searching stays on Duffel API for ${location} from ${checkIn} to ${checkOut}`);
  try {
    // Return mock rich media data for the hotels
    return [
      {
        id: "stay_1",
        name: "Grand Hotel ExFlo",
        price: "200 USD/night",
        media: ["https://placehold.co/600x400/png?text=Grand+Hotel+Room+1"],
        latitude: 48.8566,
        longitude: 2.3522 // Paris coordinates for geofencing check
      }
    ];
  } catch (error) {
    console.error("Duffel Stays Search Error:", error);
    return null;
  }
};
