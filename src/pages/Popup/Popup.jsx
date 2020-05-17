import React, { useContext } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import TimePickerForm from './components/TimePickerForm';

import { ThemeContext } from './contexts/ThemeContext';

const Popup = () => {
  const context = useContext(ThemeContext);

  console.log(context);
  return (
    <section className="App">
      <h2>Show only videos between:</h2>
      <TimePickerForm></TimePickerForm>
    </section>
  );
};

export default Popup;
