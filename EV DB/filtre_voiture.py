import json

# Charger les données
with open("H:/Desktop/EV DB/database/china_ev_cars.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Listes de résultats
ev, phev, mhev = [], [], []

# Mots-clés pour chaque type
ev_keywords = [
    "ev", "e-motor", "pure electric", "pure electric drive",
    "range-extended electric vehicle", "range extended electric vehicle"
]

phev_keywords = [
    "plug-in", "phev", "plug in hybrid",
    "e-motor +", "+ e-motor", "e-motor + 1.5l", "e-motor + 1.8l", "range: 100km"
]

mhev_keywords = [
    "48v", "mhev", "1.5t+48v", "1.8t+48v"
]

# Parcourir toutes les voitures
for car in data:
    fuel = car.get("specs", {}).get("Engine", {}).get("Fuel Type", "").lower()
    displacement = car.get("specs", {}).get("Basic Specs", {}).get("Engine Displacement", "").lower()
    range_info = car.get("specs", {}).get("Body", {}).get("Range", "").lower()
    combined = f"{fuel} {displacement} {range_info}"

    # Ordre logique : PHEV > MHEV > EV
    if any(keyword in combined for keyword in phev_keywords):
        phev.append(car)
    elif any(keyword in combined for keyword in mhev_keywords):
        mhev.append(car)
    elif any(keyword in combined for keyword in ev_keywords) and "gasoline" not in combined:
        ev.append(car)

# Sauvegarder les résultats
with open("H:/Desktop/EV DB/ev.json", "w", encoding="utf-8") as f:
    json.dump(ev, f, indent=2, ensure_ascii=False)

with open("H:/Desktop/EV DB/phev.json", "w", encoding="utf-8") as f:
    json.dump(phev, f, indent=2, ensure_ascii=False)

with open("H:/Desktop/EV DB/mhev.json", "w", encoding="utf-8") as f:
    json.dump(mhev, f, indent=2, ensure_ascii=False)

# Résumé
print(f"✅ EV : {len(ev)}\n🔌 PHEV : {len(phev)}\n⚙️ MHEV : {len(mhev)}")
