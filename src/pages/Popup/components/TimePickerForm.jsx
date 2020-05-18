import React, { useState } from 'react';
import { useForm, FormContext, useFormContext } from 'react-hook-form';
import TimePickerItem from './TimePickerItem';
import { generateTimeOptions } from './utils/utils';

function TimePicker() {
  const methods = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <FormContext {...methods}>
      <form className="time-filter" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="time-filter-fieldset">
          <TimePickerItem
            name="fromHours"
            options={generateTimeOptions('hour')}
            control={methods.control}
            placeholder={'hours'}
            errors={methods.errors}
            onChange={(e) => {
              console.log('errors: ', methods.errors);

              if (e) {
                methods.clearError('fromHours');
                return e;
              }

              methods.setError('fromHours', 'undefined', 'Please type');
            }}
            defaultValue={generateTimeOptions('hour')[0]}
          ></TimePickerItem>

          {/* <TimePickerItem
            name="fromMinutes"
            options={generateTimeOptions('minute')}
            control={methods.control}
            placeholder={'minutes'}
          ></TimePickerItem>

          <TimePickerItem
            name="fromSeconds"
            options={generateTimeOptions('second')}
            control={methods.control}
            placeholder={'seconds'}
          ></TimePickerItem> */}
        </div>
        {/* <div className="time-filter-fieldset">
          <TimePickerItem
            name="toHours"
            options={generateTimeOptions('hour')}
            control={methods.control}
            placeholder={'hours'}
            defaultValue={generateTimeOptions('hour')[0]}
          ></TimePickerItem>

          <TimePickerItem
            name="toMinutes"
            options={generateTimeOptions('minute')}
            control={methods.control}
            placeholder={'minutes'}
          ></TimePickerItem>

          <TimePickerItem
            name="toSeconds"
            options={generateTimeOptions('second')}
            control={methods.control}
            placeholder={'seconds'}
          ></TimePickerItem>
        </div> */}
        <input type="submit" />
      </form>
    </FormContext>
  );
}

export default TimePicker;
