import React, { useState } from 'react';
import {
  AccountType,
  RegisterCredentials,
  UsernameAndPassword,
} from '../../utils/Types';
import './auth.scss';

interface Props {
  setUsernameAndPassword: (credentials: UsernameAndPassword) => void;
  registerWithUsernameAndPassword: (credentials: RegisterCredentials) => void;
  errorMessage: string;
  nullError: () => void;
}

function toAccountType(str: string): AccountType {
  if (str === 'internal') return 'internal';
  if (str === 'external') return 'external';
  else return 'internal';
}

/**
 * UI per permettere all'utente di inserire username e password.
 * @param {Props} props Metodo per impostare in Auth username e password.
 * @return {JSX.Element}
 */
function AuthUI(props: Props) {
  const [section, setSection] = useState('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<AccountType>('internal');
  const [clientId, setClientId] = useState<string | undefined>();
  const handleLoginSubmit = (e: any) => {
    e.preventDefault();
    props.setUsernameAndPassword({ username, password });
  };

  /**
   * Inizia procedura di registrazione. Tutta la logica è in <Auth>
   */
  const handleSignupSubmit = (e: any) => {
    e.preventDefault();
    props.registerWithUsernameAndPassword({
      username,
      password,
      type,
      clientId,
    });
  };
  let body;
  if (section === 'signin') {
    // modifica l'ui da mostrare a seconda se la sezione è 'signin' o 'signup'
    body = (
      <div className="main">
        <h1 className="text-center">Accedi</h1>
        {props.errorMessage && (
          <div className="alert alert-danger">{props.errorMessage}</div>
        )}
        <form
          onSubmit={
            section === 'signin' ? handleLoginSubmit : handleSignupSubmit
          }
          className="form-group"
        >
          <label htmlFor="username">
            <span>Username:</span>
            <input
              className="form-control"
              required
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            <span>Password:</span>
            <input
              className="form-control"
              required
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="submit text-center">
            <p>
              Non hai ancora un account?{' '}
              <span className="auth-link" onClick={() => setSection('signup')}>
                Clicca qui
              </span>
              .
            </p>
            <input
              required
              className="btn btn-primary mt-3"
              type="submit"
              value="Log In"
            />
          </div>
        </form>
      </div>
    );
  } else {
    body = (
      <div className="main">
        <h1 className="text-center">Crea account</h1>
        {props.errorMessage && (
          <div className="alert alert-danger form-group">
            {props.errorMessage}
          </div>
        )}
        <form
          onSubmit={
            section === 'signin' ? handleLoginSubmit : handleSignupSubmit
          }
        >
          <label htmlFor="username">
            <span>Username:</span>
            <input
              minLength={1}
              required
              className="form-control"
              type="text"
              id="username"
              placeholder="INSICURO"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            <span>Password:</span>
            <input
              minLength={1}
              required
              type="password"
              id="password"
              className="form-control"
              placeholder="INSICURO"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label htmlFor="accountType">
            <span>Tipo di account:</span>
            <select
              className="form-control"
              id="accountType"
              value={type}
              onChange={(e) => {
                setType(toAccountType(e.target.value));
              }}
            >
              <option value="internal">internal</option>
              <option value="external">external</option>
            </select>
          </label>
          {type === 'external' && (
            <label htmlFor="clientId">
              <span>Id Cliente:</span>
              <input
                placeholder="(nome azienda)"
                className="form-control"
                required
                value={clientId}
                type="text"
                id="clientId"
                onChange={(e) => setClientId(e.target.value)}
              />
            </label>
          )}
          <div className="submit text-center">
            <p>
              Hai già un account?{' '}
              <span onClick={() => setSection('signin')} className="auth-link">
                Clicca qui
              </span>
              .
            </p>
            <input
              required
              className="btn btn-primary mt-3"
              type="submit"
              value="Sign Up"
            />
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-nav">
          <div
            className={`text-center auth-nav-item ${
              section === 'signin' && 'active'
            }`}
            onClick={() => {
              props.nullError();
              setSection('signin');
            }}
          >
            Sign In
          </div>
          <div
            className={`text-center auth-nav-item ${
              section === 'signup' && 'active'
            }`}
            onClick={() => {
              props.nullError();
              setSection('signup');
            }}
          >
            Sign Up
          </div>
        </div>
        {body}
      </div>
    </div>
  );
}

export default AuthUI;
