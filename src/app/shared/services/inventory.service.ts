import { InventoryHistoryService } from './inventory-history.service';
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy,
  collectionData,
} from '@angular/fire/firestore';
import { InventoryEventEnum } from '@enums';
import { Inventory, InventorySearch } from '@models';
import { AuthService } from '@services';
import { normalizeText } from '@utils';
import { deleteDoc, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private collectionName = 'inventories';

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
    private inventoryHistoryService: InventoryHistoryService
  ) {}

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName);
  }

  getInventories$(filters?: InventorySearch): Observable<Inventory[]> {
    const conditions: QueryConstraint[] = [];

    if (filters) {
      // 🔍 Filtre par nom
      if (filters.name != null && filters.name !== '') {
        const searchText = normalizeText(filters.name);
        conditions.push(
          where('normalizedName', '>=', searchText),
          where('normalizedName', '<=', searchText + '\uf8ff'),
          orderBy('normalizedName')
        );
      }

      // 📂 Filtre par catégorie
      if (filters.category != null) {
        conditions.push(where('category', '==', filters.category));
      }

      // 📅 Tri
      if (!filters.name) {
        conditions.push(orderBy('updatedAt', 'desc'));
      } else {
        conditions.push(orderBy('name', 'asc'));
      }
    } else {
      conditions.push(orderBy('updatedAt', 'desc'));
    }

    const q = query(this.getCollectionRef(), ...conditions);

    return collectionData(q, { idField: 'uid' }) as Observable<Inventory[]>;
  }

  async insertInventory(inventory: Inventory) {
    console.log('insertInventory');
    const docRef = doc(this.getCollectionRef());
    const newInventory: Inventory = {
      ...inventory,
      createdBy: this.auth.currentAppUser!,
      updatedBy: this.auth.currentAppUser!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(docRef, newInventory);

    // 🔹 Ajouter à l'historique
    await this.inventoryHistoryService.insertInventoryHistory(
      newInventory,
      InventoryEventEnum.CREATED
    );

    return docRef.id;
  }

  async updateInventory(inventory: Inventory) {
    console.log('updateInventory');
    const docRef = doc(this.getCollectionRef(), inventory.id!);
    const updatedInventory = {
      ...inventory,
      updatedBy: this.auth.currentAppUser,
      updatedAt: new Date(),
    };
    await updateDoc(docRef, updatedInventory);

    // 🔹 Ajouter à l'historique
    await this.inventoryHistoryService.insertInventoryHistory(
      updatedInventory as Inventory,
      InventoryEventEnum.UPDATED
    );
  }

  async deleteInventory(inventory: Inventory) {
    console.log('deleteInventory');
    const docRef = doc(this.getCollectionRef(), inventory.id);

    await deleteDoc(docRef);

    // 🔹 Ajouter à l'historique
    if (inventory) {
      await this.inventoryHistoryService.insertInventoryHistory(
        inventory,
        InventoryEventEnum.DELETED
      );
    }
  }

  async inventoryNameExists(name: string): Promise<boolean> {
    const uid = this.auth.currentUserId;
    if (!uid) throw new Error('User not logged in');

    const q = query(
      this.getCollectionRef(),
      where('normalizedName', '==', normalizeText(name))
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty; // true si au moins un document existe
  }
}
