import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = (props) => {
  const [formData, setFormData] = useState();
  const [options, setOptions] = useState({
    filter: true,
    filterOnScroll: true,
    filterEverySeconds: 1,
    removeEmptyVerticalLists: true,
  });

  return (
    <div>
      <ThemeContext.Provider
        value={{ formData, setFormData, options, setOptions }}
      >
        {props.children}
      </ThemeContext.Provider>
    </div>
  );
};

export default ThemeProvider;
