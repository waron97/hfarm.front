import React, { useEffect, useState } from 'react';
import { SearchIcon } from '../../utils/icons';
import { QueryType } from '../../utils/Types';

interface Props {
  setQueryType: (queryType: QueryType) => void;
  setQuery: (query: string) => void;
  setClientIdQuery: (query: string) => void;
}
/**
 * Converte una stringa libera in una QueryType
 * per motivi di Type Safety
 */
function toQueryType(str: string): QueryType {
  if (str === 'internal') return 'internal';
  if (str === 'external') return 'external';
  if (str === 'title') return 'title';
  else return 'title';
}

/**
 *
 * Barra di ricerca per filtrare le call in Dasboard
 */
function FilterBar(props: Props) {
  const [queryType, setQueryType] = useState<QueryType>('title');
  const [query, setQuery] = useState('');
  const [clientQuery, setClientQuery] = useState('');

  useEffect(() => {
    // Imposta il queryType di <Dashboard> al valore inizializzato e aggiornato.
    // Evita che i due valori siano fuori sincronia sin dall'inizializzazione
    props.setQueryType(queryType);
    props.setQuery(query);
    props.setClientIdQuery(clientQuery);
  }, [queryType, query, clientQuery]);

  let body;
  switch (queryType) {
    case 'external':
      body = (
        <div className="filter-body">
          <section>
            <input
              type="text"
              placeholder="Cerca titolo"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <SearchIcon />
          </section>
          <section>
            <input
              type="text"
              placeholder="Cerca codice cliente"
              value={clientQuery}
              onChange={(e) => {
                setClientQuery(e.target.value);
              }}
            />
            <SearchIcon />
          </section>
        </div>
      );
      break;
    case 'internal':
      body = (
        <div className="filter-body">
          <section>
            {' '}
            <input
              type="text"
              placeholder="Cerca titolo"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <SearchIcon />
          </section>
        </div>
      );
      break;
    case 'title':
      body = (
        <div className="filter-body">
          <section>
            {' '}
            <input
              type="text"
              placeholder="Cerca titolo"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <SearchIcon />
          </section>
        </div>
      );
      break;
  }
  return (
    <div className="filter-bar text-left">
      {body}
      <select
        value={queryType}
        onChange={(e) => {
          setQueryType(toQueryType(e.target.value));
        }}
      >
        <option value="internal">Call interne</option>
        <option value="external">Call esterne</option>
        <option value="title">Cerca per titolo</option>
      </select>
    </div>
  );
}

export default FilterBar;
