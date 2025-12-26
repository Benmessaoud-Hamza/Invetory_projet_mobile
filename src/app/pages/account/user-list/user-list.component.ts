import { AuthService, ProfileService } from '@services';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { collection, query, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AppUser } from '@models';
import { UserRole } from '@enums';
import { UserStatus } from '@enums';
import { getIconByRole, roleBigThan } from '@utils';

@Component({
  selector: 'app-user-list-component',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [IonicModule, CommonModule, AsyncPipe],
})
export class UserListComponent {
  users$!: Observable<AppUser[]>;
  loaded = false;
  @Input() set status(value: UserStatus) {
    this._status = value;
    if (this.loaded) {
      this.getOrRefrechData();
    }
  }

  _status = UserStatus.ACTIVE;
  constructor(
    private firestore: Firestore,
    private profileService: ProfileService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getOrRefrechData();
    this.loaded = true;
  }

  getOrRefrechData() {
    const usersCol = collection(this.firestore, 'profiles');

    // 🔹 filtrage par status
    const q = query(usersCol, where('status', '==', this._status));

    this.users$ = collectionData(q, { idField: 'uid' }) as Observable<
      AppUser[]
    >;
  }

  getRoleIcon(role: UserRole) {
    return getIconByRole(role);
  }

  onStatusToggle(user: AppUser, event: any) {
    const checked = event.detail.checked;

    const newStatus = checked ? UserStatus.ACTIVE : UserStatus.BLOCKED;

    this.profileService.changeProfileStatus(user.uid!, newStatus);

    this.getOrRefrechData();
  }

  canDisableUser(role: UserRole) {
    return roleBigThan(this.authService.currentAppUser?.role!, role);
  }
}
