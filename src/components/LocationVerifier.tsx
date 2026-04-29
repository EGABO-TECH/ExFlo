import React, { useState } from 'react';
import { SmartEscrowService } from '../blockchain/escrow';
import { TripStore } from '../store';

export const LocationVerifier: React.FC<{ bookingId: string, onVerified?: () => void }> = ({ bookingId, onVerified }) => {
  const [status, setStatus] = useState<string>("Pending");

  const handleCheckIn = async () => {
    setStatus("Verifying coordinates with AI Oracle...");
    try {
        const activeEscrow = TripStore.getTrips().find(t => t.id === bookingId);
        if (!activeEscrow) throw new Error("Booking Escrow not found in active state.");

        // Deterministic simulation for ExFlo Trustless Check-In demo
        const coords = {
            latitude: activeEscrow.destinationLat + 0.0001,
            longitude: activeEscrow.destinationLon + 0.0001
        };

        const mockEscrowDetail = {
            id: bookingId,
            amount: activeEscrow.amount,
            providerAddress: "0xVendor",
            isReleased: false,
            destinationLat: activeEscrow.destinationLat,
            destinationLon: activeEscrow.destinationLon
        };

        const success = await SmartEscrowService.verifyAndReleaseFunds(mockEscrowDetail, coords.latitude, coords.longitude);
        
        if (success) {
            setStatus("Match < 200m. Releasing Escrow...");
            // Simulated transaction delay overhead
            setTimeout(() => {
                setStatus(`Check-in Successful! Tx: Verified`);
                TripStore.updateTripStatus(bookingId, "active");
                if (onVerified) onVerified();
            }, 1000);
        } else {
            setStatus(`Location Failure. Please move closer to the verified coordinates.`);
        }
    } catch (error: any) {
        setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-slate-50">
      <h3 className="text-xl font-bold mb-2">Trustless Check-in</h3>
      <p className="mb-4">Use the ExFlo app to verify your presence and release the escrow funds.</p>
      
      <button 
        onClick={handleCheckIn}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
      >
        Check-In Now
      </button>

      {status && (
        <div className="mt-4 p-2 bg-slate-200 rounded text-sm font-mono">
          Logs: {status}
        </div>
      )}
    </div>
  );
};
