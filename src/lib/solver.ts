import { Recipe, ItemId, RecipeId } from '../types';
import itemsData from '../data/items.json';
import recipesData from '../data/recipes.json';
import machinesData from '../data/machines.json';
import logisticsData from '../data/logistics.json';

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
  logistics: {
    beltTier: number;
    pipeTier: number;
  };
}

export interface ConstructionMaterials {
  itemId: ItemId;
  amount: number;
}

export interface FactoryPlan {
  targetItemId: ItemId;
  targetAmount: number;
  steps: ProductionStep[];
  totalPower: number;
  rawResources: Record<ItemId, number>;
  constructionCosts: ConstructionMaterials[];
  foundationCount: number;
}

export interface SolverOptions {
  preferredRecipes?: Record<ItemId, RecipeId>;
  overclock?: Record<RecipeId, number>; // recipeId -> percentage (default 100)
  strategy?: 'default' | 'min-energy';
}

export function solveProduction(
  targetItemId: ItemId,
  targetAmount: number,
  options: SolverOptions = {}
): FactoryPlan {
  const { preferredRecipes = {}, overclock = {}, strategy = 'default' } = options;
  const rawResources: Record<ItemId, number> = {};
  const machineTotals: Record<string, number> = {};
  let totalPower = 0;
  const activeSteps = new Set<ItemId>();

  function getStep(itemId: ItemId, amount: number): ProductionStep | null {
    if (activeSteps.has(itemId)) {
        rawResources[itemId] = (rawResources[itemId] || 0) + amount;
        return null;
    }

    const item = items.find(i => i.id === itemId);
    if (!item || item.category === 'Resource') {
      rawResources[itemId] = (rawResources[itemId] || 0) + amount;
      return null;
    }

    // Find recipe
    let recipe: Recipe | undefined;
    const preferredId = preferredRecipes[itemId];

    if (preferredId) {
        recipe = recipes.find(r => r.id === preferredId);
    } else if (strategy === 'min-energy') {
        const potentialRecipes = recipes.filter(r => r.products.some(p => p.itemId === itemId));
        if (potentialRecipes.length > 0) {
            recipe = potentialRecipes.reduce((best, current) => {
                const bestProduct = best.products.find(p => p.itemId === itemId)!;
                const currentProduct = current.products.find(p => p.itemId === itemId)!;
                const bestMachine = machines.find(m => m.id === best.producedIn);
                const currentMachine = machines.find(m => m.id === current.producedIn);
                const bestEnergyPerUnit = (bestMachine?.powerConsumption || 0) / bestProduct.amount;
                const currentEnergyPerUnit = (currentMachine?.powerConsumption || 0) / currentProduct.amount;
                return currentEnergyPerUnit < bestEnergyPerUnit ? current : best;
            });
        }
    } else {
        recipe = recipes.find(r => r.products.some(p => p.itemId === itemId));
    }

    if (!recipe) {
      rawResources[itemId] = (rawResources[itemId] || 0) + amount;
      return null;
    }

    const oc = overclock[recipe.id] || 100;
    const ocMultiplier = oc / 100;
    const product = recipe.products.find(p => p.itemId === itemId)!;
    const baseAmountPerMinute = product.amount;
    const actualAmountPerMinute = baseAmountPerMinute * ocMultiplier;

    const ratio = amount / actualAmountPerMinute;
    const machineCount = ratio;
    const machineId = recipe.producedIn;
    machineTotals[machineId] = (machineTotals[machineId] || 0) + machineCount;

    const machine = machines.find(m => m.id === machineId);
    const powerPerMachine = machine ? machine.powerConsumption * Math.pow(ocMultiplier, 1.6) : 0;
    const power = powerPerMachine * machineCount;
    totalPower += power;

    activeSteps.add(itemId);

    // Logistics calculation
    let maxBeltSpeed = 0;
    let maxPipeSpeed = 0;

    recipe.ingredients.forEach(ing => {
        const ingItem = items.find(i => i.id === ing.itemId);
        const rate = ing.amount * ratio;
        if (ingItem?.isFluid) maxPipeSpeed = Math.max(maxPipeSpeed, rate);
        else maxBeltSpeed = Math.max(maxBeltSpeed, rate);
    });

    const beltTier = logisticsData.belts.find(b => b.speed >= maxBeltSpeed)?.tier || 6;
    const pipeTier = logisticsData.pipes.find(p => p.speed >= maxPipeSpeed)?.tier || 2;

    const step: ProductionStep = {
      recipeId: recipe.id,
      targetItemId: itemId,
      targetAmount: amount,
      machineId: machineId,
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
      childSteps: [],
      logistics: { beltTier, pipeTier }
    };

    step.ingredients.forEach(ing => {
      const child = getStep(ing.itemId, ing.amount);
      if (child) step.childSteps.push(child);
    });

    activeSteps.delete(itemId);
    return step;
  }

  const rootStep = getStep(targetItemId, targetAmount);

  // Calculate construction costs
  const constructionCosts: Record<ItemId, number> = {};
  let totalArea = 0;

  Object.entries(machineTotals).forEach(([mId, count]) => {
    const machine = machines.find(m => m.id === mId);
    if (machine) {
        const ceiledCount = Math.ceil(count);
        if (machine.cost) {
            machine.cost.forEach(c => {
                constructionCosts[c.itemId] = (constructionCosts[c.itemId] || 0) + (c.amount * ceiledCount);
            });
        }
        totalArea += (machine.width || 8) * (machine.length || 8) * ceiledCount;
    }
  });

  // Calculate foundations (8x8m)
  const foundationCount = Math.ceil(totalArea / 64);
  const foundation = logisticsData.foundations[0];
  foundation.cost.forEach(c => {
    constructionCosts[c.itemId] = (constructionCosts[c.itemId] || 0) + (c.amount * foundationCount);
  });

  return {
    targetItemId,
    targetAmount,
    steps: rootStep ? [rootStep] : [],
    totalPower,
    rawResources,
    constructionCosts: Object.entries(constructionCosts).map(([itemId, amount]) => ({ itemId, amount })),
    foundationCount
  };
}
