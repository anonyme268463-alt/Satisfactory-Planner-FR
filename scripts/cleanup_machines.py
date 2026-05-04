import json

with open('src/data/recipes.json', 'r') as f:
    recipes = json.load(f)

for recipe in recipes:
    m = recipe['producedIn']
    if 'assembler' in m:
        recipe['producedIn'] = 'assembler'
    elif 'constructor' in m:
        recipe['producedIn'] = 'constructor'
    elif 'manufacturer' in m:
        recipe['producedIn'] = 'manufacturer'
    elif 'smelter' in m:
        recipe['producedIn'] = 'smelter'
    elif 'foundry' in m:
        recipe['producedIn'] = 'foundry'

with open('src/data/recipes.json', 'w') as f:
    json.dump(recipes, f, indent=2, ensure_ascii=False)

# Add missing machines to machines.json
with open('src/data/machines.json', 'r') as f:
    machines = json.load(f)

existing_ids = set(m['id'] for m in machines)

new_machines = [
    { "id": "packager", "name": "Emballeuse", "nameEn": "Packager", "powerConsumption": 10, "baseSpeed": 1.0, "width": 8, "length": 12 },
    { "id": "converter", "name": "Convertisseur", "nameEn": "Converter", "powerConsumption": 250, "baseSpeed": 1.0, "width": 20, "length": 24 },
    { "id": "quantum-encoder", "name": "Encodeur quantique", "nameEn": "Quantum Encoder", "powerConsumption": 1000, "baseSpeed": 1.0, "width": 30, "length": 30 }
]

for nm in new_machines:
    if nm['id'] not in existing_ids:
        machines.append(nm)

with open('src/data/machines.json', 'w') as f:
    json.dump(machines, f, indent=2, ensure_ascii=False)
