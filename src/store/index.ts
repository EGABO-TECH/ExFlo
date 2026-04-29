export interface FlowTrip {
  id: string;
  destination: string;
  amount: number;
  status: 'pending_payment' | 'active' | 'completed';
  txHash?: string;
  dates: string;
  destinationLat: number;
  destinationLon: number;
}

const DEFAULT_MOCK_TRIPS: FlowTrip[] = [
  {
    id: "TRP-UG502",
    destination: "Uganda Safari",
    amount: 1450,
    status: "active",
    dates: "Oct 12 – Oct 17, 2026",
    destinationLat: 2.2289,
    destinationLon: 31.6569,
  }
];

export const TripStore = {
  getTrips: (): FlowTrip[] => {
    const data = localStorage.getItem('exflo_active_trips');
    if (data) {
        try {
            return JSON.parse(data);
        } catch {
            return DEFAULT_MOCK_TRIPS;
        }
    }
    return DEFAULT_MOCK_TRIPS;
  },
  addTrip: (trip: FlowTrip) => {
    const trips = TripStore.getTrips();
    trips.push(trip);
    localStorage.setItem('exflo_active_trips', JSON.stringify(trips));
    // Dispatch custom event so other components can reactively update
    window.dispatchEvent(new Event('exflo_trips_updated'));
  },
  updateTripStatus: (id: string, newStatus: FlowTrip['status'], txHash?: string) => {
    const trips = TripStore.getTrips();
    const updated = trips.map(t => t.id === id ? { ...t, status: newStatus, txHash: txHash || t.txHash } : t);
    localStorage.setItem('exflo_active_trips', JSON.stringify(updated));
    window.dispatchEvent(new Event('exflo_trips_updated'));
  }
};
