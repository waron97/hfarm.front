import React, { useContext, useEffect, useState } from 'react';
import isDev from '../../utils/IsDev';
import { createCall, getCalls } from '../../utils/JobCallApi';
import { Call, CallEssential, QueryType } from '../../utils/Types';
import { UserContext } from '../Auth/Auth';
import Spinner from '../Spinner.tsx/Spinner';
import AddCall from './AddCall';
import CallCard from './CallCard';
import './dashboard.scss';
import FilterBar from './FilterBar';

/**
 * Funzione per ordinare le call prima in base allo stato di preferiti
 * poi in base alla data di pubblicazione.
 * @param a Prima Call
 * @param b Seconda Call
 * @param favorites La lista di preferiti dell'utente
 */
function sortByIsFavorite(
  a: Call,
  b: Call,
  favorites: number[] | undefined
): number {
  if (!favorites) {
    return 0;
  } else {
    if (
      (favorites.includes(a.id) && favorites.includes(b.id)) ||
      (!favorites.includes(a.id) && !favorites.includes(b.id))
    ) {
      if (a.timePosted < b.timePosted) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (favorites.includes(a.id)) {
        return -1;
      } else {
        return 1;
      }
    }
  }
}

/**
 * Dashbaord principale che mostra tutte le call aperte.
 */
function Dashboard() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [queryType, setQueryType] = useState<QueryType>('title');
  const [query, setQuery] = useState<string>('');
  const [clientIdQuery, setClientIdQuery] = useState<string>('');
  const [loading, setIsLoading] = useState(false);
  const ctx = useContext(UserContext);
  const user = ctx?.user;

  const refreshCalls = () => {
    getCalls()
      .then((data) => {
        setCalls(data);
        setFilteredCalls(data);
      })
      .catch(() => {
        setError('Errore nel download delle call');
      });
  };

  const addCall = async (call: CallEssential) => {
    if (isDev) {
      return;
    }
    if (user) {
      const success = await createCall(user, call).catch(() => {
        return false;
      });
      if (success) {
        refreshCalls();
      } else {
        setError('Non siamo riusciti a creare la tua call');
      }
    }
  };

  useEffect(() => {
    // Filtra le Calls sulla base dei filtri provenienti da <FilterBar>
    if (queryType === 'title') {
      setFilteredCalls(
        calls.filter((call) => {
          return call.title.toLowerCase().includes(query.toLowerCase());
        })
      );
    } else if (queryType === 'external') {
      setFilteredCalls(
        calls.filter(
          (call) =>
            call.type === 'external' &&
            call.clientId
              ?.toLowerCase()
              .includes(clientIdQuery.toLowerCase()) &&
            call.title.includes(query)
        )
      );
    } else if (queryType === 'internal') {
      setFilteredCalls(
        calls.filter(
          (call) => call.type === 'internal' && call.title.includes(query)
        )
      );
    } else {
      setFilteredCalls(calls);
    }
  }, [query, queryType, clientIdQuery, calls]);

  useEffect(() => {
    // Richiedi le call dal server
    setIsLoading(true);
    getCalls()
      .then((data) => {
        data = data.sort((a, b) => sortByIsFavorite(a, b, user?.favorites));
        setCalls(data);
        setFilteredCalls(data);
        setIsLoading(false);
      })
      .catch((e) => {
        setError('Error');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Riordina le Call se vengono modificati i preferiti
    const sortedFavorites = calls.sort((a, b) =>
      sortByIsFavorite(a, b, user?.favorites)
    );
    setCalls([...sortedFavorites]);
  }, [ctx]);

  if (loading) return <Spinner />;

  return (
    <div className="dashboard">
      {error && <div className="alert alert-danger">{error}</div>}
      <FilterBar
        setQuery={setQuery}
        setQueryType={setQueryType}
        setClientIdQuery={setClientIdQuery}
      />
      <div className="calls">
        {error && <div className="alert alert-danger">{error}</div>}
        {query ? <></> : <AddCall addCall={addCall} />}
        {filteredCalls.map((call) => (
          <CallCard key={call.id} {...call} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
