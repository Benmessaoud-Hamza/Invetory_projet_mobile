import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonButton,
  IonIcon,
  IonInput,
  IonSpinner,
  IonLabel,
  IonToggle,
  IonList,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonModal,
  IonSelectOption,
  IonSelect,
} from '@ionic/angular/standalone';

const modules = [
  CommonModule,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  //=========
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonButton,
  IonIcon,
  IonInput,
  IonSpinner,
  IonLabel,
  IonToggle,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonModal,
  IonSelect,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class AccountModule {}
