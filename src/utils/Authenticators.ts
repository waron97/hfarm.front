import {
  AuthServerRejection,
  AuthSignupRejection,
  GenericServerError,
  NoAuthTokenOnRequest,
  NoTokenError,
} from './Errors';
import isDev from './IsDev';
import mockData from './MockData';
import { RegisterCredentials, User, UsernameAndPassword } from './Types';

/**
 * Prende il token da localStorage e autentica l'utente. Se questo fallisce,
 * ritorna o NoTokenError o AuthServerRejection
 * @returns {Promise<User>} The promisified authenticated user object
 */
export const authenticateWithToken = (): Promise<User> => {
  return new Promise(async (resolve, reject) => {
    if (isDev) {
      const doResolve = true;
      doResolve
        ? resolve(mockData.currentUser)
        : reject(new NoTokenError('no_token'));
      return;
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      reject(new NoTokenError('no_token'));
      return;
    } else {
      const fetchParams: RequestInit = {
        method: 'POST',
        headers: [['authorization', token]],
      };
      const response = await fetch('/api/authenticateWithToken', fetchParams);
      if (!response.ok) {
        handleServerRejections(await response.text(), reject);
      } else {
        resolve(await response.json());
      }
    }
  });
};

/**
 * Manda una richiesta al server per autenticare l'utente
 * @param credentials username e password
 * @returns il token di sessione
 */
export const authenticateWithUsernameAndPassword = (
  credentials: UsernameAndPassword
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (isDev) {
      reject(new AuthServerRejection('wrong_credentials'));
      return;
    }
    const fetchParams: RequestInit = {
      method: 'POST',
      body: JSON.stringify(credentials),
    };
    const response = await fetch(
      '/api/authenticateWithUsernameAndPassword',
      fetchParams
    );
    if (!response.ok) {
      handleServerRejections(await response.text(), reject);
    } else {
      resolve(await response.text());
    }
  });
};

/**
 * @param credentials Username, password, accountType, clientId?
 * @returns {User} the authenticated user
 */
export const registerWithUsernameAndPassword = (
  credentials: RegisterCredentials
): Promise<User> => {
  return new Promise((resolve, reject) => {
    if (isDev) {
      reject(new AuthSignupRejection('username_taken'));
      return;
    }
    const fetchParams: RequestInit = {
      method: 'POST',
      body: JSON.stringify(credentials),
    };
    fetch('/api/registerUser', fetchParams).then(async (response) => {
      if (!response.ok) {
        const err = await response.text();
        handleServerRejections(err, reject);
      } else {
        resolve(await response.json());
      }
    });
  });
};

/**
 *
 * @param err Il messaggio di errore ritornato dal server
 * @param reject Il metodo della Promise ritornata dal parente
 *                per rifiutare con l'errore giusto
 */
export const handleServerRejections = (err: string, reject: Function) => {
  console.log(err);
  switch (err) {
    case 'invalid_json':
      reject(new AuthSignupRejection(err));
      break;
    case 'existing_username':
      reject(new AuthSignupRejection('username_taken'));
      break;
    case 'server_failure':
      reject(new GenericServerError(err));
      break;
    case 'no_token':
      reject(new NoAuthTokenOnRequest(err));
      break;
    case 'wrong_credentials':
      reject(new AuthServerRejection(err));
      break;
    case 'token_expired':
      reject(new NoAuthTokenOnRequest(err));
      break;
    case 'must_be_post':
      throw new GenericServerError(
        `This should never emerge in prod. 
        There is a GET request that should be POST.`
      );
  }
};
