import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = (props) => {
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
