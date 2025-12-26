import { UserRole, UserStatus } from '@enums';

export interface AppUser {
  uid: string;
  email: string;

  firstName?: string;
  lastName?: string;
  fullName?: string;

  role: UserRole;
  status: UserStatus;
}
