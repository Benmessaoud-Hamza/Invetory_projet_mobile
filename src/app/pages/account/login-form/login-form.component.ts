import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services';
import { Subscription } from 'rxjs';
import { ToastService } from '@services';
import { AccountModule } from '../acount.module';

@Component({
  selector: 'app-login-form-component',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [AccountModule, FormsModule],
})
export class LoginFormComponent implements OnDestroy {
  showPassword = false;
  email = '';
  password = '';
  subscriptions = new Subscription();
  constructor(
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async login() {
    console.log('email', this.email);
    console.log('password', this.password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.toastService.showError('Format de l’email invalide');
      return;
    }

    this.subscriptions.add(
      this.authService.login(this.email, this.password).subscribe({
        error: async (err) => {
          console.log('error');
          // Firebase error code
          let message = 'Une erreur est survenue';
          if (err.code) {
            switch (err.code) {
              case 'auth/user-not-found':
                message = "L'utilisateur n'existe pas";
                break;
              case 'auth/wrong-password':
                message = 'Mot de passe incorrect';
                break;
              case 'auth/invalid-email':
                message = 'Adresse email invalide';
                break;
              case 'auth/invalid-credential':
                message = 'Adresse email ou mot de passe invalide';
                break;
              case 'auth/user-disabled':
                message = 'Compte désactivé';
                break;
              default:
                message = err.message || message;
            }
          }

          await this.toastService.showError(message);
        },
      })
    );
  }
}
