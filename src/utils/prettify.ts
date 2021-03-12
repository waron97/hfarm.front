import { ApplicationStatus } from './Types';

export const getColorOnStatus = (status: ApplicationStatus) => {
  switch (status) {
    case 'confermato':
      return 'green';
    case 'review':
      return 'orange';
    case 'ricevuto':
      return 'blue';
    case 'rifiutato':
      return 'red';
  }
};
