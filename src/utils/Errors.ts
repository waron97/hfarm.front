type LoginRejectMessage =
  | 'wrong_credentials'
  | 'expired_token'
  | 'missing_auth'
  | 'server_failure';
type SignupRejectMessage = 'server_failure' | 'username_taken' | 'invalid_json';

/**
 * Errore lanciato se non c'è un token di autenticazione in localStorage
 */
export class NoTokenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Errore lanciato se il server rigetta la richiesta a causa di session-token
 * mancante in headers/authorization
 */
export class NoAuthTokenOnRequest extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Errore lanciato se il server rifiuta il token o le credenziali
 */
export class AuthServerRejection extends Error {
  constructor(message: LoginRejectMessage) {
    super(message);
  }
}

/**
 * Errore lanciato quando il server rifiuta i dati mandati.
 */
export class AuthSignupRejection extends Error {
  constructor(message: SignupRejectMessage) {
    super(message);
  }
}

/**
 * Errore lanciato quando il server restituisce un errore
 * inaspettato. Da usare come ultima spiaggia.
 */
export class GenericServerError extends Error {
  constructor(message: string) {
    super(message);
  }
}
