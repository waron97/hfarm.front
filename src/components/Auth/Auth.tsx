import React from 'react';
import {
  UsernameAndPassword,
  User,
  UserProvider,
  FavoritesOperations,
  RegisterCredentials,
} from '../../utils/Types';
import {
  authenticateWithToken,
  authenticateWithUsernameAndPassword,
  registerWithUsernameAndPassword,
} from '../../utils/Authenticators';
import AuthUI from './AuthUI';
import {
  AuthServerRejection,
  AuthSignupRejection,
  NoAuthTokenOnRequest,
  NoTokenError,
} from '../../utils/Errors';
import Spinner from '../Spinner.tsx/Spinner';

export const UserContext = React.createContext<UserProvider | null>(null);

export interface AuthProps {}

export interface AuthState {
  isAuthenticated: boolean;
  usernameAndPassword?: UsernameAndPassword;
  user: User | null;
  errorMessage: string;
  loading: boolean;
}

/**
 * Fornisce il wrapper d'autenticazione per l'applicazione.
 * Se l'utente è autenticato, ritorna i figli, altrimenti l'interfaccia auth.
 * Ai figli viene dato un oggetto utente tramite React.Context.
 */
class Auth extends React.Component<AuthProps, AuthState> {
  constructor(props: AuthProps) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
      errorMessage: '',
      loading: false,
    };
  }

  nullError = () => {
    this.setState({ errorMessage: '' });
  };

  componentDidMount() {
    // Prova ad autenticare appena il componente si carica, nel caso ci sia
    // già un token in localStorage
    this.authenticate();
  }

  /**
   * Il componente richiede l'autenticazione quando riceve username e password
   */
  componentDidUpdate(
    prevProps: Readonly<AuthProps>,
    prevState: Readonly<AuthState>
  ) {
    if (
      prevState.usernameAndPassword?.username !==
        this.state.usernameAndPassword?.username ||
      this.state.usernameAndPassword?.password !==
        prevState.usernameAndPassword?.password
    ) {
      this.authenticate();
    }
  }

  /**
   * Metodo per ricevere user e password da AuthUI
   * @param {UsernameAndPassword} credentials oggetto con username e password
   */
  setUsernameAndPassword = (credentials: UsernameAndPassword) => {
    this.setState({ usernameAndPassword: credentials });
  };

  /**
   * Punto finale della procedura di autenticazione.
   * Prende l'utente autenticato dal server e lo mette in Context.
   * @param user L'utente autenticato mandato dal server.
   */
  handleAuthSuccess = (user: User) => {
    this.setState({ loading: false });
    console.log('auth success');
    console.log(user);
    this.setState({ isAuthenticated: true, user: user });
  };

  /**
   * Punto intermedio di autenticazione.
   * Il server ha accettato username e password, e ha mandato il token.
   * Questa funzioe mette il token in localStorage e reinizia
   * la procedura di autenticazione.
   * @param token Token di sessione ricevuto dal server.
   */
  handleTokenReceived = (token: string) => {
    localStorage.setItem('authToken', token);
    this.authenticate();
  };

  /**
   *
   * Gestione degli errori di autenticazione.
   *
   */
  handleAuthFailure = (e: any) => {
    this.setState({ loading: false });
    if (e instanceof NoTokenError && this.state.usernameAndPassword) {
      authenticateWithUsernameAndPassword(this.state.usernameAndPassword)
        .then(this.handleTokenReceived)
        .catch(this.handleAuthFailure);
    } else if (e instanceof NoTokenError && !this.state.usernameAndPassword) {
      console.log(
        'No token was found and user has not provided credentials yet.'
      );
      return;
    } else if (
      e instanceof AuthServerRejection &&
      e.message === 'token_expired'
    ) {
      return;
    } else if (
      e instanceof AuthServerRejection &&
      e.message === 'server_failure'
    ) {
      this.setState({
        errorMessage: 'Errore nel server. Riprovare più tardi.',
      });
      return;
    } else if (
      e instanceof AuthServerRejection &&
      e.message === 'wrong_credentials'
    ) {
      this.setState({
        usernameAndPassword: undefined,
        errorMessage: 'Credenziali rifiutate',
      });
      return;
    } else if (e instanceof NoAuthTokenOnRequest) {
      this.setState({ usernameAndPassword: undefined, errorMessage: '' });
    } else {
      throw e;
    }
  };

  /**
   * Punto di arrivo della procedura di registrazione.
   * Accetta l'utente autenticato ritornato dal server e
   * lo mette in Context.
   * @param user L'oggetto-utente ritornato dal server
   */
  handleSignupSuccess = (user: User) => {
    this.setState({ loading: false });
    user.token && localStorage.setItem('authToken', user.token);
    this.setState({ user: user, isAuthenticated: true });
  };

  /**
   *
   * Gestione degli errori di registrazione.
   */
  handleSignupFailure = (e: any) => {
    this.setState({ loading: false });
    if (e instanceof AuthSignupRejection && e.message === 'username_taken') {
      this.setState({ errorMessage: 'Questo username esiste già.' });
      return;
    } else if (
      e instanceof AuthSignupRejection &&
      e.message === 'invalid_json'
    ) {
      this.setState({
        errorMessage: 'Errore. Controlla di aver inserito tutto correttamente',
      });
      return;
    } else if (
      e instanceof AuthSignupRejection &&
      e.message === 'server_failure'
    ) {
      this.setState({ errorMessage: 'Errore nel server. Riprova più tardi.' });
      return;
    } else {
      throw e;
    }
  };

  /**
   * Punto d'entrata per il flow di autenticazione.
   */
  authenticate = () => {
    this.setState({ loading: true });
    authenticateWithToken()
      .then(this.handleAuthSuccess)
      .catch(this.handleAuthFailure);
  };

  /**
   * Metodo chiamato per creare un nuovo account utente con username e password
   */
  register = (credentials: RegisterCredentials) => {
    const confirm = window.confirm(
      `
      Non usare username o password che utilizzi altrove! 
      Non sono tenuti in maniera sicura nel database!
      `
    );
    if (!confirm) return;
    this.setState({ loading: true });
    registerWithUsernameAndPassword(credentials)
      .then(this.handleSignupSuccess)
      .catch(this.handleSignupFailure);
  };

  /**
   * Rimuove o aggiunge una Call dai preferiti dell'utente sul server
   * e sul Client.
   * @param operation L'operazione da eseguire
   * @param callId L'id del preferito da aggiungere/togliere
   */
  alterUserFavorites = (
    operation: FavoritesOperations,
    callId: number
  ): void => {
    const user = this.state.user;
    if (user) {
      // Aggiornamento locale
      operation === 'add'
        ? user?.favorites?.push(callId)
        : (user.favorites = user?.favorites?.filter((id) => id != callId));
      this.setState({ user: user });

      // Aggiornamento remoto
      const token = this.state.user?.token ? this.state.user.token : '';
      const fetchParams: RequestInit = {
        method: 'POST',
        body: JSON.stringify({ id: callId, operation: operation }),
        headers: [['authorization', token]],
      };
      fetch('/api/updateUserFavorites', fetchParams).then(async (response) => {
        if (!response.ok) {
          alert(
            'could not update server favorites: ' + (await response.text())
          );
        }
      });
    }
  };

  /**
   * Aggiunge all'oggetto-utente locale la candidatura ad un post.
   * L'aggiornamento sul server è eseguito direttamente
   * in CallDetails/UserIsNotOwner.
   * @param callId Id della Call target di candidatura
   */
  addUserApplicationLocally = (callId: number) => {
    const user = this.state.user;
    user?.applications?.push(callId);
    this.setState({ user: user });
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    if (!this.state.isAuthenticated || !this.state.user) {
      return (
        <AuthUI
          nullError={this.nullError}
          errorMessage={this.state.errorMessage}
          registerWithUsernameAndPassword={this.register}
          setUsernameAndPassword={this.setUsernameAndPassword}
        />
      );
    } else {
      return (
        <UserContext.Provider
          value={{
            user: this.state.user,
            editFavorites: this.alterUserFavorites,
            editApplications: this.addUserApplicationLocally,
          }}
        >
          {this.props.children}
        </UserContext.Provider>
      );
    }
  }
}

export default Auth;
