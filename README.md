# Application de Gestion d'Inventaires

Cette application permet de gérer des inventaires avec un système complet de création, modification, suppression et suivi historique des actions. Elle inclut un système d’authentification et des rôles utilisateur différenciés pour gérer les permissions.

---

## Fonctionnalités

### Gestion des Inventaires

- **Création** d’articles et d’inventaires.
- **Modification** des articles existants.
- **Suppression** des articles (selon le rôle de l’utilisateur).
- **Visualisation** des inventaires.
- **Historique** complet des actions effectuées sur les inventaires.

### Gestion des Utilisateurs

- **Création** de nouveaux utilisateurs (Admin et Manager uniquement).
- **Activation / désactivation** des comptes utilisateurs (pour les comptes avec des roles inférieurs).
- Aucun utilisateur ne peut modifier le rôle d’un utilisateur supérieur.

### Rôles et Permissions

#### Administrateur

- Gestion complète des inventaires : création, modification, suppression, visualisation.
- Accès à l’historique complet.
- Gestion des utilisateurs : création et activation/désactivation des comptes (Manager, Utilisateur, Visiteur).

#### Manager

- Gestion des inventaires : création, modification, visualisation (pas de suppression).
- Accès à l’historique.
- Gestion des utilisateurs : création et activation/désactivation des comptes inférieurs (Utilisateur, Visiteur).

#### Utilisateur

- Gestion des inventaires : création, modification, visualisation (pas de suppression).
- Accès à l’historique.
- Aucun droit sur la gestion des utilisateurs.

#### Visiteur

- Visualisation des inventaires et de l’historique.
- Aucun droit sur la gestion des utilisateurs.

### Filtrage

- **Inventaires** :
  - Filtrage par nom
  - Filtrage par type de catégorie
- **Historique** :
  - Filtrage par nom
  - Filtrage par catégorie
  - Filtrage par date (début et fin)

---

## Authentification

- Page de connexion pour tous les utilisateurs.
- Gestion des sessions sécurisées selon le rôle.
- Permissions appliquées selon le rôle attribué.

---
