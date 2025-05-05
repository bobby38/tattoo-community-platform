#!/usr/bin/env python3
import json

# Load the existing coordinates
with open("/home/ubuntu/tattoo_project/geocoding/studio_coordinates.json", "r") as f:
    studios = json.load(f)

# Manual coordinates for studios that couldn't be geocoded
manual_coordinates = {
    "Familiar Strangers Tattoo Studio": {"lat": 1.2875, "lng": 103.8476},  # Approximate for Upper Circular Road
    "Alive Tattoo Studio": {"lat": 1.2839, "lng": 103.8452},  # Approximate for New Bridge Road
    "Exotic Tattoos & Piercings": {"lat": 1.3071, "lng": 103.8327},  # Approximate for Scotts Road
    "Borneo Ink Tattoo": {"lat": 3.1662, "lng": 101.6564},  # Approximate for Mont Kiara
    "The Tattoo Parlor": {"lat": 3.1065, "lng": 101.5983},  # Approximate for Kelana Jaya
    "Hustla Ink Tattoo Studio": {"lat": 3.1617, "lng": 101.7425},  # Approximate for Jalan Ampang
    "Pitt's Tattoo & Piercing": {"lat": 5.4173, "lng": 100.3354},  # Approximate for Georgetown
    "Lostchild Tattoo & Piercing": {"lat": 5.4148, "lng": 100.3293}  # Approximate for Georgetown
}

# Update the studios with manual coordinates
for studio in studios:
    if studio["lat"] is None and studio["name"] in manual_coordinates:
        studio["lat"] = manual_coordinates[studio["name"]]["lat"]
        studio["lng"] = manual_coordinates[studio["name"]]["lng"]

# Save the updated coordinates
with open("/home/ubuntu/tattoo_project/geocoding/studio_coordinates_complete.json", "w") as f:
    json.dump(studios, f, indent=2)

print("Manual coordinates added. Results saved to /home/ubuntu/tattoo_project/geocoding/studio_coordinates_complete.json")
