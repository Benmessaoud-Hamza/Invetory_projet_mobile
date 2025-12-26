import { ToastService } from '@services';
import { ModalController, IonicModule } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InventoryDtoWrite } from '@models';
import { CategoryInventoryEnum } from '@enums';
import { CommonModule } from '@angular/common';
import { getCategories, getCategoryIcon, normalizeText } from '@utils';

@Component({
  selector: 'app-create-update-inventory',
  templateUrl: './create-update-inventory.component.html',
  styleUrls: ['./create-update-inventory.component.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class CreateOrUpdateInventoryPage implements OnInit {
  formGroup!: FormGroup;

  @Input() inventory!: InventoryDtoWrite;
  categories = getCategories();

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    if (!this.inventory) {
      this.reset();
    }

    this.formGroup = this.formBuilder.group({
      name: [this.inventory?.name, Validators.required],
      category: [this.inventory?.category, Validators.required],
      price: [this.inventory?.price, [Validators.required, Validators.min(0)]],
      quantity: [
        this.inventory?.quantity,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  async valider() {
    const isUpdate = this.inventory.id != null;

    this.inventory = { ...this.inventory, ...this.formGroup.value };
    this.inventory.normalizedName = normalizeText(this.inventory.name!);

    this.modalController.dismiss(this.inventory);

    this.reset();
  }

  reset() {
    this.inventory = {
      name: undefined,
      price: 0,
      quantity: 1,
      category: CategoryInventoryEnum.FURNITURE,
    };
  }

  getIconCategory(category: CategoryInventoryEnum) {
    return getCategoryIcon(category);
  }

  exit() {
    this.modalController.dismiss(null);
  }
}
