from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import re
import json
from datetime import datetime
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ExFlo AI Pilot Backend — Ashley 1.0")

# ──────────────────────────────────────────────
# CORS
# ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────
AMADEUS_CLIENT_ID = os.getenv("AMADEUS_CLIENT_ID")
AMADEUS_CLIENT_SECRET = os.getenv("AMADEUS_CLIENT_SECRET")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ──────────────────────────────────────────────
# AMADEUS CLIENT (optional)
# ──────────────────────────────────────────────
amadeus_client = None
if AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET:
    try:
        from amadeus import Client
        amadeus_client = Client(
            client_id=AMADEUS_CLIENT_ID,
            client_secret=AMADEUS_CLIENT_SECRET
        )
        print("[OK] Amadeus client initialized.")
    except Exception as e:
        print(f"[WARN] Amadeus failed: {e}")

# ──────────────────────────────────────────────
# ASHLEY SYSTEM PROMPT
# ──────────────────────────────────────────────
_prompt_path = os.path.join(os.path.dirname(__file__), "..", "ashley_prompt.md")
if os.path.exists(_prompt_path):
    with open(_prompt_path, "r", encoding="utf-8") as f:
        ASHLEY_SYSTEM_PROMPT = f.read()
    print("[OK] Ashley prompt loaded from file.")
else:
    ASHLEY_SYSTEM_PROMPT = """
You are Ashley, Lead Travel Pilot & Concierge at ExFlo.
You are sophisticated, warm, and hyper-competent.
NEVER call yourself an AI, chatbot, or LLM. You are Ashley, the Pilot.
Use concierge language: curate, orchestrate, seamless, secured, optimized.
Keep responses premium, warm, and actionable. Use ✈️ or 🛡️ sparingly.
"""

# ──────────────────────────────────────────────
# IATA RESOLUTION
# ──────────────────────────────────────────────
IATA_MAP = {
    "nairobi": "NBO", "entebbe": "EBB", "london": "LHR", "new york": "JFK",
    "paris": "CDG", "tokyo": "NRT", "dubai": "DXB", "mombasa": "MBA",
    "kigali": "KGL", "dar es salaam": "DAR", "johannesburg": "JNB",
    "bali": "DPS", "denpasar": "DPS", "barcelona": "BCN", "madrid": "MAD",
    "amsterdam": "AMS", "frankfurt": "FRA", "singapore": "SIN",
    "bangkok": "BKK", "sydney": "SYD", "toronto": "YYZ", "montreal": "YUL",
    "chicago": "ORD", "los angeles": "LAX", "miami": "MIA", "cairo": "CAI",
    "lagos": "LOS", "accra": "ACC", "addis ababa": "ADD", "kampala": "EBB",
    "rome": "FCO", "milan": "MXP", "istanbul": "IST", "seoul": "ICN",
    "mumbai": "BOM", "delhi": "DEL", "beijing": "PEK", "shanghai": "PVG",
    "kuala lumpur": "KUL", "hong kong": "HKG", "doha": "DOH", "abu dhabi": "AUH",
}

def resolve_iata(city: str) -> str:
    return IATA_MAP.get(city.lower().strip(), city.upper()[:3])

def parse_duration_minutes(d: str) -> int:
    h = int(re.search(r"(\d+)H", d).group(1)) if re.search(r"(\d+)H", d) else 0
    m = int(re.search(r"(\d+)M", d).group(1)) if re.search(r"(\d+)M", d) else 0
    return h * 60 + m

def format_duration(d: str) -> str:
    h = int(re.search(r"(\d+)H", d).group(1)) if re.search(r"(\d+)H", d) else 0
    m = int(re.search(r"(\d+)M", d).group(1)) if re.search(r"(\d+)M", d) else 0
    return f"{h}h {m:02d}m" if m else f"{h}h"

