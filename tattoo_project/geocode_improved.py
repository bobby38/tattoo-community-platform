import json
import requests
import time
from typing import Dict, List, Optional, Any

def geocode_address(address: str, city: str, country: str) -> Dict[str, Optional[float]]:
    """
    Geocode an address using Nominatim (OpenStreetMap)
    Returns a dictionary with lat and lng
    """
    if not address and not city:
        return {"lat": None, "lng": None}
    
    # Format the query with city and country for better results
    if address and "," not in address and city:
        query = f"{address}, {city}, {country}"
    elif address:
        query = f"{address}, {country}"
    else:
        query = f"{city}, {country}"
    
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
            # Try with just city and country if address failed
            if address and city:
                print(f"No results for '{query}', trying with just city and country")
                return geocode_address("", city, country)
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
        # Skip if already has coordinates
        if event.get("lat") and event.get("lng"):
            continue
        
        # Get country, city and address
        country = event.get("country", "")
        city = event.get("city", "")
        address = event.get("address", "")
        
        # Geocode the address
        coords = geocode_address(address, city, country)
        
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
    with open('sea_events.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Geocoding complete. Results saved to 'sea_events.json'")

if __name__ == "__main__":
    main()
