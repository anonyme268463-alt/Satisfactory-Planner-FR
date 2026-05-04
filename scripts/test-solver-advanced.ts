import { solveProduction } from '../src/lib/solver';

console.log('--- Standard Plan ---');
const plan1 = solveProduction('reinforced-iron-plate', 5);
console.log('Total Power:', plan1.totalPower.toFixed(2), 'MW');
console.log('Raw Resources:', plan1.rawResources);

console.log('\n--- Overclocked Plan (250% on all) ---');
const plan2 = solveProduction('reinforced-iron-plate', 5, {
  overclock: {
    'recipe-reinforced-iron-plate': 250,
    'recipe-iron-plate': 250,
    'recipe-iron-ingot': 250,
    'recipe-screw': 250,
    'recipe-iron-rod': 250
  }
});
console.log('Total Power:', plan2.totalPower.toFixed(2), 'MW (Higher due to overclocking exponent)');
console.log('Raw Resources:', plan2.rawResources);
console.log('Machines for RIP:', plan2.steps[0].machineCount.toFixed(2));
