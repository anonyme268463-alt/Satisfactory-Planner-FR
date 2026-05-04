import json
import re

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9]', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')

# Load sources
with open('scripts/source_items.json') as f:
    source_items = json.load(f)['all']
with open('scripts/source_recipes.json') as f:
    source_recipes = json.load(f)['all']

# Process Items
new_items = []
for item in source_items:
    name_en = item['name']
    if not name_en: continue
    item_id = slugify(name_en)

    is_fluid = any(x in name_en.lower() for x in ["liquid", "gas", "acid", "water", "oil", "solution", "fuel", "residue"])

    category = "Component"
    if "level" in item and item["level"] == 0:
        category = "Resource"

    new_items.append({
        "id": item_id,
        "name": name_en,
        "nameEn": name_en,
        "category": category,
        "isFluid": is_fluid
    })

# Deduplicate items
seen_items = set()
unique_items = []
for item in new_items:
    if item['id'] not in seen_items:
        unique_items.append(item)
        seen_items.add(item['id'])

# Process Recipes
new_recipes = []
for recipe in source_recipes:
    name_en = recipe['name']
    if not name_en: continue

    recipe_id = slugify(name_en)
    is_alternate = "Alternate" in name_en or name_en.endswith("Alternate")

    machine_map = {
        "ConstructorCraft Bench": "constructor",
        "AssemblerCraft Bench": "assembler",
        "ManufacturerCraft Bench": "manufacturer",
        "Refinery": "refinery",
        "SmelterCraft Bench": "smelter",
        "FoundryCraft Bench": "foundry",
        "Blender": "blender",
        "Particle Accelerator": "particle-accelerator",
        "Quantum Encoder": "quantum-encoder",
        "Converter": "converter",
        "Smelter": "smelter",
        "Foundry": "foundry",
        "Constructor": "constructor",
        "Assembler": "assembler",
        "Manufacturer": "manufacturer",
        "Packager": "packager",
        "Equipment Workshop": "equipment-workshop",
        "Nuclear Power Plant": "nuclear-power-plant"
    }

    building = recipe['building']
    produced_in = machine_map.get(building, slugify(building) if building else "unknown")

    ingredients = []
    for ing in recipe['input']:
        ingredients.append({
            "itemId": slugify(ing['name']),
            "amount": ing['rate'] if ing['rate'] is not None else ing['amount']
        })

    products = []
    for prod in recipe['output']:
        products.append({
            "itemId": slugify(prod['name']),
            "amount": prod['rate'] if prod['rate'] is not None else prod['amount']
        })

    duration = 60.0

    new_recipes.append({
        "id": recipe_id,
        "name": name_en,
        "nameEn": name_en,
        "isAlternate": is_alternate,
        "ingredients": ingredients,
        "products": products,
        "producedIn": produced_in,
        "duration": duration
    })

production_recipes = [r for r in new_recipes if r['producedIn'] not in ["unknown", "build-gun"]]

with open('src/data/items.json', 'w') as f:
    json.dump(unique_items, f, indent=2, ensure_ascii=False)
with open('src/data/recipes.json', 'w') as f:
    json.dump(production_recipes, f, indent=2, ensure_ascii=False)

print(f"Restored {len(unique_items)} items and {len(production_recipes)} recipes.")
