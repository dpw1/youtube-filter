import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

function TimePicker() {
  const [option, setOption] = useState();
  const { register, handleSubmit, watch, errors, control } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input name="example" defaultValue="test" ref={register} />

      {/* include validation with required or other standard HTML validation rules */}
      <input name="exampleRequired" ref={register({ required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <Controller
        as={<Select options={options} defaultValue={options[0]} />}
        control={control}
        onChange={([selected]) => {
          // Place your logic here
          return selected;
        }}
        name="reactSelect"
      />
      <input type="submit" />
    </form>
  );
}

export default TimePicker;
