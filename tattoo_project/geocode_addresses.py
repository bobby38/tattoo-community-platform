#!/usr/bin/env python3
import requests
import json
import time

# List of addresses to geocode
addresses = [
    # Singapore studios
    {"name": "Lovesick Tattoo Studio", "address": "63 Circular Road, Singapore 049417", "country": "Singapore", "city": "Singapore"},
    {"name": "Familiar Strangers Tattoo Studio", "address": "20 Upper Circular Road, The Riverwalk #01-10, Singapore", "country": "Singapore", "city": "Singapore"},
    {"name": "Alive Tattoo Studio", "address": "211 New Bridge Road, Lucky Chinatown, Singapore", "country": "Singapore", "city": "Singapore"},
    {"name": "Vagabond Ink Tattoo Studio", "address": "Chinatown, Singapore", "country": "Singapore", "city": "Singapore"},
    {"name": "Exotic Tattoos & Piercings", "address": "14 Scotts Road, Far East Plaza, Singapore", "country": "Singapore", "city": "Singapore"},
    
    # Malaysia studios
    {"name": "Borneo Ink Tattoo", "address": "B-09-15, Gateway Kiaramas Corporate Suites, No 1 Jalan Desa Kiara, Mont Kiara, 50480 Kuala Lumpur, Malaysia", "country": "Malaysia", "city": "Kuala Lumpur"},
    {"name": "Pink Tattoos", "address": "Jalan Telawi, Bangsar, Kuala Lumpur, Malaysia", "country": "Malaysia", "city": "Kuala Lumpur"},
    {"name": "The Tattoo Parlor", "address": "31-1 Block C, Zenith Corporate Park, SS7 Kelana Jaya, Petaling Jaya, Selangor, Malaysia", "country": "Malaysia", "city": "Petaling Jaya"},
    {"name": "Hustla Ink Tattoo Studio", "address": "No. AR18, Ground Floor, Megan Ambassy, Holiday Place, 225 Jalan Ampang, 50450 Kuala Lumpur, Malaysia", "country": "Malaysia", "city": "Kuala Lumpur"},
    {"name": "Pitt's Tattoo & Piercing", "address": "No. 174, Jalan Dr. Lim Chwee Leong, Georgetown, 10100 Penang, Malaysia", "country": "Malaysia", "city": "Penang"},
    {"name": "Ink & Needles Tattoo Studio", "address": "19, Lebuh Keng Kwee, George Town, Penang, 10450, Malaysia", "country": "Malaysia", "city": "Penang"},
    {"name": "Lostchild Tattoo & Piercing", "address": "The Rise Collection 3, 10150 Georgetown, Penang, Malaysia", "country": "Malaysia", "city": "Penang"}
]

# Function to geocode an address using Nominatim
def geocode_address(address):
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }
    
    headers = {
        "User-Agent": "TattooStudioResearch/1.0"
    }
    
    try:
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if data and len(data) > 0:
            return {
                "lat": float(data[0]["lat"]),
                "lng": float(data[0]["lon"])
            }
        else:
            return {"lat": None, "lng": None}
    except Exception as e:
        print(f"Error geocoding address '{address}': {e}")
        return {"lat": None, "lng": None}

# Geocode all addresses
results = []
for studio in addresses:
    print(f"Geocoding: {studio['name']} - {studio['address']}")
    
    # Combine address components
    full_address = studio["address"]
    
    # Get coordinates
    coordinates = geocode_address(full_address)
    
    # Add to results
    studio_info = {
        "name": studio["name"],
        "country": studio["country"],
        "city": studio["city"],
        "address": studio["address"],
        "lat": coordinates["lat"],
        "lng": coordinates["lng"]
    }
    results.append(studio_info)
    
    # Sleep to respect rate limits
    time.sleep(1)

# Save results to file
with open("/home/ubuntu/tattoo_project/geocoding/studio_coordinates.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"Geocoding complete. Results saved to /home/ubuntu/tattoo_project/geocoding/studio_coordinates.json")
