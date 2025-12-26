import { CategoryInventoryEnum } from '@enums';
import { AppUser } from './app-user.model';

export interface Inventory {
  id: string; // Firestore doc id
  name: string;
  normalizedName: string;
  price: number;
  quantity: number;
  category: CategoryInventoryEnum;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AppUser;
  updatedBy: AppUser;
}

export interface InventoryDtoWrite extends Partial<Inventory> {}

export interface InventorySearch {
  name?: string;
  category?: CategoryInventoryEnum;
}
