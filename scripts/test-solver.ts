import { solveProduction } from '../src/lib/solver';

const plan = solveProduction('reinforced-iron-plate', 5);

console.log('Production Plan for 5 Reinforced Iron Plates/min:');
console.log('Total Power:', plan.totalPower, 'MW');
console.log('Raw Resources:', plan.rawResources);

function printStep(step: any, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}- ${step.targetAmount} ${step.targetItemId}/min via ${step.recipeId} (${step.machineCount.toFixed(2)} ${step.machineId})`);
  step.childSteps.forEach((s: any) => printStep(s, depth + 1));
}

plan.steps.forEach(s => printStep(s));
