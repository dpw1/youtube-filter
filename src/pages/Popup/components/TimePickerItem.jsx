import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

function TimePickerItem(props) {
  const { options, name, control, placeholder, defaultValue } = props;
  return (
    <Controller
      className="time-filter-item"
      as={
        <Select options={options} defaultValue={defaultValue && defaultValue} />
      }
      control={control}
      placeholder={placeholder}
      onChange={([selected]) => {
        // Place your logic here
        return selected;
      }}
      name={name}
    />
  );
}

export default TimePickerItem;
