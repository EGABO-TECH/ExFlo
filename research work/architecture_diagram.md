# ExFlo Architecture Diagram

This diagram illustrates the data flow between the AI Pilot, the MiniPay Wallet, and the Celo Smart Contract for the "Verification of Presence" and "Smart Escrow" modules.

```mermaid
sequenceDiagram
    participant User as User (Traveler)
    participant UI as ExFlo UI (React/Vite)
    participant AI as AI Pilot (Services)
    participant Geo as Geofencing Service
    participant MiniPay as MiniPay SDK (Wallet)
    participant Celo as Celo Smart Contract (Escrow)

    %% Planning Phase
    User->>UI: Plan Trip & Confirm Itinerary
    UI->>AI: Request Itinerary Optimization
    AI-->>UI: Optimized Itinerary Details
    
    %% Funding Phase
    User->>UI: Proceed to Payment
    UI->>MiniPay: Initialize Payment (Connect Wallet)
    MiniPay-->>UI: Wallet Connected
    UI->>Celo: Lock Funds in Smart Escrow
    Celo-->>UI: Transaction Hash (Funds Locked)
    
    %% Verification Phase (On Trip)
    User->>UI: Arrive at Destination
    UI->>Geo: Get GPS Coordinates
    Geo->>Geo: Calculate Haversine Distance (< 200m)
    Geo-->>UI: Verification Success (Is Present)
    
    %% Escrow Release
    UI->>Celo: Trigger Escrow Release (Signed Proof)
    Celo->>Celo: Verify Conditions (Presence = true)
    Celo-->>MiniPay: Transfer Funds to Vendor/Service
    MiniPay-->>UI: Payment Successful
    UI-->>User: Escrow Completed & Receipt
```
