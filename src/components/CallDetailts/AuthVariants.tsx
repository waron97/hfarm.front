import React, { useContext, useEffect, useState } from 'react';
import isDev from '../../utils/IsDev';
import {
  applyToCall,
  editCall,
  updateApplicationStatus,
} from '../../utils/JobCallApi';
import { ApplicationStatus, Call, User } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';
import Spinner from '../Spinner.tsx/Spinner';
import * as faker from 'faker';

interface Props {
  user: User;
  call: Call;
  refresh: () => void;
}

interface InfoProps extends Props {
  owner: boolean;
}

function CallInformation(props: InfoProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.call.title);
  const [description, setDescritpion] = useState(props.call.description);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = useContext(UserContext);
  const clientId =
    props.call.clientId && props.call.clientId !== 'NOID'
      ? props.call.clientId
      : '';

  const handleChangeSubmit = async () => {
    if (user) {
      const success = await editCall(props.call, user.user, title, description);
      if (!success) {
        setError('Non è stato possibile aggiornare la call');
      } else {
        setSuccess('Call aggiornata con successo');
      }
    }
  };

  return (
    <>
      <div className="jumbotron">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <h1 className="display-5">
          {editing ? (
            <div>
              <input
                className="form-control"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          ) : (
            title
          )}
          {props.owner && !editing && (
            <button
              className="btn btn-secondary d-block mt-2 mb-2"
              onClick={() => {
                setEditing(true);
              }}
            >
              Edit
            </button>
          )}
        </h1>
        <p className="">
          {props.call.timePosted.toLocaleDateString()}
          {' - ' + clientId}
        </p>
        <hr className="my-4" />
        {editing ? (
          <div>
            <textarea
              rows={10}
              className="form-control"
              value={description}
              onChange={(e) => {
                setDescritpion(e.target.value);
              }}
            ></textarea>
          </div>
        ) : (
          description.split('\n').map((par) => (
            <p key={par} className="lead">
              {par}
            </p>
          ))
        )}
        {props.owner && editing && (
          <div className="buttons pt-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                handleChangeSubmit();
                setEditing(false);
              }}
            >
              Conferma
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => {
                setEditing(false);
                setTitle(props.call.title);
                setDescritpion(props.call.description);
              }}
            >
              Annulla
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/**
 *
 * UI da ritornare se l'utente è il poster della Call.
 */
