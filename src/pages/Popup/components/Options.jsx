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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TimePicker() {
  const methods = useForm();
  const context = useContext(ThemeContext);

  // console.log('watchAllFields', watchAllFields);
  const onSubmit = (data) => {
    methods.clearError();

    console.log('data sent');
  };

  /** Watch inputs */
  useEffect(
    (e) => {
      console.log('field changed!', watchAllFields);
    },
    [watchAllFields]
  );

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

  const handleErrors = () => {};

  return (
    <FormContext {...methods}>
      <form
        name="form"
        className="time-filter"
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
          <h3 className="has-text-white">To:</h3>
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

        <Button
          className="time-filter-button"
          type="submit"
          color="primary"
          onClick={(e) => console.log(e)}
        >
          {buttonText}
        </Button>
      </form>
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
    </FormContext>
  );
}

export default TimePicker;
