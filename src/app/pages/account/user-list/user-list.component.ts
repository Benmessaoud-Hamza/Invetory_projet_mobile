import { AuthService, ProfileService } from "@services";
import { AsyncPipe } from "@angular/common";
import { Component, Input, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import { AppUser } from "@models";
import { UserRole } from "@enums";
import { UserStatus } from "@enums";
import { formatDate, getIconByRole, roleBigThan } from "@utils";
import { AccountModule } from "../acount.module";
import { Timestamp } from "firebase/firestore";

@Component({
  selector: "app-user-list-component",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  imports: [AccountModule, AsyncPipe],
})
export class UserListComponent implements OnDestroy {
  users$!: Observable<AppUser[]>;
  loaded = false;
  @Input() set status(value: UserStatus) {
    this._status = value;
    if (this.loaded) {
      this.users$ = this.profileService.getProfilesByStatus(this._status);
    }
  }

  _status = UserStatus.ACTIVE;
  constructor(
    private profileService: ProfileService,
    public authService: AuthService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    this.users$ = this.profileService.getProfilesByStatus(this._status);
    this.loaded = true;
  }

  getRoleIcon(role: UserRole) {
    return getIconByRole(role);
  }

  onStatusToggle(user: AppUser, event: any) {
    const checked = event.detail.checked;

    const newStatus = checked ? UserStatus.ACTIVE : UserStatus.BLOCKED;

    this.profileService.changeProfileStatus(user.uid!, newStatus);
  }

  canDisableUser(role: UserRole) {
    return roleBigThan(this.authService.currentAppUser?.role!, role);
  }
  formatDate(timestamp: Timestamp | Date): string {
    return formatDate(timestamp);
  }
}
