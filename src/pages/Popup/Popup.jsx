import React, { useContext, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Bulma.css';
import TimePickerForm from './components/TimePickerForm';

import { ThemeContext } from './contexts/ThemeContext';

const Popup = () => {
  const context = useContext(ThemeContext);
  const defaultData = {
    from: {
      hours: {
        value: 0,
        label: '0 hours',
      },
      minutes: {
        value: 0,
        label: '0 minutes',
      },
      seconds: {
        value: 0,
        label: '0 seconds',
      },
      formatted: '00:00:00',
    },
    to: {
      hours: {
        value: 0,
        label: '0 hours',
      },
      minutes: {
        value: 0,
        label: '0 minutes',
      },
      seconds: {
        value: 0,
        label: '0 seconds',
      },
      formatted: '00:00:00',
    },
  };
  useEffect(() => {
    chrome.storage.sync.get(['data'], function (result) {
      console.log(result);

      if (result.data) {
        context.setFormData(result.data);
      } else if (!result.data) {
        console.log('empty!');
        context.setFormData(defaultData);
      }
    });
  }, []);

  console.log(context);
  return (
    <section className="App">
      <h2 className="title is-5 has-text-white	">Show only videos between:</h2>
      {context.formData ? (
        <TimePickerForm></TimePickerForm>
      ) : (
        <p>'Loading...'</p>
      )}
    </section>
  );
};

export default Popup;
