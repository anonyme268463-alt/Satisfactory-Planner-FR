import { ProductionStep } from './solver';
import machinesData from '../data/machines.json';

export interface LayoutElement {
  id: string;
  machineId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  length: number;
  targetItemId: string;
}

export interface LayoutConnection {
  fromId: string;
  toId: string;
  itemId: string;
  amount: number;
}

export interface FactoryLayout {
  elements: LayoutElement[];
  connections: LayoutConnection[];
  totalWidth: number;
  totalLength: number;
}

export function generateLayout(steps: ProductionStep[]): FactoryLayout {
  const elements: LayoutElement[] = [];
  const connections: LayoutConnection[] = [];

  let currentY = 0;
  const spacingX = 10;
  const spacingY = 15;

  function processStep(step: ProductionStep, x: number, parentId?: string): string {
    const machine = machinesData.find(m => m.id === step.machineId);
    const count = Math.ceil(step.machineCount);
    const elementId = `${step.targetItemId}-${step.recipeId}-${Math.random().toString(36).substr(2, 5)}`;

    const width = machine ? machine.width : 10;
    const length = machine ? machine.length : 10;

    // Place machines in a row if count > 1
    const totalWidth = width * count + (count - 1) * 2;

    elements.push({
      id: elementId,
      machineId: step.machineId,
      name: `${count}x ${machine?.name || step.machineId}`,
      x: x - totalWidth / 2,
      y: currentY,
      width: totalWidth,
      length: length,
      targetItemId: step.targetItemId
    });

    if (parentId) {
      connections.push({
        fromId: elementId,
        toId: parentId,
        itemId: step.targetItemId,
        amount: step.targetAmount
      });
    }

    const savedY = currentY;
    currentY += length + spacingY;

    const childCount = step.childSteps.length;
    if (childCount > 0) {
      const childSpacing = 40;
      const startX = x - ((childCount - 1) * childSpacing) / 2;

      step.childSteps.forEach((child, index) => {
        processStep(child, startX + index * childSpacing, elementId);
      });
    }

    return elementId;
  }

  if (steps.length > 0) {
    processStep(steps[0], 0);
  }

  // Normalize coordinates
  const minX = Math.min(...elements.map(e => e.x));
  const minY = Math.min(...elements.map(e => e.y));

  elements.forEach(e => {
    e.x -= minX;
    e.y -= minY;
  });

  const maxX = Math.max(...elements.map(e => e.x + e.width), 0);
  const maxY = Math.max(...elements.map(e => e.y + e.length), 0);

  return {
    elements,
    connections,
    totalWidth: maxX,
    totalLength: maxY
  };
}
