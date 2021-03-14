export interface UsernameAndPassword {
  username: string;
  password: string;
}

export type VoidCallback = () => void;

export interface SpinnerProvider {
  startSpinner: VoidCallback;
  stopSpinner: VoidCallback;
}

export interface CallEssential {
  title: string;
  description: string;
}

export interface RegisterCredentials extends UsernameAndPassword {
  type: AccountType;
  clientId?: string;
}

export type ApplicationStatus =
  | 'ricevuto'
  | 'review'
  | 'confermato'
  | 'rifiutato';

export interface CallApplication {
  id: number;
  applicantId: number;
  applicantName: string;
  applicantSeniority: string;
  timeApplied: Date;
  applicationStatus: ApplicationStatus;
  target?: Call;
  applicantType?: string;
}

/**
 * L'utente autenticato disporrà di tutti i campi. Altri oggetti-utente
 * solo dei campi obbligatori
 */
export interface User {
  username: string;
  uid: number;
  token?: string;
  clientId?: string;
  favorites?: number[];
  accountType?: AccountType;
  applications?: number[];
}

export type FavoritesOperations = 'add' | 'remove';
export type FavoriteEditor = (
  operation: FavoritesOperations,
  callId: number
) => void;

export interface UserProvider {
  user: User;
  editFavorites: FavoriteEditor;
  editApplications: (callId: number) => void;
}

export type AccountType = 'internal' | 'external';

export interface Call {
  id: number;
  title: string;
  description: string;
  poster: number;
  clientId?: string;
  type: AccountType;
  timePosted: Date;
  applications?: CallApplication[];
}

export type QueryType = 'title' | 'internal' | 'external';
