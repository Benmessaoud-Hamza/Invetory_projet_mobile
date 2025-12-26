import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { AppUser } from '@models';
import { UserRole, UserStatus } from '@enums';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAuth } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private appUserSubject = new BehaviorSubject<AppUser | null>(null);
  public appUser$: Observable<AppUser | null> =
    this.appUserSubject.asObservable();
  public isLoading = true;

  constructor(
    private auth: Auth,
    private profileService: ProfileService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.auth.onAuthStateChanged(async (user) => {
      this.isLoading = false;
      if (user) {
        const userData = await this.profileService.getProfileByIdUser(user.uid);
        this.appUserSubject.next(userData);
        this.router.navigate(['/tabs/inventory']);
      } else {
        this.appUserSubject.next(null);
      }
    });
  }

  // -------------------------
  // Auth
  // -------------------------
  register(
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
    firstName?: string,
    lastName?: string
  ) {
    const secondaryApp = initializeApp(
      environment.firebaseConfig,
      'secondaryApp'
    );
    const secondaryAuth = getAuth(secondaryApp);

    return from(
      createUserWithEmailAndPassword(secondaryAuth, email, password)
        .then(async (cred) => {
          const userData: AppUser = {
            uid: cred.user.uid,
            status: UserStatus.ACTIVE,
            email,
            role,
            firstName,
            lastName,
            fullName:
              firstName && lastName ? `${firstName} ${lastName}` : undefined,
          };
          console.log('cred', cred);
          await this.profileService.addProfileUser(cred.user.uid, userData);
        })
        .catch(() => {
          this.isLoading = false;
        })
    );
  }

  login(email: string, password: string) {
    this.isLoading = true;
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(async (userCred) => {
          this.isLoading = false;
          const userData = await this.profileService.getProfileByIdUser(
            userCred.user.uid
          );

          if (userData?.status === UserStatus.BLOCKED) {
            this.toastService.showError('Votre compte est bloqué');
            return this.logout();
          }

          if (userData) {
            userData.uid = userCred.user.uid!;
          }

          this.appUserSubject.next(userData);
          return userCred.user;
        })
        .catch(() => {
          this.isLoading = false;
        })
    );
  }

  logout() {
    this.isLoading = false;
    return from(signOut(this.auth).then(() => this.appUserSubject.next(null)));
  }

  get currentAppUser(): AppUser | null {
    return this.appUserSubject.value;
  }

  get currentUserId() {
    return this.auth.currentUser?.uid;
  }
}
