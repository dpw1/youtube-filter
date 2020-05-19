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

  const onSubmit = (data) => {
    // TODO: move this to content/index.js

    methods.clearError();

    console.log(data);

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

    console.log('clean data: ', cleanData);

    const from = convertToSeconds(cleanData.from.formatted);
    const to = convertToSeconds(cleanData.to.formatted);

    const minGreaterThanMax = from >= to;
    const maxLowerThanMin = to <= from;

    if (minGreaterThanMax) {
      methods.setError(
        'form',
        'minGreaterThanMax',
        `<b>From</b> cannot be greater than <b>To</b>.`
      );
    }

    console.log('errors: ', methods.errors);

    chrome.storage.sync.set({ data: cleanData }, function () {
      console.log(`Data succesfully saved: ${data}`);
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
        <input type="submit" value="Filter now!" />
        <p>
          {methods.errors.form && ReactHtmlParser(methods.errors.form.message)}
        </p>
      </form>
    </FormContext>
  );
}

export default TimePicker;