export function UserIsOwner(props: Props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState(props.call.applications);
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('Nome');

  useEffect(() => {
    if (queryType === 'Nome') {
      const filteredApplicants = props.call.applications?.filter(
        (application) => application.applicantName.includes(query)
      );
      setApplicants(filteredApplicants);
    } else if (queryType == 'Seniority') {
      const filteredApplicants = props.call.applications?.filter(
        (application) => application.applicantSeniority === query
      );
      setApplicants(filteredApplicants);
    }
  }, [query, queryType]);
  const setApplicationStatus = (
    newStatus: ApplicationStatus,
    applicationId: number
  ) => {
    if (isDev) return;
    setLoading(true);
    updateApplicationStatus(newStatus, applicationId, props.user).then(
      (success) => {
        if (success) {
          props.refresh();
        } else {
          setError('Non è stato possibile aggiornare lo stato');
        }
        setLoading(false);
      }
    );
  };

  if (loading) {
    return <Spinner />;
  }
  if (applicants) {
    return (
      <div className="call-view user-owner text-left p-3">
        <CallInformation {...props} owner={true} />
        {error && <div className="alert alert-danger">{error}</div>}
        <h2 className="p-2">Candidati</h2>
        <p className="text-muted p-2">
          C&apos;è una funzionalità nel Brief che qui non è implemenata, ovvero
          l&apos;aggiunta diretta di un candidato. Per ovviare al problema, si
          dovrebbe aggiornare l&apos;endpoint sul server per accettare anche uno
          username per creare una candidatura. Tuttavia, la nuova categoria di
          errori che emerge quando non è l&apos;utente autenticato (che quindi
          dispone di un ID certamente esistente nel DB) a creare una candidatura
          (per esempio viene fornito un username non esistente) richiederebbe
          una implementazione attenta della nuova feature. Purtroppo non ho
          pianificato con sufficiente accortezza all&apos;inzio, quindi tornare
          a lavorare su questo richiederebbe troppo tempo.
        </p>
        {queryType === 'Nome' && (
          <div className="form-group p-2">
            <label htmlFor="">
              <input
                placeholder="Inserisci il nome"
                type="text"
                className="form-control"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
            </label>
          </div>
        )}
        <div className="form-group p-2">
          <label htmlFor="">
            <select
              className="form-control"
              onChange={(e) => {
                const value = e.target.value;
                value === 'Senior' || value === 'Junior'
                  ? setQueryType('Seniority')
                  : setQueryType('Nome');
                if (value !== 'Nome') setQuery(value);
                else setQuery('');
              }}
            >
              <option value="Nome">Filtra per Nome</option>
              <option value="Senior">Solo senior</option>
              <option value="Junior">Solo junior</option>
            </select>
          </label>
        </div>
        <table className="table table-striped table-responsive-sm">
          <thead className="thead-dark">
            <tr>
              <th>Nome</th>
              <th>Seniority</th>
              <th>Data</th>
              <th>Residenza</th>
              <th>Status</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {applicants
              .filter(
                (application) => application.applicationStatus !== 'rifiutato'
              )
              .map((application) => (
                <tr
                  key={application.id}
                  style={{
                    backgroundColor:
                      application.applicantType === 'internal'
                        ? 'rgba(0, 135, 255, 0.7)'
                        : 'rgba(255, 197, 0, 1)',
                  }}
                >
                  <td>{application.applicantName}</td>
                  <td>
                    {faker.name.jobTitle()} ({application.applicantSeniority})
                  </td>
                  <td>{application.timeApplied.toLocaleDateString()}</td>
                  <td>{faker.address.city()}</td>
                  <td
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    {application.applicationStatus}
                  </td>
                  <td className="actions-tooltip">
                    <span
                      onClick={() =>
                        setApplicationStatus('ricevuto', application.id)
                      }
                    >
                      Ricevuto
                    </span>
                    <span
                      onClick={() =>
                        setApplicationStatus('review', application.id)
                      }
                    >
                      Review
                    </span>
                    <span
                      onClick={() =>
                        setApplicationStatus('confermato', application.id)
                      }
                    >
                      Confermato
                    </span>
                    <span
                      onClick={() =>
                        setApplicationStatus('rifiutato', application.id)
                      }
                    >
                      Rifiutato
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  } else return <h1>No applications</h1>;
}

/**
 *
 * UI da ritornare se l'utente non è il poster della Call.
 */
export function UserIsNotOwner(props: Props) {
  const hasApplied = props.user.applications?.includes(props.call.id);
  const [error, setError] = useState('');
  const [seniority, setSeniority] = useState('junior');
  const [loading, setLoading] = useState(false);
  const ctx = useContext(UserContext);

  const handlesubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const success = await applyToCall(props.user, props.call.id, seniority);
    if (success) {
      ctx?.editApplications(props.call.id);
      setLoading(false);
      props.refresh();
    } else {
      setError('Non siamo riusciti ad effettuare la tua application');
      setLoading(false);
    }
  };
  const form = hasApplied ? (
    <div className="alert alert-info">
      Hai già mandato la tua candidatura a questa call.
    </div>
  ) : (
    <form onSubmit={handlesubmit}>
      <section>
        <label htmlFor="seniority">
          Seniority:
          <select
            className="form-control"
            id="seniority"
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
          >
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>
        </label>
      </section>
      <input type="submit" value="Submit" className="btn btn-primary" />
    </form>
  );
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="call-view user-not-owner text-left p-3">
      <CallInformation {...props} owner={false} />
      {error && <div className="alert alert-danger">{error}</div>}
      {form}
    </div>
  );
}
