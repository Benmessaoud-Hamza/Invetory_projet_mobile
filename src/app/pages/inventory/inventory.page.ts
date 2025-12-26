import { AuthService, InventoryService, ToastService } from '@services';
import { Inventory } from '@models';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CreateOrUpdateInventoryPage } from './create-update-inventory/create-update-inventory.component';
import { getCategories, getCategoryIcon, roleBigOrEqualThan } from '@utils';
import { CategoryInventoryEnum, UserRole } from '@enums';
import { InventoryDetailComponent } from '../../shared/components/inventory-detail/inventory-detail.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  imports: [IonicModule, FormsModule],
  providers: [InventoryService],
})
export class InventoryPage implements OnInit {
  public items: Inventory[] = [];
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

  async ngOnInit() {
    await this.getData();
  }

  async getData() {
    this.items = (await this.inventoryService.getInventories()) ?? [];
    console.log('   this.items ', this.items);
  }

  async addOrupdateInventory(inventory?: Inventory) {
    const isUpdate = inventory !== undefined;

    const modal = await this.modalController.create({
      component: CreateOrUpdateInventoryPage,
      componentProps: {
        inventory,
      },
    });

    await modal.present();
    const { data }: { data: Inventory } = (await modal.onDidDismiss()) as any;

    if (data) {
      if (isUpdate) {
        console.log('update');
        await this.inventoryService.updateInventory(data);
        const index = this.items.findIndex((el) => el.id === data.id);
        this.items[index] = data;
      } else {
        console.log('create');
        const nameExist = await this.inventoryService.inventoryNameExists(
          data.name
        );
        console.log('nameExist', nameExist);
        if (nameExist) {
          this.toastService.showError(
            "Ce nom d'inventaire est déjà utilisé. Merci d'en choisir un autre ou de modifier l'inventaire existant."
          );
          return;
        }

        await this.inventoryService.insertInventory(data);
      }

      if (isUpdate) {
        this.toastService.showSuccess('Inventaire ajouté avec succès !');
      } else {
        this.toastService.showSuccess('Inventaire mis à jour avec succès !');
      }

      await this.getData();
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
            this.items = this.items.filter((el) => el.id !== inventory.id);
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

  async search() {
    let category;
    if (this.categorySearch != null && this.categorySearch !== 'all') {
      category = this.categorySearch;
    }

    console.log('search', {
      name: this.searchName,
      category,
    });

    this.items = await this.inventoryService.getInventories({
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
