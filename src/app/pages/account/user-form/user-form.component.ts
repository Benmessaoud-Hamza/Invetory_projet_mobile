import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { AuthService } from '@services';
import { UserRole } from '@enums';
import { Subscription } from 'rxjs';
import { ToastService } from '@services';
import { getIconByRole, getRoleName } from '@utils';

@Component({
  selector: 'app-user-form-component',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
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
    private authService: AuthService,
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
            this.email,
            this.password,
            this.role,
            this.firstName,
            this.lastName
          )
          .subscribe(async () => {
            await this.toastService.showSuccess(
              `Utilisateur créé avec succes!`
            );

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
}
