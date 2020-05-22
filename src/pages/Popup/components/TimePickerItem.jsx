import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

function TimePickerItem(props) {
  const {
    options,
    name,
    control,
    placeholder,
    customDefaultValue,
    onChange,
    errors,
    rules,
    clearError,
    disabled,
  } = props;
  return (
    <React.Fragment>
      <div className="time-filter-item">
        <Controller
          style={{ border: `1px solid red` }}
          as={
            <Select
              options={options}
              classNamePrefix="time-filter-select"
              isDisabled={disabled}
            />
          }
          rules={rules}
          control={control}
          defaultValue={customDefaultValue}
          placeholder={placeholder}
          onChange={([selected]) => {
            if (typeof onChange === 'function') {
              onChange(selected);
            }

            return selected;
          }}
          name={name}
        />
        {errors[name] && <span>{errors[name].message}</span>}
      </div>
    </React.Fragment>
  );
}

export default TimePickerItem;
