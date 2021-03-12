import React, { useContext, useEffect, useState } from 'react';
import { getUserApplications } from '../../utils/JobCallApi';
import { CallApplication } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';
import Spinner from '../Spinner.tsx/Spinner';
import './myapplications.scss';

/**
 * Mostra tutte le candidature dell'utente autenticato.
 */
function MyApplications() {
  const [applications, setApplications] = useState<CallApplication[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const ctx = useContext(UserContext);
  useEffect(() => {
    setLoading(true);
    if (ctx) {
      getUserApplications(ctx.user)
        .then((data) => {
          setApplications(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Non è stato possibile ottenere i tuoi post');
          setLoading(false);
        });
    }
  }, []);
  const applicationNodes = applications.map((application) => (
    <tr key={application.id}>
      <td>{application.target?.title}</td>
      <td>{application.timeApplied.toLocaleDateString()}</td>
      <td>{application.target?.type}</td>
      <td>{application.applicationStatus}</td>
      <td className="no-linebreak">
        <a href={`/call/${application.target?.id}`}>Vai a call</a>
      </td>
    </tr>
  ));

  if (loading) return <Spinner />;
  return (
    <div className="user-applications text-left p-4">
      <h1 className="text-center mb-3">Candidature</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped table-responsive-sm">
        <thead className="thead-dark">
          <tr>
            <th>Titolo</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Stato</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{applications && applicationNodes}</tbody>
      </table>
    </div>
  );
}

export default MyApplications;
