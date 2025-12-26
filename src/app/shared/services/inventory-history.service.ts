import { Injectable, Query } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
} from '@angular/fire/firestore';
import {
  Inventory,
  InventoryHistory,
  AppUser,
  InventoryHistorySearch,
} from '@models';
import { AuthService } from '@services';
import { InventoryEventEnum } from '@enums';
import { DocumentData, where } from 'firebase/firestore';
import { normalizeText } from '@utils';

@Injectable({ providedIn: 'root' })
export class InventoryHistoryService {
  private collectionName = 'inventory_histories';

  constructor(private firestore: Firestore, private auth: AuthService) {}

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName);
  }

  async getInventoryHistory(
    filters?: Partial<InventoryHistorySearch>
  ): Promise<InventoryHistory[]> {
    console.log('getInventoryHistory', filters);

    const conditions: any[] = [];
    if (filters) {
      // Filter by event type (if provided)
      if (filters?.eventType != null) {
        conditions.push(where('eventType', '==', filters.eventType));
      }

      // Filter by date range
      if (filters?.dateFrom != null) {
        conditions.push(where('dateEvent', '>=', new Date(filters.dateFrom)));
      }
      if (filters?.dateTo != null) {
        conditions.push(where('dateEvent', '<=', new Date(filters.dateTo)));
      }

      // Filter by inventory name (prefix search on normalized field)
      if (filters.name != null && filters.name !== '') {
        const normalized = normalizeText(filters.name);
        conditions.push(
          where('inventory.normalizedName', '>=', normalized),
          where('inventory.normalizedName', '<=', normalized + '\uf8ff')
        );
      }

      // Filter by inventory category
      if (filters?.category != null) {
        conditions.push(where('inventory.category', '==', filters.category));
      }
    }

    // Always order by dateEvent descending
    conditions.push(orderBy('dateEvent', 'desc'));

    // Build the final query with spread operator
    const q = query(this.getCollectionRef(), ...conditions);

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as any;
      return {
        id: docSnap.id,
        eventType: data.eventType,
        dateEvent: data.dateEvent?.toDate
          ? data.dateEvent.toDate()
          : new Date(data.dateEvent),
        user: data.user as AppUser,
        inventory: data.inventory as Inventory,
      } as InventoryHistory;
    });
  }

  // 🔹 Ajouter un historique
  async insertInventoryHistory(
    inventory: Inventory,
    event: InventoryEventEnum
  ) {
    const docRef = doc(this.getCollectionRef());

    const history: Partial<InventoryHistory> = {
      eventType: event,
      dateEvent: new Date(),
      user: this.auth.currentAppUser ?? undefined,
      inventory,
    };

    await setDoc(docRef, history);
    return docRef.id;
  }
}
