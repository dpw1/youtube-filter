import React, { useContext, useEffect } from 'react';

import TimePickerForm from './components/TimePickerForm';
import { ToastContainer, toast } from 'react-toastify';
import { ThemeContext } from './contexts/ThemeContext';

import './Bulma.css';
import 'react-toastify/dist/ReactToastify.css';
import Settings from './components/Settings';

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
      if (result.data) {
        context.setFormData(result.data);
      } else if (!result.data) {
        context.setFormData(defaultData);
      }
    });

    chrome.storage.sync.get(['options'], function (result) {
      if (result.options) {
        context.setOptions(result.data);
      } else {
        console.log('no options, trying to save');
        const { options } = context;
        chrome.storage.sync.set({ options }, async function () {
          console.log('no options, setting default options');
        });
      }

      console.log(result);
    });
  }, []);

  console.log(context);
  return (
    <section className="App">
      {context.formData ? (
        <div>
          <Settings></Settings>
          <TimePickerForm></TimePickerForm>
        </div>
      ) : (
        <p>'Loading...'</p>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </section>
  );
};

export default Popup;
