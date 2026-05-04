import json

extra_translations = {
    "mercer-sphere": "Sphère de Mercer",
    "somersloop": "Somersloop",
    "time-crystal": "Cristal temporel",
    "neural-quantum-processor": "Processeur neuro-quantique",
    "superposition-oscillator": "Oscillateur de superposition",
    "excited-photonic-matter": "Matière photonique excitée",
    "dark-matter-crystal": "Cristal de matière noire",
    "dark-matter-residue": "Résidu de matière noire",
    "ficsite-trigon": "Trigone de ficsite",
    "ficsonium": "Ficsonium",
    "singularity-cell": "Cellule de singularité",
    "ballistic-warp-drive": "Propulseur à distorsion balistique",
    "ai-expansion-server": "Serveur d'extension d'IA",
    "reanimated-sam": "SAM réanimé",
    "ficsonium-fuel-rod": "Barre de ficsonium",
    "plutonium-fuel-rod": "Barre de plutonium",
    "uranium-fuel-rod": "Barre d'uranium",
    "ficsite-ingot": "Lingot de ficsite"
}

with open('src/data/items.json', 'r') as f:
    items = json.load(f)

for item in items:
    if item['id'] in extra_translations:
        item['name'] = extra_translations[item['id']]

with open('src/data/items.json', 'w') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

with open('src/data/recipes.json', 'r') as f:
    recipes = json.load(f)

for recipe in recipes:
    if not recipe['isAlternate'] and len(recipe['products']) == 1:
        prod_id = recipe['products'][0]['itemId']
        if prod_id in extra_translations:
            recipe['name'] = extra_translations[prod_id]

    if recipe['isAlternate'] and len(recipe['products']) == 1:
         prod_id = recipe['products'][0]['itemId']
         if prod_id in extra_translations:
             recipe['name'] = extra_translations[prod_id] + " (Alternatif)"

with open('src/data/recipes.json', 'w') as f:
    json.dump(recipes, f, indent=2, ensure_ascii=False)

print("Applied 1.0 translations.")
import json

extra_translations = {
    "sam-fluctuator": "Fluctuateur SAM",
    "ai-limiter": "Limiteur d'IA",
    "supercomputer": "Superordinateur",
    "assembly-director-system": "Système de directeur d'assemblage",
    "adaptive-control-unit": "Unité de contrôle adaptative",
    "magnetic-field-generator": "Générateur de champ magnétique",
    "thermal-propulsion-rocket": "Fusée à propulsion thermique",
    "nuclear-pasta": "Pâtes nucléaires",
    "versatile-framework": "Ossature polyvalente",
    "automated-wiring": "Câblage automatisé",
    "modular-engine": "Moteur modulaire",
    "smart-plating": "Placage intelligent",
    "fused-modular-frame": "Cadre modulaire fusionné",
    "heavy-modular-frame": "Cadre modulaire lourd",
    "modular-frame": "Cadre modulaire",
    "reinforced-iron-plate": "Plaque de fer renforcée",
    "encased-industrial-beam": "Poutre industrielle encastrée",
    "alclad-aluminum-sheet": "Tôle d'aluminium alclad",
    "aluminum-casing": "Boîtier en aluminium"
}

with open('src/data/items.json', 'r') as f:
    items = json.load(f)
for item in items:
    if item['id'] in extra_translations:
        item['name'] = extra_translations[item['id']]
with open('src/data/items.json', 'w') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

with open('src/data/recipes.json', 'r') as f:
    recipes = json.load(f)
for recipe in recipes:
    if not recipe['isAlternate'] and len(recipe['products']) == 1:
        prod_id = recipe['products'][0]['itemId']
        if prod_id in extra_translations:
            recipe['name'] = extra_translations[prod_id]
    if recipe['isAlternate'] and len(recipe['products']) == 1:
         prod_id = recipe['products'][0]['itemId']
         if prod_id in extra_translations:
             recipe['name'] = extra_translations[prod_id] + " (Alternatif)"
with open('src/data/recipes.json', 'w') as f:
    json.dump(recipes, f, indent=2, ensure_ascii=False)
