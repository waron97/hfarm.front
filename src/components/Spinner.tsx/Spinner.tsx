import React from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './spinner.scss';
/**
 * Componente usato in tutta l'applicazione per mostrare che
 * il contenuto richiesto è in fase di caricamento
 */
function Spinner(props: any) {
  return (
    <div className="loader">
      <Loader type="Circles" color="blue" />
    </div>
  );
}

export default Spinner;
