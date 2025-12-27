import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { AuthService } from '@services';
import { UserRole, UserStatus } from '@enums';
import { Subscription } from 'rxjs';
import { ToastService } from '@services';
import { getIconByRole, getRoleName, roleBigOrEqualThan } from '@utils';
import { AccountModule } from '../acount.module';

@Component({
  selector: 'app-user-form-component',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [AccountModule, FormsModule],
})
export class UserFormComponent implements OnDestroy {
  email = '';
  password = '';
  role: UserRole = UserRole.USER;
  firstName: string = '';
  lastName: string = '';
  formGroup!: FormGroup;

  @Output() userCreated = new EventEmitter<any>();
  @Output() exit = new EventEmitter<any>();
  subscriptions = new Subscription();
  showPassword = false;

  // get role names and values
  roles = Object.values(UserRole).map((role) => ({
    name: getRoleName(role),
    value: role,
  }));

  constructor(
    public authService: AuthService,
    private toastService: ToastService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async createUser() {
    if (!this.email || !this.password) {
      await this.toastService.showError('Email and password are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.toastService.showError('Format de l’email invalide');
      return;
    }

    if (!this.password || this.password.length < 6) {
      await this.toastService.showError(
        'Le mot de passe doit contenir au moins 6 caractères'
      );
      return;
    }

    try {
      this.subscriptions.add(
        this.authService
          .register(
            {
              email: this.email,
              role: this.role,
              firstName: this.firstName,
              lastName: this.lastName,
              status: UserStatus.ACTIVE,
            },
            this.password
          )
          .subscribe(async () => {
            this.email = '';
            this.password = '';
            this.firstName = '';
            this.lastName = '';
            this.role = UserRole.USER;
            this.userCreated.emit(true);
          })
      );
    } catch (err: any) {
      await this.toastService.showError(err.message || 'Failed to create user');
    }
  }

  getIconRole(role: UserRole) {
    return getIconByRole(role);
  }

  close() {
    this.userCreated.emit(false);
  }

  isRoleAvailable(role: UserRole) {
    return roleBigOrEqualThan(this.authService.currentAppUser?.role!, role);
  }
}
