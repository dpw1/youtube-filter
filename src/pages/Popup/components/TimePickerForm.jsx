import React, { useState, useEffect } from 'react';
import { useForm, FormContext, useFormContext } from 'react-hook-form';
import TimePickerItem from './TimePickerItem';
import { generateTimeOptions } from './utils/utils';

function TimePicker() {
  const methods = useForm();
  const [options, setOptions] = useState();
  const [data, setData] = useState();

  const onSubmit = (data) => {
    const from = `${data.fromHours.value}:${data.fromMinutes.value}:${data.fromSeconds.value}`;

    console.log(from);
    const cleanData = {
      from,
    };
    chrome.storage.sync.set({ data: cleanData }, function () {
      console.log(`value saved: ${data}`);
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

  useEffect(() => {
    chrome.storage.sync.get(['data'], function (result) {
      setData(result.data);
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
            defaultValue={generateTimeOptions('hour')[0]}
          ></TimePickerItem>
          <TimePickerItem
            name="fromMinutes"
            options={generateTimeOptions('minute')}
            control={methods.control}
            placeholder={'minutes'}
            errors={methods.errors}
            defaultValue={generateTimeOptions('minute')[0]}
          ></TimePickerItem>
          <TimePickerItem
            name="fromSeconds"
            options={generateTimeOptions('second')}
            control={methods.control}
            placeholder={'seconds'}
            errors={methods.errors}
            defaultValue={generateTimeOptions('second')[0]}
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
