import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.scss';

import ThemeProvider from './contexts/ThemeContext';
render(
  <ThemeProvider>
    <Popup />
  </ThemeProvider>,
  window.document.querySelector('#app-container')
);
