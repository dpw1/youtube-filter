import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import TimePicker from './components/TimePicker';

const Popup = () => {
  return (
    <section className="App">
      <h2>Show only videos between:</h2>
      <TimePicker></TimePicker>
    </section>
  );
};

export default Popup;
