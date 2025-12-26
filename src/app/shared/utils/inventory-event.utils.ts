import { InventoryEventEnum } from '@enums';

export const getInventoryEventName = (event: InventoryEventEnum) => {
  switch (event) {
    case InventoryEventEnum.CREATED:
      return 'Création';
    case InventoryEventEnum.DELETED:
      return 'Suppression';
    case InventoryEventEnum.UPDATED:
      return 'Mise à jour';
  }
};
