import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import React from "react";
import { Control, ControllerProps, FieldValues, Path } from "react-hook-form";

interface FormBaseProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  children: (
    props: Parameters<ControllerProps<T>["render"]>[0],
  ) => React.ReactNode;
  classes?: {
    formItem?: string;
    formLabel?: string;
    formDescription?: string;
    formControl?: string;
    formMessage?: string;
  };
}

function FormBase<T extends FieldValues>({
  name,
  label,
  description,
  control,
  children,
  classes,
}: FormBaseProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={(props) => (
        <FormItem className={classes?.formItem ?? ""}>
          <FormLabel className={classes?.formLabel ?? ""}>
            {label ?? name}
          </FormLabel>
          {description && (
            <FormDescription className={classes?.formDescription ?? ""}>
              {description}
            </FormDescription>
          )}
          <FormControl className={classes?.formControl ?? ""}>
            {children(props)}
          </FormControl>
          <FormMessage className={classes?.formMessage ?? ""} />
        </FormItem>
      )}
    />
  );
}

export default FormBase;
