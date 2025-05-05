import json
import requests
import time
from typing import Dict, List, Optional, Any

def geocode_address(address: str, country: str) -> Dict[str, Optional[float]]:
    """
    Geocode an address using Nominatim (OpenStreetMap)
    Returns a dictionary with lat and lng
    """
    if not address:
        return {"lat": None, "lng": None}
    
    # Format the query with country for better results
    query = f"{address}, {country}"
    
    # Nominatim API endpoint
    url = "https://nominatim.openstreetmap.org/search"
    
    # Parameters for the request
    params = {
        "q": query,
        "format": "json",
        "limit": 1,
    }
    
    # Add a user agent as required by Nominatim's usage policy
    headers = {
        "User-Agent": "TattooEventGeocoder/1.0"
    }
    
    try:
        # Make the request
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        
        # Parse the response
        data = response.json()
        
        # Check if we got any results
        if data and len(data) > 0:
            lat = float(data[0]["lat"])
            lng = float(data[0]["lon"])
            return {"lat": lat, "lng": lng}
        else:
            print(f"No geocoding results found for: {query}")
            return {"lat": None, "lng": None}
    
    except Exception as e:
        print(f"Error geocoding address '{query}': {str(e)}")
        return {"lat": None, "lng": None}

def process_events(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Process a list of events, adding geocoding information
    """
    for event in events:
        # Skip if no address or already has coordinates
        if not event.get("address") or (event.get("lat") and event.get("lng")):
            continue
        
        # Get country and address
        country = event.get("country", "")
        address = event.get("address", "")
        
        # Geocode the address
        coords = geocode_address(address, country)
        
        # Update the event with coordinates
        event["lat"] = coords["lat"]
        event["lng"] = coords["lng"]
        
        # Sleep to respect rate limits
        time.sleep(1)
    
    return events

def main():
    # Check if input file exists
    try:
        with open('events_to_geocode.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Input file 'events_to_geocode.json' not found.")
        return
    
    # Process the events
    if "events" in data:
        data["events"] = process_events(data["events"])
    else:
        data = process_events(data)
    
    # Write the results to a file
    with open('events_geocoded.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Geocoding complete. Results saved to 'events_geocoded.json'")

if __name__ == "__main__":
    main()