# ──────────────────────────────────────────────
# FLIGHT DATA
# ──────────────────────────────────────────────
MOCK_FLIGHTS = [
    {"id": "EF-001", "price": {"total": "320.00", "currency": "USD"}, "itineraries": [{"duration": "PT12H45M"}], "airline": "British Airways"},
    {"id": "EF-002", "price": {"total": "450.00", "currency": "USD"}, "itineraries": [{"duration": "PT8H30M"}],  "airline": "Kenya Airways"},
    {"id": "EF-003", "price": {"total": "890.00", "currency": "USD"}, "itineraries": [{"duration": "PT7H15M"}],  "airline": "Emirates"},
]

def get_flights(origin: str, destination: str, date: str) -> dict:
    """Fetch live flights from Amadeus. Returns {'offers': [], 'carriers': {}}."""
    if amadeus_client:
        try:
            response = amadeus_client.shopping.flight_offers_search.get(
                originLocationCode=origin, destinationLocationCode=destination,
                departureDate=date, adults=1, max=5, currencyCode="USD"
            )
            # Amadeus SDK response.result contains the full JSON
            data = response.result.get("data", [])
            dictionaries = response.result.get("dictionaries", {})
            carriers = dictionaries.get("carriers", {})
            
            return {"offers": data, "carriers": carriers}
        except Exception as e:
            print(f"[WARN] Amadeus flight search failed: {e}. Using mock.")
    
    return {"offers": MOCK_FLIGHTS, "carriers": {}}

def build_flight_manifest(flight_data: dict, origin: str, destination: str) -> dict:
    """Build a tiered manifest from Amadeus offers and carrier dictionaries."""
    offers = flight_data["offers"]
    carriers = flight_data["carriers"]
    
    if not offers:
        return {"type": "flight_manifest", "origin": origin, "destination": destination, "options": []}

    def get_price(f): return float(f["price"]["total"])
    def get_dur(f):   return parse_duration_minutes(f["itineraries"][0]["duration"])

    # Sort to find tiered options
    sp = sorted(offers, key=get_price)
    sd = sorted(offers, key=get_dur)
    
    economic = sp[0]
    elite    = sd[0]
    prime    = sp[len(sp) // 2] if len(sp) > 1 else offers[0]

    def fmt(f, tier):
        itinerary = f["itineraries"][0]
        segments = itinerary.get("segments", [])
        carrier_code = segments[0].get("carrierCode", "FL") if segments else "FL"
        airline_name = carriers.get(carrier_code, f.get("airline", carrier_code))
        
        return {
            "tier": tier, 
            "id": f.get("id", "EF-XXX"), 
            "airline": airline_name,
            "price": float(f["price"]["total"]), 
            "currency": f["price"].get("currency", "USD"),
            "duration": format_duration(itinerary["duration"]),
            "origin": origin, 
            "destination": destination,
            "carrierCode": carrier_code
        }

    return {
        "type": "flight_manifest", 
        "origin": origin, 
        "destination": destination,
        "options": [fmt(prime, "Prime"), fmt(economic, "Economic"), fmt(elite, "Elite")]
    }

def build_hotel_briefing(city: str) -> dict:
    cap = city.title()
    return {
        "type": "hotel_briefing", "city": cap,
        "options": [
            {"tier": "Prime",    "name": f"{cap} Grand Palace",     "price": 250, "rating": 5, "amenities": ["Spa", "Rooftop Pool", "Concierge"]},
            {"tier": "Economic", "name": f"{cap} Boutique Inn",     "price": 120, "rating": 4, "amenities": ["Breakfast Included", "City View"]},
            {"tier": "Elite",    "name": f"The Royal {cap} Suites", "price": 550, "rating": 5, "amenities": ["Private Butler", "Helipad", "Michelin Dining"]},
        ]
    }

# ──────────────────────────────────────────────
# INTENT EXTRACTION (AI-POWERED)
# ──────────────────────────────────────────────
def extract_intent_gemini(message: str, history: list) -> dict:
    """Use Gemini to extract travel intent in a structured JSON format."""
    if not GOOGLE_API_KEY:
        # Fallback to a very basic regex if no key (for safety)
        return {"flight": None, "hotel": None}

    prompt = f"""
    You are a travel logistics extractor. Extract travel parameters from the user's message.
    Respond ONLY with a valid JSON object. No markdown, no text.
    
    JSON Schema:
    {{
        "flight": {{ "origin": "city/airport", "destination": "city/airport", "date": "YYYY-MM-DD" }},
        "hotel": {{ "city": "city name" }}
    }}
    
    If an entity is not mentioned, set it to null. 
    Current date: {datetime.now().strftime("%Y-%m-%d")}
    
    User Message: "{message}"
    """

    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1, # High precision
            "response_mime_type": "application/json"
        }
    }

    try:
        response = httpx.post(
            f"{GEMINI_URL}?key={GOOGLE_API_KEY}",
            json=payload,
            timeout=10.0
        )
        response.raise_for_status()
        data = response.json()
        raw_json = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        # Clean up possible markdown backticks
        raw_json = re.sub(r"```json\n?|\n?```", "", raw_json)
        return json.loads(raw_json)
    except Exception as e:
        print(f"[WARN] Gemini Intent Extraction failed: {e}")
        return {"flight": None, "hotel": None}

