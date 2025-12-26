import { Timestamp } from 'firebase/firestore';
import { formatDate as angularFormatDate } from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

export const formatDate = (timestamp: Timestamp | Date) => {
  if (timestamp instanceof Timestamp) {
    timestamp = timestamp.toDate();
  }
  return angularFormatDate(timestamp, 'dd/MM/yyyy HH:mm', 'fr-FR');
};
