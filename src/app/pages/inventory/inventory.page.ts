import { Observable, Subscription } from 'rxjs';
import { AuthService, InventoryService, ToastService } from '@services';
import { Inventory } from '@models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CreateOrUpdateInventoryPage } from './create-update-inventory/create-update-inventory.component';
import { getCategories, getCategoryIcon, roleBigOrEqualThan } from '@utils';
import { CategoryInventoryEnum, UserRole } from '@enums';
import { InventoryDetailComponent } from '../../shared/components/inventory-detail/inventory-detail.component';
import { FormsModule } from '@angular/forms';
import { InventoryModule } from './inventory.module';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  imports: [InventoryModule, FormsModule],
  providers: [ModalController, AlertController, AsyncPipe],
})
export class InventoryPage implements OnInit, OnDestroy {
  public items$!: Observable<Inventory[]>;
  searchName = undefined;
  categorySearch?: CategoryInventoryEnum | 'all' = undefined;
  categories = getCategories();

  constructor(
    private inventoryService: InventoryService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastService: ToastService,
    private auth: AuthService
  ) {}

  ngOnDestroy(): void {}

  async ngOnInit() {
    this.items$ = this.inventoryService.getInventories$();
  }

  async addOrupdateInventory(inventory?: Inventory) {
    const isUpdate = inventory != null;

    const modal = await this.modalController.create({
      component: CreateOrUpdateInventoryPage,
      componentProps: {
        inventory,
      },
    });

    await modal.present();
    const { data } = (await modal.onDidDismiss()) as { data: Inventory };

    if (data) {
      if (isUpdate) {
        console.log('update');
        await this.inventoryService.updateInventory(data);
      } else {
        console.log('create');
        const nameExist = await this.inventoryService.inventoryNameExists(
          data.name
        );
        console.log('nameExist', nameExist);
        if (nameExist) {
          this.toastService.showError(
            "Ce nom d'article est déjà utilisé. Merci d'en choisir un autre ou de modifier l'article existant."
          );
          return;
        }

        await this.inventoryService.insertInventory(data);
      }

      if (isUpdate) {
        this.toastService.showSuccess('Article ajouté avec succès !');
      } else {
        this.toastService.showSuccess('Article mis à jour avec succès !');
      }
    }
  }

  async deleteInventory(inventory: Inventory) {
    console.log('delete', inventory);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      message: `Êtes-vous sûr de vouloir supprimer cet article '${inventory.name}'`,
      buttons: [
        {
          text: 'Confirmer la suppression',
          handler: async () => {
            await this.inventoryService.deleteInventory(inventory);
          },
        },
      ],
    });

    await alert.present();
  }

  getIconCategory(category: CategoryInventoryEnum | 'all') {
    if (category === 'all') {
      return undefined;
    }
    return getCategoryIcon(category);
  }

  async viewDetails(inventory: Inventory) {
    const modal = await this.modalController.create({
      component: InventoryDetailComponent,
      componentProps: { inventory }, // Passe l'inventaire à afficher
    });
    await modal.present();
  }

  search() {
    let category: CategoryInventoryEnum | undefined;

    if (this.categorySearch && this.categorySearch !== 'all') {
      category = this.categorySearch;
    }

    this.items$ = this.inventoryService.getInventories$({
      name: this.searchName,
      category,
    });
  }

  get hasRight() {
    return roleBigOrEqualThan(this.auth.currentAppUser!.role, UserRole.USER);
  }

  get canDelete() {
    return roleBigOrEqualThan(this.auth.currentAppUser!.role, UserRole.MANAGER);
  }
}
