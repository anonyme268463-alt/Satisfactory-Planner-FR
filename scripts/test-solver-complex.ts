import { solveProduction } from '../src/lib/solver';

const target = 'smart-plating';
const amount = 2;
const plan = solveProduction(target, amount);

console.log(`Production Plan for ${amount} ${target}/min:`);
console.log('Total Power:', plan.totalPower.toFixed(2), 'MW');
console.log('Raw Resources:', plan.rawResources);

function printStep(step: any, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}- ${step.targetAmount.toFixed(2)} ${step.targetItemId}/min via ${step.recipeId} (${step.machineCount.toFixed(2)} ${step.machineId})`);
  step.childSteps.forEach((s: any) => printStep(s, depth + 1));
}

plan.steps.forEach(s => printStep(s));
