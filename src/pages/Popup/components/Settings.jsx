import React, { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import './ReactToggle.scss';
import './Settings.scss';

export default function Settings() {
  const [options, setOptions] = useState(false);

  const handleChange = () => {
    chrome.storage.sync.set(
      { options: { filter: !options.filter } },
      function () {
        chrome.storage.sync.get(['options'], function (result) {
          const data = result.options;

          if (!data) {
            return setOptions({ filter: true });
          }

          setOptions(data);
        });
      }
    );
  };

  useEffect(() => {
    chrome.storage.sync.get(['options'], function (result) {
      const data = result.options;

      if (!data) {
        return setOptions({ filter: true });
      }

      setOptions(data);
    });
  }, []);

  return options ? (
    <div className="settings">
      {/* <h2 className="title is-5 has-text-white settings-title">Settings:</h2> */}
      <div className="settings-form">
        <Toggle
          id="filter"
          className="settings-toggle"
          checked={options.filter}
          onChange={handleChange}
        />
        <label htmlFor="filter" className="settings-label has-text-white">
          {options.filter ? 'Filter is active!' : 'Filter is off :('}
        </label>
      </div>
    </div>
  ) : (
    <p>loading</p>
  );
}
