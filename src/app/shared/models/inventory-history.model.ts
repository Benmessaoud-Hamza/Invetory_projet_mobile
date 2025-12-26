import { CategoryInventoryEnum, InventoryEventEnum } from '@enums';
import { AppUser, Inventory } from '@models';

export interface InventoryHistory {
  id?: string; // doc id Firestore
  eventType: InventoryEventEnum;
  dateEvent: Date;
  user?: AppUser;
  inventory: Inventory;
}

export interface InventoryHistoryDtoWrite extends Partial<InventoryHistory> {}

export interface InventoryHistorySearch {
  name?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  category?: CategoryInventoryEnum;
  eventType?: InventoryEventEnum;
}
