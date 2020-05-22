import React, { useState, useEffect, useContext } from 'react';
import { useForm, FormContext, useFormContext } from 'react-hook-form';
import TimePickerItem from './TimePickerItem';
import {
  generateTimeOptions,
  minTwoDigits,
  convertToSeconds,
  sleep,
} from '../utils/utils';
import { ThemeContext } from '../contexts/ThemeContext';
import ReactHtmlParser from 'react-html-parser';
import { Button } from 'react-bulma-components';
import { toast } from 'react-toastify';
import './TimePickerForm.scss';

function TimePicker() {
  const methods = useForm();
  const context = useContext(ThemeContext);
  const [options, setOptions] = useState(false);
  const [buttonText, setButtonText] = useState('Filter now!');
  const watchAllFields = methods.watch();

  // console.log('watchAllFields', watchAllFields);
  const onSubmit = (data) => {
    methods.clearError();

    const cleanData = {
      from: {
        hours: data.fromHours,
        minutes: data.fromMinutes,
        seconds: data.fromSeconds,
        formatted: `${minTwoDigits(data.fromHours.value)}:${minTwoDigits(
          data.fromMinutes.value
        )}:${minTwoDigits(data.fromMinutes.value)}`,
      },
      to: {
        hours: data.toHours,
        minutes: data.toMinutes,
        seconds: data.toSeconds,
        formatted: `${minTwoDigits(data.toHours.value)}:${minTwoDigits(
          data.toMinutes.value
        )}:${minTwoDigits(data.toSeconds.value)}`,
      },
    };

    const min = convertToSeconds(cleanData.from.formatted);
    const max = convertToSeconds(cleanData.to.formatted);

    const minGreaterThanMax = min >= max;

    if (minGreaterThanMax) {
      return methods.setError(
        'form',
        'minGreaterThanMax',
        `Error: "From" cannot be greater than "To".`
      );
    }

    chrome.storage.sync.set({ data: cleanData }, async function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        const tabId = tab[0].id;

        chrome.runtime.sendMessage({
          message: 'reload',
          data: {
            tabId,
          },
        });
      });

      window.close();
    });
  };

  /** Watch errors */
  useEffect(() => {
    if (methods.errors.form) {
      toast.error(`${methods.errors.form.message}`, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      methods.clearError();
    }
  }, [methods.errors]);

  useEffect(() => {
    chrome.storage.sync.get(['options'], function (result) {
      const data = result.options;

      console.log('result is: ', data);
      if (!data) {
        return setOptions({ filter: true });
      }

      setOptions(data);
    });
  }, []);

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];

      console.log(key);
      if (key === 'options') {
        setOptions(storageChange.newValue);
      }
    }
  });

  return Object.keys(options).length >= 1 ? (
    <div className="time-filter">
      <h2 className="title is-5 has-text-white time-filter-title">
        Show only videos between:
      </h2>
      <FormContext {...methods}>
        <form
          name="form"
          className="time-filter-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <label htmlFor="">
            <h3 className="has-text-white">From:</h3>
          </label>
          <div className="time-filter-fieldset">
            <TimePickerItem
              name="fromHours"
              options={generateTimeOptions('hour')}
              control={methods.control}
              placeholder={'hours'}
              errors={methods.errors}
              disabled={!options.filter}
              customDefaultValue={context.formData.from.hours}
            ></TimePickerItem>
            <TimePickerItem
              name="fromMinutes"
              options={generateTimeOptions('minute')}
              control={methods.control}
              placeholder={'minutes'}
              errors={methods.errors}
              disabled={!options.filter}
              customDefaultValue={context.formData.from.minutes}
            ></TimePickerItem>
            <TimePickerItem
              name="fromSeconds"
              options={generateTimeOptions('second')}
              control={methods.control}
              placeholder={'seconds'}
              errors={methods.errors}
              disabled={!options.filter}
              customDefaultValue={context.formData.from.seconds}
            ></TimePickerItem>
          </div>
          <label htmlFor="">
            <h3 className="has-text-white">To:</h3>
          </label>
          <div className="time-filter-fieldset">
            <TimePickerItem
              name="toHours"
              options={generateTimeOptions('hour')}
              control={methods.control}
              placeholder={'hours'}
              errors={methods.errors}
              disabled={!options.filter}
              customDefaultValue={context.formData.to.hours}
            ></TimePickerItem>
            <TimePickerItem
              name="toMinutes"
              options={generateTimeOptions('minute')}
              control={methods.control}
              placeholder={'minutes'}
              errors={methods.errors}
              disabled={!options.filter}
              customDefaultValue={context.formData.to.minutes}
            ></TimePickerItem>
            <TimePickerItem
              name="toSeconds"
              options={generateTimeOptions('second')}
              control={methods.control}
              placeholder={'seconds'}
              errors={methods.errors}
              disabled={!options.filter}
              customDefaultValue={context.formData.to.seconds}
            ></TimePickerItem>
          </div>

          <Button
            className="time-filter-button"
            type="submit"
            color="primary"
            disabled={!options.filter}
          >
            {buttonText}
          </Button>
        </form>
      </FormContext>
    </div>
  ) : (
    <p className="has-text-white">Loading...</p>
  );
}

export default TimePicker;
