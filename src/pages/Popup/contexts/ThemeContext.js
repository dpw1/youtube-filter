import React, { createContext } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = (props) => {
  return (
    <div>
      <ThemeContext.Provider value={{ formData: [] }}>
        {props.children}
      </ThemeContext.Provider>
    </div>
  );
};

export default ThemeProvider;