def get_hotels(city: str) -> list:
    """Fetch live hotels using Amadeus (mock fallback)."""
    if amadeus_client:
        try:
            # 1. Resolve City to IATA if needed
            iata = resolve_iata(city)
            # 2. Get Hotels in City
            hotels_resp = amadeus_client.reference_data.locations.hotels.by_city.get(cityCode=iata)
            hotel_ids = [h["hotelId"] for h in hotels_resp.data[:5]]
            
            if not hotel_ids:
                return []
                
            # 3. Get Offers for those hotels (simplified)
            # In a real app, we'd need check-in/out dates. 
            # For this 'orchestration' demo, we use a slightly mock variety of live names.
            return [
                {"name": h.get("name", "Luxury Hotel"), "hotelId": h["hotelId"]} 
                for h in hotels_resp.data[:3]
            ]
        except Exception as e:
            print(f"[WARN] Amadeus hotel search failed: {e}")
    
    # Realistic mock variety
    cap = city.title()
    return [
        {"tier": "Prime",    "name": f"{cap} Grand Palace",     "price": 250, "rating": 5, "amenities": ["Spa", "Rooftop Pool"]},
        {"tier": "Economic", "name": f"{cap} Boutique Inn",     "price": 120, "rating": 4, "amenities": ["Breakfast Included"]},
        {"tier": "Elite",    "name": f"The Royal {cap} Suites", "price": 550, "rating": 5, "amenities": ["Private Butler", "Helipad"]},
    ]

# ──────────────────────────────────────────────
# GEMINI REST API (no gRPC, no SDK required)
# ──────────────────────────────────────────────
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

def call_gemini_rest(user_message: str, history: list, context_data: str = "") -> str:
    """Call Gemini via REST API — zero gRPC dependency."""
    if not GOOGLE_API_KEY:
        # Graceful template fallback
        if context_data:
            return (
                "It would be my pleasure to arrange that for you. I have polled the global grids and curated the finest options for your journey.\n\n"
                "Please review the manifest above and let me know which Flow you wish to secure. "
                "I am standing by to initiate the booking sequence. ✈️"
            )
        return (
            "Welcome to ExFlo. I am Ashley, your dedicated pilot. "
            "I am ready to orchestrate your next journey. Please share your destination and travel dates, "
            "and I will begin scanning the global inventory. ✈️"
        )

    system_text = ASHLEY_SYSTEM_PROMPT
    if context_data:
        system_text += f"\n\n--- LIVE TRAVEL DATA (weave naturally into your response) ---\n{context_data}\n---"

    # Build Gemini REST contents
    contents = []
    for msg in history[-10:]:
        role = "user" if msg.get("role") == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg.get("content", "")}]})
    contents.append({"role": "user", "parts": [{"text": user_message}]})

    payload = {
        "system_instruction": {"parts": [{"text": system_text}]},
        "contents": contents,
        "generationConfig": {
            "temperature": 0.85,
            "maxOutputTokens": 800,
        }
    }

    try:
        response = httpx.post(
            f"{GEMINI_URL}?key={GOOGLE_API_KEY}",
            json=payload,
            timeout=30.0
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"[WARN] Gemini REST call failed: {e}")
        return (
            "My sincerest apologies — I encountered a temporary disruption on the orchestration layer. "
            "I am re-calibrating. Please resend your request and I will prioritize it immediately."
        )

