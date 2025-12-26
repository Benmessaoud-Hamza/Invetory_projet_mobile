import { CategoryInventoryEnum } from '@enums';
let categories: { name: string; value: CategoryInventoryEnum }[] = [];

export const getCategories = () => {
  if (!categories.length) {
    categories = Object.values(CategoryInventoryEnum).map((value) => ({
      name: getCategoryName(value),
      value: value,
    }));
  }

  return categories;
};

export const getCategoryName = (category: CategoryInventoryEnum): string => {
  switch (category) {
    case CategoryInventoryEnum.ELECTRONICS:
      return 'Électronique';
    case CategoryInventoryEnum.FURNITURE:
      return 'Mobilier';
    case CategoryInventoryEnum.CLOTHING:
      return 'Vêtements';
    case CategoryInventoryEnum.FOOD:
      return 'Alimentation';
    case CategoryInventoryEnum.TOYS:
      return 'Jouets';
    case CategoryInventoryEnum.BOOKS:
      return 'Livres';
    case CategoryInventoryEnum.SPORTS:
      return 'Articles de sport';
    case CategoryInventoryEnum.STATIONERY:
      return 'Fournitures scolaires';
    case CategoryInventoryEnum.LAB_EQUIPMENT:
      return 'Équipement de laboratoire';
    case CategoryInventoryEnum.ART_SUPPLIES:
      return 'Fournitures artistiques';
    case CategoryInventoryEnum.CLEANING:
      return 'Produits de nettoyage';
    case CategoryInventoryEnum.OTHER:
      return 'Autre';
    default:
      return 'Inconnu';
  }
};

export const getCategoryIcon = (category: CategoryInventoryEnum) => {
  switch (category) {
    case CategoryInventoryEnum.ELECTRONICS:
      return 'phone-portrait';
    case CategoryInventoryEnum.FURNITURE:
      return 'bed';
    case CategoryInventoryEnum.CLOTHING:
      return 'shirt';
    case CategoryInventoryEnum.FOOD:
      return 'restaurant';
    case CategoryInventoryEnum.TOYS:
      return 'game-controller';
    case CategoryInventoryEnum.BOOKS:
      return 'book';
    case CategoryInventoryEnum.SPORTS:
      return 'football';
    case CategoryInventoryEnum.STATIONERY:
      return 'pencil';
    case CategoryInventoryEnum.LAB_EQUIPMENT:
      return 'flask';
    case CategoryInventoryEnum.ART_SUPPLIES:
      return 'brush';
    case CategoryInventoryEnum.CLEANING:
      return 'trash';
    case CategoryInventoryEnum.OTHER:
      return 'cube';
    default:
      return 'help-circle';
  }
};
