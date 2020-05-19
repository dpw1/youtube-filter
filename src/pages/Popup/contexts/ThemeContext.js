import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = (props) => {
  const dummyData = {
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
  const [formData, setFormData] = useState();
  const [options, setOptions] = useState();

  return (
    <div>
      <ThemeContext.Provider value={{ formData, setFormData }}>
        {props.children}
      </ThemeContext.Provider>
    </div>
  );
};

export default ThemeProvider;