# ──────────────────────────────────────────────
# MODELS
# ──────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

# ──────────────────────────────────────────────
# ENDPOINTS
# ──────────────────────────────────────────────
@app.get("/")
def read_root():
    return {
        "message": "ExFlo Backend Active",
        "agent": "Ashley 1.0",
        "status": "online",
        "gemini": "REST (no grpcio)",
        "amadeus": "live" if amadeus_client else "mock"
    }

@app.post("/chat")
def chat_with_ashley(request: ChatRequest):
    user_msg = request.message
    history  = [m.dict() for m in request.history]

    # 1. AI-Driven Intent Extraction
    intent = extract_intent_gemini(user_msg, history)
    
    manifest = None
    context_parts = []

    # 2. Flight Orchestration
    if intent.get("flight"):
        fi = intent["flight"]
        origin_iata = resolve_iata(fi["origin"])
        dest_iata   = resolve_iata(fi["destination"])
        travel_date = fi.get("date") or datetime.now().replace(month=6, day=15).strftime("%Y-%m-%d")
        
        raw_flights = get_flights(origin_iata, dest_iata, travel_date)
        manifest    = build_flight_manifest(raw_flights, origin_iata, dest_iata)
        opts        = manifest["options"]
        context_parts.append(
            f"Flight results: {fi['origin'].title()} ({origin_iata}) → {fi['destination'].title()} ({dest_iata}) on {travel_date}.\n"
            f"• Prime: ${opts[0]['price']} via {opts[0]['airline']} ({opts[0]['duration']})\n"
            f"• Economic: ${opts[1]['price']} via {opts[1]['airline']} ({opts[1]['duration']})\n"
            f"• Elite: ${opts[2]['price']} via {opts[2]['airline']} ({opts[2]['duration']})"
        )

    # 3. Hotel Orchestration
    if intent.get("hotel"):
        city = intent["hotel"]["city"]
        hotel_options = get_hotels(city)
        
        # Build Briefing
        hotel_briefing = {
            "type": "hotel_briefing", 
            "city": city.title(),
            "options": hotel_options if "price" in hotel_options[0] else [
                {"tier": "Prime",    "name": hotel_options[0]["name"], "price": 280, "rating": 5, "amenities": ["Boutique", "Central"]},
                {"tier": "Economic", "name": hotel_options[1]["name"] if len(hotel_options)>1 else "City Inn", "price": 140, "rating": 4, "amenities": ["WiFi", "Breakfast"]},
                {"tier": "Elite",    "name": hotel_options[2]["name"] if len(hotel_options)>2 else "Grand Plaza", "price": 520, "rating": 5, "amenities": ["Butler", "Spa"]},
            ]
        }
        
        # If we already have a flight manifest, we might want to prioritize it or merge.
        # For now, if both exist, we return the flight manifest first (or whichever comes last in the logic)
        # but both are added to context so Ashley knows about them.
        if manifest is None:
            manifest = hotel_briefing
        
        opts = hotel_briefing["options"]
        context_parts.append(
            f"Hotel results in {city.title()}:\n"
            f"• Prime: {opts[0]['name']} at ${opts[0]['price']}/night\n"
            f"• Economic: {opts[1]['name']} at ${opts[1]['price']}/night\n"
            f"• Elite: {opts[2]['name']} at ${opts[2]['price']}/night"
        )

    # 4. Generate AI Response with live context
    ashley_response = call_gemini_rest(user_msg, history, "\n\n".join(context_parts))

    return {
        "response": ashley_response,
        "role": "assistant",
        "manifest": manifest,
        "intent": {
            "has_flight": intent.get("flight") is not None,
            "has_hotel":  intent.get("hotel") is not None,
            "details": intent
        }
    }
