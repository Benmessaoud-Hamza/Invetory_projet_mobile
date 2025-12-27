import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryInventoryEnum, InventoryEventEnum } from '@enums';
import { ModalController } from '@ionic/angular';
import { InventoryHistory, InventoryHistorySearch } from '@models';
import { InventoryHistoryService } from '@services';
import {
  formatDate,
  getCategories,
  getCategoryIcon,
  getInventoryEventName,
} from '@utils';
import { Timestamp } from 'firebase/firestore';
import { InventoryDetailComponent } from 'src/app/shared/components';
import { HistoryModule } from './history.module';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  imports: [HistoryModule, FormsModule],
  providers: [ModalController],
})
export class HistoryPage {
  public items: InventoryHistory[] = [];
  dateStart: string | undefined;
  dateEnd: string | undefined;
  categorySearch?: CategoryInventoryEnum | 'all' = undefined;
  searchName: string | undefined;
  categories = getCategories();

  constructor(
    private historyService: InventoryHistoryService,
    private modalController: ModalController
  ) {}

  async ionViewWillEnter() {
    this.items = await this.historyService.getInventoryHistory();
  }

  async openDetail(history: InventoryHistory) {
    const modal = await this.modalController.create({
      component: InventoryDetailComponent,
      componentProps: { history, inventory: history.inventory },
    });
    await modal.present();
  }

  formatDate(timestamp: Timestamp | Date): string {
    return formatDate(timestamp);
  }

  getEventName(event: InventoryEventEnum) {
    return getInventoryEventName(event);
  }

  async search() {
    const searchObject: InventoryHistorySearch = {};

    if (this.dateStart) {
      searchObject.dateFrom = this.dateStart;
    }

    if (this.dateEnd) {
      searchObject.dateTo = this.dateEnd;
    }

    if (this.searchName) {
      searchObject.name = this.searchName;
    }

    if (this.categorySearch && this.categorySearch !== 'all') {
      searchObject.category = this.categorySearch;
    }

    this.items = await this.historyService.getInventoryHistory(searchObject);
  }

  getIconCategory(category: CategoryInventoryEnum | 'all') {
    if (category === 'all') {
      return undefined;
    }
    return getCategoryIcon(category);
  }
}
