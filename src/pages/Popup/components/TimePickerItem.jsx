import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

function TimePickerItem(props) {
  const {
    options,
    name,
    control,
    placeholder,
    defaultValue,
    onChange,
    errors,
  } = props;
  return (
    <React.Fragment>
      <Controller
        className="time-filter-item"
        as={
          <Select
            options={options}
            defaultValue={defaultValue && defaultValue}
          />
        }
        control={control}
        placeholder={placeholder}
        onChange={([selected]) => {
          onChange(selected);
          return selected;
        }}
        name={name}
      />
      {errors[name] && errors[name].message}
    </React.Fragment>
  );
}

export default TimePickerItem;
