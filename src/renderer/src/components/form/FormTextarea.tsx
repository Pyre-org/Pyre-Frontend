import React from "react";
import FormBase from "./FormBase";
import { Control, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@renderer/components/ui/textarea";

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

function FormTextarea<T extends FieldValues>(props: FormTextareaProps<T>) {
  const { textareaProps, ...rest } = props;
  return (
    <FormBase {...rest}>
      {({ field }) => <Textarea {...textareaProps} {...field} />}
    </FormBase>
  );
}

export default FormTextarea;
