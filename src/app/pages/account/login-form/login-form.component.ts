import { IonicModule } from '@ionic/angular';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services';
import { Subscription } from 'rxjs';
import { ToastService } from '@services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form-component',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LoginFormComponent implements OnDestroy {
  showPassword = false;
  email = '';
  password = '';
  subscriptions = new Subscription();
  constructor(
    public authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  login() {
    console.log('email', this.email);
    console.log('password', this.password);
    this.subscriptions.add(
      this.authService.login(this.email, this.password).subscribe({
        next: async () => {
          await this.toastService.showSuccess('Authentifié avec Success');
        },
        error: (err) => {
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

          this.toastService.showError(message);
        },
      })
    );
  }
}
