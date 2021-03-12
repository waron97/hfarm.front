import React from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './spinner.scss';

function Spinner(props: any) {
  return (
    <div className="loader">
      <Loader type="Circles" color="blue" />
    </div>
  );
}

export default Spinner;
