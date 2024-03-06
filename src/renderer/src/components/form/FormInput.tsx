import React from "react";
import FormBase from "./FormBase";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@renderer/components/ui/input";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

function FormInput<T extends FieldValues>(props: FormInputProps<T>) {
  const { inputProps, ...rest } = props;
  return (
    <FormBase {...rest}>
      {({ field }) => <Input {...inputProps} {...field} />}
    </FormBase>
  );
}

export default FormInput;
