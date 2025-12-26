import { Subscription } from "rxjs";
import { Component, OnDestroy } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { AuthService } from "@services";
import { AsyncPipe, CommonModule } from "@angular/common";
import { LoginFormComponent } from "./login-form/login-form.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { UserListComponent } from "./user-list/user-list.component";
import { FormsModule } from "@angular/forms";
import { UserStatus } from "@enums";
import { UserRole } from "@enums";

import {
  getIconByRole,
  getRoleName,
  roleBigOrEqualThan,
  roleBigThan,
} from "@utils";

@Component({
  selector: "app-account",
  templateUrl: "account.page.html",
  styleUrls: ["account.page.scss"],
  imports: [
    IonicModule,
    CommonModule,
    LoginFormComponent,
    UserFormComponent,
    UserListComponent,
    FormsModule,
  ],
  providers: [AsyncPipe],
})
export class AccountPage implements OnDestroy {
  subscriptions = new Subscription();
  segment: UserStatus = UserStatus.ACTIVE;
  modalOpen = false;

  constructor(public authService: AuthService) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout() {
    this.subscriptions.add(this.authService.logout().subscribe());
  }

  onUserCreated(user: any) {
    console.log("New user created:", user);
    this.modalOpen = false;
  }

  openCreateModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  getRoleIcon(role: UserRole) {
    return getIconByRole(role);
  }

  getRoleLabel(role: UserRole) {
    return getRoleName(role);
  }

  get canManageUsers() {
    return roleBigOrEqualThan(
      this.authService.currentAppUser?.role!,
      UserRole.MANAGER
    );
  }
}
