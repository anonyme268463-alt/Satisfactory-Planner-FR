import itemsData from '../src/data/items.json';
import recipesData from '../src/data/recipes.json';
import machinesData from '../src/data/machines.json';

const itemIds = new Set(itemsData.map(i => i.id));
const machineIds = new Set(machinesData.map(m => m.id));

let errors = 0;

recipesData.forEach(recipe => {
  if (!machineIds.has(recipe.producedIn)) {
    console.error(`Error: Recipe ${recipe.id} produced in unknown machine ${recipe.producedIn}`);
    errors++;
  }
  recipe.ingredients.forEach(ing => {
    if (!itemIds.has(ing.itemId)) {
      console.error(`Error: Recipe ${recipe.id} has unknown ingredient ${ing.itemId}`);
      errors++;
    }
  });
  recipe.products.forEach(p => {
    if (!itemIds.has(p.itemId)) {
      console.error(`Error: Recipe ${recipe.id} has unknown product ${p.itemId}`);
      errors++;
    }
  });
});

if (errors === 0) {
  console.log('Data consistency check passed!');
} else {
  console.log(`Data consistency check failed with ${errors} errors.`);
  process.exit(1);
}
