import { ApplicationStatus } from './Types';

/**
 *
 * ritorna il colore da attribuire allo stato di una candidatura
 */
export const getColorOnStatus = (status: ApplicationStatus) => {
  switch (status) {
    case 'confermato':
      return 'green';
    case 'review':
      return 'orange';
    case 'ricevuto' || 'received':
      return 'blue';
    case 'rifiutato':
      return 'red';
  }
};
