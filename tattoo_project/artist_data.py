#!/usr/bin/env python3
import json

# Load the studio data
with open("/home/ubuntu/tattoo_project/geocoding/studio_coordinates_complete.json", "r") as f:
    studios = json.load(f)

# Create a mapping of studio names to IDs
studio_id_map = {studio["name"]: i+1 for i, studio in enumerate(studios)}

# Artist data
artists = [
    # Lovesick Tattoo Studio artists
    {
        "id": 1,
        "studio_id": studio_id_map["Lovesick Tattoo Studio"],
        "country": "Singapore",
        "name": "Louis Tham",
        "bio": "Award-winning realism tattoo artist renowned for his intricate and lifelike designs. He is a black and grey tattoo specialist based in Singapore.",
        "years_experience": 15,
        "styles": ["Realism", "Black and Grey", "Portrait"],
        "tribes": [],
        "inspiration_sources": ["Photography", "Fine Art"],
        "social": {
            "instagram": "@louislovesicktattoo",
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Eternal Ink", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.9,
            "count": 120
        },
        "reviews": [
            {
                "user_id": "user123",
                "rating": 5,
                "comment": "Louis created an amazing portrait tattoo that looks incredibly realistic. His attention to detail is outstanding."
            }
        ]
    },
    {
        "id": 2,
        "studio_id": studio_id_map["Lovesick Tattoo Studio"],
        "country": "Singapore",
        "name": "Mr. Ling",
        "bio": "Experienced and highly talented tattoo artist specializing in incredibly intricate Japanese and dotwork tattoo art.",
        "years_experience": 10,
        "styles": ["Japanese", "Dotwork", "Fine Line"],
        "tribes": [],
        "inspiration_sources": ["Japanese Art", "Nature"],
        "social": {
            "instagram": "@mrling.tattoo",
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Coil Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Kuro Sumi", "Intenze"],
        "portfolio": [],
        "ratings": {
            "average": 4.8,
            "count": 95
        },
        "reviews": [
            {
                "user_id": "user456",
                "rating": 5,
                "comment": "Mr. Ling's Japanese-style tattoos are incredible. The level of detail in his work is amazing."
            }
        ]
    },
    {
        "id": 3,
        "studio_id": studio_id_map["Lovesick Tattoo Studio"],
        "country": "Singapore",
        "name": "Kian Tan",
        "bio": "Renowned blackwork tattoo artist specializing in geometric blackout tattoos, creating intricate designs that capture the beauty of form and abstract shapes.",
        "years_experience": 8,
        "styles": ["Blackwork", "Geometric", "Blackout"],
        "tribes": [],
        "inspiration_sources": ["Architecture", "Sacred Geometry"],
        "social": {
            "instagram": "@genghiskian",
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Dynamic Black", "Silverback Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.7,
            "count": 85
        },
        "reviews": [
            {
                "user_id": "user789",
                "rating": 5,
                "comment": "Kian's geometric work is precise and bold. He transformed my arm with an amazing blackwork piece."
            }
        ]
    },
    
    # Borneo Ink Tattoo artists
    {
        "id": 4,
        "studio_id": studio_id_map["Borneo Ink Tattoo"],
        "country": "Malaysia",
        "name": "Eddie David",
        "bio": "Founder of Borneo Ink Tattoo, specializing in traditional Iban hand-tap tattoos and custom designs. Award-winning artist with international recognition.",
        "years_experience": 25,
        "styles": ["Biomechanic", "Black & Gray", "Traditional", "Iban", "Neo-Tribal", "Oriental", "Portrait"],
        "tribes": ["Iban"],
        "inspiration_sources": ["Borneo Culture", "Traditional Tattoo Art"],
        "social": {
            "instagram": "@eddieborneoink",
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Traditional Hand-Tap Tools, Modern Rotary Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Traditional Hand-Tap Needles", "Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Eternal Ink", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.9,
            "count": 150
        },
        "reviews": [
            {
                "user_id": "user101",
                "rating": 5,
                "comment": "Eddie's traditional Iban tattoo was a spiritual experience. His knowledge of the culture and technique is unmatched."
            }
        ]
    },
    {
        "id": 5,
        "studio_id": studio_id_map["Borneo Ink Tattoo"],
        "country": "Malaysia",
        "name": "Simon David",
        "bio": "Brother of Eddie David and co-founder of Borneo Ink Tattoo. Specializes in tribal and traditional designs with a modern twist.",
        "years_experience": 20,
        "styles": ["Tribal", "Traditional", "Neo-Traditional"],
        "tribes": ["Iban"],
        "inspiration_sources": ["Borneo Culture", "Modern Art"],
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Eternal Ink", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.8,
            "count": 120
        },
        "reviews": [
            {
                "user_id": "user102",
                "rating": 5,
                "comment": "Simon's tribal work is both authentic and contemporary. He created a beautiful piece that honors my heritage."
            }
        ]
    },
    
    # Pink Tattoos artists
    {
        "id": 6,
        "studio_id": studio_id_map["Pink Tattoos"],
        "country": "Malaysia",
        "name": "Lynda Chean",
        "bio": "Founder of Pink Tattoos, known for delicate, fine line work and botanical designs. Pioneering female tattoo artist in Malaysia.",
        "years_experience": 15,
        "styles": ["Fine Line", "Botanical", "Minimalist"],
        "tribes": [],
        "inspiration_sources": ["Nature", "Botanical Illustrations"],
        "social": {
            "instagram": "@pinktattoos",
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Fine Liner", "Single Needle"]
        },
        "favorite_inks": ["Eternal Ink", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.9,
            "count": 130
        },
        "reviews": [
            {
                "user_id": "user103",
                "rating": 5,
                "comment": "Lynda's delicate line work is incredible. My floral tattoo looks like a botanical illustration."
            }
        ]
    },
    
    # Pitt's Tattoo & Piercing artists
    {
        "id": 7,
        "studio_id": studio_id_map["Pitt's Tattoo & Piercing"],
        "country": "Malaysia",
        "name": "PIT FUN",
        "bio": "Lead artist at Pitt's Tattoo & Piercing, specializing in custom designs and various styles.",
        "years_experience": 12,
        "styles": ["Custom", "Japanese", "Traditional"],
        "tribes": [],
        "inspiration_sources": ["Asian Art", "Street Culture"],
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Eternal Ink", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.7,
            "count": 90
        },
        "reviews": [
            {
                "user_id": "user104",
                "rating": 5,
                "comment": "PIT FUN created an amazing custom design that perfectly captured what I wanted."
            }
        ]
    },
    {
        "id": 8,
        "studio_id": studio_id_map["Pitt's Tattoo & Piercing"],
        "country": "Malaysia",
        "name": "Vivian",
        "bio": "Talented artist at Pitt's Tattoo & Piercing, known for colorful and vibrant designs.",
        "years_experience": 8,
        "styles": ["Color", "Neo-Traditional", "Watercolor"],
        "tribes": [],
        "inspiration_sources": ["Pop Art", "Watercolor Painting"],
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Eternal Ink", "Intenze"],
        "portfolio": [],
        "ratings": {
            "average": 4.8,
            "count": 75
        },
        "reviews": [
            {
                "user_id": "user105",
                "rating": 5,
                "comment": "Vivian's color work is vibrant and beautiful. My watercolor tattoo looks amazing."
            }
        ]
    },
    
    # Ink & Needles Tattoo Studio artists
    {
        "id": 9,
        "studio_id": studio_id_map["Ink & Needles Tattoo Studio"],
        "country": "Malaysia",
        "name": "Jason Wong",
        "bio": "Founder and senior artist at Ink & Needles Tattoo Studio, specializing in Japanese and Oriental tattoos.",
        "years_experience": 10,
        "styles": ["Japanese", "Oriental", "Traditional"],
        "tribes": [],
        "inspiration_sources": ["Japanese Art", "Asian Culture"],
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Coil Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Kuro Sumi", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.8,
            "count": 85
        },
        "reviews": [
            {
                "user_id": "user106",
                "rating": 5,
                "comment": "Jason's Japanese-style tattoo exceeded my expectations. His attention to detail is impressive."
            }
        ]
    },
    {
        "id": 10,
        "studio_id": studio_id_map["Ink & Needles Tattoo Studio"],
        "country": "Malaysia",
        "name": "Yan Cheah",
        "bio": "Senior artist at Ink & Needles Tattoo Studio, known for geometric and mandala designs.",
        "years_experience": 8,
        "styles": ["Geometric", "Mandala", "Dotwork"],
        "tribes": [],
        "inspiration_sources": ["Sacred Geometry", "Mandalas"],
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Dynamic Black", "Eternal Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.7,
            "count": 70
        },
        "reviews": [
            {
                "user_id": "user107",
                "rating": 5,
                "comment": "Yan's geometric work is precise and beautiful. My mandala tattoo is perfect."
            }
        ]
    },
    
    # The Tattoo Parlor artists
    {
        "id": 11,
        "studio_id": studio_id_map["The Tattoo Parlor"],
        "country": "Malaysia",
        "name": "Prinz",
        "bio": "Co-founder of The Tattoo Parlor, specializing in neo-traditional and custom designs.",
        "years_experience": 10,
        "styles": ["Neo-Traditional", "Custom", "Old School"],
        "tribes": [],
        "inspiration_sources": ["Traditional Tattoo Art", "Pop Culture"],
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Coil Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Eternal Ink", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.8,
            "count": 90
        },
        "reviews": [
            {
                "user_id": "user108",
                "rating": 5,
                "comment": "Prinz created an amazing neo-traditional piece for me. His style is bold and clean."
            }
        ]
    },
    
    # Lostchild Tattoo & Piercing artists
    {
        "id": 12,
        "studio_id": studio_id_map["Lostchild Tattoo & Piercing"],
        "country": "Malaysia",
        "name": "Bird Lostchild",
        "bio": "Founder of Lostchild Tattoo & Piercing, renowned for hyper-realism tattoos and detailed work.",
        "years_experience": 12,
        "styles": ["Hyper-Realism", "Portrait", "Black and Grey"],
        "tribes": [],
        "inspiration_sources": ["Photography", "Realism Art"],
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "equipment": {
            "machine": "Rotary Tattoo Machine",
            "power_supply": "Digital Power Supply",
            "needles": ["Round Liner", "Magnum Shader"]
        },
        "favorite_inks": ["Eternal Ink", "Dynamic Ink"],
        "portfolio": [],
        "ratings": {
            "average": 4.9,
            "count": 95
        },
        "reviews": [
            {
                "user_id": "user109",
                "rating": 5,
                "comment": "Bird's hyper-realistic tattoo work is mind-blowing. The portrait he did looks like a photograph."
            }
        ]
    }
]

