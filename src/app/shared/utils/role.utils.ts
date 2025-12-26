import { UserRole } from '@enums';
const levels = [
  UserRole.VISITOR,
  UserRole.USER,
  UserRole.MANAGER,
  UserRole.ADMIN,
];

export const getIconByRole = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'shield-checkmark-outline';
    case UserRole.MANAGER:
      return 'briefcase-outline';
    case UserRole.USER:
      return 'person-outline';
    case UserRole.VISITOR:
      return 'eye';

    default:
      return 'help-circle-outline';
  }
};

export const getRoleName = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrateur';
    case UserRole.MANAGER:
      return 'Manager';
    case UserRole.VISITOR:
      return 'Visiteur';
    case UserRole.USER:
      return 'Utilisateur';
    default:
      return 'Visiteur';
  }
};

export const getRoleLevel = (role: UserRole) => {
  return levels.findIndex((roleLevel) => roleLevel === role);
};

export const roleBigOrEqualThan = (
  roleToCompare: UserRole,
  roleCheck: UserRole
) => {
  const levelRole1 = getRoleLevel(roleToCompare);
  const levelRole2 = getRoleLevel(roleCheck);
  return levelRole1 === levelRole2 || levelRole1 > levelRole2;
};

export const roleBigThan = (roleToCompare: UserRole, roleCheck: UserRole) => {
  const levelRole1 = getRoleLevel(roleToCompare);
  const levelRole2 = getRoleLevel(roleCheck);
  return levelRole1 > levelRole2;
};
