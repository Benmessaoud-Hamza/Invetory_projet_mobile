import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AppUser } from '@models';
import { UserRole, UserStatus } from '@enums';
import { setDoc, updateDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private collectionName = 'profiles';

  constructor(private firestore: Firestore) {}

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
