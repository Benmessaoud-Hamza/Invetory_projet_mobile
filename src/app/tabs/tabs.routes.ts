import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inventory',
        loadComponent: () =>
          import('../pages/inventory/inventory.page').then(
            (m) => m.InventoryPage
          ),
        canActivate: [AuthGuard], // protéger l’accès
      },
      {
        path: 'history',
        loadComponent: () =>
          import('../pages/history/history.page').then((m) => m.HistoryPage),
        canActivate: [AuthGuard], // protéger l’accès
      },
      {
        path: 'account',
        loadComponent: () =>
          import('../pages/account/account.page').then((m) => m.AccountPage),
      },
      {
        path: '',
        redirectTo: '/tabs/inventory',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inventory',
    pathMatch: 'full',
  },
];
