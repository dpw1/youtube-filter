import React, { useState, useEffect, useContext } from 'react';
import { useForm, FormContext, useFormContext } from 'react-hook-form';
import TimePickerItem from './TimePickerItem';
import {
  generateTimeOptions,
  minTwoDigits,
  convertToSeconds,
} from './utils/utils';
import { ThemeContext } from '../contexts/ThemeContext';
import ReactHtmlParser from 'react-html-parser';

function TimePicker() {
  const methods = useForm();
  const context = useContext(ThemeContext);
  // const watchAllFields = methods.watch();

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
        `<b>From</b> cannot be greater than <b>To</b>.`
      );
    }

    chrome.storage.sync.set({ data: cleanData }, function () {
      console.log(`Data succesfully saved: ${data}`);
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

    // if (!data.fromHours) {
    //   methods.setError('fromHours', 'undefined', 'Please select hours.');
    // }

    // if (!data.fromMinutes) {
    //   methods.setError('fromMinutes', 'undefined', 'Please select minutes.');
    // }

    // if (!data.fromSeconds) {
    //   methods.setError('fromSeconds', 'undefined', 'Please select seconds.');
    // }

    // const errors = Object.values(data).some((e) => e === undefined);

    // console.log(errors);
    // if () {
    //   return;
    // }

    // console.log('form sent succesfully');
  };

  const handleErrors = () => {};

  return (
    <FormContext {...methods}>
      <form
        name="form"
        className="time-filter"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <label htmlFor="">
          <h3>From:</h3>
        </label>
        <div className="time-filter-fieldset">
          <TimePickerItem
            name="fromHours"
            options={generateTimeOptions('hour')}
            control={methods.control}
            placeholder={'hours'}
            errors={methods.errors}
            customDefaultValue={context.formData.from.hours}
          ></TimePickerItem>
          <TimePickerItem
            name="fromMinutes"
            options={generateTimeOptions('minute')}
            control={methods.control}
            placeholder={'minutes'}
            errors={methods.errors}
            customDefaultValue={context.formData.from.minutes}
          ></TimePickerItem>
          <TimePickerItem
            name="fromSeconds"
            options={generateTimeOptions('second')}
            control={methods.control}
            placeholder={'seconds'}
            errors={methods.errors}
            customDefaultValue={context.formData.from.seconds}
          ></TimePickerItem>
        </div>
        <label htmlFor="">
          <h3>To:</h3>
        </label>
        <div className="time-filter-fieldset">
          <TimePickerItem
            name="toHours"
            options={generateTimeOptions('hour')}
            control={methods.control}
            placeholder={'hours'}
            errors={methods.errors}
            customDefaultValue={context.formData.to.hours}
          ></TimePickerItem>
          <TimePickerItem
            name="toMinutes"
            options={generateTimeOptions('minute')}
            control={methods.control}
            placeholder={'minutes'}
            errors={methods.errors}
            customDefaultValue={context.formData.to.minutes}
          ></TimePickerItem>
          <TimePickerItem
            name="toSeconds"
            options={generateTimeOptions('second')}
            control={methods.control}
            placeholder={'seconds'}
            errors={methods.errors}
            customDefaultValue={context.formData.to.seconds}
          ></TimePickerItem>
        </div>
        <input
          className="time-filter-button"
          type="submit"
          value="Filter now!"
        />
        <p>
          {methods.errors.form && ReactHtmlParser(methods.errors.form.message)}
        </p>
      </form>
    </FormContext>
  );
}

export default TimePicker;
