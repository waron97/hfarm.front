import React, { useContext, useState } from 'react';
import { AddIcon } from '../../utils/icons';
import { CallEssential } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';

interface Props {
  addCall: (call: CallEssential) => void;
}

function AddCall(props: Props) {
  const [clicked, setClicked] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newCall: CallEssential = { title, description };
    props.addCall(newCall);
    setTitle('');
    setDescription('');
    setClicked(false);
  };
  const ctx = useContext(UserContext);
  let addPopup;
  if (ctx) {
    const { user } = ctx;
    addPopup = (
      <div className="add-call-form">
        <h1>Aggiungi call</h1>
        <form onSubmit={handleSubmit} className="add-call">
          <table cellPadding={1}>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="title">Titolo:</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={({ target: { value } }) => setTitle(value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="description">Descrizione: </label>
                </td>
                <td>
                  <textarea
                    cols={25}
                    id="description"
                    value={description}
                    onChange={({ target: { value } }) => setDescription(value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="type">Tipo: </label>
                </td>
                <td>
                  <input type="text" readOnly value={user.accountType} />
                </td>
              </tr>
              {user.accountType === 'external' && (
                <tr>
                  <td>
                    <label htmlFor="clientid">Codice cliente: </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="clientid"
                      readOnly
                      value={user.clientId}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <small className="text-center mt-3">
            Non è un bug che &apos;tipo&apos; e &apos;codice cliente&apos; non
            siano editabili. Il server prende queste due informazioni
            direttamente dall&apos;oggetto utente autenticato.
          </small>
          <div className="buttons">
            <input type="submit" value="Submit" className="btn btn-primary" />
            <button
              className="btn btn-secondary"
              onClick={() => {
                setTitle('');
                setDescription('');
                setClicked(false);
              }}
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="call-card text-left">
      <div className="call-taskbar" style={{ backgroundColor: 'grey' }}></div>
      <div className="call-add-box" onClick={() => setClicked(true)}>
        <AddIcon />
      </div>
      {clicked && addPopup}
    </div>
  );
}

export default AddCall;
