import { Recipe, ItemId, RecipeId } from '../types';
import itemsData from '../data/items.json';
import recipesData from '../data/recipes.json';
import machinesData from '../data/machines.json';

const items = itemsData;
const recipes = recipesData as Recipe[];
const machines = machinesData;

export interface ProductionStep {
  recipeId: RecipeId;
  targetItemId: ItemId;
  targetAmount: number; // units per minute
  machineId: string;
  machineCount: number;
  powerConsumption: number; // MW
  overclock: number; // percentage, e.g., 100
  ingredients: { itemId: ItemId; amount: number }[];
  products: { itemId: ItemId; amount: number }[];
  childSteps: ProductionStep[];
}

export interface FactoryPlan {
  targetItemId: ItemId;
  targetAmount: number;
  steps: ProductionStep[];
  totalPower: number;
  rawResources: Record<ItemId, number>;
}

export interface SolverOptions {
  preferredRecipes?: Record<ItemId, RecipeId>;
  overclock?: Record<RecipeId, number>; // recipeId -> percentage (default 100)
  resourcePurity?: Record<ItemId, 'Impure' | 'Normal' | 'Pure'>;
}

export function solveProduction(
  targetItemId: ItemId,
  targetAmount: number,
  options: SolverOptions = {}
): FactoryPlan {
  const { preferredRecipes = {}, overclock = {} } = options;
  const rawResources: Record<ItemId, number> = {};
  let totalPower = 0;

  function getStep(itemId: ItemId, amount: number): ProductionStep | null {
    const item = items.find(i => i.id === itemId);
    if (!item || item.category === 'Resource') {
      rawResources[itemId] = (rawResources[itemId] || 0) + amount;
      return null;
    }

    // Find recipe
    const recipeId = preferredRecipes[itemId];
    const recipe = recipeId
      ? recipes.find(r => r.id === recipeId)
      : recipes.find(r => r.products.some(p => p.itemId === itemId));

    if (!recipe) {
      rawResources[itemId] = (rawResources[itemId] || 0) + amount;
      return null;
    }

    const oc = overclock[recipe.id] || 100;
    const ocMultiplier = oc / 100;

    const product = recipe.products.find(p => p.itemId === itemId)!;
    // Base amount produced per minute = (product.amount / (recipe.duration / 60))
    // Actually our recipes.json already has amounts per minute (based on my previous write_file)
    // Wait, let me check recipes.json content.

    // In my recipes.json:
    // { "itemId": "iron-ore", "amount": 30 }
    // These are amounts per minute for the machine at 100% speed.

    const baseAmountPerMinute = product.amount;
    const actualAmountPerMinute = baseAmountPerMinute * ocMultiplier;

    const ratio = amount / actualAmountPerMinute;
    const machineCount = ratio; // This is the number of machines at the specified overclock

    const machine = machines.find(m => m.id === recipe.producedIn);

    // Power consumption with overclocking: P = P0 * (OC/100)^1.6 (approx for 1.0)
    // Simplified: power = machine.power * machineCount * (oc/100)^1.6
    const powerPerMachine = machine ? machine.powerConsumption * Math.pow(ocMultiplier, 1.6) : 0;
    const power = powerPerMachine * machineCount;
    totalPower += power;

    const step: ProductionStep = {
      recipeId: recipe.id,
      targetItemId: itemId,
      targetAmount: amount,
      machineId: recipe.producedIn,
      machineCount: machineCount,
      powerConsumption: power,
      overclock: oc,
      ingredients: recipe.ingredients.map(ing => ({
        itemId: ing.itemId,
        amount: ing.amount * ratio
      })),
      products: recipe.products.map(p => ({
        itemId: p.itemId,
        amount: p.amount * ratio
      })),
      childSteps: []
    };

    step.ingredients.forEach(ing => {
      const child = getStep(ing.itemId, ing.amount);
      if (child) {
        step.childSteps.push(child);
      }
    });

    return step;
  }

  const rootStep = getStep(targetItemId, targetAmount);

  return {
    targetItemId,
    targetAmount,
    steps: rootStep ? [rootStep] : [],
    totalPower,
    rawResources
  };
}
