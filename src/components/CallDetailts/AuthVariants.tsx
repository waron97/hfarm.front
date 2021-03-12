import React, { useContext, useState } from 'react';
import isDev from '../../utils/IsDev';
import { applyToCall, updateApplicationStatus } from '../../utils/JobCallApi';
import { getColorOnStatus } from '../../utils/prettify';
import { ApplicationStatus, Call, User } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';
import Spinner from '../Spinner.tsx/Spinner';

interface Props {
  user: User;
  call: Call;
  refresh: () => void;
}

/**
 *
 * UI da ritornare se l'utente è il poster della Call.
 */
export function UserIsOwner(props: Props) {
  const applicants = props.call.applications;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
        <h1>{props.call.title}</h1>
        <small>{props.call.timePosted.toLocaleDateString()}</small>
        <p>{props.call.description}</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Nome</th>
              <th>Seniority</th>
              <th>Data</th>
              <th>Status</th>
              <th>CV</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((application) => (
              <tr key={application.id}>
                <td>{application.applicantName}</td>
                <td>{application.applicantSeniority}</td>
                <td>{application.timeApplied.toLocaleDateString()}</td>
                <td
                  style={{
                    color: getColorOnStatus(application.applicationStatus),
                    fontWeight: 'bold',
                  }}
                >
                  {application.applicationStatus}
                </td>
                <td>
                  <a href="#">Scarica CV</a>
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
      <h1>{props.call.title}</h1>
      <small>{props.call.timePosted.toLocaleDateString()}</small>
      <p>{props.call.description}</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {form}
    </div>
  );
}
