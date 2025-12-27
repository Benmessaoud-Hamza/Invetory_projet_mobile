import {
  addCircle,
  addOutline,
  bed,
  book,
  briefcaseOutline,
  brush,
  cube,
  eye,
  eyeOff,
  eyeOffOutline,
  flask,
  football,
  gameController,
  helpCircle,
  helpCircleOutline,
  key,
  logOutOutline,
  newspaper,
  pencil,
  people,
  person,
  personCircle,
  personOutline,
  phonePortrait,
  restaurant,
  shieldCheckmark,
  shieldCheckmarkOutline,
  shirt,
  trash,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, RouterModule, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      personOutline,
      shieldCheckmarkOutline,
      briefcaseOutline,
      helpCircleOutline,
      eyeOffOutline,
      logOutOutline,
      addOutline,
      addCircle,
      newspaper,
      cube,
      personCircle,
      person,
      people,
      shieldCheckmark,
      key,
      phonePortrait,
      bed,
      shirt,
      restaurant,
      gameController,
      book,
      football,
      pencil,
      flask,
      brush,
      trash,
      helpCircle,
      eye,
      eyeOff,
    });
  }
}
