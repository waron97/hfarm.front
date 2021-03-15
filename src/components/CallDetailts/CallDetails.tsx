import React, { useContext, useEffect, useState } from 'react';
import { getCall } from '../../utils/JobCallApi';
import { Call, User } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';
import Spinner from '../Spinner.tsx/Spinner';
import { UserIsNotOwner, UserIsOwner } from './AuthVariants';
import './calldetail.scss';

export interface CallDetailProps {
  match: { params: { id: string } };
}

/**
 *
 * Schermata che mostra i dettagli di una Call.
 * Ritorna una variante a seconda che l'utente
 * sia il poster della Call o no.
 */
function CallDetails(props: CallDetailProps) {
  const [error, setError] = useState('');
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(false);
  const ctx = useContext(UserContext);
  const [isOwner, setIsOwner] = useState(ctx?.user?.uid === call?.poster);

  const {
    match: {
      params: { id },
    },
  } = props;
  let user: User | undefined;
  if (ctx) {
    user = ctx.user;
  }

  useEffect(() => {
    setLoading(true);
    if (user) {
      getCall(user, id)
        .then((data) => {
          if (data) {
            console.log(data);
            setCall(data);
            setLoading(false);
          } else {
            setError('Non siamo riusciti a scaricare i dati');
            setLoading(false);
          }
        })
        .catch(() => setError('Non siamo riusciti a scaricare i dati'));
    }
  }, []);

  useEffect(() => {
    if (user?.uid === call?.poster) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [isOwner, setIsOwner, user, call]);

  const refreshCallData = () => {
    setLoading(true);
    if (user) {
      getCall(user, id)
        .then((data) => {
          if (data) {
            setCall(data);
            setLoading(false);
          } else {
            setError('Non siamo riusciti a scaricare i dati');
            setLoading(false);
          }
        })
        .catch(() => setError('Non siamo riusciti a scaricare i dati'));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  if (user && call) {
    if (isOwner) {
      return <UserIsOwner refresh={refreshCallData} user={user} call={call} />;
    } else {
      return (
        <UserIsNotOwner refresh={refreshCallData} user={user} call={call} />
      );
    }
  } else return <h1>{error}</h1>;
}

export default CallDetails;
