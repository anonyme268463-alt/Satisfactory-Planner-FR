export type ItemId = string;
export type RecipeId = string;
export type MachineId = string;

export interface Item {
  id: ItemId;
  name: string; // Nom en français
  nameEn: string;
  description?: string;
  category: 'Resource' | 'Component' | 'Fuel' | 'Waste';
  isFluid: boolean;
}

export interface Ingredient {
  itemId: ItemId;
  amount: number; // Quantité par minute
}

export interface Recipe {
  id: RecipeId;
  name: string;
  nameEn: string;
  isAlternate: boolean;
  ingredients: Ingredient[];
  products: Ingredient[];
  producedIn: MachineId;
  duration: number; // en secondes pour un cycle
}

export interface Machine {
  id: MachineId;
  name: string;
  nameEn: string;
  powerConsumption: number; // en MW
  baseSpeed: number; // 1.0 par défaut
}

export interface ResourceNode {
  itemId: ItemId;
  purity: 'Impure' | 'Normal' | 'Pure';
  baseRate: number; // Taux de base par minute
}