# Now let's create the final JSON structure
final_data = {
    "studios": [],
    "artists": artists
}

# Add studio data
for i, studio in enumerate(studios):
    # Find featured artists for this studio
    featured_artists = []
    for artist in artists:
        if artist["studio_id"] == i+1:
            featured_artists.append(artist["id"])
    
    # Create studio object
    studio_obj = {
        "id": i+1,
        "name": studio["name"],
        "country": studio["country"],
        "city": studio["city"],
        "address": studio["address"],
        "lat": studio["lat"],
        "lng": studio["lng"],
        "phone": None,
        "email": None,
        "website": None,
        "social": {
            "instagram": None,
            "facebook": None,
            "tiktok": None
        },
        "hours": {
            "mon_fri": None,
            "sat": None,
            "sun": None
        },
        "styles_offered": [],
        "tribes": [],
        "ink_brands": [],
        "equipment": [],
        "amenities": [],
        "featured_artists": featured_artists,
        "ratings": {
            "average": None,
            "count": None
        },
        "reviews": []
    }
    
    # Add specific data for each studio
    if studio["name"] == "Lovesick Tattoo Studio":
        studio_obj["phone"] = "+65 8163 0700"
        studio_obj["email"] = "enquiries@lovesicktattoostudio.com"
        studio_obj["website"] = "https://www.lovesicktattoostudio.com/"
        studio_obj["social"]["instagram"] = "@lovesicktattoosingapore"
        studio_obj["hours"]["mon_fri"] = "11:00 AM - 8:00 PM"
        studio_obj["hours"]["sat"] = "11:00 AM - 8:00 PM"
        studio_obj["hours"]["sun"] = "11:00 AM - 8:00 PM"
        studio_obj["styles_offered"] = ["Realism", "Black and Grey", "Japanese", "Dotwork", "Blackwork", "Geometric"]
        studio_obj["ink_brands"] = ["Eternal Ink", "Dynamic Ink", "Kuro Sumi"]
        studio_obj["equipment"] = ["Rotary Machines", "Coil Machines", "Digital Power Supplies"]
        studio_obj["amenities"] = ["Walk-ins Welcome", "Custom Designs", "Free Consultations"]
        studio_obj["ratings"]["average"] = 4.8
        studio_obj["ratings"]["count"] = 250
    
    elif studio["name"] == "Borneo Ink Tattoo":
        studio_obj["phone"] = "+601162621313"
        studio_obj["email"] = "borneoinktat2@gmail.com"
        studio_obj["website"] = "https://borneoink.com/"
        studio_obj["social"]["instagram"] = "@borneo_ink_tat2"
        studio_obj["hours"]["mon_fri"] = "11:00 AM - 7:00 PM"
        studio_obj["hours"]["sat"] = "11:00 AM - 7:00 PM"
        studio_obj["hours"]["sun"] = "11:00 AM - 7:00 PM"
        studio_obj["styles_offered"] = ["Tribal", "Traditional", "Iban", "Biomechanic", "Black & Gray", "Oriental", "Portrait"]
        studio_obj["tribes"] = ["Iban"]
        studio_obj["ink_brands"] = ["Eternal Ink", "Dynamic Ink"]
        studio_obj["equipment"] = ["Traditional Hand-Tap Tools", "Rotary Machines", "Digital Power Supplies"]
        studio_obj["amenities"] = ["Custom Designs", "Traditional Hand-Tap Tattooing", "Free Consultations"]
        studio_obj["ratings"]["average"] = 4.9
        studio_obj["ratings"]["count"] = 300
    
    elif studio["name"] == "Pink Tattoos":
        studio_obj["email"] = "ask@tattoomepink.com"
        studio_obj["website"] = "http://www.tattoomepink.com/"
        studio_obj["social"]["instagram"] = "@pinktattoos"
        studio_obj["hours"]["mon_fri"] = "By Appointment Only"
        studio_obj["hours"]["sat"] = "By Appointment Only"
        studio_obj["hours"]["sun"] = "By Appointment Only"
        studio_obj["styles_offered"] = ["Fine Line", "Botanical", "Minimalist", "Delicate"]
        studio_obj["ink_brands"] = ["Eternal Ink", "Dynamic Ink"]
        studio_obj["equipment"] = ["Rotary Machines", "Digital Power Supplies"]
        studio_obj["amenities"] = ["Appointment Only", "Custom Designs", "Female Artists"]
        studio_obj["ratings"]["average"] = 4.9
        studio_obj["ratings"]["count"] = 200
    
    elif studio["name"] == "Pitt's Tattoo & Piercing":
        studio_obj["phone"] = "+6016 – 295 9018"
        studio_obj["email"] = "pittstattoo@hotmail.com"
        studio_obj["website"] = "https://www.pittstattoo.com/"
        studio_obj["hours"]["mon_fri"] = "12:00 PM - 8:00 PM"
        studio_obj["hours"]["sat"] = "12:00 PM - 8:00 PM"
        studio_obj["hours"]["sun"] = "12:00 PM - 8:00 PM"
        studio_obj["styles_offered"] = ["Custom", "Japanese", "Traditional", "Color", "Neo-Traditional", "Watercolor"]
        studio_obj["ink_brands"] = ["Eternal Ink", "Dynamic Ink", "Intenze"]
        studio_obj["equipment"] = ["Rotary Machines", "Digital Power Supplies"]
        studio_obj["amenities"] = ["Piercing", "Laser Removal", "Tattoo Courses", "Walk-ins Welcome"]
        studio_obj["ratings"]["average"] = 4.7
        studio_obj["ratings"]["count"] = 150
    
    elif studio["name"] == "Ink & Needles Tattoo Studio":
        studio_obj["phone"] = "016-428 0933"
        studio_obj["website"] = "https://ink-and-needles.com/"
        studio_obj["social"]["instagram"] = "@ink_and_needlestattoostudio"
        studio_obj["hours"]["mon_fri"] = "11:30 AM - 7:00 PM"
        studio_obj["hours"]["sat"] = "11:30 AM - 7:00 PM"
        studio_obj["hours"]["sun"] = "11:30 AM - 7:00 PM"
        studio_obj["styles_offered"] = ["Japanese", "Oriental", "Tribal", "Mandala", "Geometric", "Minimalist", "Traditional"]
        studio_obj["ink_brands"] = ["Kuro Sumi", "Dynamic Ink", "Eternal Ink"]
        studio_obj["equipment"] = ["Rotary Machines", "Coil Machines", "Digital Power Supplies"]
        studio_obj["amenities"] = ["Custom Designs", "Free Consultations"]
        studio_obj["ratings"]["average"] = 4.8
        studio_obj["ratings"]["count"] = 180
    
    elif studio["name"] == "The Tattoo Parlor":
        studio_obj["phone"] = "+603-7624-4426"
        studio_obj["website"] = "https://thetattooparlor14.wixsite.com/thetattooparlor"
        studio_obj["social"]["instagram"] = "@thetattooparlormalaysia"
        studio_obj["hours"]["mon_fri"] = "11:00 AM - 8:00 PM"
        studio_obj["hours"]["sat"] = "11:00 AM - 8:00 PM"
        studio_obj["hours"]["sun"] = "11:00 AM - 8:00 PM"
        studio_obj["styles_offered"] = ["Neo-Traditional", "Custom", "Old School", "Asian", "Western", "Realism", "Colours", "Traditional", "Dotwork"]
        studio_obj["ink_brands"] = ["Eternal Ink", "Dynamic Ink"]
        studio_obj["equipment"] = ["Coil Machines", "Digital Power Supplies"]
        studio_obj["amenities"] = ["Walk-ins Welcome", "Free Consultations", "Custom Designs"]
        studio_obj["ratings"]["average"] = 4.8
        studio_obj["ratings"]["count"] = 170
    
    elif studio["name"] == "Lostchild Tattoo & Piercing":
        studio_obj["phone"] = "+601111834330"
        studio_obj["email"] = "lostchild_company@gmail.com"
        studio_obj["website"] = "https://www.lostchildstudio.com/"
        studio_obj["styles_offered"] = ["Hyper-Realism", "Portrait", "Black and Grey"]
        studio_obj["ink_brands"] = ["Eternal Ink", "Dynamic Ink"]
        studio_obj["equipment"] = ["Rotary Machines", "Digital Power Supplies"]
        studio_obj["amenities"] = ["Piercing", "Private Studio", "Appointment Only"]
        studio_obj["ratings"]["average"] = 4.9
        studio_obj["ratings"]["count"] = 120
    
    # Add the studio to the final data
    final_data["studios"].append(studio_obj)

# Save the final data to a JSON file
with open("/home/ubuntu/tattoo_project/sea_studios_artists_part1.json", "w") as f:
    json.dump(final_data, f, indent=2)

print("Final data saved to /home/ubuntu/tattoo_project/sea_studios_artists_part1.json")
