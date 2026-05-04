import json

translations = {
    "iron-ore": "Minerai de fer",
    "copper-ore": "Minerai de cuivre",
    "limestone": "Calcaire",
    "coal": "Charbon",
    "caterium-ore": "Minerai de caterium",
    "raw-quartz": "Quartz brut",
    "sulfur": "Soufre",
    "bauxite": "Bauxite",
    "uranium": "Uranium",
    "sam-ore": "Minerai de SAM",
    "water": "Eau",
    "crude-oil": "Pétrole brut",
    "nitrogen-gas": "Azote gazeux",
    "iron-ingot": "Lingot de fer",
    "copper-ingot": "Lingot de cuivre",
    "caterium-ingot": "Lingot de caterium",
    "steel-ingot": "Lingot d'acier",
    "aluminum-ingot": "Lingot d'aluminium",
    "ficsite-ingot": "Lingot de ficsite",
    "iron-plate": "Plaque de fer",
    "iron-rod": "Tige de fer",
    "screw": "Vis",
    "reinforced-iron-plate": "Plaque de fer renforcée",
    "modular-frame": "Cadre modulaire",
    "heavy-modular-frame": "Cadre modulaire lourd",
    "fused-modular-frame": "Cadre modulaire fusionné",
    "copper-sheet": "Tôle de cuivre",
    "wire": "Fil électrique",
    "cable": "Câble",
    "quickwire": "Fil actif",
    "steel-beam": "Poutre d'acier",
    "steel-pipe": "Tuyau d'acier",
    "encased-industrial-beam": "Poutre industrielle encastrée",
    "aluminum-casing": "Boîtier en aluminium",
    "alclad-aluminum-sheet": "Tôle d'aluminium alclad",
    "aluminum-scrap": "Débris d'aluminium",
    "silica": "Silice",
    "quartz-crystal": "Cristal de quartz",
    "plastic": "Plastique",
    "rubber": "Caoutchouc",
    "polymer-resin": "Résine polymère",
    "petroleum-coke": "Coke de pétrole",
    "fuel": "Carburant",
    "turbofuel": "Turbocarburant",
    "heavy-oil-residue": "Résidu d'huile lourde",
    "alumina-solution": "Solution d'alumine",
    "sulfuric-acid": "Acide sulfurique",
    "nitric-acid": "Acide nitrique",
    "battery": "Batterie",
    "circuit-board": "Circuit imprimé",
    "computer": "Ordinateur",
    "supercomputer": "Superordinateur",
    "ai-limiter": "Limiteur d'IA",
    "high-speed-connector": "Connecteur haute vitesse",
    "rotor": "Rotor",
    "stator": "Stator",
    "motor": "Moteur",
    "turbo-motor": "Turbomoteur",
    "radio-control-unit": "Unité de contrôle radio",
    "cooling-system": "Système de refroidissement",
    "crystal-oscillator": "Oscillateur à cristal",
    "heat-sink": "Dissipateur thermique",
    "smart-plating": "Placage intelligent",
    "versatile-framework": "Ossature polyvalente",
    "automated-wiring": "Câblage automatisé",
    "modular-engine": "Moteur modulaire",
    "adaptive-control-unit": "Unité de contrôle adaptative",
    "assembly-director-system": "Système de directeur d'assemblage",
    "magnetic-field-generator": "Générateur de champ magnétique",
    "thermal-propulsion-rocket": "Fusée à propulsion thermique",
    "nuclear-pasta": "Pâtes nucléaires",
    "concrete": "Béton"
}

with open('src/data/items.json', 'r') as f:
    items = json.load(f)

for item in items:
    if item['id'] in translations:
        item['name'] = translations[item['id']]

with open('src/data/items.json', 'w') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

with open('src/data/recipes.json', 'r') as f:
    recipes = json.load(f)

for recipe in recipes:
    if not recipe['isAlternate'] and len(recipe['products']) == 1:
        prod_id = recipe['products'][0]['itemId']
        if prod_id in translations:
            recipe['name'] = translations[prod_id]

    if recipe['isAlternate'] and len(recipe['products']) == 1:
         prod_id = recipe['products'][0]['itemId']
         if prod_id in translations:
             recipe['name'] = translations[prod_id] + " (Alternatif)"

with open('src/data/recipes.json', 'w') as f:
    json.dump(recipes, f, indent=2, ensure_ascii=False)

print("Applied translations.")
