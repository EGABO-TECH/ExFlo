import { MapPin } from "lucide-react";

export default function Trips() {
  const trips = [
    {
      destination: "Uganda Safari",
      dates: "Oct 12 – Oct 17, 2026",
      cost: "1450 cUSD",
      status: "active",
    },
    {
      destination: "Tokyo, Japan",
      dates: "Apr 15 – Apr 22, 2026",
      cost: "$2840",
      status: "active",
    },
    {
      destination: "Barcelona, Spain",
      dates: "May 10 – May 16, 2026",
      cost: "$1920",
      status: "upcoming",
    },
    {
      destination: "Bali, Indonesia",
      dates: "Feb 1 – Feb 10, 2026",
      cost: "$2150",
      status: "completed",
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold mb-2">My Trips</h1>
        <p className="text-muted-foreground text-sm">
          Your AI Pilot is monitoring all active journeys.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {trips.map((trip, i) => (
          <div
            key={i}
            className="group relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 transition-all hover:bg-card/50 hover:border-border"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {trip.destination}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {trip.dates}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t border-border/50 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    trip.status === "active"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : trip.status === "upcoming"
                      ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      : "bg-secondary text-muted-foreground border border-border/50"
                  }`}
                >
                  {trip.status}
                </span>
                <span className="font-bold text-lg">{trip.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
