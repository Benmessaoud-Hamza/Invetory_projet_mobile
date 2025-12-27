import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { AppUser } from '@models';
import { UserRole, UserStatus } from '@enums';
import {
  collection,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private collectionName = 'profiles';

  constructor(private firestore: Firestore) {}

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName);
  }

  getProfilesByStatus(status: UserStatus): Observable<AppUser[]> {
    // 🔹 filtrage par status
    const q = query(
      this.getCollectionRef(),
      where('status', '==', status)
      // orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'uid' }) as Observable<AppUser[]>;
  }

  public async getProfileByIdUser(idUser: string): Promise<AppUser | null> {
    const userDoc = await getDoc(
      doc(this.firestore, `${this.collectionName}/${idUser}`)
    );
    if (!userDoc.exists()) return null;
    const user = userDoc.data() as AppUser;
    user.uid = idUser;

    return user;
  }

  public async getProfileRoleByIdUser(
    idUser?: string
  ): Promise<UserRole | null> {
    if (!idUser) return null;
    const userDoc = await getDoc(
      doc(this.firestore, `${this.collectionName}/${idUser}`)
    );
    if (!userDoc.exists()) return null;
    const data = userDoc.data() as AppUser;
    return data.role;
  }

  public async changeProfileStatus(
    idUser: string,
    status: UserStatus
  ): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${idUser}`);
    await updateDoc(docRef, {
      status,
    });
  }

  public async addProfileUser(idUser: string, userData: AppUser) {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${idUser}`),
      userData
    );
  }
}
