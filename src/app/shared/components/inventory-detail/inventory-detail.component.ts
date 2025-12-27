import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  //=========
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonIcon,
  ModalController,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';

import { Component, Input } from '@angular/core';
import { Inventory } from '@models';
import { CategoryInventoryEnum, InventoryEventEnum } from '@enums';
import { Timestamp } from 'firebase/firestore';

import {
  getInventoryEventName,
  formatDate,
  getCategoryIcon,
  getCategoryName,
} from '@utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    //=========
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow,
  ],
  providers: [ModalController],
})
export class InventoryDetailComponent {
  @Input() inventory!: Inventory;
  @Input() historyEvent?: InventoryEventEnum;

  constructor(private modalController: ModalController) {}

  formatDate(timestamp: Timestamp | Date): string {
    return formatDate(timestamp);
  }

  get createdByName() {
    return `${this.inventory?.createdBy?.firstName} ${this.inventory?.createdBy?.lastName}`;
  }

  get updatedByName() {
    return `${this.inventory?.updatedBy?.firstName} ${this.inventory?.updatedBy?.lastName}`;
  }

  getIconCategory(category: CategoryInventoryEnum) {
    return getCategoryIcon(category);
  }

  close() {
    this.modalController.dismiss(this.inventory);
  }

  getCategoryName(category: CategoryInventoryEnum) {
    return getCategoryName(category);
  }

  getEventName(event: InventoryEventEnum) {
    return getInventoryEventName(event);
  }
}
